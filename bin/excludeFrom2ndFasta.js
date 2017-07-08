#!/usr/bin/env node
'use strict'

let path = require('path'),
	ArgumentParser = require('argparse').ArgumentParser,
	fastaUtils = require('../src/fasta-utils.js'),
	cbio = require('core-bio'),
	fs = require('fs')

let parser = new ArgumentParser({
	addHelp: true,
	description: 'Delete sequences present in the 1st FASTA file from the 2nd FASTA file based on header names'
})

parser.addArgument(
	'firstFasta',
	{
		help: 'First FASTA file '
	}
)
parser.addArgument(
	'secondFasta',
	{
		help: 'Second FASTA file '
	}
)
parser.addArgument(
	['-o', '--output'],
	{
		help: 'name of the output file',
		defaultValue: 'x.fa'
	}
)

let args = parser.parseArgs()

if (args.output === 'x.fa')
	args.output = args.secondFasta.replace(/\.([a-z]|[A-Z]){2,4}$/, '.x.fa')

fastaUtils.loadFasta(path.resolve(args.firstFasta))
	.then(function(seqRef) {
		let reader = fs.createReadStream(path.resolve(args.secondFasta)),
			parserFasta = cbio.fastaStream(),
			filteredStream = new fastaUtils.FilterSequences(seqRef),
			writer = cbio.fastaStream.writer(),
			ws = fs.createWriteStream(path.resolve(args.output))

		reader
			.pipe(parserFasta)
			.pipe(filteredStream)
			.pipe(writer)
			.pipe(ws)
	})
