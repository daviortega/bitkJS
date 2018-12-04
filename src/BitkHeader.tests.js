/* eslint-disable no-unused-vars */
'use strict'

const fs = require('fs')
const path = require('path')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

const expect = chai.expect
const should = chai.should()

const BitkHeader = require('./BitkHeader.js')

const bitk2SampleFile = path.resolve(__dirname, '../sampleData/bitk2headerSamples.txt')
const bitk2SampleData = fs.readFileSync(bitk2SampleFile)
	.toString()
	.split('\n')

describe('BitkHeader unit test', function() {
	describe('bitk header version 2 tag format', function() {
		let fixtures = [
			{
				in: 'My_xan_508|MXAN_2680|YP_630897.1',
				orgID: 'My_xan_508',
				ge: 'My',
				sp: 'xan',
				gid: 508,
				lo: 'MXAN_2680',
				ac: 'YP_630897.1'
			}
		]
		it('Getting organism ID', () => {
			fixtures.forEach(function(fixture) {
				let bitkHeader = new BitkHeader(fixture.in)
				bitkHeader.parse()
				expect(bitkHeader.getOrgId()).equal(fixture.orgID)
			})
		})
		it('Getting locus', () => {
			fixtures.forEach(function(fixture) {
				let bitkHeader = new BitkHeader(fixture.in)
				bitkHeader.parse()
				expect(bitkHeader.getLocus()).equal(fixture.lo)
			})
		})
		it('Getting accession', () => {
			fixtures.forEach(function(fixture) {
				let bitkHeader = new BitkHeader(fixture.in)
				bitkHeader.parse()
				expect(bitkHeader.getAccession()).equal(fixture.ac)
			})
		})
		it('Getting organism MiST ID', () => {
			fixtures.forEach(function(fixture) {
				let bitkHeader = new BitkHeader(fixture.in)
				bitkHeader.parse()
				expect(bitkHeader.getGId()).equal(fixture.gid)
			})
		})
	})
	describe('bitk header version 1 tag format', function() {
		let fixtures = [
			{
				in: 'My.xan.508-MXAN_2680-YP_630897.1',
				orgID: 'My.xan.508',
				ge: 'My',
				sp: 'xan',
				gid: 508,
				lo: 'MXAN_2680',
				ac: 'YP_630897.1'
			}
		]
		it('Getting organism ID', () => {
			fixtures.forEach(function(fixture) {
				let bitkHeader = new BitkHeader(fixture.in)
				bitkHeader.parse()
				expect(bitkHeader.getOrgId()).equal(fixture.orgID)
			})
		})
		it('Getting locus', () => {
			fixtures.forEach(function(fixture) {
				let bitkHeader = new BitkHeader(fixture.in)
				bitkHeader.parse()
				expect(bitkHeader.getLocus()).equal(fixture.lo)
			})
		})
		it('Getting accession', () => {
			fixtures.forEach(function(fixture) {
				const bitkHeader = new BitkHeader(fixture.in)
				bitkHeader.parse()
				expect(bitkHeader.getAccession()).equal(fixture.ac)
			})
		})
		it('Getting organism MiST ID', () => {
			fixtures.forEach(function(fixture) {
				const bitkHeader = new BitkHeader(fixture.in)
				bitkHeader.parse()
				expect(bitkHeader.getGId()).equal(fixture.gid)
			})
		})
	})
	describe('Should not match other headers', function() {
		const fixture = [
			'XX108XX'
		]
		it('should throw error', function() {
			fixture.forEach((header) => {
				const bitkHeader = new BitkHeader(header)
				expect(() => bitkHeader.parse()).to.throw()
			})
		})
	})
	describe('should be able to handle non-bitk headers if asked', function() {
		it('should work with several bitk header version 2', function() {
			const expected = bitk2SampleData.length
			let results = 0
			bitk2SampleData.forEach((header) => {
				const bitkHeader = new BitkHeader(header)
				const isBitkHeader = bitkHeader.parse()
				if (isBitkHeader)
					results++
			})
			expect(results).eq(expected)
		})
	})
	describe('utilities', function() {
		it('Translate to versions 1 to 2', () => {
			let fixtures = [
				{
					in: 'My.xan.508-MXAN_2680-YP_630897.1',
					out: 'My_xan_508|MXAN_2680|YP_630897.1',
					outVer: 2
				},
				{
					in: 'My.xan.508-MXAN_2680-YP_630897.1-F3-LJ',
					out: 'My_xan_508|MXAN_2680|YP_630897.1|F3|LJ',
					outVer: 2
				}
			]
			fixtures.forEach(function(fixture) {
				let bitkHeader = new BitkHeader(fixture.in)
				bitkHeader.parse()
				const newHeader = bitkHeader.toVersion(fixture.outVer)
				expect(newHeader).equal(fixture.out)
			})
		})
		it('Translate to versions 2 to 1', () => {
			let fixtures = [
				{
					out: 'My.xan.508-MXAN_2680-YP_630897.1',
					outVer: 1,
					in: 'My_xan_508|MXAN_2680|YP_630897.1'
				},
				{
					out: 'My.xan.508-MXAN_2680-YP_630897.1-F3-KH',
					outVer: 1,
					in: 'My_xan_508|MXAN_2680|YP_630897.1|F3|KH'
				}
			]
			fixtures.forEach(function(fixture) {
				const bitkHeader = new BitkHeader(fixture.in, fixture.inVer)
				bitkHeader.parse()
				const newHeader = bitkHeader.toVersion(fixture.outVer)
				expect(newHeader).equal(fixture.out)
			})
		})
	})
	describe('getLocus', function() {
		it('should give the locus in version 3', function() {
			const header = 'My_xan_508|MXAN_2680|YP_630897.1'
			const bitkHeader = new BitkHeader(header)
			bitkHeader.parse()
			const expectedLocus = 'MXAN_2680'
			const locus = bitkHeader.getLocus()
			expect(locus).eq(expectedLocus)
		})
		it('should give the locus in version 2', function() {
			const header = 'My.xan.508-MXAN_2680-YP_630897.1'

			const bitkHeader = new BitkHeader(header)
			bitkHeader.parse()
			const expectedLocus = 'MXAN_2680'
			const locus = bitkHeader.getLocus()
			expect(locus).eq(expectedLocus)
		})
	})
	describe('fetchGenomeVersion', function() {
		it('should work with header with genome version', function() {
			const header = 'Gr_hol|GCF_001558255.2-AL542_RS03615'
			const bitkHeader = new BitkHeader(header)
			bitkHeader.parse()
			const expected = 'GCF_001558255.2'
			return bitkHeader.fetchGenomeVersion().then((genomeVersion) => {
				expect(genomeVersion).eql(expected)
			})
		})
		it('should also work with valid header without genome version (bitk version 1)', function() {
			const header = 'My.xan.508-MXAN_2680-YP_630897.1'
			const bitkHeader = new BitkHeader(header)
			bitkHeader.parse()
			return bitkHeader.fetchGenomeVersion({fetch: false}).should.be.rejectedWith('Genome version not found in header MXAN_2680. No fetch allowed.')
		})
		it('should not work with valid header without genome version (bitk version 1)', function() {
			const header = 'My.xan.508-MXAN_2680-YP_630897.1'
			const bitkHeader = new BitkHeader(header)
			bitkHeader.parse()
			const expected = 'GCF_000012685.1'
			return bitkHeader.fetchGenomeVersion().then((genomeVersion) => {
				expect(genomeVersion).eql(expected)
			})
		})
	})
})
