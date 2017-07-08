'use strict'

const fs = require('fs'),
	fasta = require('bionode-fasta'),
	throught2 = require('through2'),
	BitkHeader = require('../src/BitkHeader.js')


let filein = process.argv[2],
	fileout = process.argv[3]

let orgs = {},
	aa = {},
	pos = 3

function headerStats(orgss) {
	return throught2({objectMode: true, allowHalfOpen: false}, function(chunk, enc, done) {
		let item = JSON.parse(chunk.toString()),
			header = new BitkHeader(item.id)
		if (header.orgID in orgs)
			orgss[header.orgID] += 1
		else
			orgss[header.orgID] = 1
		done(null, chunk)
	})
}

function seqStats(posistion, hash) {
	return throught2({objectMode: true, allowHalfOpen: false}, function(chunk, enc, done) {
		let item = JSON.parse(chunk.toString())
		if (item.seq[pos] in aa)
			aa[item.seq[pos]] += 1
		else
			aa[item.seq[pos]] = 1
		done(null, chunk)
	})
}

let writeOut = fs.createWriteStream(fileout)

fs.createReadStream(filein)
	.pipe(fasta())
	.pipe(headerStats(orgs))
	.pipe(seqStats(pos, aa))
	.on('end', function() {
		console.log(JSON.stringify(orgs, null, '\t'))
		console.log(JSON.stringify(aa))
	})
	.pipe(writeOut)


