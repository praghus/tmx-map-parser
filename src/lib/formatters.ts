import { FLIPPED, SHAPE } from './constants'
import { isValidArray } from './helpers'

const getFilename = (path: string): string =>
    path
        .replace(/^.*[\\/]/, '')
        .split('.')
        .slice(0, -1)
        .join('.')

const getAttributes = ($: StringTMap<any>): Array<Record<string, any>> =>
    $ && Object.entries($).map(([key, value]) => ({ [key]: value }))

const getProperties = (properties: Array<Record<string, any>>) => ({
    properties: properties && Object.assign(
        {},
        ...properties.map(({ property }) =>
            Object.assign(
                {},
                ...property.map(({ $: { name, value }, _ }) => ({
                    [name]: value || _
                }))
            )
        )
    ) || null
})

const getFlips = (gid: number) => ({
    H: !!(gid & FLIPPED.HORIZONTALLY),
    V: !!(gid & FLIPPED.VERTICALLY),
    D: !!(gid & FLIPPED.DIAGONALLY)
})

const getTileId = (gid: number): number => (
    gid &= ~(
        FLIPPED.HORIZONTALLY | 
        FLIPPED.VERTICALLY | 
        FLIPPED.DIAGONALLY
    ))

const getObjectShape = (data: StringTMap<any>) =>
    (data.point && SHAPE.POINT) ||
    (data.ellipse && SHAPE.ELLIPSE) ||
    (data.polygon && SHAPE.POLYGON) ||
    SHAPE.RECTANGLE

const getObjectData = (data: StringTMap<any>) => {
    const { $, properties, polygon, text } = data
    const object = Object.assign(
        {
            shape: getObjectShape(data),
            ...(isValidArray(polygon) && {
                points: polygon[0].$.points.split(' ').map((point) => {
                    const [x, y] = point.split(',')
                    return [parseFloat(x), parseFloat(y)]
                })
            }),
            ...getProperties(properties)
        },
        ...getAttributes($)
    )
    if (text) {
        object.text = text[0]._
        object.properties = Object.assign({}, object.properties, text[0].$)
    }
    if (object.gid) {
        object.flips = getFlips(object.gid)
        object.gid = getTileId(object.gid)
    }
    return object
}

const getTileData = (data: StringTMap<any>) => {
    const { $, animation, objectgroup } = data
    const obj = isValidArray(objectgroup) && objectgroup[0].object
    return Object.assign(
        {
            ...(isValidArray(animation) && {
                animation: {
                    frames: animation[0].frame.map(({ $ }) => Object.assign(
                        {}, 
                        ...getAttributes($))
                    )
                }
            }),
            ...(isValidArray(obj) && {
                objects: obj.map((o) => getObjectData(o))
            })
        },
        ...getAttributes($)
    )
}



export {
    getFilename,
    getAttributes,
    getProperties,
    getFlips,
    getObjectShape,
    getObjectData,
    getTileData,
    getTileId
}
