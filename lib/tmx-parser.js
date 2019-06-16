import 'babel-polyfill'
import zlib from 'zlib'
import { parseString } from 'xml2js'
import { isValidArray, isDataURL } from './helpers'
import { COMPRESSION, ENCODING, FLIPPED, NODE_TYPE, SHAPE } from './constants'

export const tmxParser = async (xmlString) => {
    const { map: { $, $$ } } = await parseTmxFile(xmlString)
    const map = Object.assign({ layers: [], tilesets: [] }, ...getValues($))
    const expectedCount = map.width * map.height * 4

    await Promise.all($$.map(async (node, i) => {
        switch (node['#name']) {
        case NODE_TYPE.LAYER:
            map.layers[i] = await parseTileLayer(node, node['#name'], expectedCount)
            break
        case NODE_TYPE.IMAGE_LAYER:
        case NODE_TYPE.OBJECT_GROUP:
            map.layers[i] = parseLayerNode(node, node['#name'])
            break
        case NODE_TYPE.PROPERTIES:
            map.properties = Object.assign(
                ...node.$$.map(({$: {name, value}}) => ({[name]: parseValue(value)}))
            )
            break
        case NODE_TYPE.TILESET:
            map.tilesets.push(getTileset(node))
            break
        }
    }))
    map.layers = Object.values(map.layers)
    return map
}

const parseTmxFile =  async (tmx) => {
    const xml = isDataURL(tmx) ? await parseDataUrl(tmx) : tmx
    return await new Promise ((resolve) => {
        parseString(xml, {
            explicitChildren: true,
            preserveChildrenOrder: true
        }, (err, tmx) => {
            if (err) throw new Error(err)
            resolve(tmx)
        })
    })
}

const parseDataUrl = async (data) => {
    return await new Promise ((resolve) => {
        fetch(data)
            .then((response) => response.text())
            .then((body) => resolve(body))
    })
}

const parseTileLayer = async (layer, type, expectedCount) => {
    const { $, data, properties } = layer
    const newLayer = Object.assign({
        type, 
        visible: 1,
        flips: [],
        ...getProperties(properties)
    }, ...getValues($))

    if (isValidArray(data)) {
        const { _, $, tile } = data[0]
        /* XML */
        if (tile) {
            newLayer.data = tile.map(({$}) => $ && $.gid || 0)
        }
        /* CSV, BASE64 */
        else {
            const { encoding, compression } = $
            const layerData = _.trim()

            let buffer
            let decompress

            switch (encoding) {
            case ENCODING.CSV:
                newLayer.data = layerData.split(',')
                break
            case ENCODING.BASE64:
                buffer = new Buffer(layerData, encoding)
                switch (compression) {
                case null:
                case undefined:
                    newLayer.data = unpackTileBytes(buffer, expectedCount)
                    break
                case COMPRESSION.GZIP: 
                case COMPRESSION.ZLIB:
                    decompress = compression === COMPRESSION.GZIP
                        ? zlib.gunzip
                        : zlib.inflate
                    newLayer.data = await new Promise((resolve, reject) => 
                        decompress(buffer, (err, buf) => {
                            if (err) reject(err)
                            resolve(unpackTileBytes(buf, expectedCount))
                        })
                    )
                    break
                default:
                    throw new Error(`unsupported compression: ${compression}`)
                }
            }
        }
        newLayer.data.map((gid, i) => {
            newLayer.flips[i] = getFlips(gid)
            newLayer.data[i] = getTileId(gid)
        })
        return newLayer
    }
}

const parseLayerNode = (layer, type) => {
    const { $, image, object, properties } = layer
    return Object.assign({
        type,
        visible: 1, 
        ...isValidArray(image) && {image: Object.assign({}, ...getValues(image[0].$))},
        ...isValidArray(object) && {objects: object.map((object) => getObjectData(object))},
        ...getProperties(properties)
    }, ...getValues($))
}

const parseValue = (value) => {
    if (value === 'true') return true
    if (value === 'false') return false
    if (value.match(/^[+-]?\d+(\.\d+)?$/g)) {
        const parsedValue = parseFloat(value) 
        return !isNaN(parsedValue) ? parsedValue : value
    }
    return value
}

const getValues = ($) => $ && Object.entries($).map(
    ([key, value]) => ({[key]: parseValue(value)})
)

const getProperties = (properties) => {
    return ({ properties: properties && Object.assign(
        ...properties.map(({property}) => Object.assign(
            ...property.map(({ $: {name, value}, _ }) => (
                {[name]: value ? parseValue(value) : _ })
            )
        ))
    ) || null}) 
}

const getFlips = (gid) => ({
    H: !!(gid & FLIPPED.HORIZONTALLY),
    V: !!(gid & FLIPPED.VERTICALLY),
    D: !!(gid & FLIPPED.DIAGONALLY)
})

const getTileId = (gid) => gid &= ~(
    FLIPPED.HORIZONTALLY | 
    FLIPPED.VERTICALLY |
    FLIPPED.DIAGONALLY
)

const getObjectShape = (data) => ( 
    data.point && SHAPE.POINT ||
    data.ellipse && SHAPE.ELLIPSE ||
    data.polygon && SHAPE.POLYGON ||
    SHAPE.RECTANGLE
)

const getObjectData = (data) => {
    const { $, properties, polygon, text } = data
    const object = Object.assign({
        shape: getObjectShape(data),
        ...isValidArray(polygon) && { 
            points: polygon[0].$.points.split(' ').map((point) => {
                const [x, y] = point.split(',')
                return ([
                    parseFloat(x), 
                    parseFloat(y)
                ])
            })},
        ...getProperties(properties)
    }, ...getValues($))
    
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

const getTileData = (data) => {
    const { $, animation, objectgroup } = data
    const object = isValidArray(objectgroup) && objectgroup[0].object
    return Object.assign({
        ...isValidArray(animation) && { 
            animation: { 
                frames: animation[0].frame.map(
                    ({$}) => Object.assign({}, ...getValues($))
                )
            }
        },
        ...isValidArray(object) && { 
            objects: object.map((o) => getObjectData(o)) 
        }
    }, ...getValues($))
}

const getTileset = (data) => {
    const { $, $$, tile } = data
    const image = $$ && Object.assign({}, ...getValues($$[0].$))
    if (image) {
        const tiles = isValidArray(tile) && tile.map((t) => getTileData(t))
        return Object.assign(...getValues($), { image, tiles })
    }
    else {
        throw new Error('Tilesets should be embeded in a map file.')
    }
}

const unpackTileBytes = (buf, expectedCount) => {
    const unpackedTiles = []
    if (buf.length !== expectedCount) {
        throw new Error(`Expected ${expectedCount} bytes of tile data; received ${buf.length}`)
    }
    for (var i = 0; i < expectedCount; i += 4) {
        unpackedTiles.push(buf.readUInt32LE(i))
    }
    return unpackedTiles
}
