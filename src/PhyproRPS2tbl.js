'use strict'

let defaultCutoff = 0.01

let BitkHeader = require('./BitkHeader.js')

module.exports =
class PhyproRPS2tbl {
	constructor(cutoff = defaultCutoff, maxclustdist = 0) {
		this.cutoff = cutoff
		this.maxclustdist = maxclustdist
	}

	parse(data) {
		let result = {
				rows: new Set(),
				cols: new Set(),
				vals: []
			},
			pssmList = data.cdd_list

		pssmList.forEach((pssm) => {
			let row = data[pssm].cdd,
				tmpRes = []
			result.rows.add(row)
			data[pssm].hit.forEach((h) => {
				if (h[1] < this.cutoff) {
					let header = new BitkHeader(h[0]),
						otherHit = tmpRes.findIndex((item) => {
							return item.val === header.locus
						})
					if (otherHit === -1) {
						tmpRes.push(
							{
								ro: row,
								val: header.locus,
								inf1: h[1]
							}
						)
					}
					else if (tmpRes[otherHit].inf1 > h[1]) {
						tmpRes[otherHit].inf1 = h[1]
					}
				}
			})
			tmpRes.sort((a, b) => {
				if (a.val < b.val) return -1
				if (a.val > b.val) return 1
				return 0
			})
			result.vals = result.vals.concat(tmpRes)
		})
		return this._group(result)
	}
	_group(tobegrouped) {
		let cluster = 0,
			row = null
		for (let i = 0; i < tobegrouped.vals.length; i++) {
			if (row !== tobegrouped.vals[i].ro) {
				if (row !== null)
					cluster = 0
				row = tobegrouped.vals[i].ro
			}
			let cluStr = 'A' + cluster
			tobegrouped.vals[i].col = cluStr
			tobegrouped.cols.add(cluStr)
			cluster++
		}
		return tobegrouped
	}
	tocsv(data, sep = ',') {
		let decimalCases = 0,
			cols = Array.from(data.cols),
			result = sep + cols.join(sep) + '\n'

		data.rows.forEach(function(row) {
			let thisRow = data.vals.filter((item) => {
				return item.ro === row
			})
			result += row
			thisRow.forEach((value) => {
				result += ',' + value.val + ' (' + value.inf1.toExponential(decimalCases).toUpperCase() + ')'
			})
			result += '\n'
		})
		return result
	}
}
