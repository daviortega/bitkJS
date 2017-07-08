#!/usr/bin/env node
'use strict'

let path = require('path'),
	ArgumentParser = require('argparse').ArgumentParser,
	Bitk2ToBitk3 = require('../src/Bitk2ToBitk3'),
	cbio = require('core-bio'),
	pumpify = require('pumpify'),
	fs = require('fs')

let parser = new ArgumentParser({
	addHelp: true,
	description: 'Update FASTA headers from bitk2 to bitk3 style'
})

parser.addArgument(
	'input',
	{
		help: 'Fasta file'
	}
)
parser.addArgument(
	['-o', '--output'],
	{
		help: 'name of the output file',
		defaultValue: 'bitk3.fa'
	}
)

let args = parser.parseArgs()

if (args.output === 'bitk3.fa')
	args.output = args.input.replace(/\.([a-z]|[A-Z]){2,4}$/, '.bitk3.fa')

let rs = fs.createReadStream(path.resolve(args.input)),
	ws = fs.createWriteStream(path.resolve(args.output)),
	reader = cbio.fastaStream(),
	writer = cbio.fastaStream.writer()

let b2Tob3 = new Bitk2ToBitk3(),
	pipeline = pumpify.obj(reader, b2Tob3, writer, ws)

rs.pipe(pipeline)
