/* eslint-disable no-magic-numbers */
/* eslint-disable no-invalid-this*/
'use strict'

const expect = require('chai').expect
const getTaxonomySummary = require('./getTaxonomySummary')
const BitkHeader = require('./BitkHeader.js')

const headers = [
	'Ga.cap.219-Galf_1012-YP_003846806.1--Uncat',
	'Ga.cap.219-Galf_1013-YP_003846807.1--Uncat',
	'Ps.mon.7931-X970_27400-REF_PRJNA231108:X970_27400--40H',
	'Rh.pal.727-RPC_2742-YP_532609.1--38H',
	'Pe.car.2091-PCC21_027230-YP_006647379.1--36H',
	'Sh.pea.854-Spea_0900-YP_001500762.1--40H',
	'Se.liq.7747-M495_06545-YP_008229264.1--36H'
]

const badHeaders = [
	'Di.dad.1167-Dd703_3560-YP_002989140.1--36H'
]

describe('getTaxonomySummary', function() {
	it('should work', function() {
		this.timeout(10000)
		const ver = 2
		const bitkHeaders = headers.map((header) => {
			const bitkHeader = new BitkHeader(header)
			bitkHeader.parse()
			return bitkHeader
		})
		const expected = {
			noData: [],
			ambiguous: [],
			data: [
				{
					version: 'GCF_000145255.1',
					superkingdom: 'Bacteria',
					phylum: 'Proteobacteria',
					class: 'Betaproteobacteria',
					order: 'Nitrosomonadales',
					family: 'Gallionellaceae',
					genus: 'Gallionella',
					species: 'Gallionella capsiferriformans',
					strain: 'ES-2',
					count: 2
				},
				{
					version: 'GCF_000510325.1',
					superkingdom: 'Bacteria',
					phylum: 'Proteobacteria',
					class: 'Gammaproteobacteria',
					order: 'Pseudomonadales',
					family: 'Pseudomonadaceae',
					genus: 'Pseudomonas',
					species: 'Pseudomonas monteilii',
					strain: 'SB3101',
					count: 1
				},
				{
					version: 'GCF_000013745.1',
					superkingdom: 'Bacteria',
					phylum: 'Proteobacteria',
					class: 'Alphaproteobacteria',
					order: 'Rhizobiales',
					family: 'Bradyrhizobiaceae',
					genus: 'Rhodopseudomonas',
					species: 'Rhodopseudomonas palustris',
					strain: 'BisB18',
					count: 1
				},
				{
					version: 'GCF_000294535.1',
					superkingdom: 'Bacteria',
					phylum: 'Proteobacteria',
					class: 'Gammaproteobacteria',
					order: 'Enterobacterales',
					family: 'Pectobacteriaceae',
					genus: 'Pectobacterium',
					species: 'Pectobacterium carotovorum',
					strain: 'subsp. carotovorum PCC21',
					count: 1
				},
				{
					version: 'GCF_000018285.1',
					superkingdom: 'Bacteria',
					phylum: 'Proteobacteria',
					class: 'Gammaproteobacteria',
					order: 'Alteromonadales',
					family: 'Shewanellaceae',
					genus: 'Shewanella',
					species: 'Shewanella pealeana',
					strain: 'ATCC 700345',
					count: 1
				},
				{
					version: 'GCF_000422085.1',
					superkingdom: 'Bacteria',
					phylum: 'Proteobacteria',
					class: 'Gammaproteobacteria',
					order: 'Enterobacterales',
					family: 'Yersiniaceae',
					genus: 'Serratia',
					species: 'Serratia liquefaciens',
					strain: 'ATCC 27592',
					count: 1
				}
			]
		}
		return getTaxonomySummary(bitkHeaders).then((info) => {
			expect(info).eql(expected)
		})
	})
	it('should also work with bad locus', function() {
		this.timeout(10000)
		const bitkHeaders = badHeaders.map((header) => {
			const bitkHeader = new BitkHeader(header)
			bitkHeader.parse()
			return bitkHeader
		})
		const expected = {
			noData: [
				'Dd703_3560'
			],
			ambiguous: [],
			data: []
		}
		return getTaxonomySummary(bitkHeaders).then((info) => expect(info).eql(expected))
	})
})
