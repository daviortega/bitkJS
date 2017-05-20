'use strict'

let crypto = require('crypto'),
	Transform = require('stream').Transform

const kHashLength = 20

module.exports =
class HashHeader extends Transform {
	constructor(hashLength = kHashLength) {
		super({objectMode: true})
		this.hashLength = hashLength
	}

	_transform(chunk, enc, done) {
		chunk.header_ = this.hashIt_(chunk.header_)
		this.push(chunk)
		done()
	}

	hashIt_(header) {
		const hash = crypto.createHash('sha256')
		hash.update(header)
		return hash.digest('hex').substr(0, this.hashLength)
	}
}
