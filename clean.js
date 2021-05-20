// use fs-extra to clean folder instead of command line makes it cross platform

const fsx = require('fs-extra')
const { join } = require('path')
const dirs = ['dist', 'build']

dirs.forEach(dir => {
  fsx.removeSync(join(__dirname, dir))
})
