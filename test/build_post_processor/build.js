/* eslint-disable */

require('.../src/ambient.js')

const object1 = require('.../src/object');
const object2 = require('.../src/nested/object')

const { array, things: items } = require('.../src/array')
const {
	today,
	isMultiline,
} = require('.../src/date')

module.exports = { today, array }

require('primitive1')
require("primitive2")
require('./relative1')
require("../../relative2")

const { default: double } = require(".../src/double")

require('.../almost')

module.exports.isMultiline = isMultiline

console.log('.../src/well_this/should_stay', 'the same')
