// Load npm modules.
const fsExtra = require('fs-extra')
const recursiveReaddirSync = require('recursive-readdir-sync')

// Load node modules.
const path = require('path')

module.exports = async (
	relativeDirectoryPath,
	fileExtension
) => {
	// Compute the directory path.
	const directoryPath = path.join(process.cwd(), relativeDirectoryPath)

	// Find all the files within the specified directory.
	await Promise.all(recursiveReaddirSync(directoryPath).map(async (filePath) => {
		// Verify that the current file has the correct extension.
		if (path.extname(filePath) !== fileExtension) {
			return
		}

		// Determine the current module's depth relative to the src directory.
		const depth = filePath.split(directoryPath + path.sep)[1].split(path.sep).length - 1
		const depthSubPath = '../'.repeat(depth)

		// Replace the aliased paths with relative paths within the current module and normalize newline characters.
		const alteredContents = (await fsExtra.readFile(filePath, 'utf-8'))
			.replace(/(import|require)([^'";]+?['"])\.\.\.\/src\//g, `$1$2./${depthSubPath}`)
			.replace(/\r\n/g, '\n')

		// Save the altered file contents.
		await fsExtra.writeFile(filePath, alteredContents, 'utf-8')
	}))
}
