'use strict'

let delim = '\t'

module.exports =
class RPSparser {
	parse(line) {
		let fields = line.split(delim),
			parsed = {}
		parsed.qseqid = fields[0]
		parsed.sseqid = fields[1]
		parsed.pident = parseFloat(fields[2])
		parsed.length = parseInt(fields[3])
		parsed.mismatch = parseInt(fields[4])
		parsed.gapopen = parseInt(fields[5])
		parsed.qstart = parseInt(fields[6])
		parsed.qend = parseInt(fields[7])
		parsed.sstart = parseInt(fields[8])
		parsed.send = parseInt(fields[9])
		parsed.evalue = parseFloat(fields[10])
		parsed.bitscore = parseFloat(fields[11])
		return parsed
	}
}
