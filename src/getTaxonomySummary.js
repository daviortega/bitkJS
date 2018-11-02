'use strict'

const bunyan = require('bunyan')
const mist3 = require('node-mist3')

const genes = new mist3.Genes()
const genomes = new mist3.Genomes()

module.exports = (bitkHeaders) => {
	const taxonomyInfo = {
		noData: [],
		ambiguous: [],
		data: []
	}
	const log = bunyan.createLogger({name: 'getTaxonomySummary'})
	const getGenomeTaxomy = async (bitkHeader) => {
		const genomeVersion = bitkHeader.getGenomeVersion()
		if (genomeVersion === null)
			return
		const record = taxonomyInfo.data.filter((item) => item.version === genomeVersion)
		if (record.length === 1) {
			log.info(`Adding count to genome: ${genomeVersion}`)
			record[0].count++
		}
		else {
			await genomes.getGenomeInfoByVersion(genomeVersion)
			.then((genomeInfo) => {
				log.info(`Adding new Genome: ${genomeInfo.name}`)
				taxonomyInfo.data.push({
					version: genomeVersion,
					superkingdom: genomeInfo.superkingdom,
					phylum: genomeInfo.phylum,
					class: genomeInfo.class,
					order: genomeInfo.order,
					family: genomeInfo.family,
					genus: genomeInfo.genus,
					species: genomeInfo.species,
					strain: genomeInfo.strain,
					count: 1
				})
			})
		}
		return
	}

	const getInfo = async (bitkHeaders) => {
		for (let i = 0, N = bitkHeaders.length; i < N; i++) {
			if (bitkHeaders[i].getGenomeVersion() === null) {
				log.warn(`Header ${bitkHeaders[i].getLocus()} does not have genome version.`)
				await genes.search(bitkHeaders[i].getLocus())
				.then((info) => {
					let genomeVersion = null
					if (info.length > 1) {
						log.warn(`Ambiguous data recovered from ${bitkHeaders[i].getLocus()}`)
						taxonomyInfo.ambiguous.push(bitkHeaders[i].getLocus())
					}
					else if (info.length === 0) {
						log.warn(`No data recovered from ${bitkHeaders[i].getLocus()}`)
						taxonomyInfo.noData.push(bitkHeaders[i].getLocus())
					}
					else {
						log.debug(info)
						genomeVersion = info[0].stable_id.split('-')[0]
					}
					bitkHeaders[i].addGenomeVersion(genomeVersion)
				})
			}
			log.info(`Getting taxonomy info for gene ${bitkHeaders[i].getHash()}`)
			await getGenomeTaxomy(bitkHeaders[i])
		}
		return taxonomyInfo
	}
	return getInfo(bitkHeaders)
}
