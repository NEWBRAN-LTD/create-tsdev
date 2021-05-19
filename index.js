#!/usr/bin/env node
// this is just the entry point where it gets call
const { processArg } = require('./dist/main.js')
const fsx = require('fs-extra')
const { join } = require('path')

processArg(process.argv)
  .then(config => {
    console.log(`Hello LOL`, config)

    // little test
    if (config.to && fsx.existsSync(config.to)) {
      process.chdir(config.to)

      const dir = process.cwd()

      console.log(dir)

      const pkgFile = join(dir, 'package.json')
      console.log(pkgFile)
      const pkg = fsx.readJsonSync(pkgFile)
      console.log(pkg.name, pkg.version)
    }


  })
