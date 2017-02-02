'use strict'

let expect = require('chai').expect,
	HelloWorld = require('./helloWorld.js')

describe('My first test suite', () => {
	it('My first test', () => {
		let hello = new HelloWorld(),
			tellMe = hello.to('Davi')
		expect('Hello, Davi').equal(tellMe)
	})
})
