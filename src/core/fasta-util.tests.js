/* eslint-disable no-magic-numbers */
'use strict'

const expect = require('chai').expect

// Local
const fastaUtil = require('./fasta-util')

describe('core functions - to be passed to core-bio', function() {
	describe('fasta-util', function() {
		describe('hashHeader', function() {
			it('returns hash from Fasta Object', function() {
				let fastaObject = {
						header_: 'This_is_a_valid_header_to_be_hashed'
					},
					expectedHeader = '24685568abcf68a23acd'


				expect(fastaUtil.hashHeader(fastaObject)).eql(expectedHeader)
			})
		})
	})
})
