'use strict'

const fs = require('fs'),
	hashUtils = require('../src/fasta-hash.js'),
	cbio = require('core-bio')


// Real from stream and wrap it in a promise.


const original = process.argv[2],
	hashedFile = process.argv[3]
let reader = fs.createReadStream(original),
	ws = fs.createWriteStream(hashedFile),
	parser = cbio.fastaStream(),
	writer = cbio.fastaStream.writer(),
	hashIt = hashUtils.hashHeaderStream()

reader
	.pipe(parser)
	.pipe(hashIt)
	.pipe(writer)
	.pipe(ws)


