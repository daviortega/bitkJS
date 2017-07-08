'use strict'

let cbio = require('core-bio'),
	Transform = require('stream').Transform

let fs = require('fs')

const lineSeparator = '\n'

function readClusterData(file, encoding) {
	return new Promise(function(resolve, reject) {
		let clusterInfo = {},
			buffer_ = '',
			cluster = '',
			header = '',
			clustStream = fs.createReadStream(file)

		clustStream.on('data', function(chunk, enc, done) {
			buffer_ += chunk
			let lines = buffer_.split(lineSeparator)
			lines.forEach(function(line) {
				if (line[0] === '>') {
					cluster = line.substr(1)
				}
				else if (cluster !== '') {
					header = line.match('>.{19}')
					if (header)
						header = header[0].substr(1)
					clusterInfo[header] = cluster
				}
				else {
					throwWrongFileType_()
				}
			})
		})
		clustStream.on('end', function(err, clusterData) {
			resolve(clusterInfo)
		})
	})
}

class ParseFasta extends Transform {
	constructor(clusterInfo) {
		super({objectMode: true})
		this.clusterInfo = clusterInfo
		this.hashSize = 19
	}

	_transform(chunk, encoding, done) {
		let headerLookup = chunk.header_.substr(0, this.hashSize),
			cluster = checkHeaderLookUp_(headerLookup, this.clusterInfo)
		if (cluster) {
			this.clusterInfo = cleanCluster_(cluster, this.clusterInfo)
			chunk.header_ += '-' + cluster.replace(' ', '_')
			this.push(chunk)
		}
		done()
	}
}

function throwWrongFileType_() {
	throw new Error('This does not apppear to be a .clstr file. This program only works with cd-hit output format')
}

function checkHeaderLookUp_(headerLookup, clusterInfo) {
	let result = null
	if (headerLookup in clusterInfo)
		result = clusterInfo[headerLookup]
	return result
}

function cleanCluster_(cluster, clusterInfo) {
	let toRemove = []
	for (let lookup in clusterInfo) {
		if (clusterInfo[lookup] === cluster)
			toRemove.push(lookup)
	}
	toRemove.forEach(function(lookup) {
		Reflect.deleteProperty(clusterInfo, lookup)
	})
	return clusterInfo
}

readClusterData('../sampleData/sorted_fasta.cdhit.85.fa.clstr')
	.then(function(clusterInfo) {
		let fastaFile = '../sampleData/sorted_fasta.fa',
			myFastaStream = fs.createReadStream(fastaFile),
			readFasta = cbio.fastaStream(),
			parser = new ParseFasta(clusterInfo),
			outFile = '../sampleData/testing.cdhitparser.fa',
			ws = fs.createWriteStream(outFile),
			writer = cbio.fastaStream.writer()

		myFastaStream
			.pipe(readFasta)
			.pipe(parser)
			.pipe(writer)
			.pipe(ws)
	})
	// .catch(console.log.bind(console))
