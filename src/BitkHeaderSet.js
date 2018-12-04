'use strict'

const bunyan = require('bunyan')
const Promise = require('bluebird')
const mist3 = require('node-mist3')

const genes = new mist3.Genes()

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
		this.hasTaxonomy = false
		this.errors = []
	}

	addTax2Headers(levels, skip = true) {
		log.info('Starting to addTax2Headers.')
		return new Promise((resolve, reject) => {
			this.getTaxonomy().then(() => {
				log.debug(this.taxonomySummary.data)
				this.bitkHeaders.forEach((bitkHeader) => {
					const genomeVersion = bitkHeader.getGenomeVersion()
					log.debug(`Finding taxonomy for genome version: ${genomeVersion}`)
					const taxonomy = this.taxonomySummary.data.filter((tax) => tax.version === genomeVersion)[0]
					log.debug(taxonomy)
					levels.forEach((level) => {
						try {
							bitkHeader.info.extra.push(taxonomy[level])
						}
						catch (e) {
							try {
								bitkHeader.info.extra.push('InfoNotFound')
							}
							catch (err) {
								log.error(`This ${bitkHeader.getOriginalHeader()}  header is not a bitkHeader format, skipping.`)
							}
						}
					})
					log.info('Done with addTax2Headers.')
					resolve()
				})
			})
		})
	}

	parseHeaders(force = false, skip = true) {
		log.info('Starting to parseHeaders.')
		if (!this.isParsed || force) {
			const bitkHeaders = this.bitkRawHeaders.map((header) => {
				const bitkHeader = new BitkHeader(header)
				bitkHeader.parse({skip})
				return bitkHeader
			})
			this.bitkHeaders = bitkHeaders
			this.isParsed = true
		}
		log.info('Done with parseHeaders')
		return
	}

	writeHeaders(version) {
		return this.bitkHeaders.map((h) => {
			const ver = version || h.version
			return h.toVersion(ver)
		})
	}

	getBitkHeaders() {
		if (this.isParsed)
			return this.bitkHeaders
		this.parseHeaders()
		return this.bitkHeaders
	}

	fetchGenomeVersions(options = {fetch: true, keepGoing: true}) {
		log.info('Starting to fetchGenomeVersions.')
		return new Promise((resolve, reject) => {
			this.parseHeaders()
			if (this.hasGenomeVersions) {
				log.info('Already have all the genome versions. Skipping fetch.')
				resolve(this.bitkHeaders)
			}
			else {
				const loci = this.bitkHeaders.map((header) => header.getLocus())
				log.debug(`Collection of loci: ${loci}`)
				log.info('Fetching genome versions.')
				genes.searchMany(loci)
					.then((genomeData) => {
						log.debug(genomeData)
						log.debug(`Collection of loci: ${loci}`)
						genomeData.forEach((genomeInfo, i) => {
							log.debug(`Working on locus ${i} - ${loci[i]}`)
							log.debug(genomeInfo)
							if (genomeInfo.length > 1) {
								log.error(`Ambiguous data recovered from ${loci[i]}`)
								this.errors.push(Error(`Ambiguous data recovered from ${loci[i]}`))
							}
							else if (genomeInfo.length === 0) {
								log.error(`No data recovered from ${loci[i]}`)
								this.errors.push(Error(`No data recovered from ${loci[i]}`))
							}
							else {
								this.bitkHeaders[i].addGenomeVersion(genomeInfo[0].stable_id.split('-')[0])
								log.debug(`Found gene's genome version: ${this.bitkHeaders[i].getGenomeVersion()}`)
							}
						})
					})
					.then(() => {
						log.info('Genome Version fetched.')
						this.hasGenomeVersions = true
						log.error(this.errors)
						log.info('Done with fetchGenomeVersions')
						resolve()
					})
			}
		})
	}

	getTaxonomy(force = false) {
		log.info('Starting to getTaxonomy.')
		return new Promise((resolve, reject) => {
			if (!this.hasTaxonomy || force) {
				this.fetchGenomeVersions().then(() => {
					log.debug(this.bitkHeaders)
					getTaxonomySummary(this.bitkHeaders)
						.then((taxonomy) => {
							this.taxonomySummary = taxonomy
							this.hasTaxonomy = true
							resolve(taxonomy)
						})
				})
			}
			else {
				log.info('Already have taxonomy, moving on.')
				resolve(this.taxonomySummary)
			}
		})
	}
}
