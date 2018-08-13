// Load local modules.
const config = require('./common')

// Set the coverage parameters.
config.collectCoverage = true
config.collectCoverageFrom = [
	'src/**/*.ts',
	'src/**/*.tsx',
	'!src/**/*.test.ts',
	'!src/**/*.test.tsx',
]

// Set the test regex.
config.testRegex = 'src/.*\\.test\\.tsx?$'

// Export the finalized configuration.
module.exports = config
