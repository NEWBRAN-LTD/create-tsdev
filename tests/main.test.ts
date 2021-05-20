// main test file
import test from 'ava'
import fsx from 'fs-extra'
import { join } from 'path'
import {
  processArg,
  changeAndGetPkg,
  CustomError,
  copyProps
} from '../src/main'


const fixtures: string = join(__dirname, 'fixtures')
const pkgTpl: string = join(fixtures, 'package-tpl.json')
const dest: string = join(fixtures, 'package.json' )

test.before(() => {
  fsx.copySync(pkgTpl, dest)
})

test.after(() => {
  fsx.remove(dest)
})


test(`Expect to able to get the right properties`, async t => {
  const p = '/home/joel/Projects/create-t1sts'
  const result = await processArg(['_', '_', '--to', p])

  t.is(result.to, p)
})


test(`Expect to fail if there is no package.json`, t => {
  const myTestFunc = () => changeAndGetPkg("/path/to/no/where")

  const err = t.throws<CustomError>(myTestFunc)
  t.is(err.parent.name, 'TypeError')
})

test(`Expect to copy over the necessary properties to the package.json` t => {
  
})
