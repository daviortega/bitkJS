/* eslint-disable no-magic-numbers */
/* eslint-disable no-invalid-this*/
'use strict'

const expect = require('chai').expect

const path = require('path')
const addTaxToHeader = require('../src/addTaxToHeader')
const fs = require('fs')

const bitk2SampleFile = path.resolve(__dirname, '../sampleData/bitk2headerSamples.small.txt')
const fastaFile = path.resolve(__dirname, '../sampleData/fasta_sample.10.fa')
const fastaFileWithTax = path.resolve(__dirname, '../sampleData/fasta_sample.10.withTax.fa')
const newickFile = path.resolve(__dirname, '../sampleData/sampleTree.nwk')

describe('addTaxToHeader', function() {
	this.timeout(10000)
	it('should work with headers', function() {
		const expected = [
			'Sh.hal.1000-Shal_0001-YP_001672236.1-Proteobacteria',
			'Br.can.1001-BCAN_A0001-YP_001591879.1-Proteobacteria',
			'Ur.ure.1002-UUR10_0001-YP_002284414.1-Tenericutes',
			'Cy.sp..1003-cce_5218-YP_001798598.1-Cyanobacteria',
			'Br.sui.1004-BSUIS_B0003-YP_001621855.1-Proteobacteria',
			'Ba.pum.1005-BPUM_0001-YP_001485261.1-Firmicutes',
			'Rh.ery.1006-pREC1_0001-YP_345062.1-Actinobacteria',
			'Pa.sp..1007-Pjdr2_0001-YP_003008768.1-Firmicutes',
			'Me.nod.1008-Mnod_7772-YP_002489978.1-Proteobacteria',
			'Cy.sp..1009-PCC7424_0001-YP_002375343.1-Cyanobacteria'
		]
		return addTaxToHeader(bitk2SampleFile, ['phylum']).then((newHeaders) => {
			expect(newHeaders).eql(expected)
		})
	})
	it('should work with fasta file', function() {
		const expected = fs.readFileSync(fastaFileWithTax).toString()
		return addTaxToHeader(fastaFile, ['phylum', 'class']).then((fastaString) => {
			expect(fastaString).eql(expected)
		})
	})
	it('should work with newick file', function() {
		this.timeout(60000)
		const expected = '((Ac.rad.3860-AradN_010100004513-ZP_08946703.1--36H-InfoNotFound-InfoNotFound:0.86659397862544262914,apRsph246192922_34H, Al.fae.4137-QWA_14207-ZP_10349096.1--36H-Proteobacteria-Betaproteobacteria:0.75352580152702641758,(Pr.mir.1265-PMI2380-YP_002152098.1--36H-Proteobacteria-Gammaproteobacteria:0.61680486218524221975,Pa.ana.119-PANA_0752-YP_003519047.1--36H-Proteobacteria-Gammaproteobacteria:0.51781810330198396741):0.09662323960714098992):0.10466867294733905869,(((Ha.sp..3926-MOY_09047-ZP_09289168.1--36H-Proteobacteria-Gammaproteobacteria:0.80233492222146463035,Ha.elo.246-HELO_4340-YP_003899409.1--36H-Proteobacteria-Gammaproteobacteria:0.48393263522111334973):0.16009206016325039368)));'
		return addTaxToHeader(newickFile, ['phylum', 'class']).then((newickString) => {
			expect(newickString).eql(expected)
		})
	})
})
