// testing with the koa template
import test from 'ava'

import { removeSync, copySync, readJsonSync } from 'fs-extra'
import { existsSync } from 'fs'
import { join } from 'path'

import { main } from '../src/main'
const from = join(__dirname, 'fixtures', 'package-tpl.json')
const to = join(__dirname, 'tmp-koa')
const pkgFile = join(to, 'package.json')
// @TODO add import { readFileSync } from 'fs'
// import { ACTION_MAP } from '../src/constants'
// const action = 'gitlab'

test.before(() => {
  // clean up first
  removeSync(to)
  copySync(from , pkgFile)
})

test.after(() => {
  removeSync(to)
})

test(`Testing with Koa template`, async t => {
  const res = await main({ to, tpl: 'koa' })

  t.true(res)
  t.true(existsSync(pkgFile))

  // check the generate package.json correct or not
  const pkg = readJsonSync(pkgFile)

  t.true(pkg.dependencies !== undefined)
  t.true(pkg.scripts !== undefined)
  t.is(pkg.scripts.test, "ava")

  // next check if there is template files
  t.true(existsSync(join(to, 'src', 'app.ts')), 'If there is a app.ts file')
  t.true(existsSync(join(to, 'src', 'server.ts')), 'If there is a server.ts file')
  t.true(existsSync(join(to, 'src', 'router.ts')), 'If there is a router.ts file')

  t.true(existsSync(join(to, 'tsconfig.json')), 'if there is tsconfig.json')
  t.true(existsSync(join(to, '.gitignore')))
  // @TODO
  t.true(existsSync(join(to, 'tests', 'server.test.ts')), 'if there is a main.test.ts file')

})
