// this is a JS test the dist version
// due to the fact that unit test passed but somehow the dist version failed

const test = require('ava')
const { main } = require('../dist/main')

test(`Dist build file test`, t => {
  t.pass()
})
