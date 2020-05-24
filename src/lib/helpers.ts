import * as Tmx from 'tmx-tiledmap'
import { FLIPPED, SHAPE } from './constants'

export const noop = Function.prototype

export const isValidArray = (arr: any): boolean => !!(arr && arr.length > 0)

export const isDataURL = (s: string): boolean =>
    !!s.match(/^\s*data:([a-z]+\/[a-z]+(;[a-z-]+=[a-z-]+)?)?(;base64)?,[a-z0-9!$&',()*+,;=\-._~:@/?%\s]*\s*$/i)

export const fetchDataURL = async (data: string): Promise<string> => {
    return new Promise((resolve) => {
        fetch(data)
            .then((response) => response.text())
            .then((body) => resolve(body))
    })
}

export const unpackTileBytes = (buf: Buffer, expectedCount: number): Array<number> => {
    const unpackedTiles = []
    if (buf.length !== expectedCount) {
        throw new Error(`Expected ${expectedCount} bytes of tile data; received ${buf.length}`)
    }
    for (let i = 0; i < expectedCount; i += 4) {
        unpackedTiles.push(buf.readUInt32LE(i))
    }
    return unpackedTiles
}

export const getAttributes = ($: Tmx.StringTMap<any>): Array<Record<string, any>> =>
    $ && Object.entries($).map(([key, value]) => ({ [key]: value }))

export const getProperties = (properties: Array<Record<string, any>>) => ({
    properties: properties && Object.assign({},
        ...properties.map(({ property }) => Object.assign({},
            ...property.map(({ $: { name, value }, _ }) => ({
                [name]: value || _
            }))
        ))
    ) || null
})
    
export const getFlips = (gid: number) => ({
    H: !!(gid & FLIPPED.HORIZONTALLY),
    V: !!(gid & FLIPPED.VERTICALLY),
    D: !!(gid & FLIPPED.DIAGONALLY)
})

export const getTileId = (gid: number): number => (
    gid &= ~(
        FLIPPED.HORIZONTALLY | 
        FLIPPED.VERTICALLY | 
        FLIPPED.DIAGONALLY
    ))

export const getObjectShape = (data: Tmx.StringTMap<any>) =>
    (data.point && SHAPE.POINT) ||
    (data.ellipse && SHAPE.ELLIPSE) ||
    (data.polygon && SHAPE.POLYGON) ||
    SHAPE.RECTANGLE

export const getValue = (value: string): any => {
    if (value === 'true') return true
    if (value === 'false') return false
    if (`${value}`.match(/^[+-]?\d+(\.\d+)?$/g)) {
        const parsedValue = parseFloat(value)
        return !isNaN(parsedValue) ? parsedValue : value
    }
    return value
}

