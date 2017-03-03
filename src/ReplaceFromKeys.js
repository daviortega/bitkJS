'use strict'

module.exports =
class ReplaceFromKeys {
	constructor(keys) {
		this.keys = keys
		this.data = null
	}

	update(thing) {
		let self = this
		if (typeof (thing) === 'string') {
			let allPatters = self.keys.map(function(key) {
					return key.b
				}),
				re = new RegExp(allPatters.join('|'), 'g')
			let newData = thing.replace(re, function(matched) {
				return self.keys.filter(function(key) {
					return key.b === matched
				})[0].a
			})
			self.data = newData
		}
		this.data = self.data
	}
}


