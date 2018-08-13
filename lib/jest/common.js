// Define the common configuration object.
module.exports = {
	moduleFileExtensions: [
		'js',
		'jsx',
		'ts',
		'tsx',
		'json',
		'node',
	],
	moduleNameMapper: {
		'^\\.\\.\\.(.*)': '<rootDir>$1',
	},
	rootDir: process.cwd(),
	setupFiles: ['@player1os/javascript-support/lib/runtime/jest'],
	testEnvironment: 'node',
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
}
