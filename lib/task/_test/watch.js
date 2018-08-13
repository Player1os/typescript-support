// Load local modules.
const serialAsyncFunctionCallback = require('../../common/serial-async-function-callback')

// Load scoped modules.
const { spawnChildProcess } = require('@player1os/javascript-support')

// Load npm modules.
const chokidar = require('chokidar')

// Configure the file watcher.
chokidar.watch([
	'package.json',
	'tsconfig.json',
	'tslint.json',
	'**/*.ts',
], {
	ignored: [
		'@types',
		'node_modules',
	],
}).on('all', serialAsyncFunctionCallback(async () => {
	// Execute the project's test task.
	await spawnChildProcess.inherited('TEST: WATCH', 'npm', ['test'])
}))
