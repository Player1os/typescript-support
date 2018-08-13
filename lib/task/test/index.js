// Load scoped modules.
const {
	spawnChildProcess,
	format,
} = require('@player1os/javascript-support')

// Store the inherited async child process function.
const spawnChildProcessInherited = spawnChildProcess.inherited

// Define the current task name.
const taskName = 'TEST'

;(async () => {
	// Execute the linter upon all of the project's typescript files.
	await spawnChildProcessInherited(taskName, 'tslint', [
		'**/*.ts',
		'-e', '@types/**/*',
		'-e', 'node_modules/**/*',
		'-p', 'tsconfig.json',
	])

	// Execute the test runner upon the project's unit tests.
	await spawnChildProcessInherited(taskName, 'jest', [
		'-c', './node_modules/@player1os/typescript-support/lib/jest/unit.js',
	])

	// Execute the project's build task.
	await spawnChildProcessInherited(taskName, 'npm', ['run', 'build'])

	// Execute the test runner upon the project's functional tests.
	await spawnChildProcessInherited(taskName, 'jest', [
		'-c', './node_modules/@player1os/typescript-support/lib/jest/functional.js',
	])

	// Report the task's success.
	format.success(taskName)
})()
