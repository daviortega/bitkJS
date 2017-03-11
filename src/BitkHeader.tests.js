'use strict'

let expect = require('chai').expect,
	BitkHeader = require('./BitkHeader.js')

describe('BitkHeader unit test', () => {
	it('Separating the tags in standard fields', () => {
		let fixtures = [
			{
				in: 'My_xan_508|MXAN_2680|YP_630897.1',
				orgID: 'My_xan_508',
				lo: 'MXAN_2680',
				ac: 'YP_630897.1'
			}
		]
		fixtures.forEach(function(fixture) {
			let bitkHeader = new BitkHeader(fixture.in)
			expect(bitkHeader.orgID).equal(fixture.orgID)
			expect(bitkHeader.locus).equal(fixture.lo)
			expect(bitkHeader.accession).equal(fixture.ac)
		})
	})
})
