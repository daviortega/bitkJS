'use strict'

const mist3 = require('node-mist3')
const bunyan = require('bunyan')
const Writable = require('stream').Writable
const Readable = require('stream').Readable
const fs = require('fs')

class MakeFastaFromGenes extends Writable {
	constructor(saveStreams, options) {
		super({objectMode: true})
		this.saveStream = saveStreams
		this.genomeInfo = {}
		this.options = options
		this.log = bunyan.createLogger({name: 'SavePFQLResults'})
	}

	addGenomeInfo_(genomeVersion) {
		const genomes = new mist3.Genomes()
		return genomes.getGenomeInfoByVersion(genomeVersion).then((genomeInfo) => {
			this.genomeInfo[genomeVersion] = genomeInfo
			return genomeInfo
		})
	}

	getGenomeVersion_(gene) {
		return gene.stable_id.split('-')[0]
	}

	_write(gene, enc, next) {
		if (gene.hasOwnProperty('stable_id')) {
			const genomeVersion = this.getGenomeVersion_(gene)
			if (!this.genomeInfo[genomeVersion]) {
				this.addGenomeInfo_(genomeVersion).then((genomeInfo) => {
					const mkFasta = new mist3.MakeFasta(genomeInfo)
					const fastaEntry = mkFasta.processOne(gene)
					this.saveStream.write(fastaEntry)
				})
				.catch((err) => {
					throw err
				})
			}
			else {
				const mkFasta = new mist3.MakeFasta(this.genomeInfo[genomeVersion])
				const fastaEntry = mkFasta.processOne(gene)
				this.saveStream.write(fastaEntry)
			}
		}
		next()
	}
}

module.exports = (stableIds, filename, options = {keepGoing: false}) => {
	const mist3Genes = new mist3.Genes()
	const saveStream = fs.createWriteStream(filename)
	const mkFasta = new MakeFastaFromGenes(saveStream)
	return mist3Genes
		.infoAll(stableIds, options)
		.then((genes) => {
			return mist3Genes.addAseqInfo(genes, options)
		})
		.then((genes) => {
			const readable = new Readable({objectMode: true})

			readable.pipe(mkFasta)

			genes.forEach((gene) => {
				readable.push(gene)
			})
			readable.push(null)
		})
		.catch((err) => {
			throw err
		})
}
