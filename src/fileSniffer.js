'use strict'

const fs = require('fs')
const BitkHeader = require('./BitkHeader')

const isFasta = (data) => {
	return data[0] === '>'
}

const isNewick = (data) => {
	return data[0] === '('
}

module.exports = (filename) => {
	const data = fs.readFileSync(filename)
	if (isFasta(data))
		return 'fasta'
	if (isNewick(data))
		return 'newick'
	return null
}
