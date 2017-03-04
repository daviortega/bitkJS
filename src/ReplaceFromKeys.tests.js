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
	it('must be ok with not finding any match', function() {
		let myKeys = [
			{b: 'j', a: '1'}
		]
		let fixture = {
			in: 'aadaaddaadddaaaa',
			out: 'aadaaddaadddaaaa'
		}
		let repFK = new ReplaceFromKeys(myKeys),
			result = repFK.update(fixture.in)
		expect(result).eql(fixture.out)
	})
	it('must also work with special characters in keys', function() {
		let myKeys = [
			{b: '\\[', a: ':'}
		]
		let fixture = {
			in: 'aada[addaa[dddaaaa',
			out: 'aada:addaa:dddaaaa'
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
	it('key replacements should work', function() {
		let myKeys = [
			{b: 'dd', a: 'tt//tt'},
			{b: 'a', a: '2.2'}
		]
		let altKeys = [
			{b: '//', a: '|'},
			{b: '\\.', a: ';'}

		]
		let fixture = {
			in: 'aadddadaddaad',
			out: '2;22;2tt|ttd2;2d2;2tt|tt2;22;2d'
		}
		let repFK = new ReplaceFromKeys(myKeys),
			result = repFK.update(fixture.in, altKeys)
		expect(result).eql(fixture.out)
	})
	it('key replacements with special characters', function() {
		let myKeys = [
			{b: 'd', a: 'c:c'},
			{b: 'a', a: '2'}
		]
		let altKeys = [
			{b: '\\:', a: '__'},
			{b: '\\*', a: '%%'},
			{b: '__', a: '$$'}
		]
		let fixture = {
			in: 'aad:aad::daad*dda__aaa',
			out: '22c__c:22c__c::c__c22c__c*c__cc__c2__222'
		}
		let repFK = new ReplaceFromKeys(myKeys),
			result = repFK.update(fixture.in, altKeys)
		expect(result).eql(fixture.out)
	})
})
