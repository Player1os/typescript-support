// Load runtime modules.
require('@player1os/javascript-support/lib/runtime')

// Load local modules.
const { serialAsyncFunctionCallback } = require('../lib')

const errorAsyncFunction = async () => {
	await Promise.delay(100)

	throw new Error()
}

serialAsyncFunctionCallback(errorAsyncFunction)()
