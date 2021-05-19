// main test file
import test from 'ava'
import { processArg } from '../src/main'

test(`Expect to able to get the right properties`, async t => {
  const p = '/home/joel/Projects/create-t1sts'
  const result = await processArg(['_', '_', '--to', p])
  
  t.is(result.to, p)
})


test.todo(`Expect to fail if there is no package.json`)

test.todo(`Expect to copy over the necessary properties to the package.json`)
