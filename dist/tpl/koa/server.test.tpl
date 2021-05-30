// tests/server.test.tpl
import test from 'ava'
import { superkoa } from 'superkoa'
import app from '../src/app.ts'


test(`It should able to connect to the koa server`, async t => {
  const conn = await superkoa(app)
  // @TODO 
  t.pass()
})
