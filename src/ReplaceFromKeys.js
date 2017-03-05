'use strict'

module.exports =
/**
 * Replace from Keys will initialize it with a set of replacement
 * instructions passed as and Array of object like this:
 *
 * {b: 'pattern to be replaced', a: 'pattern to replace with'}
 *
 * Special characters should have double backslash "\\".
 *
 */
class ReplaceFromKeys {
	constructor(keys) {
		this.keys = keys
	}

	/**
	 * update the string in thing by replacing the changes passed
	 * in the constructor as keys and post-replacement extra replacements.
	 *
	 * @param {string} thing - string to be replaced
	 * @param {Array{Objects}} [keyReplacements=[]] - Array of keys for replacements in the original key
	 * @returns string after the replacements
	 */

	update(thing = '', keyReplacements = [], fieldsToKeep = [], delim = '|') {
		let self = this
		if (fieldsToKeep.length !== 0)
			self.keys = this._preProcessKeys(self.keys, fieldsToKeep, delim)

		if (keyReplacements.length !== 0)
			self.keys = this._replaceInKeys(self.keys, keyReplacements)

		if (typeof (thing) === 'string') {
			let newData = this._replace(thing, self.keys)
			self.data = newData
		}
		return self.data
	}

	_replace(data, keys) {
		let altPatters = keys.map(function(key) {
				return key.b
			}),
			jointPat = altPatters.join('|'),
			re = new RegExp(jointPat, 'g')
		let newData = data.replace(re, function(matched) {
			return keys.filter(function(key) {
				return key.b.replace('\\', '') === matched
			})[0].a
		})
		return newData
	}

	_replaceInKeys(keys, altKeys) {
		let altPatters = altKeys.map(function(altKey) {
				return altKey.b
			}),
			jointPat = altPatters.join('|'),
			re = new RegExp(jointPat, 'g')
		let newKeys = []
		keys.forEach(function(key) {
			let newKey = {}
			newKey.b = key.b
			newKey.a = key.a.replace(re, function(matched) {
				return altKeys.filter(function(altKey) {
					return altKey.b.replace('\\', '') === matched
				})[0].a
			})
			newKeys.push(newKey)
		})
		return newKeys
	}

	_preProcessKeys(keys, fieldsToKeep, delim) {
		let newKeys = []
		keys.forEach(function(key) {
			let newKey = {}
			newKey.b = key.b
			newKey.a = key.a
				.split(delim)
				.filter(function(expr, i) {
					return fieldsToKeep.indexOf(i) !== -1
				})
				.join(delim)
			newKeys.push(newKey)
		})
		return newKeys
	}
}
