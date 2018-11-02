#!/usr/bin/env node
'use strict'

const path = require('path')
const ArgumentParser = require('argparse').ArgumentParser
const fastaUtils = require('../src/fasta-utils')
const BitkHeader = require('../src/BitkHeader')
const getTaxonomySummary = require('../src/addTaxInfo')
const fs = require('fs')

let parser = new ArgumentParser({
	addHelp: true,
	description: 'Build a taxonomy summary from fasta dataset'
})

parser.addArgument(
	'input',
	{
		help: 'File in fasta or newick format or, a list, of NCBI gene versions file'
	}
)

let args = parser.parseArgs()

const filenameParts = args.input.split('.')
const extension = filenameParts[filenameParts.length - 1]
const output = args.input.replace(/\.([a-z]|[A-Z]){2,4}$/, '.withTaxInfo.') + extension

fastaUtils.loadFasta(args.input)
    .then(
		(sequences) => {
			const headers = sequences.map((seq) => new BitkHeader(seq.header_))
			return getTaxonomySummary(headers)
		}
	)
    .then((summary) => fs.writeFileSync(output, JSON.stringify(summary, null, ' ')))
