'use strict'

const bunyan = require('bunyan')
const mist3 = require('node-mist3')

const genes = new mist3.Genes()
const genomes = new mist3.Genomes()


const log = bunyan.createLogger({name: 'getTaxonomySummary'})

const getGenomeTaxomy = async (genomeVersion) => {
	return genomes.getGenomeInfoByVersion(genomeVersion)
		.then((genomeInfo) => {
			const taxonomy = {
				superkingdom: genomeInfo.superkingdom,
				phylum: genomeInfo.phylum,
				class: genomeInfo.class,
				order: genomeInfo.order,
				family: genomeInfo.family,
				genus: genomeInfo.genus,
				species: genomeInfo.species,
				strain: genomeInfo.strain
			}
			return taxonomy
		})
}

const getInfo = async (loci) => {
	const taxonomyInfo = []
	for (let i = 0, N = loci.length; i < N; i++) {
		await genes.search(loci[i])
			.then((info) => {
				if (info.length > 1) {
					log.error(`Ambiguous data recovered from ${loci[i]}`)
					throw Error(`Ambiguous data recovered from ${loci[i]}`)
				}
				if (info.length === 0) {
					log.error(`No data recovered from ${loci[i]}`)
					throw Error(`No data recovered from ${loci[i]}`)
				}
				log.debug(info)
				const genomeVersion = info[0].stable_id.split('-')[0]
				return genomeVersion
			})
			.then(getGenomeTaxomy)
			.then((genomeTaxInfo) => {
				taxonomyInfo.push(genomeTaxInfo)
			})
	}
	return taxonomyInfo
}

module.exports = (bitkHeaders) => {
	const loci = bitkHeaders.map((header) => header.getLocus())
	return getInfo(loci)
}
