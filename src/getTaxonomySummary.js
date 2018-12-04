'use strict'

const bunyan = require('bunyan')
const mist3 = require('node-mist3')

const genomes = new mist3.Genomes()

module.exports = (bitkHeadersList) => {
	const taxonomyInfo = {
		noData: [],
		ambiguous: [],
		data: []
	}
	const log = bunyan.createLogger({name: 'getTaxonomySummary'})
	const getGenomeTaxomy = (bitkHeader) => {
		const genomeVersion = bitkHeader.getGenomeVersion()
		log.debug(`Working on bitkHeader with genome version: ${JSON.stringify(bitkHeader)}`)
		log.debug(`Genome version: ${genomeVersion}`)
		if (genomeVersion === null) {
			taxonomyInfo.noData.push(bitkHeader)
			return true
		}
		const record = taxonomyInfo.data.filter((item) => item.version === genomeVersion)
		if (record.length === 1) {
			log.info(`Adding count to genome: ${genomeVersion}`)
			record[0].count++
		}
		else {
			return genomes.getGenomeInfoByVersion(genomeVersion)
				.then((genomeInfo) => {
					log.info(`Adding new Genome: ${genomeInfo.name}`)
					const taxInfo = {
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
					}
					log.debug(`TaxInfo = ${JSON.stringify(taxInfo)}`)
					taxonomyInfo.data.push(taxInfo)
				})
		}
		return true
	}

	const getInfo = async (bitkHeaders) => {
		for (let i = 0, N = bitkHeaders.length; i < N; i++)
			await getGenomeTaxomy(bitkHeaders[i])
		return taxonomyInfo
	}
	return getInfo(bitkHeadersList)
}
