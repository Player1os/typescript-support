# Typescript Support

[![License](https://img.shields.io/github/license/Player1os/typescript-support.svg)](https://github.com/Player1os/typescript-support/blob/master/LICENSE)
[![NodeJS version](https://img.shields.io/node/v/@player1os/typescript-support.svg?label=node%20version)](https://nodejs.org/dist/v10.6.0/)
[![GitHub tag](https://img.shields.io/github/tag/Player1os/typescript-support.svg?label=version)](https://github.com/Player1os/typescript-support/releases)
[![Build Status](https://travis-ci.org/Player1os/typescript-support.svg?branch=master)](https://travis-ci.org/Player1os/typescript-support) [![Greenkeeper badge](https://badges.greenkeeper.io/Player1os/typescript-support.svg)](https://greenkeeper.io/)

A set of common utilities and scripts to be used in the development of projects written in Typescript.

This project provides the following development assets:

- a `tslint.json`, which contains a common linter configuration for *tslint* used in all derived Typescript projects. This
configuration file is intended for use within the **VSCode** editor, using the `eg2.tslint` extension as well as when testing the project's
implementation.

- a `.travis.yml` file, which contains a basic configuration for the derived project's CI, since all derived projects are assumed to be
published on GitHub.

- a `tsconfig-base.json` file, which contains a base configuration for the Typescript compiler.

- type definitions for the following libraries, which that are assumed to be located in derived Typescript projects:
	- `jest`
	- `bluebird`

Also contains a utility module used to process the outputs of the typescript compiler. The following two operations are executed:
- The paths prefixes (so called aliases) in require and import statements are rewritten to point to actual files.
- Normalizes newline characters to the `LF` sequence.

Finally, the project contains a module that loads all prerequisites for the direct execution of typescript sources in the node runtime.

Includes the setting of the `bluebird` promise implementation as the global promise object.

Includes the aliasing of module prefixes, so that `'...'` points to the current project's root directory. The root directory is
determined by recursively searching upwards for the closest directory containing a `package.json` file.
