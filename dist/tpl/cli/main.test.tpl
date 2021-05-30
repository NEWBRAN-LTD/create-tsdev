import test from 'ava'
import { greeting } from '../src/main'

test(`Hello world test`, t => {

  t.is(greeting('world'), `Hello world`)

})
