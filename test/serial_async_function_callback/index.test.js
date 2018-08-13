// Load local modules.
const { serialAsyncFunctionCallback } = require('.../lib')

// Load scoped modules.
const { spawnChildProcess } = require('@player1os/javascript-support')

// Load node modules.
const path = require('path')

// Load the test runtime.
beforeAll(() => {
	require('@player1os/javascript-support/lib/runtime/jest')
})

test('Triggered asynchronous function (2x) and multiple external calls (5x)', async () => {
	// Define a counter for the number of entries into the wrapped asynchronous function.
	let entryCount = 0

	// Define a variable to store the resolve method of the promise within the asynchronous function.
	let storedResolve = null

	// Define the promise used within the asynchronous function.
	const promise = new Promise((resolve) => {
		storedResolve = resolve
	})

	// Define the wrapped async function with an entry counter and a promise that can be externally triggered.
	const wrappedAsyncFunction = serialAsyncFunctionCallback(async () => {
		++entryCount

		await promise
	})

	// Call the wrapped asynchronous function 5x with async delays.
	for (let i = 0; i < 5; ++i) {
		await Promise.delay(10)
		wrappedAsyncFunction()
	}

	// Verify that the asynchronous function was entered only once.
	expect(entryCount).toBe(1)

	// Trigger the conclusion of the first asynchronous function call with an async delay.
	storedResolve()
	await Promise.delay(10)

	// Verify that the asynchronous function was entered a second time to account for the calls that ocurred after the first.
	expect(entryCount).toBe(2)

	// Trigger the conclusion of the second asynchronous function call with an async delay.
	storedResolve()
	await Promise.delay(10)

	// Verify that the asynchronous function was not entered a third time, since no other external function was delayed by the serializer.
	expect(entryCount).toBe(2)
})

test('Correct error propagation', async () => {
	const { statusCode } = await spawnChildProcess.piped('TEST RUN', 'node', [path.join(__dirname, 'async_error.js')], true)

	expect(statusCode).toBe(1)
})
