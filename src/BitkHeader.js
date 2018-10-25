'use strict'

let currVersion = 3

let sep = {}

sep[3] = {
	header: '|',
	genome: '_'
}
sep[2] = {
	header: '-',
	genome: '.'
}

module.exports =
class BitkHeader {
	constructor(header, ver = currVersion) {
		this.version = ver

		let fields = header.split(sep[ver].header),
			extraPos = 3

		let	genReg = new RegExp(/.{2}/),
			speReg = new RegExp('\\' + sep[ver].genome + '.{3}'),
			genIdReg = new RegExp(/[0-9]{1,4}/)


		this.orgID = fields[0]
		this.ge = this.orgID.match(genReg)[0]
		this.sp = this.orgID.match(speReg)[0].slice(1)
		this.gid = parseInt(this.orgID.match(genIdReg)[0])
		this.locus = fields[1]
		this.accession = fields[2]
		this.extra = fields.slice(extraPos)
	}

	toVersion(ver) {
		let orgID = this.ge + sep[ver].genome + this.sp + sep[ver].genome + this.gid,
			extra = ''
		if (this.extra.length !== 0)
			extra = sep[ver].header + this.extra.join(sep[ver].header)
		return orgID + sep[ver].header + this.locus + sep[ver].header + this.accession + extra
	}

	getLocus() {
		return this.locus
	}
}
