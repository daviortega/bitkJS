'use strict'

// Core
const crypto = require('crypto'),
	Transform = require('stream').Transform,
	cbio = require('core-bio'),
	fs = require('fs')

exports.kDefaults = {
	hashAlgorithm: 'sha512',
	hashEncoding: 'hex',
	hashLength: 20
}

class HashHeader extends Transform {
	constructor(hashLength = exports.kDefaults.HashLength) {
		super({objectMode: true})
		this.Options = {hashLength}
	}

	_transform(chunk, enc, done) {
		let newHeader = hashHeader(chunk, this.Options)
		chunk.header_ = newHeader.hashed
		this.push(chunk)
		done()
	}
}

class UnhashHeader extends Transform {
	constructor(hashTable = [], hashLength = exports.kDefaults.HashLength) {
		super({objectMode: true})
		this.Options = {hashLength}
		this.hashTable = hashTable
	}

	_transform(chunk, enc, done) {
		let newHeader = this.hashTable[chunk.header_]
		chunk.header_ = newHeader
		this.push(chunk)
		done()
	}
}

/**
 * Returns a hash the header of the fasta object.
 *
 * @param {fastaSeq} fastaSeq Object
 * @param {Object} Options
 * @returns {string}
 */

function hashHeader(fastaSeq, Options = {}) {
	let hashAlgorithm = Options.hashAlgorithm || exports.kDefaults.hashAlgorithm,
		hashEncoding = Options.hashEncoding || exports.kDefaults.hashEncoding,
		hashLength = Options.hashLength || exports.kDefaults.hashLength

	let hash = crypto.createHash(hashAlgorithm)
	hash.update(fastaSeq.header_)
	return {original: fastaSeq.header_, hashed: hash.digest(hashEncoding).substr(0, hashLength)}
}

function hashHeaderStream(hashLength) {
	return new HashHeader(hashLength)
}

function unHashHeaderStream(hashTable, hashLength) {
	let parsedHashTable = {}
	hashTable.forEach((item) => {
		parsedHashTable[item.hashed] = item.original
	})
	return new UnhashHeader(parsedHashTable, hashLength)
}

function loadHashTable(originalFile) {
	return new Promise(function(res, rej) {
		let reader = fs.createReadStream(originalFile),
			parser = cbio.fastaStream(),
			hashTable = []

		parser.on('data', function(chunk, enc, done) {
			let hashed = hashHeader(chunk)
			hashTable.push(hashed)
		})

		reader.pipe(parser)
			.on('finish', function() {
				res(hashTable)
			})
	})
}

exports.hashHeader = hashHeader
exports.hashHeaderStream = hashHeaderStream
exports.unHashHeaderStream = unHashHeaderStream
exports.loadHashTable = loadHashTable
