'use strict'

const expect = require('chai').expect
const BitkHeaderSet = require('./BitkHeaderSet')
const BitkHeader = require('./BitkHeader')

const headers = [
	'Ga.cap.219-Galf_1012-YP_003846806.1--Uncat',
	'Ga.cap.219-Galf_1013-YP_003846807.1--Uncat',
	'Ps.mon.7931-X970_27400-REF_PRJNA231108:X970_27400--40H',
	'Rh.pal.727-RPC_2742-YP_532609.1--38H',
	'Pe.car.2091-PCC21_027230-YP_006647379.1--36H',
	'Sh.pea.854-Spea_0900-YP_001500762.1--40H',
	'Se.liq.7747-M495_06545-YP_008229264.1--36H'
]

describe.only('BitkHeaderSet', function() {
	describe('getBitkHeaders', function() {
		it('should parse headers automatically', function() {
			const bitkHeaderSet = new BitkHeaderSet(headers)
			const bitkHeaders = bitkHeaderSet.getBitkHeaders()
			const headersV1 = bitkHeaders.map((h) => h.toVersion(1))
			expect(headersV1).eql(headers)
		})
	})
	describe('getTaxonomy', function() {
		this.timeout(5000)
		it('should parse headers automatically', function() {
			const bitkHeaderSet = new BitkHeaderSet(headers)
			return bitkHeaderSet.getTaxonomy().then((taxonomy) => {
				expect(taxonomy.data.length).eql(headers.length - 1)
			})
		})
	})
})
