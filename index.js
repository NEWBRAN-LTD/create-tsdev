#!/usr/bin/env node
// this is just the entry point where it gets call
const { main } = require('./dist/main.js')

const args = require('yargs/yargs')(process.argv.slice(2)).argv

main(args)
