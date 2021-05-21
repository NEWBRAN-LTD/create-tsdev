import test from 'ava'
import { removeSync, copySync, existsSync, readJsonSync } from 'fs-extra'
import { join } from 'path'

import { main } from '../src/main'
import { ACTION_MAP } from '../src/constants'

const from = join(__dirname, 'fixtures', 'package-tpl.json')
const to = join(__dirname, 'tmp')
const pkgFile = join(to, 'package.json')
const action = 'github'

test.before(() => {
  copySync(from , pkgFile)
})

test.after(() => {
  removeSync(to)
})


test(`End to end test`, async t => {
  const res = await main(['--to', to, '--action', action])
  
  t.true(res)
  t.true(existsSync(pkgFile))

  // check the generate package.json correct or not
  const pkg = readJsonSync(pkgFile)

  t.true(pkg.dependencies !== undefined)
  t.true(pkg.scripts !== undefined)
  t.is(pkg.scripts.test, "ava")

  // check if the action install correctly
  t.true(existsSync(join(to, ACTION_MAP[action])))

})
