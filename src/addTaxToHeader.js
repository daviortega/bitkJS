'use strict'

const bunyan = require('bunyan')
const fs = require('fs')
const fileSniffer = require('./fileSniffer')
const fastaUtils = require('../src/fasta-utils')
const tntTree = require('tnt.tree')
const parser = require('tnt.newick')
const BitkHeaderSet = require('./BitkHeaderSet')

const log = bunyan.createLogger({
	name: 'addTaxToHeader'
})

module.exports = (filename, taxLevels = []) => {
	const fileType = fileSniffer(filename)
	log.info(`File sniffer: ${fileType}`)
	switch (fileType) {
		case 'fasta': {
			return fastaUtils.loadFasta(filename).then((sequences) => {
				log.debug('Read Fasta')
				log.debug(sequences)
				const headers = sequences.map((seq) => seq.header_)
				const bitkHeaderSet = new BitkHeaderSet(headers)
				let fastaString = ''
				return bitkHeaderSet.addTax2Headers(taxLevels).then(() => {
					const newHeaders = bitkHeaderSet.writeHeaders()
					sequences.forEach((seq, i) => {
						seq.setHeader(newHeaders[i])
						fastaString += seq.toString()
					})
					return fastaString
				})
			})
		}
		case 'newick': {
			const data = fs.readFileSync(filename).toString()
			const treeObj = parser.parse_newick(data)
			const tree = tntTree().data(treeObj)
			const leafs = tree.root().get_all_leaves()
			const headers = leafs.map((n) => n.node_name())
			const bitkHeaderSet = new BitkHeaderSet(headers)
			return bitkHeaderSet.addTax2Headers(taxLevels).then(() => {
				let newData = data
				headers.forEach((header) => {
					log.info(`Finding a replacement for ${header}`)
					const newHeaderCandidate = bitkHeaderSet.getBitkHeaders().filter((h) => h.getOriginalHeader() === header)
					if (newHeaderCandidate.length !== 0) {
						log.debug(`-> ${JSON.stringify(newHeaderCandidate[0])}`)
						let newHeader = newHeaderCandidate[0].toVersion()
						if (newHeader !== '') {
							log.info(`Replacing ${header} with ${newHeader}`)
							log.debug(data)
							newData = newData.replace(header, newHeader)
							log.debug(data)
						}
					}
				})
				return newData
			})
		}
		default: {
			const data = fs.readFileSync(filename).toString()
			const headers = data.split('\n')
			const bitkHeaderSet = new BitkHeaderSet(headers)
			return bitkHeaderSet.addTax2Headers(taxLevels).then(() => {
				return bitkHeaderSet.writeHeaders()
			})
		}
	}
}
