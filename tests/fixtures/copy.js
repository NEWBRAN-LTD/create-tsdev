const fsx = require('fs-extra')
const { join, resolve } = require('path')

console.log(`testing copy hidden file`)

const src = resolve(__dirname, '..', '..', 'src', 'actions', 'gitlab.yml')

console.log('source', src)

const dest = resolve('tests', 'tmp', '.gitlab.yml')

console.log('dest', dest)

fsx.copy(src, dest)
  .then(() => {
    console.log('is there?', fsx.existsSync(dest))
  })
  .catch(err => {
    console.error(`error?`)
  })
