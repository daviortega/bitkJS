'use strict'

// Core
const crypto = require('crypto')

exports.kDefaults = {
	hashAlgorithm: 'sha256',
	hashEncoding: 'hex',
	hashLength: 20
}

/**
 * Returns a hash the header of the fasta object.
 *
 * @param {fastaSeq} fastaSeq Object
 * @param {Object} Options
 * @returns {string}
 */
exports.hashHeader = function(fastaSeq, Options = {}) {
	let hashAlgorithm = Options.hashAlgorithm || exports.kDefaults.hashAlgorithm,
		hashEncoding = Options.hashEncoding || exports.kDefaults.hashEncoding,
		hashLength = Options.hashLength || exports.kDefaults.hashLength

	let hash = crypto.createHash(hashAlgorithm)
	hash.update(fastaSeq.header_)
	return hash.digest(hashEncoding).substr(0, hashLength)
}
