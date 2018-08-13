import '.../src/ambient.js'

import object1 from '.../src/object';
import object2 from '.../src/nested/object'

import { array, things as items } from '.../src/array'
import {
	today,
	isMultiline,
} from '.../src/date'

export { today, array }

import 'primitive1'
import "primitive2"
import './relative1'
import "../../relative2"

import double from ".../src/double"

import '.../almost'

export {
	isMultiline
}
