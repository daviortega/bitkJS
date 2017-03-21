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
		let keyStr = keys
		if (keyStr === '')
			keyStr = 'qseqid sseqid bitscore evalue qlen length qcovs slen'

		let hdrs = this._parseKeyString(keyStr)

		let options = {
			hasHeader: false,
			headers: hdrs,
			separator: '\t'
		}
		this.parser = new Parser(options)

		this.infile = infile
		this.rowFlowing = false

		this.log = bunyan.createLogger({
			name: 'ParseBlastResults',
			streams: [{
				level: 'info',
				type: 'raw',
				stream: prettyStdOut
			}]
		})
		this.log.info('Loading headers:' + options.headers.join(', '))
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
					i++
					this.log.info('Processing record number: %s => %s', i, row.qseqid)
					this.push(row)
				})
				.on('end', () => {
					this.push(null)
				})
		}
	}

	_parseKeyString(keyStr) {
		let keys = keyStr.split(' ')
		return keys
	}
}
