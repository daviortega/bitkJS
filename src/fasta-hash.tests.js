/* eslint-disable no-magic-numbers */
'use strict'

const expect = require('chai').expect

let cbio = require('core-bio'),
	Promise = require('bluebird')

let fs = Promise.promisifyAll(require('fs'))

// Local
const hashHeader = require('./fasta-hash.js').hashHeader,
	hashHeaderStream = require('./fasta-hash.js').hashHeaderStream,
	unHashHeaderStream = require('./fasta-hash.js').unHashHeaderStream


describe('fasta-hash', function() {
	describe('functions', function() {
		describe('hashHeader', function() {
			it('returns hash from Fasta Object', function() {
				let fastaObject = {
						header_: 'This_is_a_valid_header_to_be_hashed'
					},
					expectedHeader = 'ffd73a52d1b23be15187'

				let header = hashHeader(fastaObject).hashed
				expect(header).eql(expectedHeader)
			})
			it('Supports changes in hashing algorithm', function() {
				let fastaObject = {
						header_: 'This_is_a_valid_header_to_be_hashed'
					},
					Options = {
						hashAlgorithm: 'sha256'
					},
					expectedHeader = '24685568abcf68a23acd'

				let header = hashHeader(fastaObject, Options).hashed
				expect(header).eql(expectedHeader)
			})
		})
	})
	describe('streams', function() {
		describe('hashIt', function() {
			it('it works as it should', function(done) {
				let expectedHeaders = [
					'0d2440774c71ad4399b9',
					'b83bc2c910377fbeb81b',
					'addc5d39035f595aea0f',
					'1ae5060b40023b3806ec',
					'7e75aa032e80ca755681',
					'06a05ebfa8143a7f2b40',
					'65fb5ad0bfb2edc1304b',
					'01b4f782f0c4fce79b08',
					'3aebd620da32b5e091c7',
					'1b92fdb8682e28e374bb'
				]
				let inputFasta = 'sampleData/fasta_sample.10.fa'

				let reader = fs.createReadStream(inputFasta),
					parser = cbio.fastaStream()

				let hashIt = hashHeaderStream(),
					hashedHeaders = []

				hashIt
					.on('data', function(chunk) {
						hashedHeaders.push(chunk.header_)
					})

				let stream = reader
					.pipe(parser)
					.pipe(hashIt)

				stream.on('finish', function() {
					expect(expectedHeaders).eql(hashedHeaders)
					done()
				})
			})
			it('changes the length of the hashed string', function(done) {
				let expectedHeaders = [
					'0d24407',
					'b83bc2c',
					'addc5d3',
					'1ae5060',
					'7e75aa0',
					'06a05eb',
					'65fb5ad',
					'01b4f78',
					'3aebd62',
					'1b92fdb'
				]
				let inputFasta = 'sampleData/fasta_sample.10.fa'

				let reader = fs.createReadStream(inputFasta),
					parser = cbio.fastaStream()

				let hashIt = hashHeaderStream(7),
					hashedHeaders = []

				hashIt
					.on('data', function(chunk) {
						hashedHeaders.push(chunk.header_)
					})

				let stream = reader
					.pipe(parser)
					.pipe(hashIt)

				stream.on('finish', function() {
					expect(expectedHeaders).eql(hashedHeaders)
					done()
				})
			})
		})
		describe('unHashIt', function() {
			it('it works as it should', function(done) {
				let hashTable = [
					{
						hashed: '0d2440774c71ad4399b9',
						original: 'Bu_pse_2959|BURPS305_6088|ZP_01764768.1'
					},
					{
						hashed: 'b83bc2c910377fbeb81b',
						original: 'Al_den_1386|Alide2_3888|YP_004389725.1'
					},
					{
						hashed: 'addc5d39035f595aea0f',
						original: 'Ac_xyl_5818|HMPREF0005_03704|ZP_16402413.1'
					},
					{
						hashed: '1ae5060b40023b3806ec',
						original: 'Bu_cen_5788|I35_0298|ZP_16295615.1'
					},
					{
						hashed: '7e75aa032e80ca755681',
						original: 'Ru_gel_1696|RGE_37450|YP_005438583.1'
					},
					{
						hashed: '06a05ebfa8143a7f2b40',
						original: 'Bu_pse_3464|BUH_6909|ZP_03791454.1'
					},
					{
						hashed: '65fb5ad0bfb2edc1304b',
						original: 'Me_ver_167|M301_1686|YP_003674643.1'
					},
					{
						hashed: '01b4f782f0c4fce79b08',
						original: 'Ga_cap_219|Galf_0984|YP_003846779.1'
					},
					{
						hashed: '3aebd620da32b5e091c7',
						original: 'Ni_eut_687|Neut_1162|YP_747382.1'
					},
					{
						hashed: '1b92fdb8682e28e374bb',
						original: 'Ru_gel_1696|RGE_39360|YP_005438771.1'
					}
				]

				let expectedHeaders = [
					'Bu_pse_2959|BURPS305_6088|ZP_01764768.1',
					'Al_den_1386|Alide2_3888|YP_004389725.1',
					'Ac_xyl_5818|HMPREF0005_03704|ZP_16402413.1',
					'Bu_cen_5788|I35_0298|ZP_16295615.1',
					'Ru_gel_1696|RGE_37450|YP_005438583.1',
					'Bu_pse_3464|BUH_6909|ZP_03791454.1',
					'Me_ver_167|M301_1686|YP_003674643.1',
					'Ga_cap_219|Galf_0984|YP_003846779.1',
					'Ni_eut_687|Neut_1162|YP_747382.1',
					'Ru_gel_1696|RGE_39360|YP_005438771.1'
				]
				let inputFasta = 'sampleData/fasta_sample.10.fa'

				let reader = fs.createReadStream(inputFasta),
					parser = cbio.fastaStream()

				let hashIt = hashHeaderStream()

				let	unHashIt = unHashHeaderStream(hashTable),
					unHashedHeaders = []

				unHashIt
					.on('data', function(chunk) {
						unHashedHeaders.push(chunk.header_)
					})

				let stream = reader
					.pipe(parser)
					.pipe(hashIt)
					.pipe(unHashIt)

				stream.on('finish', function() {
					expect(expectedHeaders).eql(unHashedHeaders)
					done()
				})
			})
			it('changes the length of the hashed string', function(done) {
				let expectedHeaders = [
					'0d24407',
					'b83bc2c',
					'addc5d3',
					'1ae5060',
					'7e75aa0',
					'06a05eb',
					'65fb5ad',
					'01b4f78',
					'3aebd62',
					'1b92fdb'
				]
				let inputFasta = 'sampleData/fasta_sample.10.fa'

				let reader = fs.createReadStream(inputFasta),
					parser = cbio.fastaStream()

				let hashIt = hashHeaderStream(7),
					hashedHeaders = []

				hashIt
					.on('data', function(chunk) {
						hashedHeaders.push(chunk.header_)
					})

				let stream = reader
					.pipe(parser)
					.pipe(hashIt)

				stream.on('finish', function() {
					expect(expectedHeaders).eql(hashedHeaders)
					done()
				})
			})
		})
	})
})
