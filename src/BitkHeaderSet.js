'use strict'

const BitkHeader = require('./BitkHeader')
const getTaxonomySummary = require('./getTaxonomySummary')

module.exports =
class BitkHeaderSet {
	constructor(bitkRawHeaders) {
		this.bitkRawHeaders = bitkRawHeaders || []
		this.bitkHeaders = []
		this.taxonomySummary = []
		this.isParsed = false
	}

	parseHeaders() {
		const bitkHeaders = this.bitkRawHeaders.map((header) => {
			const bitkHeader = new BitkHeader(header)
			bitkHeader.parse()
			return bitkHeader
		})
		this.bitkHeaders = bitkHeaders
		this.isParsed = true
		return
	}

	getBitkHeaders() {
		if (this.isParsed)
			return this.bitkHeaders
		this.parseHeaders()
		return this.bitkHeaders
	}

	getTaxonomy() {
		if (!this.isParsed)
			this.parseHeaders()
		if (this.taxonomySummary.length === 0)
			this.taxonomySummary = getTaxonomySummary(this.bitkHeaders)
		return this.taxonomySummary
	}

}
