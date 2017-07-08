'use strict'

let expect = require('chai').expect,
	HashHeader = require('./hash-header-stream.js'),
	cbio = require('core-bio'),
	fs = require('fs')

let expectedHeaders = [
	'0d2440774c71ad4399b9',
	'b83bc2c910377fbeb81b',
	'addc5d39035f595aea0f',
	'1ae5060b40023b3806ec',
	'7e75aa032e80ca755681',
	'06a05ebfa8143a7f2b40',
	'65fb5ad0bfb2edc1304b',
	'01b4f782f0c4fce79b08',
	'3aebd620da32b5e091c7',
	'1b92fdb8682e28e374bb'
]
let inputFasta = '../sampleData/fasta_sample.10.fa'

let reader = fs.createReadStream(inputFasta),
	parser = cbio.fastaStream()

let hashIt = new HashHeader()

reader.on('error', function(err) {
	console.error(err)
})


parser.on('data', function(chunk) {
	console.log('*- ' + chunk.header_ + ' -*')
})

hashIt
	.on('data', function(chunk) {
		let i = expectedHeaders.indexOf(chunk.header_)
		console.log(chunk.header_)
		if (i !== -1)
			expectedHeaders.splice(i, 1)
		else
			throw new Error('this is not expected ' + chunk.header_)

	})
	.on('error', function(err) {
		console.log(err)
	})

let stream = reader
	.pipe(parser)
	.pipe(hashIt)
	.on('error', function(err) {
		console.error(err)
	})

stream.on('finish', function() {
	console.log('dsads')
})