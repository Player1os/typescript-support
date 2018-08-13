// Load runtime modules.
require('@player1os/javascript-support/lib/runtime/verify_cwd')
require('@player1os/javascript-support/lib/runtime/promise')

// Load local modules.
const recursiveLastModificationTime = require('../common/recursive_last_modification_time')

// Load scoped modules.
const {
	format,
	spawnChildProcess,
} = require('@player1os/javascript-support')

// Define the current task name.
const taskName = 'BUILD: ON CHANGE'

// Initialize the sleep flag.
let sleep = true

;(async () => {
	// Determine the time of last build and source file modifications.
	const [
		buildFileLastModificationTime,
		sourceFileLastModificationTime,
	] = await Promise.all([
		recursiveLastModificationTime('build'),
		recursiveLastModificationTime('src'),
	])

	// Execute the project's build task, if a change had ocurred since the last build.
	if ((sourceFileLastModificationTime - buildFileLastModificationTime) > 0) {
		await spawnChildProcess.inherited(taskName, 'npm', ['run', 'build'])
	}

	// Report the task's success.
	format.success(taskName)

	// Unset the sleep flag.
	sleep = false
})()

// Block the event loop until the task is done.
require('deasync').loopWhile(() => {
	return sleep
})
