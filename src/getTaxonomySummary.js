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
	const getGenomeTaxomy = async (genomeVersion) => {
		if (!genomeVersion)
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

	const getInfo = async (loci) => {
		for (let i = 0, N = loci.length; i < N; i++) {
			await genes.search(loci[i])
				.then((info) => {
					let genomeVersion = null
					if (info.length > 1) {
						log.warn(`Ambiguous data recovered from ${loci[i]}`)
						taxonomyInfo.ambiguous.push(loci[i])
					}
					else if (info.length === 0) {
						log.warn(`No data recovered from ${loci[i]}`)
						taxonomyInfo.noData.push(loci[i])
					}
					else {
						log.debug(info)
						genomeVersion = info[0].stable_id.split('-')[0]
					}
					return genomeVersion
				})
				.then(getGenomeTaxomy)
		}
		return taxonomyInfo
	}

	const loci = bitkHeaders.map((header) => header.getLocus())
	return getInfo(loci)
}
