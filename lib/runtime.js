// Load the compiler require hook.
require('ts-node/register')

// Load npm modules.
const Bluebird = require('bluebird')
const findRoot = require('find-root')
const moduleAlias = require('module-alias')

// Set bluebird as the global promise object.
global.Promise = Bluebird

// Determine the location of the closest package configuration file.
const rootPath = findRoot(process.cwd())
if (rootPath === '') {
	throw new Error("Cannot find the project's root.")
}

// Setup module-alias to properly load non-relative local modules.
moduleAlias.addAlias('...', rootPath)
