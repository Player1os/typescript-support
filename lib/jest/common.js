// Load node modules.
const path = require('path')

// Define the common configuration object.
module.exports = {
	globals: {
		'ts-jest': {
			skipBabel: true,
		},
	},
	moduleFileExtensions: [
		'ts',
		'tsx',
		'json',
		'node',
	],
	moduleNameMapper: {
		'^\\.\\.\\.(.*)': '<rootDir>$1',
	},
	rootDir: process.cwd(),
	setupFiles: [path.join(__dirname, 'runtime.js')],
	testEnvironment: 'node',
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
}
