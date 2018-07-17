// Load local modules.
const postProcessor = require('../lib/post_processor')

// Load npm modules.
const fsExtra = require('fs-extra')

// Load node modules.
const path = require('path')

// Define the paths of the test files.
const testFileNames = [
	'build.js',
	'definition.d.ts',
	'not_build.json',
]

// Declare the map of file names to file lines.
const fileNameToLinesMap = new Map()

beforeAll(() => {
	// Determine the temporary file paths.
	const temporaryFilePathsMap = new Map(testFileNames.map((testFileName) => {
		return [testFileName, path.join(__dirname, 'tmp', testFileName)]
	}))

	// Create a temporary copy for each test file.
	for (const [testFileName, temporaryFilePath] of temporaryFilePathsMap) {
		fsExtra.copySync(path.join(__dirname, testFileName), temporaryFilePath)
	}

	// Run the postprocessor on the temporary files.
	postProcessor(path.join('test', 'tmp'), '.../src/', '.js')
	postProcessor(path.join('test', 'tmp'), '.../src/', '.ts')

	// Populate the file name to lines map.
	for (const [testFileName, temporaryFilePath] of temporaryFilePathsMap) {
		fileNameToLinesMap.set(testFileName, fsExtra.readFileSync(temporaryFilePath, 'utf-8').split('\n'))
	}
})

afterAll(() => {
	// Remove the temporary directory with all of its contents.
	fsExtra.removeSync(path.join(__dirname, 'tmp'))
})

describe('Verify build.js', () => {
	let fileLines = null

	beforeAll(() => {
		fileLines = fileNameToLinesMap.get('build.js')
	})

	test('Ambient require', () => {
		expect(fileLines[2]).toBe("require('./ambient.js')")
	})

	test('Ordinary require semicolon', () => {
		expect(fileLines[4]).toBe("const object1 = require('./object');")
	})

	test('Ordinary nested require no semicolon', () => {
		expect(fileLines[5]).toBe("const object2 = require('./nested/object')")
	})

	test('Destructured require', () => {
		expect(fileLines[7]).toBe("const { array, things: items } = require('./array')")
	})

	test('Multiline destructured require', () => {
		expect(fileLines[8]).toBe('const {')
		expect(fileLines[9]).toBe('\ttoday,')
		expect(fileLines[10]).toBe('\tisMutiline,')
		expect(fileLines[11]).toBe("} = require('./date')")
	})

	test('Unnaffected line (export)', () => {
		expect(fileLines[13]).toBe('module.exports = { today, array }')
	})

	test('Unnaffected line (named module)', () => {
		expect(fileLines[15]).toBe("require('primitive1')")
	})

	test('Unnaffected line (named module with double quotes)', () => {
		expect(fileLines[16]).toBe('require("primitive2")')
	})

	test('Unnaffected line (relative module)', () => {
		expect(fileLines[17]).toBe("require('./relative1')")
	})

	test('Unnaffected line (relative module with double quotes)', () => {
		expect(fileLines[18]).toBe('require("../../relative2")')
	})

	test('Default require with double quotes', () => {
		expect(fileLines[20]).toBe('const { default: double } = require("./double")')
	})

	test('Unnaffected line (similar prefix)', () => {
		expect(fileLines[22]).toBe("require('.../almost')")
	})

	test('Unnaffected line (export single property)', () => {
		expect(fileLines[24]).toBe('module.exports.isMutiline = isMutiline')
	})

	test('Unnaffected line (console.log with matching string)', () => {
		expect(fileLines[26]).toBe("console.log('.../src/well_this/should_stay', 'the same')")
	})
})

describe('Verify definition.d.ts', () => {
	let fileLines = null

	beforeAll(() => {
		fileLines = fileNameToLinesMap.get('definition.d.ts')
	})

	test('Ambient import', () => {
		expect(fileLines[0]).toBe("import './ambient.js'")
	})

	test('Ordinary import semicolon', () => {
		expect(fileLines[2]).toBe("import object1 from './object';")
	})

	test('Ordinary nested import no semicolon', () => {
		expect(fileLines[3]).toBe("import object2 from './nested/object'")
	})

	test('Destructured import', () => {
		expect(fileLines[5]).toBe("import { array, things as items } from './array'")
	})

	test('Multiline destructured import', () => {
		expect(fileLines[6]).toBe('import {')
		expect(fileLines[7]).toBe('\ttoday,')
		expect(fileLines[8]).toBe('\tisMutiline,')
		expect(fileLines[9]).toBe("} from './date'")
	})

	test('Unnaffected line (export)', () => {
		expect(fileLines[11]).toBe('export { today, array }')
	})

	test('Unnaffected line (named module)', () => {
		expect(fileLines[13]).toBe("import 'primitive1'")
	})

	test('Unnaffected line (named module with double quotes)', () => {
		expect(fileLines[14]).toBe('import "primitive2"')
	})

	test('Unnaffected line (relative module)', () => {
		expect(fileLines[15]).toBe("import './relative1'")
	})

	test('Unnaffected line (relative module with double quotes)', () => {
		expect(fileLines[16]).toBe('import "../../relative2"')
	})

	test('Default require with double quotes', () => {
		expect(fileLines[18]).toBe('import double from "./double"')
	})

	test('Unnaffected line (similar prefix)', () => {
		expect(fileLines[20]).toBe("import '.../almost'")
	})

	test('Unnaffected line (multiline export)', () => {
		expect(fileLines[22]).toBe('export {')
		expect(fileLines[23]).toBe('\tisMutiline')
		expect(fileLines[24]).toBe('}')
	})
})

test('Vefiry not_build.json', () => {
	const fileName = 'not_build.json'

	const fileLines = fsExtra.readFileSync(path.join(__dirname, fileName), 'utf-8').split('\n')

	expect(fileNameToLinesMap.get(fileName)).toEqual(fileLines)
})
