'use strict'

let expect = require('chai').expect,
	BitkHeader = require('./BitkHeader.js')

describe('BitkHeader unit test', function() {
	describe('BITK3 type of tag format', function() {
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
				expect(bitkHeader.orgID).equal(fixture.orgID)
			})
		})
		it('Getting locus', () => {
			fixtures.forEach(function(fixture) {
				let bitkHeader = new BitkHeader(fixture.in)
				expect(bitkHeader.locus).equal(fixture.lo)
			})
		})
		it('Getting accession', () => {
			fixtures.forEach(function(fixture) {
				let bitkHeader = new BitkHeader(fixture.in)
				expect(bitkHeader.accession).equal(fixture.ac)
			})
		})
		it('Getting organism genus 2 characters marker', () => {
			fixtures.forEach(function(fixture) {
				let bitkHeader = new BitkHeader(fixture.in)
				expect(bitkHeader.ge).equal(fixture.ge)
			})
		})
		it('Getting organism species 3 characters marker', () => {
			fixtures.forEach(function(fixture) {
				let bitkHeader = new BitkHeader(fixture.in)
				expect(bitkHeader.sp).equal(fixture.sp)
			})
		})
		it('Getting organism MiST ID', () => {
			fixtures.forEach(function(fixture) {
				let bitkHeader = new BitkHeader(fixture.in)
				expect(bitkHeader.gid).equal(fixture.gid)
			})
		})
	})
	describe('BITK2 type of tag format', function() {
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
				let ver = 2
				let bitkHeader = new BitkHeader(fixture.in, ver)
				expect(bitkHeader.orgID).equal(fixture.orgID)
			})
		})
		it('Getting locus', () => {
			fixtures.forEach(function(fixture) {
				let ver = 2
				let bitkHeader = new BitkHeader(fixture.in, ver)
				expect(bitkHeader.locus).equal(fixture.lo)
			})
		})
		it('Getting accession', () => {
			fixtures.forEach(function(fixture) {
				let ver = 2
				let bitkHeader = new BitkHeader(fixture.in, ver)
				expect(bitkHeader.accession).equal(fixture.ac)
			})
		})
		it('Getting organism genus 2 characters marker', () => {
			fixtures.forEach(function(fixture) {
				let ver = 2
				let bitkHeader = new BitkHeader(fixture.in, ver)
				expect(bitkHeader.ge).equal(fixture.ge)
			})
		})
		it('Getting organism species 3 characters marker', () => {
			fixtures.forEach(function(fixture) {
				let ver = 2
				let bitkHeader = new BitkHeader(fixture.in, ver)
				expect(bitkHeader.sp).equal(fixture.sp)
			})
		})
		it('Getting organism MiST ID', () => {
			fixtures.forEach(function(fixture) {
				let ver = 2
				let bitkHeader = new BitkHeader(fixture.in, ver)
				expect(bitkHeader.gid).equal(fixture.gid)
			})
		})
	})
	describe('utilities', function() {
		it('Translate to versions 2 to 3', () => {
			let fixtures = [
				{
					in: 'My.xan.508-MXAN_2680-YP_630897.1',
					inVer: 2,
					out: 'My_xan_508|MXAN_2680|YP_630897.1',
					outVer: 3
				},
				{
					in: 'My.xan.508-MXAN_2680-YP_630897.1-F3-LJ',
					inVer: 2,
					out: 'My_xan_508|MXAN_2680|YP_630897.1|F3|LJ',
					outVer: 3
				}
			]
			fixtures.forEach(function(fixture) {
				let bitkHeader = new BitkHeader(fixture.in, fixture.inVer),
					newHeader = bitkHeader.toVersion(fixture.outVer)
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
			const expectedLocus = 'MXAN_2680'
			const locus = bitkHeader.getLocus()
			expect(locus).eq(expectedLocus)
		})
		it('should give the locus in version 2', function() {
			const header = 'My.xan.508-MXAN_2680-YP_630897.1'
			const ver = 2
			const bitkHeader = new BitkHeader(header, ver)
			const expectedLocus = 'MXAN_2680'
			const locus = bitkHeader.getLocus()
			expect(locus).eq(expectedLocus)
		})
	})
})
