'use strict'

let bunyan = require('bunyan'),
	PrettyStream = require('bunyan-prettystream'),
	Parser = require('text2json').Parser,
	Readable = require('stream').Readable

let prettyStdOut = new PrettyStream()
prettyStdOut.pipe(process.stdout)

module.exports =
class ParseBlastResults extends Readable {
	constructor(infile, keys = '') {
		super({objectMode: true})
		this.log = bunyan.createLogger({
			name: 'ParseBlastResults',
			streams: [{
				level: 'info',
				type: 'raw',
				stream: prettyStdOut
			}]
		})
		this.date = Date.now()
		let keyStr = keys
		if (keyStr === '')
			keyStr = 'qseqid sseqid bitscore* evalue* qlen* length* qcovs* slen*'

		this.hdrs = this._parseKeyString(keyStr)

		let options = {
			hasHeader: false,
			headers: this.hdrs.headers,
			separator: '\t'
		}
		this.log.info('Loading headers:' + options.headers.join(', '))
		this.parser = new Parser(options)

		this.infile = infile
		this.rowFlowing = false
	}

	parse(infile) {

	}

	_read(size) {
		if (!this.rowFlowing) {
			this.rowFlowing = true
			let i = 0
			this.parser.text2json(this.infile)
				.on('error', (err) => {
					this.log.warn(err)
				})
				.on('row', (row) => {
					this.hdrs.headers.forEach((hd, j) => {
						if (this.hdrs.number[j])
							row[hd] = Number(row[hd])
					})
					i++
					row.id = i
					row.stamp = this.date
					this.log.info('Processing record number: %s => %s', i, row.qseqid)
					this.push(row)
				})
				.on('end', () => {
					this.push(null)
				})
		}
	}

	_parseKeyString(keyStr) {
		let keys = keyStr.split(' '),
			isNumber = []
		keys.forEach((key, i) => {
			let match = key.match(/\*/)
			if (match) {
				isNumber.push(true)
				keys[i] = key.replace('*', '')
			}
			else {
				isNumber.push(false)
			}
		})
		return {headers: keys, number: isNumber}
	}
}
