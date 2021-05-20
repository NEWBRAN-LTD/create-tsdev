import test from 'ava'
import { removeSync, copySync, existsSync, readJsonSync } from 'fs-extra'
import { join } from 'path'

import { main } from '../src/main'

const from = join(__dirname, 'fixtures', 'package-tpl.json')
const to = join(__dirname, 'tmp')
const pkgFile = join(to, 'package.json')

test.before(() => {
  copySync(from , pkgFile)
})

test.after(() => {
  removeSync(to)
})


test(`End to end test`, async t => {
  const res = await main(['--to', to])
  t.true(res)
  t.true(existsSync(pkgFile))

  const pkg = readJsonSync(pkgFile)

  t.true(pkg.dependencies !== undefined)
  t.true(pkg.scripts !== undefined)
  t.is(pkg.scripts.test, "ava")
})
