// this is a JS test the dist version
// due to the fact that unit test passed but somehow the dist version failed

import { join } from 'path'
import test from 'ava'
import { copySync, removeSync, existsSync } from 'fs-extra'
import { main } from '../dist/main'

const fixtures = join(__dirname, 'fixtures')
const to = join(fixtures, 'tmp-2')

test.before(() => {
  copySync(join(fixtures, 'package-tpl.json'), join(to , 'package.json'))
})

test.after(() => {
  removeSync(to)
})

test(`Dist build file test`, t => {
  return main({ to })
    .then(() => {
      t.true(existsSync(join(to, 'clean.js')))
      t.true(existsSync(join(to, 'src', 'main.ts')))
      t.true(existsSync(join(to, 'tests', 'main.test.ts')))
    })
})
