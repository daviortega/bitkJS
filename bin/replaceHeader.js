#!/usr/bin/env node
'use strict'

let fs = require('fs'),
	path = require('path'),
	ArgumentParser = require('argparse').ArgumentParser,
	ReplaceFromKeys = require('../src/ReplaceFromKeys.js')


let parser = new ArgumentParser({
	addHelp: true,
	description: 'Replace shortened tags with real tags in any file'
})

parser.addArgument(
	'input',
	{
		help: 'File with short headers'
	}
)
parser.addArgument(
	'keys',
	{
		help: 'JSON file with keys'
	}
)
parser.addArgument(
	['-o', '--out'],
	{
		help: 'name of the output file',
		defaultValue: 'replacedHeader.txt'
	}
)
parser.addArgument(
	['-a', '--altKeys'],
	{
		help: 'name of the .json file with post-processing keys',
		defaultValue: ''
	}
)
parser.addArgument(
	['--extractTag'],
	{
		help: 'extract fields from tags in keys. Pass the numbers of fields to keep separated by space. The detault delimiter is "|" but you can pass any other using --delim option.',
		defaultValue: '',
		type: Number,
		nargs: '+'
	}
)
parser.addArgument(
	['--delim'],
	{
		help: 'Change the delimiter of fields in tag from the default "|"',
		defaultValue: ''
	}
)


let args = parser.parseArgs()

let Transform = require('stream').Transform,
	keys = require(path.resolve(args.keys))

let altKeys = []
if (args.altKeys !== '')
	altKeys = require(path.resolve(args.altKeys)) // eslint-disable-line global-require

let fieldsToKeep = [],
	delim = '|'

if (args.extractTag) {
	fieldsToKeep = args.extractTag
	if (args.delim)
		delim = args.delim
}

let	readerStream = fs.createReadStream(path.resolve(args.input)),
	writerStream = fs.createWriteStream(path.resolve(args.out)),
	transform = new Transform(),
	repFKs = new ReplaceFromKeys(keys)

transform._transform = function(data, encoding, done) {
	repFKs.update(data.toString(), altKeys, fieldsToKeep, delim)
	this.push(repFKs.data)
}

readerStream
	.pipe(transform)
	.pipe(writerStream)
