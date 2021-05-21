import test from 'ava'
import { removeSync, copySync, readJsonSync } from 'fs-extra'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

import { ACTION_MAP } from '../src/constants'
import { main } from '../src/main'

const from = join(__dirname, 'fixtures', 'package-tpl.json')
const to = join(__dirname, 'tmp')
const pkgFile = join(to, 'package.json')
const action = 'gitlab'

test.before(() => {
  // clean up first
  removeSync(to)
  copySync(from , pkgFile)
})

test.after(() => {
  removeSync(to)
})


test(`End to end test`, async t => {
  const res = await main({ to, action })

  t.true(res)
  t.true(existsSync(pkgFile))

  // check the generate package.json correct or not
  const pkg = readJsonSync(pkgFile)

  t.true(pkg.dependencies !== undefined)
  t.true(pkg.scripts !== undefined)
  t.is(pkg.scripts.test, "ava")


  // @BUG from node.js the path point of an existing file (its hidden) but both report not found
  // where I can cat it
  const ymlFile = join(to, ACTION_MAP[action])
  // console.log(ymlFile)
  // check if the action install correctly
  t.truthy(readFileSync(ymlFile) , 'Check to see if the action file got copy')

})
