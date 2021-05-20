#!/usr/bin/env node
// this is just the entry point where it gets call
const { main } = require('./dist/main.js')

main(process.argv.slice(2))
