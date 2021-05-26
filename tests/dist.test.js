// this is a JS test the dist version
// due to the fact that unit test passed but somehow the dist version failed
const { join } = require('path')
const test = require('ava')
const { main } = require('../dist/main')

const to = join(__dirname, 'fixtures', 'tmp-2')

test(`Dist build file test`, t => {
  return main({ to })
    .then(() => {
      t.pass()
    })
})
