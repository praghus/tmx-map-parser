import test from 'ava'
import { isValidArray } from './helpers'


test('isValidArray', (t) => {
    t.is(isValidArray([]), false)
    t.is(isValidArray(null), false)
    t.is(isValidArray([1, 2]), true)
})
