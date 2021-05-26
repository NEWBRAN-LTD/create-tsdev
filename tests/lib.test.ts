// main test file
import test from 'ava'
import { copySync, removeSync, readJsonSync, existsSync, ensureDir } from 'fs-extra'
import { join } from 'path'
import {
  processArg,
  changeAndGetPkg,
  CustomError,
  copyProps,
  setupTpl
} from '../src/lib'


const fixtures: string = join(__dirname, 'fixtures')
const pkgTpl: string = join(fixtures, 'package-tpl.json')
const dest: string = join(fixtures, 'package.json' )

const tmp = join(fixtures, 'tmp-1')


test.before(() => {
  copySync(pkgTpl, dest)
  ensureDir(tmp)
})

test.after(() => {
  removeSync(dest)
  removeSync(tmp)
})

/*
// result: IT DOES 
test.only(`To see if the async method can return a promise`, t => {
  return dummyFn()
    .then(r => {
      t.truthy(r)
    })
})
*/

test(`Expect to able to get the right properties`, async t => {
  const p = '/home/joel/Projects/create-t1sts'
  const result = await processArg({to: p, skipInstall: true, action: 'somethingelse', skipTpl: true})

  t.is(result.to, p)
  t.true(result.skipTpl)
  t.falsy(result.action)
})

test(`Expect to fail if there is no package.json`, t => {
  const myTestFunc = () => changeAndGetPkg("/path/to/no/where")

  const err = t.throws<CustomError>(myTestFunc)
  t.is(err.parent.name, 'TypeError')
})

test(`Expect to copy over the necessary properties to the package.json`, t => {
  const myPkg = readJsonSync(dest)
  const result = copyProps(myPkg)

  t.true(result.dependencies !== undefined)
  t.true(result.scripts !== undefined)
  t.is(result.scripts.test, "ava")
})


test(`Expect to copy over the required tpl files`, async t => {
  // move into the tmp directory as pwd
  process.chdir(tmp)

  await setupTpl({skipTpl: true})

  t.true(existsSync(join(tmp, 'clean.js')))
})
