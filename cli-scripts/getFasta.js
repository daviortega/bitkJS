#!/usr/bin/env node
'use strict'

let path = require('path'),
	ArgumentParser = require('argparse').ArgumentParser,
	getFasta = require('../src/getFastaFromStableIds'),
	fs = require('fs')

let parser = new ArgumentParser({
	addHelp: true,
	description: 'Makes FASTA file from MiST3 stableID'
})

parser.addArgument(
	'input',
	{
		help: 'Text file with stable IDs. One per line'
	}
)
parser.addArgument(
	['-o', '--output'],
	{
		help: 'name of the output file',
		defaultValue: 'bitk3.fa'
	}
)

parser.addArgument(
	['--skipBad'],
	{
		help: 'Skip bad stable Ids',
		defaultValue: false,
		nargs: 0
	}
)

let args = parser.parseArgs()

if (args.output === 'bitk3.fa')
	args.output = args.input.replace(/\.([a-z]|[A-Z]){2,4}$/, '.bitk3.fa')

const options = (args.skipBad) ? {keepGoing: true} : {keepGoing: false}

console.log(args)
const rawData = fs.readFileSync(path.resolve(args.input)).toString()
const stableIds = rawData.split('\n')

while (stableIds.indexOf('') !== -1) {
	const index = stableIds.indexOf('')
	stableIds.splice(index, 1)
}
console.log(options)
getFasta(stableIds, args.output, options)
