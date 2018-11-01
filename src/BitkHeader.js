'use strict'

const bunyan = require('bunyan')

let currVersion = 3

let versionSpecs = [
	{
		version: 3,
		sep: {
			header: '|',
			genome: '_'
		}
	},
	{
		version: 1,
		sep: {
			header: '-',
			genome: '.',
		},
		regex: `[a-zA-Z][a-z]\.([a-z]{2}\.|[a-z]{3}|[A-Z][a-z]{2})\.[0-9]{1,6}-.*-([A-Z]{2}_[0-9]{5,10}\.[0-9]{1}|REF_.*:.*).*`
	},
	{
		version: 2,
		sep: {
			header: '|',
			genome: '-',
		},
		regex: `[a-zA-Z][a-z]_([a-z]{2}\.|[a-z]{3}|[A-Z][a-z]{2})_[0-9]{1,6}\|.*\|([A-Z]{2}_[0-9]{5,10}\.[0-9]{1}|REF_.*:.*).*`
	}
]

module.exports =
class BitkHeader {
	constructor(header) {
		this.header = header
		this.version = false
		this.info = {
			orgID: null,
			ge: null,
			sp: null,
			locus: null,
			accession: null,
			genomeVersion: null,
			extra: null,
		}
		this.log = bunyan.createLogger({
			name: 'BitkHeader'
		})
	}

	parse(options = {skip: false}) {
		this.version = this.sniffVersion_()
		if (!this.version && !options.skip){
			this.log.error(`Invalid header: ${this.header}`)
			throw Error(`Invalid header: ${this.header}`)
		}
		else if (this.version === 2 || this.version) {
			const versionSpec = versionSpecs.filter((v) => v.version === this.version)[0]
			const fields = this.header.split(versionSpec.sep.header)
			const extraPos = 3

			const genReg = new RegExp(/.{2}/)
			const speReg = new RegExp('\\' + versionSpec.sep.genome + '.{3}')
			const genIdReg = new RegExp(/[0-9]{1,4}/)

			this.info.orgID = fields[0]
			this.info.ge = this.info.orgID.match(genReg)[0]
			this.info.sp = this.info.orgID.match(speReg)[0].slice(1)
			this.info.gid = parseInt(this.info.orgID.match(genIdReg)[0])
			this.info.locus = fields[1]
			this.info.accession = fields[2]
			this.info.extra = fields.slice(extraPos)
			return true
		}
		else if (this.version === 3) {
			const versionSpec = versionSpecs.filter((v) => v.version === this.version)[0]
			const fields = this.header.split(versionSpec.sep.header)
			const genReg = new RegExp(/.{2}/)
			const speReg = new RegExp('\\' + versionSpec.sep.genome + '.{3}')
			this.info.orgID = fields[0]
			this.info.ge = this.info.orgID.match(genReg)[0]
			this.info.sp = this.info.orgID.match(speReg)[0].slice(1)
			const mist3Info = fields[1].split()
			this.info.genomeVersion = mist3Info[0]
			this.info.locus = mist3Info[1]
			return true
		}
		return false
	}

	sniffVersion_() {
		const matches = []
		versionSpecs.forEach((versionSpec) => {
			if (this.header.match(versionSpec.regex))
				matches.push(versionSpec.version)
		})
		let version = false
		if (matches.length >= 1)
			version = matches[0]
		return version
	}

	toVersion(ver) {
		let orgID = this.ge + sep[ver].genome + this.sp + sep[ver].genome + this.gid,
			extra = ''
		if (this.extra.length !== 0)
			extra = sep[ver].header + this.extra.join(sep[ver].header)
		return orgID + sep[ver].header + this.locus + sep[ver].header + this.accession + extra
	}

	getLocus() {
		return this.info.locus
	}

	getGenomeVersion() {
		return this.info.locus
	}
}
