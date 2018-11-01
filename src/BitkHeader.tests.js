'use strict'

const fs = require('fs')
const path = require('path')

const expect = require('chai').expect
const BitkHeader = require('./BitkHeader.js')

const bitk2SampleFile = path.resolve(__dirname, '../sampleData/bitk2headerSamples.txt')
const bitk2SampleData = fs.readFileSync(bitk2SampleFile)
	.toString()
	.split('\n')

describe.only('BitkHeader unit test', function() {
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
	describe.skip('should be able to handle non-bitk headers if asked', function() {
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
	describe.only('utilities', function() {
		it.only('Translate to versions 1 to 2', () => {
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
		it('Translate to versions 3 to 2', () => {
			let fixtures = [
				{
					out: 'My.xan.508-MXAN_2680-YP_630897.1',
					outVer: 2,
					in: 'My_xan_508|MXAN_2680|YP_630897.1',
					inVer: 3
				},
				{
					out: 'My.xan.508-MXAN_2680-YP_630897.1-F3-KH',
					outVer: 2,
					in: 'My_xan_508|MXAN_2680|YP_630897.1|F3|KH',
					inVer: 3
				}
			]
			fixtures.forEach(function(fixture) {
				let bitkHeader = new BitkHeader(fixture.in, fixture.inVer),
					newHeader = bitkHeader.toVersion(fixture.outVer)
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
			const header = 'My.const.508-MXAN_2680-YP_630897.1'

			const bitkHeader = new BitkHeader(header)
			bitkHeader.parse()
			const expectedLocus = 'MXAN_2680'
			const locus = bitkHeader.getLocus()
			expect(locus).eq(expectedLocus)
		})
	})
})
