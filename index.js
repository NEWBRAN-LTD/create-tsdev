#!/usr/bin/env node
// this is just the entry point where it gets call
const { main } = require('./dist/main.js')

const args = require('yargs/yargs')(process.argv.slice(2)).argv

main(args)
  .then(() => {
    console.log(`All setup, you can get to work`)
  })
  .catch(e => {
    console.error(`Sorry couldn't complete the setup due to`, e)
  })
