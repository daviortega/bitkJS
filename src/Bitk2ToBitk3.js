'use strict'

let Transform = require('stream').Transform,
	BitkHeader = require('./BitkHeader')

module.exports =
class Bitk2ToBitk3 extends Transform {
	constructor(options) {
		super({objectMode: true})
		this.ver = 2
		this.newVer = 3
	}

	_transform(chunk, enc, done) {
		let header = new BitkHeader(chunk.header_, this.ver),
			newHeader = header.toVersion(this.newVer)
		chunk.header_ = newHeader
		this.push(chunk)
		done()
	}
}
