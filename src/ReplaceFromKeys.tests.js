/* eslint-disable no-unused-expressions */
'use strict'

let expect = require('chai').expect,
	ReplaceFromKeys = require('./ReplaceFromKeys.js')

describe('ReplaceFromKeys unit tests', function() {
	it('must have a key', function() {
		let myKeys = [
			{b: 'd', a: '1'}
		]
		let repFK = new ReplaceFromKeys(myKeys)
		expect(repFK.keys).eql(myKeys)
	})
	it('attribute .data must be null before update', function() {
		let myKeys = [
			{b: 'd', a: '1'}
		]
		let repFK = new ReplaceFromKeys(myKeys)
		expect(repFK.data).to.be.null
	})
	it('must switch all elements', function() {
		let myKeys = [
			{b: 'd', a: '1'}
		]
		let fixture = {
			in: 'aadaaddaadddaaaa',
			out: 'aa1aa11aa111aaaa'
		}
		let repFK = new ReplaceFromKeys(myKeys)
		repFK.update(fixture.in)
		expect(repFK.data).eql(fixture.out)
	})
	it('must work with multiple items in key', function() {
		let myKeys = [
			{b: 'd', a: '1'},
			{b: 'a', a: '2'}
		]
		let fixture = {
			in: 'aadaaddaadddaaaa',
			out: '2212211221112222'
		}
		let repFK = new ReplaceFromKeys(myKeys)
		repFK.update(fixture.in)
		expect(repFK.data).eql(fixture.out)
	})
	it('must work independently from other replacements', function() {
		let myKeys = [
			{b: 'd', a: 'a'},
			{b: 'a', a: '2'}
		]
		let fixture = {
			in: 'aadaaddaadddaaaa',
			out: '22a22aa22aaa2222'
		}
		let repFK = new ReplaceFromKeys(myKeys)
		repFK.update(fixture.in)
		expect(repFK.data).eql(fixture.out)
	})
})
