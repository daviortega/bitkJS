'use strict'

let BITKHEADSEP = '|',
	BITKGENSEP = '_'

module.exports =
class BitkHeader {
	constructor(header) {
		let fields = header.split(BITKHEADSEP),
			extraPos = 3
		this.orgID = fields[0]
		this.locus = fields[1]
		this.accession = fields[2]
		this.extra = fields.slice(extraPos, fields.length).join(BITKGENSEP)
	}
}
