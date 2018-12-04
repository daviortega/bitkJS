'use strict'

const fs = require('fs')
const bunyan = require('bunyan')

const log = bunyan.createLogger({
	name: 'fileSniffer'
})

const isFasta = (data) => {
	return data[0] === '>'
}

const isNewick = (data) => {
	return data[0] === '('
}

module.exports = (filename) => {
	const data = fs.readFileSync(filename).toString()
	if (isFasta(data)) {
		log.info('Sniffed a fasta')
		return 'fasta'
	}
	if (isNewick(data)) {
		log.info('Sniffed a newick')
		return 'newick'
	}
	return null
}
