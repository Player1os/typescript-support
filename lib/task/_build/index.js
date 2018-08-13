// Load local modules.
const postProcessor = require('./post_processor')

// Load scoped modules.
const {
	format,
	packageConfiguration,
	spawnChildProcess,
} = require('@player1os/javascript-support')

// Load npm modules.
const fsExtra = require('fs-extra')

// Determine whether the current project is an npm package.
const isNpmPackage = packageConfiguration.isNpmPackage()

// Define the current task name.
const taskName = 'BUILD'

;(async () => {
	// Clear any previously generated executable code.
	await fsExtra.remove('build')

	// Clear any previously generated type definitions, if the current project is an npm package.
	if (isNpmPackage) {
		await fsExtra.remove('@types')
	}

	// Generate the create typescript configuration object.
	const createTypescriptConfig = {
		include: ['src/**/*.ts'],
		exclude: ['src/**/*.test.ts'],
		extends: './tsconfig.json',
	}
	const compilerOptions = {
		outDir: 'build',
	}
	if (isNpmPackage) {
		compilerOptions.declaration = true
		compilerOptions.declarationDir = '@types'
	}
	createTypescriptConfig.compilerOptions = compilerOptions

	// Write the create typescript configuration object to a file in the project.
	await fsExtra.writeJson('tsconfig-create.json', createTypescriptConfig)

	// Execute the typescript compiler to generate the executable code and type definitions.
	const { statusCode: buildStatusCode } = await spawnChildProcess
		.inherited(taskName, 'tsc', ['-p', 'tsconfig-create.json'], true)

	// Remove the create typescript configuration file.
	await fsExtra.remove('tsconfig-create.json')

	// Check whether the build failed.
	if (buildStatusCode !== 0) {
		// Report the task's failure.
		format.failure(taskName)

		// Exit the task process
		process.exit(1)
	}

	// Execute the path rewriters upon the generated executable code.
	await postProcessor('build', '.js')

	// Process the emitted type definitions for npm package projects.
	if (isNpmPackage) {
		// Execute the path rewriters upon the generated type definitions.
		await postProcessor('@types', '.ts')

		// Write the validate typescript configuration object to a file in the project.
		await fsExtra.writeJson('tsconfig-validate.json', {
			include: ['@types'],
			extends: './node_modules/@player1os/typescript-support/tsconfig-base.json',
		})

		// Execute the typescript compiler to validate the created type definitions.
		const { statusCode: validateStatusCode } = await spawnChildProcess
			.inherited(taskName, 'tsc', ['-p', 'tsconfig-validate.json', '--noEmit'], true)

		// Remove the validate typescript configuration file.
		await fsExtra.remove('tsconfig-validate.json')

		// Check whether the validation failed.
		if (validateStatusCode !== 0) {
			// Report the task's failure.
			format.failure(taskName)

			// Exit the task process.
			process.exit(1)
		}
	}

	// Report the task's success.
	format.success(taskName)
})()
