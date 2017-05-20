'use strict'

let expect = require('chai').expect,
	HashHeader = require('./hash-header-stream.js'),
	cbio = require('core-bio'),
	fs = require('fs')


let inputFasta = '../sampleData/bitk3.fa'

let reader = fs.createReadStream(inputFasta),
	parser = cbio.fastaStream(),
	fastaWriter = cbio.fastaStream.writer()

let	hashIt = new HashHeader()

reader
	.pipe(parser)
	.pipe(hashIt)
	.pipe(fastaWriter)
	.pipe(process.stdout)
