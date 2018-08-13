// Load local modules.
const postProcessor = require('.../lib/task/_build/post_processor')

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

beforeAll(async () => {
	// Load the test runtime.
	require('@player1os/javascript-support/lib/runtime/jest')

	// Determine the temporary file paths.
	const temporaryFilePathsMap = new Map(testFileNames.map((testFileName) => {
		return [testFileName, path.join('test', 'tmp', testFileName)]
	}))

	// Create a temporary copy for each test file.
	for (const [testFileName, temporaryFilePath] of temporaryFilePathsMap) {
		await fsExtra.copy(path.join(__dirname, testFileName), temporaryFilePath)
	}

	// Run the post-processor on the temporary files.
	await Promise.all([
		postProcessor(path.join('test', 'tmp'), '.js'),
		postProcessor(path.join('test', 'tmp'), '.ts'),
	])

	// Populate the file name to lines map.
	for (const [testFileName, temporaryFilePath] of temporaryFilePathsMap) {
		const fileContents = await fsExtra.readFile(temporaryFilePath, 'utf-8')
		fileNameToLinesMap.set(testFileName, fileContents.split('\n'))
	}
})

afterAll(async () => {
	// Remove the temporary directory with all of its contents.
	await fsExtra.remove(path.join('test', 'tmp'))
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

	test('De-structured require', () => {
		expect(fileLines[7]).toBe("const { array, things: items } = require('./array')")
	})

	test('Multiline de-structured require', () => {
		expect(fileLines[8]).toBe('const {')
		expect(fileLines[9]).toBe('\ttoday,')
		expect(fileLines[10]).toBe('\tisMultiline,')
		expect(fileLines[11]).toBe("} = require('./date')")
	})

	test('Unaffected line (export)', () => {
		expect(fileLines[13]).toBe('module.exports = { today, array }')
	})

	test('Unaffected line (named module)', () => {
		expect(fileLines[15]).toBe("require('primitive1')")
	})

	test('Unaffected line (named module with double quotes)', () => {
		expect(fileLines[16]).toBe('require("primitive2")')
	})

	test('Unaffected line (relative module)', () => {
		expect(fileLines[17]).toBe("require('./relative1')")
	})

	test('Unaffected line (relative module with double quotes)', () => {
		expect(fileLines[18]).toBe('require("../../relative2")')
	})

	test('Default require with double quotes', () => {
		expect(fileLines[20]).toBe('const { default: double } = require("./double")')
	})

	test('Unaffected line (similar prefix)', () => {
		expect(fileLines[22]).toBe("require('.../almost')")
	})

	test('Unaffected line (export single property)', () => {
		expect(fileLines[24]).toBe('module.exports.isMultiline = isMultiline')
	})

	test('Unaffected line (console.log with matching string)', () => {
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

	test('De-structured import', () => {
		expect(fileLines[5]).toBe("import { array, things as items } from './array'")
	})

	test('Multiline de-structured import', () => {
		expect(fileLines[6]).toBe('import {')
		expect(fileLines[7]).toBe('\ttoday,')
		expect(fileLines[8]).toBe('\tisMultiline,')
		expect(fileLines[9]).toBe("} from './date'")
	})

	test('Unaffected line (export)', () => {
		expect(fileLines[11]).toBe('export { today, array }')
	})

	test('Unaffected line (named module)', () => {
		expect(fileLines[13]).toBe("import 'primitive1'")
	})

	test('Unaffected line (named module with double quotes)', () => {
		expect(fileLines[14]).toBe('import "primitive2"')
	})

	test('Unaffected line (relative module)', () => {
		expect(fileLines[15]).toBe("import './relative1'")
	})

	test('Unaffected line (relative module with double quotes)', () => {
		expect(fileLines[16]).toBe('import "../../relative2"')
	})

	test('Default require with double quotes', () => {
		expect(fileLines[18]).toBe('import double from "./double"')
	})

	test('Unaffected line (similar prefix)', () => {
		expect(fileLines[20]).toBe("import '.../almost'")
	})

	test('Unaffected line (multiline export)', () => {
		expect(fileLines[22]).toBe('export {')
		expect(fileLines[23]).toBe('\tisMultiline')
		expect(fileLines[24]).toBe('}')
	})
})

test('Verify not_build.json', () => {
	const fileName = 'not_build.json'

	const fileLines = fsExtra.readFileSync(path.join(__dirname, fileName), 'utf-8').split('\n')

	expect(fileNameToLinesMap.get(fileName)).toEqual(fileLines)
})
