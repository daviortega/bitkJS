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
	it('must complain for invalid keys')
	it('must switch all elements', function() {
		let myKeys = [
			{b: 'd', a: '1'}
		]
		let fixture = {
			in: 'aadaaddaadddaaaa',
			out: 'aa1aa11aa111aaaa'
		}
		let repFK = new ReplaceFromKeys(myKeys),
			result = repFK.update(fixture.in)
		expect(result).eql(fixture.out)
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
		let repFK = new ReplaceFromKeys(myKeys),
			result = repFK.update(fixture.in)
		expect(result).eql(fixture.out)
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
		let repFK = new ReplaceFromKeys(myKeys),
			result = repFK.update(fixture.in)
		expect(result).eql(fixture.out)
	})
	it('must complain if not a string is passed to be updated')
})
