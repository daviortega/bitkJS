#!/usr/bin/env node
'use strict'

let path = require('path'),
	ArgumentParser = require('argparse').ArgumentParser,
	ParseBlastResults = require('../src/ParseBlastResults.js'),
	JSONStream = require('JSONStream'),
	fs = require('fs')

let parser = new ArgumentParser({
	addHelp: true,
	description: 'Parse BLAST result into JSON'
})

parser.addArgument(
	'input',
	{
		help: 'File with BLAST output'
	}
)
parser.addArgument(
	['--keys'],
	{
		help: 'String of keys. Mark with "*" if you want to make it an integer',
		defaultValue: 'qseqid sseqid bitscore* evalue* qlen* length* qcovs* slen*'
	}
)
parser.addArgument(
	['-o', '--output'],
	{
		help: 'name of the output file',
		defaultValue: 'blastResultParsed.json'
	}
)


let args = parser.parseArgs(),
	blastParser = new ParseBlastResults(path.resolve(args.input), args.keys),
	ws = fs.createWriteStream(path.resolve(args.output))

blastParser
	.pipe(JSONStream.stringify())
	.pipe(ws)

