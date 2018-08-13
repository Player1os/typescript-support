// Load local modules.
const serialAsyncFunctionCallback = require('../../common/serial-async-function-callback')

// Load scoped modules.
const { spawnChildProcess } = require('@player1os/javascript-support')

// Load npm modules.
const chokidar = require('chokidar')

// Configure the file watcher.
chokidar.watch([
	'src',
	'package.json',
	'tsconfig.json',
], {
	ignored: '**/*.test.ts',
}).on('all', serialAsyncFunctionCallback(async () => {
	// Execute the project's build task.
	await spawnChildProcess.inherited('BUILD: WATCH', 'npm', ['run', 'build'])
}))
