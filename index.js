#!/usr/bin/env node
// this is just the entry point where it gets call
const { processArg } = require('./dist/main.js')

processArg(process.argv)
  .then(config => {
    console.log(`Hello LOL`, config)
  })
