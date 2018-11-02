
/* eslint-disable no-magic-numbers */
'use strict'

const bunyan = require('bunyan')

let versionSpecs = [
	{
		version: 3,
		sep: {
			header: '|',
			genome: '_'
		},
		regex: '[a-zA-Z][a-z]_([a-z]{3}.|[a-z]{2}|[A-Z][a-z]{2})[A-Z]{3}_[0-9]{9}.[0-9]-.*'
	},
	{
		version: 1,
		sep: {
			header: '-',
			genome: '.'
		},
		regex: '[a-zA-Z][a-z].([a-z]{2}.|[a-z]{3}|[A-Z][a-z]{2}).[0-9]{1,6}-.*-([A-Z]{2}_[0-9]{5,10}.[0-9]{1}|REF_.*:.*).*'
	},
	{
		version: 2,
		sep: {
			header: '|',
			genome: '_'
		},
		regex: '[a-zA-Z][a-z]_([a-z]{2}.|[a-z]{3}|[A-Z][a-z]{2})_[0-9]{1,6}|.*|([A-Z]{2}_[0-9]{5,10}.[0-9]{1}|REF_.*:.*).*'
	}
]

module.exports =
class BitkHeader {
	constructor(header) {
		this.header = header
		this.version = false
		this.info = {
			ge: null,
			sp: null,
			gid: null,
			locus: null,
			accession: null,
			genomeVersion: null,
			extra: null
		}
		this.log = bunyan.createLogger({
			name: 'BitkHeader'
		})
		this.isParsed = false
	}

	isParsed() {
		if (this.isParsed)
			return true
		throw Error('Must parse header first with .parse()')
	}

	parse(options = {skip: false}) {
		this.version = this.sniffVersion_()
		this.log.info(`Header ${this.header} seems to be of version ${this.version}`)
		if (!this.version && !options.skip) {
			this.log.error(`Invalid header: ${this.header}`)
			throw Error(`Invalid header: ${this.header}`)
		}
		else if ([1, 2].indexOf(this.version) !== -1) {
			const versionSpec = this.getVersionSpecs_(this.version)
			const fields = this.header.split(versionSpec.sep.header)
			this.log.debug(fields)
			const extraPos = 3

			const genReg = new RegExp(/.{2}/)
			const speReg = new RegExp('\\' + versionSpec.sep.genome + '.{3}')
			const genIdReg = new RegExp(/[0-9]{1,4}/)

			const orgID = fields[0]
			this.log.debug(`orgID parsed: ${orgID}`)
			this.log.debug(orgID.match(genReg))
			this.info.ge = orgID.match(genReg)[0]
			this.log.debug(orgID.match(speReg))
			this.info.sp = orgID.match(speReg)[0].slice(1)
			this.log.debug(`The gid is here: ${orgID.match(genIdReg)}`)
			this.info.gid = parseInt(orgID.match(genIdReg)[0])
			this.info.locus = fields[1]
			this.info.accession = fields[2]
			this.info.extra = fields.slice(extraPos)
			this.isParsed = true
		}
		else if (this.version === 3) {
			const versionSpec = this.getVersionSpecs_(this.version)
			const fields = this.header.split(versionSpec.sep.header)
			const genReg = new RegExp(/.{2}/)
			const speReg = new RegExp('\\' + versionSpec.sep.genome + '.{3}')
			const orgID = fields[0]
			this.info.ge = orgID.match(genReg)[0]
			this.info.sp = orgID.match(speReg)[0].slice(1)
			const mist3Info = fields[1].split()
			this.info.genomeVersion = mist3Info[0]
			this.info.locus = mist3Info[1]
			this.isParsed = true
		}
		return this.isParsed
	}

	sniffVersion_() {
		const matches = []
		versionSpecs.forEach((versionSpec) => {
			if (this.header.match(versionSpec.regex))
				matches.push(versionSpec.version)
		})
		if (this.header === '')
			return false
		let version = false
		if (matches.length >= 1)
			version = matches[0]
		return version
	}

	getLocus() {
		return this.info.locus
	}

	getGenomeVersion() {
		return this.info.locus
	}

	getAccession() {
		let accession = null
		if (([1, 2].indexOf(this.version)) !== -1)
			accession = this.info.accession
		else
			this.log.warn('This type of header does not have accessions')
		return accession
	}

	getGId() {
		let gid = null
		if (([1, 2].indexOf(this.version)) !== -1)
			gid = this.info.gid
		else
			this.log.warn('This type of header does not have MiST2 ids')
		return gid
	}

	getOrgId(ver) {
		const version = ver || this.version
		let orgId = null
		const versionSpec = this.getVersionSpecs_(version)
		const sep = versionSpec.sep
		if (([1, 2].indexOf(version)) !== -1)
			orgId = this.info.ge + sep.genome + this.info.sp + sep.genome + this.info.gid
		else if (version === 3)
			orgId = this.info.ge + sep.genome + this.info.sp
		else
			this.log.warn('This type of header does not have MiST2 ids')
		return orgId
	}

	toVersion(ver, options = {force: false}) {
		let header = ''
		const versionSpec = this.getVersionSpecs_(ver)
		this.log.debug(`version: ${ver}`)
		switch (ver) {
			case 1: {
				const sep = versionSpec.sep
				this.log.debug(this.info)
				header = this.info.ge + sep.genome + this.info.sp + sep.genome + this.info.gid + sep.header + this.info.locus + sep.header + this.info.accession
				if (this.info.extra.length !== 0)
					header += sep.header + this.info.extra.join(sep.header)
				this.log.debug(`Header version 1 was build as: ${header}`)
				break
			}
			case 2: {
				const sep = versionSpec.sep
				this.log.debug(this.info)
				header = this.info.ge + sep.genome + this.info.sp + sep.genome + this.info.gid + sep.header + this.info.locus + sep.header + this.info.accession
				if (this.info.extra.length !== 0)
					header += sep.header + this.info.extra.join(sep.header)
				this.log.debug(`Header version 2 was build as: ${header}`)
				break
			}
			case 3: {
				const sep = versionSpec.sep
				header = this.info.ge + sep.genome + this.info.sp + sep.genome + sep.header + this.info.genomeVersion + sep.header + this.info.locus
				if (this.info.extra.length !== 0)
					header += sep.header + this.info.extra.join(sep.header)
				this.log.debug(`Header version 3 was build as: ${header}`)
				break
			}
		}
		return header
	}

	getVersionSpecs_(ver) {
		const versionSpec = versionSpecs.filter((v) => v.version === ver)[0]
		this.log.debug(`Found version specs: ${JSON.stringify(versionSpec)}`)
		return versionSpec
	}

}
