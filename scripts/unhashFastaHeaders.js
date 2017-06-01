'use strict'

const fs = require('fs'),
	hashUtils = require('../src/fasta-hash.js'),
	cbio = require('core-bio')


// Real from stream and wrap it in a promise.


const original = '../sampleData/fasta_sample.10.fa',
	hashedFile = '../sampleData/fasta_sample.10.hashed.fa',
	unhashedFile = '../sampleData/fasta_sample.10.UNhashed.fa'

let ldHashTab = hashUtils.loadHashTable(original)

ldHashTab.then((hashTable) => {
	let reader = fs.createReadStream(hashedFile),
		ws = fs.createWriteStream(unhashedFile),
		parser = cbio.fastaStream(),
		writer = cbio.fastaStream.writer(),
		unhashIt = hashUtils.unHashHeaderStream(hashTable)

	reader
		.pipe(parser)
		.pipe(unhashIt)
		.pipe(writer)
		.pipe(ws)
})


