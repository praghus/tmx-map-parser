import test from 'ava'
import { isDataURL, isValidArray, unpackTileBytes } from '../helpers'

const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
const buffer = new Buffer('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==', 'base64')
const width = 4
const height = 4

test('isValidArray', (t) => {
    t.is(isValidArray([]), false)
    t.is(isValidArray(null), false)
    t.is(isValidArray([1, 2]), true)
})

test('isDataURL', (t) => {
    t.is(isDataURL('Test'), false)
    t.is(isDataURL(dataUrl), true)
})

test('unpackTileBytes', (t) => {
    t.deepEqual(unpackTileBytes(buffer, width * height * 4), [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ])
})