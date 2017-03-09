/* eslint-disable no-unused-expressions */
/* eslint-disable no-magic-numbers */
'use strict'

let expect = require('chai').expect,
	RPSparser = require('./RPSparser.js')

describe('RPSparser unit tests', function() {
	it('parsed must have all fields', function() {
		let line = 'My_xan_508|MXAN_0005|YP_628291.1	gnl|CDD|226054	22.73	88	63	3	190	276	387	470	3e-04	31.6',
			expected = {
				qseqid: 'My_xan_508|MXAN_0005|YP_628291.1',
				sseqid: 'gnl|CDD|226054',
				pident: 22.73,
				length: 88,
				mismatch: 63,
				gapopen: 3,
				qstart: 190,
				qend: 276,
				sstart: 387,
				send: 470,
				evalue: 3E-04,
				bitscore: 31.6
			},
			rpsParser = new RPSparser()
		let parsed = rpsParser.parse(line)
		expect(parsed).eql(expected)
	})
})
