'use strict'

let corebio = require('core-bio'),
	fs = require('fs'),
	path = require('path')

let Transform = require('stream').Transform

class FilterSequences extends Transform {
	constructor(seqRef = []) {
		super({objectMode: true})
		this.seqRef = seqRef.map(function(item) {
			return item.header_
		})
	}

	_transform(chunk, enc, done) {
		if (this.seqRef.indexOf(chunk.header_) === -1)
			this.push(chunk)
		done()
	}
}

function loadFasta(fastaFile) {
	return new Promise(function(res, rej) {
		let reader = fs.createReadStream(path.resolve(fastaFile)),
			parser = corebio.fastaStream()

		let sequences = []

		parser.on('data', function(chunk, enc, done) {
			sequences.push(chunk)
		})

		reader.pipe(parser)
			.on('finish', function() {
				res(sequences)
			})
	})
}

exports.loadFasta = loadFasta
exports.FilterSequences = FilterSequences
