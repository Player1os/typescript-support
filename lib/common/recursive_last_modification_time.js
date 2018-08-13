// Load npm modules.
const fsExtra = require('fs-extra')
const recursiveReaddirSync = require('recursive-readdir-sync')

module.exports = async (directoryPath) => {
	// Recursively load the stats of all subdirectories.
	const fileStats = await Promise.all(recursiveReaddirSync(directoryPath).map((filePath) => {
		return fsExtra.stat(filePath)
	}))

	// Extract the greatest modification time among the loaded file stats.
	return fileStats.reduce((maximum, { mtime }) => {
		return ((maximum - mtime) < 0)
			? mtime
			: maximum
	}, new Date(0))
}
