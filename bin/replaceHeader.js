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

let args = parser.parseArgs()

let Transform = require('stream').Transform,
	keys = require(path.resolve(args.keys))

let	readerStream = fs.createReadStream(path.resolve(args.input)),
	writerStream = fs.createWriteStream(path.resolve(args.out)),
	transform = new Transform(),
	repFKs = new ReplaceFromKeys(keys)

transform._transform = function(data, encoding, done) {
	repFKs.update(data.toString())
	this.push(repFKs.data)
}

readerStream
	.pipe(transform)
	.pipe(writerStream)
