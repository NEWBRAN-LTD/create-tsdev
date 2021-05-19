// main test file
import test from 'ava'
import { processArg, changeAndGetPkg, CustomError } from '../src/main'

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

test.todo(`Expect to copy over the necessary properties to the package.json`)
