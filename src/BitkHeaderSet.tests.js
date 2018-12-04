/* eslint-disable no-magic-numbers */
/* eslint-disable no-invalid-this*/
'use strict'

const expect = require('chai').expect
const BitkHeaderSet = require('./BitkHeaderSet')

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
	'Rh.pal.727-RPC_2742-YP_532609.1--38H',
	'Di.dad.1167-Dd703_3560-YP_002989140.1--36H',
	'Ga.cap.219-Galf_1013-YP_003846807.1--Uncat'
]

describe('BitkHeaderSet', function() {
	describe('getBitkHeaders', function() {
		it('should parse headers automatically', function() {
			const bitkHeaderSet = new BitkHeaderSet(headers)
			const bitkHeaders = bitkHeaderSet.getBitkHeaders()
			const headersV1 = bitkHeaders.map((h) => h.toVersion(1))
			expect(headersV1).eql(headers)
		})
	})
	describe('getTaxonomy', function() {
		this.timeout(10000)
		it('should get Taxonomy (and also parse headers)', function() {
			const bitkHeaderSet = new BitkHeaderSet(headers)
			return bitkHeaderSet.getTaxonomy().then((taxonomy) => {
				expect(taxonomy.data.length).eql(headers.length - 1)
			})
		})
	})
	describe('fetchGenomeVersions', function() {
		this.timeout(5000)
		it('should fetch gene versions (and also parse headers)', function() {
			const bitkHeaderSet = new BitkHeaderSet(headers)
			const expected = [
				'GCF_000145255.1',
				'GCF_000145255.1',
				'GCF_000510325.1',
				'GCF_000013745.1',
				'GCF_000294535.1',
				'GCF_000018285.1',
				'GCF_000422085.1'
			]
			return bitkHeaderSet.fetchGenomeVersions().then(() => {
				const genomeVersionsPromises = bitkHeaderSet.getBitkHeaders().map((h) => h.getGenomeVersion())
				return Promise.all(genomeVersionsPromises).then((genomeVersions) => {
					expect(genomeVersions).eql(expected)
				})
			})
		})
		it('should pass with unavailable headers (and also parse headers)', function() {
			const bitkHeaderSet = new BitkHeaderSet(badHeaders)
			const expected = [
				'GCF_000013745.1',
				null,
				'GCF_000145255.1'
			]
			return bitkHeaderSet.fetchGenomeVersions().then(() => {
				const genomeVersionsPromises = bitkHeaderSet.getBitkHeaders().map((h) => h.getGenomeVersion())
				return Promise.all(genomeVersionsPromises).then((genomeVersions) => {
					expect(genomeVersions).eql(expected)
				})
			})
		})
		it('should throw with unavailable headers if keepGoing is false (and also parse headers)', function() {
			const bitkHeaderSet = new BitkHeaderSet(badHeaders)
			return bitkHeaderSet.fetchGenomeVersions({keepGoing: false}).catch((err) => {
				expect(err).eql(new Error('Genome version not found.'))
			})
		})
	})
	describe('addTax2Headers', function() {
		it('should work', function() {
			const bitkHeaderSet = new BitkHeaderSet(badHeaders)
			const levels = ['phylum', 'class']
			const expected = [
				'Rh_pal_|GCF_000013745.1|RPC_2742||38H|Proteobacteria|Alphaproteobacteria',
				'Di_dad_|null|Dd703_3560||36H|InfoNotFound|InfoNotFound',
				'Ga_cap_|GCF_000145255.1|Galf_1013||Uncat|Proteobacteria|Betaproteobacteria'
			]
			return bitkHeaderSet.addTax2Headers(levels).then(() => {
				const headersV3 = bitkHeaderSet.writeHeaders(3)
				expect(headersV3).eql(expected)
			})
		})
	})
})
