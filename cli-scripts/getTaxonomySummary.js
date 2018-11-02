#!/usr/bin/env node
'use strict'

const ArgumentParser = require('argparse').ArgumentParser
const fastaUtils = require('../src/fasta-utils')
const BitkHeaderSet = require('../src/BitkHeaderSet')
const getTaxonomySummary = require('../src/getTaxonomySummary')
const fs = require('fs')

let parser = new ArgumentParser({
	addHelp: true,
	description: 'Build a taxonomy summary from fasta dataset'
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
		defaultValue: 'taxonomySummary.json'
	}
)

parser.addArgument(
	['--bitk-header-version'],
	{
		help: 'version of the bitk header',
		defaultValue: 3
	}
)

let args = parser.parseArgs()

if (args.output === 'taxonomySummary.json')
	args.output = args.input.replace(/\.([a-z]|[A-Z]){2,4}$/, '.taxonomySummary.json')

fastaUtils.loadFasta(args.input)
    .then(
		(sequences) => {
			const headers = sequences.map((seq) => seq.header_)
			const bitkHeaderSet = new BitkHeaderSet(headers)
			return bitkHeaderSet.getTaxonomy()
		}
	)
    .then((summary) => fs.writeFileSync(args.output, JSON.stringify(summary, null, ' ')))
