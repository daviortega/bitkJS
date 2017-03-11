#!/usr/bin/env node
'use strict'

let fs = require('fs'),
	path = require('path'),
	ArgumentParser = require('argparse').ArgumentParser,
	PhyproRPS2tbl = require('../src/PhyproRPS2tbl.js')

let parser = new ArgumentParser({
	addHelp: true,
	description: 'Make table of clusters of genes matchign pssms (phypro). Related to Yi-Wei project'
})

parser.addArgument(
	'input',
	{
		help: 'Phypro rps*.json file of parsed information for specific genome'
	}
)
parser.addArgument(
	['-o', '--out'],
	{
		help: 'name of the output file',
		defaultValue: null
	}
)
parser.addArgument(
	['--cutoff'],
	{
		help: 'alternative e-value cutoff.',
		defaultValue: 0.01,
		type: Number,
		nargs: 1
	}
)

let args = parser.parseArgs(),
	cutoff = args.cutoff,
	outfile = args.out || args.input + 'parsed.txt',
	maxclustDist = 5

let data = require(path.resolve(args.input))

let phyproRPS2tbl = new PhyproRPS2tbl(maxclustDist, cutoff),
	parsed = phyproRPS2tbl.parse(data),
	csv = phyproRPS2tbl.tocsv(parsed)

fs.writeFile(outfile, csv, (err) => {
	if (err) throw err
})
