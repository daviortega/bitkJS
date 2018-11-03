'use strict'

const fs = require('fs')
const fileSniffer = require('./fileSniffer')
const fastaUtils = require('../src/fasta-utils')
const tntTree = require('tnt.tree')
const parser = require('tnt.newick')
const BitkHeaderSet = require('./BitkHeaderSet')

module.exports = (filename, taxLevels = []) => {
	const data = fs.readFileSync(filename)
	const fileType = fileSniffer(data)
	switch (fileType) {
		case 'fasta': {
			fastaUtils.loadFasta(filename).then((sequences) => {
				const headers = sequences.map((seq) => seq.header_)
				const bitkHeaderSet = new BitkHeaderSet(headers)
				bitkHeaderSet.addTax2header(taxLevels)
				return
			})
		}
		case 'newick': {
			const treeObj = parser(data)
			return tntTree(treeObj)
		}
		default: {

		}
	}
}
