module.exports = (originalAsyncFunction) => {
	// Initialize the instance's state flags.
	let isReRunRequired = false
	let isRunning = false

	// Define the function that assures the original async function is rerun serially.
	const run = async () => {
		do {
			// Reset the flag indicating that the
			isReRunRequired = false

			// Execute the original async function.
			await originalAsyncFunction()

			// Verify that the re-run flag hasn't been set, otherwise execute the original function again.
		} while (isReRunRequired)

		// Reset the flag, indicating that the async function will be run directly the next time.
		isRunning = false
	}

	return () => {
		// Check whether the callback has ocurred while waiting for the original async function to finish from a previous callback.
		if (isRunning) {
			// Set the re-run flag, indicating that the original async function
			// must be executed again, after the current iteration finishes.
			isReRunRequired = true

			// Exit the callback function.
			return
		}
		// Set the flag that blocks any future attempts to run the callback directly.
		isRunning = true

		// Execute the serialization function.
		run(originalAsyncFunction)
			.catch((err) => {
				// Reset the instance's state flags.
				isReRunRequired = false
				isRunning = false

				// Rethrow the error outside of the asynchronous context.
				process.nextTick(() => {
					throw err
				})
			})
	}
}
