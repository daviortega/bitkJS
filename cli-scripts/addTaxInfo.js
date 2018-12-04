#!/usr/bin/env node
'use strict'

const path = require('path')
const ArgumentParser = require('argparse').ArgumentParser
const addTaxToHeader = require('../src/addTaxToHeader')
const fs = require('fs')

let parser = new ArgumentParser({
	addHelp: true,
	description: 'Build a taxonomy summary from fasta, newick or list of bitk headers'
})

parser.addArgument(
	'input',
	{
		help: 'File in fasta or newick format or, a list of bitkHeaders'
	},
)

parser.addArgument(
	'--taxonomy',
	{
		help: 'comma separated taxonomy levels',
		choices: ['superkingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species', 'strain'],
		nargs: '+'
	}
)

let args = parser.parseArgs()

const filenameParts = args.input.split('.')
const extension = filenameParts[filenameParts.length - 1]
const output = args.input.replace(/\.([a-z]|[A-Z]){2,4}$/, '.withTaxInfo.') + extension

addTaxToHeader(args.input, args.taxonomy).then((result) => {
	fs.writeFileSync(output, result)
})

