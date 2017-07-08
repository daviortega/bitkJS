#!/usr/bin/env node
'use strict'

let fs = require('fs'),
	path = require('path'),
	cbio = require('core-bio'),
	sort = require('sort-stream'),
	ArgumentParser = require('argparse').ArgumentParser
	// ReplaceFromKeys = require('../src/ReplaceFromKeys.js')


let parser = new ArgumentParser({
	addHelp: true,
	description: 'Sort FASTA file by header'
})

parser.addArgument(
	'input',
	{
		help: 'FASTA file to be sorted'
	}
)
parser.addArgument(
	['-o', '--out'],
	{
		help: 'name of the output file',
		defaultValue: 'sorted_fasta.fa'
	}
)
parser.addArgument(
	['-r', '--reverse'],
	{
		help: 'Reverse sort'
	}
)

let args = parser.parseArgs()

let	readerStream = fs.createReadStream(path.resolve(args.input)),
	writerStream = fs.createWriteStream(path.resolve(args.out)),
	fastaReader = cbio.fastaStream(),
	fastaWriter = cbio.fastaStream.writer()


readerStream
	.pipe(fastaReader)
	.pipe(sort(function(a, b) {
		let value = 0
		if (a.header_ < b.header_)
			value = -1
		else if (b.header_ < a.header_)
			value = 1
		return value
	}))
	.pipe(fastaWriter)
	.pipe(writerStream)
