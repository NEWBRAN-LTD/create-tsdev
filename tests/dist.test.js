// this is a JS test the dist version
// due to the fact that unit test passed but somehow the dist version failed
const { join } = require('path')
const test = require('ava')
const fsx = require('fs-extra')
const { main } = require('../dist/main')

const fixtures = join(__dirname, 'fixtures')
const to = join(fixtures, 'tmp-2')

test.before(() => {
  fsx.copySync(join(fixtures, 'package-tpl.json'), join(to , 'package.json'))
})

test.after(() => {
  fsx.removeSync(to)
})

test(`Dist build file test`, t => {
  return main({ to })
    .then(() => {
      t.true(fsx.existsSync(join(to, 'clean.js')))
      t.true(fsx.existsSync(join(to, 'src', 'main.ts')))
      t.true(fsx.existsSync(join(to, 'tests', 'main.test.ts')))
    })
})
