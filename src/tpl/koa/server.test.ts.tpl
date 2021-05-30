// tests/server.test.tpl
import test from 'ava'
import { superkoa } from 'superkoa'
import app from '../src/app.ts'


test.cb(`It should able to connect to the koa server`, t => {
  superkoa(app)
    .get("/")
    .expect(200, function (err, res) {

      t.is(res.text, 'Hello world', 'res.text == Hello world')
      t.end()
    })
})
