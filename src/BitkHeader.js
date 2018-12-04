
/* eslint-disable no-magic-numbers */
'use strict'

const bunyan = require('bunyan')
const crypto = require('crypto')
const mist3 = require('node-mist3')

const genes = new mist3.Genes()

const log = bunyan.createLogger({
	name: 'BitkHeader'
})

const kDefaults = {
	crypto: {
		hashAlgorithm: 'sha512',
		hashEncoding: 'hex',
		hashLength: 10
	}
}

let versionSpecs = [
	{
		version: 3,
		sep: {
			header: '|',
			genome: '_',
			genomeVersion: '-'
		},
		regex: '[a-zA-Z][a-z]_([a-z]{3}.|[a-z]{2}|[A-Z][a-z]{2})[A-Z]{3}_[0-9]{9}.[0-9]-.*'
	},
	{
		version: 1,
		sep: {
			header: '-',
			genome: '.'
		},
		regex: /([a-zA-Z][a-z]|[A-Z][A-Z])\.([a-z]{2}\.|[a-z]{3}|[A-Z][a-z]{2}\.|\[[A-z][a-z]|'[A-Z][a-z]|[A-Z][a-z][a-z])\.[0-9]{1,6}-.*-([A-Z]{2,3}.[0-9]{5,10}.[0-9]{1}|REF_.*:.*).*/
	},
	{
		version: 2,
		sep: {
			header: '|',
			genome: '_'
		},
		regex: /([a-zA-Z][a-z]|[A-Z][A-Z])_([a-z]{2}\.|[a-z]{3}|[A-Z][a-z]{2}\.|\[[A-z][a-z]|'[A-Z][a-z]|[A-Z][a-z][a-z])_[0-9]{1,6}\|.*\|([A-Z]{2,3}.[0-9]{5,10}.[0-9]{1}|REF_.*:.*).*/
	}
]

module.exports =
class BitkHeader {
	constructor(header) {
		this.originalHeader = header
		this.originalVersion = false
		this.info = {
			ge: null,
			sp: null,
			gid: null,
			locus: null,
			accession: null,
			genomeVersion: null,
			extra: null
		}
		this.isParsed = false
	}

	isParsed() {
		if (this.isParsed)
			return true
		throw Error('Must parse header first with .parse()')
	}

	parse(options = {skip: false}) {
		this.originalVersion = this.sniffVersion_()
		log.info(`Header ${this.originalHeader} seems to be of version ${this.originalVersion}`)
		if (!this.originalVersion && !options.skip) {
			log.error(`Invalid header: ${this.originalHeader}`)
			throw Error(`Invalid header: ${this.originalHeader}`)
		}
		else if ([1, 2].indexOf(this.originalVersion) !== -1) {
			const versionSpec = this.getVersionSpecs_(this.originalVersion)
			const fields = this.originalHeader.split(versionSpec.sep.header)
			log.debug(fields)
			const extraPos = 3

			const genReg = new RegExp(/.{2}/)
			const speReg = new RegExp('\\' + versionSpec.sep.genome + '.{3}')
			const genIdReg = new RegExp(/[0-9]{1,4}/)

			const orgID = fields[0]
			log.debug(`orgID parsed: ${orgID}`)
			log.debug(orgID.match(genReg))
			this.info.ge = orgID.match(genReg)[0]
			log.debug(orgID.match(speReg))
			this.info.sp = orgID.match(speReg)[0].slice(1)
			log.debug(`The gid is here: ${orgID.match(genIdReg)}`)
			this.info.gid = parseInt(orgID.match(genIdReg)[0])
			this.info.locus = fields[1]
			this.info.accession = fields[2]
			this.info.extra = fields.slice(extraPos)
			this.isParsed = true
		}
		else if (this.originalVersion === 3) {
			const versionSpec = this.getVersionSpecs_(this.originalVersion)
			const fields = this.originalHeader.split(versionSpec.sep.header)
			const genReg = new RegExp(/.{2}/)
			const speReg = new RegExp('\\' + versionSpec.sep.genome + '.{3}')
			const orgID = fields[0]
			this.info.ge = orgID.match(genReg)[0]
			this.info.sp = orgID.match(speReg)[0].slice(1)
			const mist3Info = fields[1].split(versionSpec.sep.genomeVersion)
			this.info.genomeVersion = mist3Info[0]
			this.info.locus = mist3Info[1]
			this.isParsed = true
		}
		return this.isParsed
	}

	sniffVersion_() {
		const matches = []
		versionSpecs.forEach((versionSpec) => {
			if (this.originalHeader.match(versionSpec.regex)) {
				log.debug(this.originalHeader.match(versionSpec.regex))
				matches.push(versionSpec.version)
			}
		})
		if (this.originalHeader === '')
			return false
		let version = false
		if (matches.length >= 1)
			version = matches[0]
		return version
	}

	getHash() {
		const info = JSON.stringify(this.info)
		const hash = crypto.createHash(kDefaults.crypto.hashAlgorithm)
		hash.update(info)
		return hash.digest(kDefaults.crypto.hashEncoding).substr(0, kDefaults.crypto.hashLength)
	}

	getLocus() {
		return this.info.locus
	}

	getGenomeVersion() {
		return this.info.genomeVersion
	}

	fetchGenomeVersion(options = {fetch: true, keepGoing: true}) {
		return new Promise((resolve, reject) => {
			if (this.info.genomeVersion !== null) {
				resolve(this.info.genomeVersion)
			}
			else if (options.fetch) {
				log.warn(`Header ${this.getLocus()} does not have genome version. Fetching...`)
				genes.search(this.getLocus())
					.then((info) => {
						log.debug(info)
						let genomeVersion = null
						if (info.length > 1) {
							log.error(`Ambiguous data recovered from ${this.getLocus()}`)
							resolve(null)
						}
						else if (info.length === 0) {
							log.error(`No data recovered from ${this.getLocus()}`)
							resolve(null)
						}
						else {
							genomeVersion = info[0].stable_id.split('-')[0]
							log.debug(`Found gene's genome version: ${genomeVersion}`)
						}
						this.addGenomeVersion(genomeVersion)
						resolve(this.info.genomeVersion)
						return
					})
			}
			else if (options.keepGoing) {
				log.error(`Header ${this.getLocus()} does not have genome information on MiST3`)
				resolve(null)
			}
			else {
				reject(Error(`Genome version not found in header ${this.getLocus()}. No fetch allowed.`))
			}
		})
	}

	addGenomeVersion(genomeVersion) {
		this.info.genomeVersion = genomeVersion
		return
	}

	getAccession() {
		let accession = null
		if (([1, 2].indexOf(this.originalVersion)) !== -1)
			accession = this.info.accession
		else
			log.warn('This type of header does not have accessions')
		return accession
	}

	getGId() {
		let gid = null
		if (([1, 2].indexOf(this.originalVersion)) !== -1)
			gid = this.info.gid
		else
			log.warn('This type of header does not have MiST2 ids')
		return gid
	}

	getOrgId(ver) {
		const version = ver || this.originalVersion
		let orgId = null
		const versionSpec = this.getVersionSpecs_(version)
		const sep = versionSpec.sep
		if (([1, 2].indexOf(version)) !== -1)
			orgId = this.info.ge + sep.genome + this.info.sp + sep.genome + this.info.gid
		else if (version === 3)
			orgId = this.info.ge + sep.genome + this.info.sp
		else
			log.warn('This type of header does not have MiST2 ids')
		return orgId
	}

	getOriginalVersion() {
		return this.orginalVersion
	}

	getOriginalHeader() {
		return this.originalHeader
	}

	toVersion(version, options = {force: false}) {
		const ver = version || this.originalVersion
		let header = ''
		const versionSpec = this.getVersionSpecs_(ver)
		log.debug(`version: ${ver}`)
		log.debug(this.info)
		switch (ver) {
			case 1: {
				const sep = versionSpec.sep
				log.debug(this.info)
				header = this.info.ge + sep.genome + this.info.sp + sep.genome + this.info.gid + sep.header + this.info.locus + sep.header + this.info.accession
				if (this.info.extra.length !== 0)
					header += sep.header + this.info.extra.join(sep.header)
				log.debug(`Header version 1 was build as: ${header}`)
				break
			}
			case 2: {
				const sep = versionSpec.sep
				log.debug(this.info)
				header = this.info.ge + sep.genome + this.info.sp + sep.genome + this.info.gid + sep.header + this.info.locus + sep.header + this.info.accession
				if (this.info.extra.length !== 0)
					header += sep.header + this.info.extra.join(sep.header)
				log.debug(`Header version 2 was build as: ${header}`)
				break
			}
			case 3: {
				const sep = versionSpec.sep
				header = this.info.ge + sep.genome + this.info.sp + sep.genome + sep.header + this.info.genomeVersion + sep.header + this.info.locus
				if (this.info.extra.length !== 0)
					header += sep.header + this.info.extra.join(sep.header)
				log.debug(`Header version 3 was build as: ${header}`)
				break
			}
		}
		return header
	}

	getVersionSpecs_(ver) {
		const versionSpec = versionSpecs.filter((v) => v.version === ver)[0]
		log.debug(`Found version specs: ${JSON.stringify(versionSpec)}`)
		return versionSpec
	}

}
