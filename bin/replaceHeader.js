#!/usr/bin/env node
'use strict'

let fs = require('fs'),
	path = require('path'),
	ArgumentParser = require('argparse').ArgumentParser


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

let	readerStream = fs.createReadStream(path.resolve(args.input)),
	writerStream = fs.createWriteStream(path.resolve(args.out))

let Transform = require('stream').Transform,
	keys = require(path.resolve(args.keys))	

let transform = new Transform()

transform._transform = function(data, encoding, done) {
	let newData = data.toString()
	keys.forEach(function(element) {
		newData = newData.replace(element.s, element.l)
	})
	this.push(newData)
}

readerStream
	.pipe(transform)
	.pipe(writerStream)
