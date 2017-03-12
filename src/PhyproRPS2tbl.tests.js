/* eslint-disable global-require */
'use strict'

let expect = require('chai').expect,
	PhyproRPS2tbl = require('./PhyproRPS2tbl.js')

let	cutoff = 0.001

describe('PhyproRPS2tbl unit test', function() {
	it('let it parse', function() {
		let myData = require('../sampleData/rps.mist22.508.myxo.json')
		let expected =
			[
				{
					ro: 'COG0515',
					val: 'MXAN_0882',
					inf1: 2e-65,
					col: 'A0'
				},
				{
					ro: 'COG0515',
					val: 'MXAN_1163',
					inf1: 9e-62,
					col: 'A1'
				},
				{
					ro: 'COG0515',
					val: 'MXAN_2680',
					inf1: 5e-66,
					col: 'A2'
				},
				{
					ro: 'COG0515',
					val: 'MXAN_3202',
					inf1: 6e-66,
					col: 'A3'
				},
				{
					ro: 'COG0515',
					val: 'MXAN_4591',
					inf1: 4e-62,
					col: 'A4'
				},
				{
					ro: 'COG0515',
					val: 'MXAN_6317',
					inf1: 3e-62,
					col: 'A5'
				},
				{
					ro: 'COG0515',
					val: 'MXAN_6420',
					inf1: 4e-62,
					col: 'A6'
				},
				{
					ro: 'COG0542',
					val: 'MXAN_4178',
					inf1: 0,
					col: 'A0'
				},
				{
					ro: 'COG0542',
					val: 'MXAN_4813',
					inf1: 0,
					col: 'A1'
				},
				{
					ro: 'COG0542',
					val: 'MXAN_4832',
					inf1: 0,
					col: 'A2'
				},
				{
					ro: 'COG0542',
					val: 'MXAN_5092',
					inf1: 0,
					col: 'A3'
				},
				{
					ro: 'COG0542',
					val: 'MXAN_6026',
					inf1: 0,
					col: 'A4'
				},
				{
					ro: 'COG0631',
					val: 'MXAN_1412',
					inf1: 5e-61,
					col: 'A0'
				},
				{
					ro: 'COG0631',
					val: 'MXAN_2044',
					inf1: 2e-83,
					col: 'A1'
				},
				{
					ro: 'COG0631',
					val: 'MXAN_4398',
					inf1: 7e-73,
					col: 'A2'
				},
				{
					ro: 'COG0631',
					val: 'MXAN_5349',
					inf1: 3e-81,
					col: 'A3'
				},
				{
					ro: 'COG0631',
					val: 'MXAN_7191',
					inf1: 0.000003,
					col: 'A4'
				}
			]

		let	maxclustDist = 5,
			pRPS2tbl = new PhyproRPS2tbl(maxclustDist, cutoff),
			parsed = pRPS2tbl.parse(myData)
		expect(parsed.vals).eql(expected)
	})
	it('parser must order by .val', function() {
		let myData = require('../sampleData/rps.mist22.508.myxo.2.json')
		let expected = [
			{ro: 'COG0515', val: 'MXAN_0614', inf1: 6e-56, col: 'A0'},
			{ro: 'COG0515', val: 'MXAN_0755', inf1: 8e-59, col: 'A1'},
			{ro: 'COG0515', val: 'MXAN_0871', inf1: 6e-59, col: 'A2'},
			{ro: 'COG0515', val: 'MXAN_0882', inf1: 2e-65, col: 'A3'},
			{ro: 'COG0515', val: 'MXAN_0930', inf1: 7e-59, col: 'A4'},
			{ro: 'COG0515', val: 'MXAN_1163', inf1: 9e-62, col: 'A5'},
			{ro: 'COG0515', val: 'MXAN_1467', inf1: 3e-61, col: 'A6'},
			{ro: 'COG0515', val: 'MXAN_1577', inf1: 8e-56, col: 'A7'},
			{ro: 'COG0515', val: 'MXAN_1929', inf1: 2e-55, col: 'A8'},
			{ro: 'COG0515', val: 'MXAN_2156', inf1: 8e-56, col: 'A9'},
			{ro: 'COG0515', val: 'MXAN_2255', inf1: 2e-59, col: 'A10'},
			{ro: 'COG0515', val: 'MXAN_2550', inf1: 3e-56, col: 'A11'},
			{ro: 'COG0515', val: 'MXAN_2680', inf1: 5e-66, col: 'A12'},
			{ro: 'COG0515', val: 'MXAN_2910', inf1: 5e-54, col: 'A13'},
			{ro: 'COG0515', val: 'MXAN_3202', inf1: 6e-66, col: 'A14'},
			{ro: 'COG0515', val: 'MXAN_3338', inf1: 2e-58, col: 'A15'},
			{ro: 'COG0515', val: 'MXAN_3693', inf1: 1e-52, col: 'A16'},
			{ro: 'COG0515', val: 'MXAN_3955', inf1: 4e-58, col: 'A17'},
			{ro: 'COG0515', val: 'MXAN_4017', inf1: 2e-57, col: 'A18'},
			{ro: 'COG0515', val: 'MXAN_4591', inf1: 4e-62, col: 'A19'},
			{ro: 'COG0515', val: 'MXAN_4700', inf1: 4e-53, col: 'A20'},
			{ro: 'COG0515', val: 'MXAN_5176', inf1: 2e-59, col: 'A21'},
			{ro: 'COG0515', val: 'MXAN_6043', inf1: 4e-61, col: 'A22'},
			{ro: 'COG0515', val: 'MXAN_6183', inf1: 6e-60, col: 'A23'},
			{ro: 'COG0515', val: 'MXAN_6317', inf1: 3e-62, col: 'A24'},
			{ro: 'COG0515', val: 'MXAN_6420', inf1: 4e-62, col: 'A25'},
			{ro: 'COG0515', val: 'MXAN_7082', inf1: 2e-56, col: 'A26'},
			{ro: 'COG0515', val: 'MXAN_7208', inf1: 7e-53, col: 'A27'}
		]
		let	maxclustDist = 5,
			pRPS2tbl = new PhyproRPS2tbl(maxclustDist, cutoff),
			parsed = pRPS2tbl.parse(myData)
		expect(parsed.vals).eql(expected)
	})
})
