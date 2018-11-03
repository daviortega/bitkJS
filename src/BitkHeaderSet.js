'use strict'

const bunyan = require('bunyan')
const Promise = require('bluebird')

const BitkHeader = require('./BitkHeader')
const getTaxonomySummary = require('./getTaxonomySummary')

const log = bunyan.createLogger({name: 'BitkHeaderSet'})

module.exports =
class BitkHeaderSet {
	constructor(bitkRawHeaders) {
		this.bitkRawHeaders = bitkRawHeaders || []
		this.bitkHeaders = []
		this.taxonomySummary = []
		this.isParsed = false
		this.hasGenomeVersions = false
	}

	addTax2Headers(levels) {
		const taxonomy = this.getTaxonomy()
		this.bitkHeaders.forEach((bitkHeader) => {
			const genomeVersion = bitkHeader.getGenomeVersion()
		})
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

	async fetchGenomeVersions(options = {keepGoing: true}) {
		const errors = []
		if (!this.isParsed)
			this.parseHeaders()
		if (this.hasGenomeVersions)
			return
		const allPromises = Promise.each(this.bitkHeaders, (header) => {
			return header.getGenomeVersion(true)
			.catch((err) => {
				console.log(err)
				return
			})
			.then((data) => {
				log.info(`Got data ${data}`)
			})
		})

		await allPromises.catch((err) => {
			console.log(err)
		})
		.then(() => {
			console.log('hurray')
		})
		
/*
			catch (err) {
				log.warn(`Error: ${this.bitkHeaders[i].getLocus()}`)
				if (options.keepGoing) {
					log.warn(`Couldn't find genome version for: ${this.bitkHeaders[i].getLocus()}`)
				}
				else {
					log.error(`Couldn't find genome version for: ${this.bitkHeaders[i].getLocus()}. Stop`)
					throw err
				}
			}
		}
		return */
	}

	getTaxonomy() {
		if (!this.isParsed)
			this.parseHeaders()
		if (this.taxonomySummary.length === 0)
			this.taxonomySummary = getTaxonomySummary(this.bitkHeaders)
		return this.taxonomySummary
	}

}
