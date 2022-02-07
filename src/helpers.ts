import zlib from 'zlib'
import { parseString } from 'xml2js'
import { COMPRESSION, ENCODING, FLIPPED, NODE_TYPE, SHAPE } from './constants'
import { TMXObject, TMXLayer, TMXFlips, TMXTile, TMXTileset, TMXLayerGroup } from './types'

const isValidArray = (arr: any): boolean => !!(arr && arr.length > 0)

const isDataURL = (s: string): boolean =>
    !!s.match(/^\s*data:([a-z]+\/[a-z]+(;[a-z-]+=[a-z-]+)?)?(;base64)?,[a-z0-9!$&',()*+,;=\-._~:@/?%\s]*\s*$/i)

const fetchDataURL = async (data: string): Promise<string> =>
    new Promise(resolve => {
        fetch(data)
            .then(response => response.text())
            .then(body => resolve(body))
    })

const unpackTileBytes = (buf: Buffer, expectedCount: number): Array<number> => {
    const unpackedTiles = []
    if (buf.length !== expectedCount) {
        throw new Error(`Expected ${expectedCount} bytes of tile data; received ${buf.length}`)
    }
    for (let i = 0; i < expectedCount; i += 4) {
        unpackedTiles.push(buf.readUInt32LE(i))
    }
    return unpackedTiles
}

const getAttributes = ($: Record<string, any>): Array<Record<string, any>> =>
    $ && Object.entries($).map(([key, value]) => ({ [key]: value }))

const getProperties = (properties: Record<string, any> | null): { properties: Record<string, any> | null } => ({
    properties:
        (properties &&
            Object.assign(
                {},
                ...properties.map(({ property }: Record<string, any>) =>
                    Object.assign(
                        {},
                        ...property.map(({ $: { name, value }, _ }: Record<string, any>) => ({
                            [name]: value || _
                        }))
                    )
                )
            )) ||
        null
})

const getFlips = (gid: number): TMXFlips => ({
    H: !!(gid & FLIPPED.HORIZONTALLY),
    V: !!(gid & FLIPPED.VERTICALLY),
    D: !!(gid & FLIPPED.DIAGONALLY)
})

const getTileId = (gid: number): number => (gid &= ~(FLIPPED.HORIZONTALLY | FLIPPED.VERTICALLY | FLIPPED.DIAGONALLY))

const getObjectShape = (data: Record<string, any>): string =>
    (data.point && SHAPE.POINT) || (data.ellipse && SHAPE.ELLIPSE) || (data.polygon && SHAPE.POLYGON) || SHAPE.RECTANGLE

const getValue = (value: string): any => {
    if (value === 'true') return true
    if (value === 'false') return false
    if (`${value}`.match(/^[+-]?\d+(\.\d+)?$/g)) {
        const parsedValue = parseFloat(value)
        return !isNaN(parsedValue) ? parsedValue : value
    }
    return value
}

const parseXMLString = async (xmlString: string): Promise<any> => {
    const xml = isDataURL(xmlString) ? await fetchDataURL(xmlString) : xmlString
    return new Promise(resolve =>
        parseString(
            xml,
            {
                explicitChildren: true,
                preserveChildrenOrder: true,
                attrValueProcessors: [(value: string): any => getValue(value)]
            },
            (error: Error, tmx: any) => {
                if (error) throw error
                resolve(tmx)
            }
        )
    )
}

const parseObjectData = (data: Record<string, any>): TMXObject => {
    const { $, properties, polygon, text } = data
    const object = Object.assign(
        {
            shape: getObjectShape(data),
            ...(isValidArray(polygon) && {
                points: polygon[0].$.points.split(' ').map((point: { split: (arg0: string) => [any, any] }) => {
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

const parseLayer = (layer: Record<string, any>): TMXLayer => {
    const { $, image, object, properties } = layer
    return Object.assign(
        {
            type: layer['#name'],
            visible: 1,
            ...(isValidArray(image) && { image: Object.assign({}, ...getAttributes(image[0].$)) }),
            ...(isValidArray(object) && {
                objects: object.map((o: Record<string, any>) => parseObjectData(o))
            }),
            ...getProperties(properties)
        },
        ...getAttributes($)
    )
}

const parseTileData = (data: Record<string, any>): TMXTile => {
    const { $, animation, objectgroup } = data
    const obj = isValidArray(objectgroup) && objectgroup[0].object
    return Object.assign(
        {
            ...(isValidArray(animation) && {
                animation: {
                    frames: animation[0].frame.map(({ $ }: Record<string, any>) =>
                        Object.assign({}, ...getAttributes($))
                    )
                }
            }),
            ...(isValidArray(obj) && {
                objects: obj.map((o: Record<string, any>) => parseObjectData(o))
            })
        },
        ...getAttributes($)
    )
}

const parseGroup = async (
    node: Record<string, any>,
    expectedCount: number,
    translateFlips: boolean
): Promise<TMXLayerGroup> =>
    Object.assign(
        {
            type: node['#name'],
            layers: isValidArray(node.$$)
                ? await Promise.all(node.$$.map((l: TMXLayer) => parseNode(l, expectedCount, translateFlips)))
                : [],
            ...getProperties(node.properties)
        },
        ...getAttributes(node.$)
    )

const parseTileset = (data: Record<string, any>): TMXTileset => {
    const { $, $$, tile } = data
    const image = $$ && Object.assign({}, ...getAttributes($$[0].$))
    if (image) {
        const tiles = isValidArray(tile) && tile.map((t: any) => parseTileData(t))
        return Object.assign({}, ...getAttributes($), { image, tiles })
    } else {
        throw new Error('Tilesets should be embeded in a map file.')
    }
}

async function parseTileLayer(
    node: Record<string, any>,
    expectedCount: number,
    translateFlips: boolean
): Promise<TMXLayer> {
    const { data, properties } = node

    if (!isValidArray(data)) {
        throw new Error('TMXLayer data corrupted!')
    }

    const newLayer = Object.assign(
        {
            ...(translateFlips ? { flips: [] } : {}),
            type: node['#name'],
            visible: 1,
            ...getProperties(properties)
        },
        ...getAttributes(node.$)
    )

    const { _, $, tile } = data[0]
    /* XML Deprecated */
    if (tile) {
        newLayer.data = tile.map(({ $ }: Record<string, any>) => ($ && $.gid) || 0)
    } else {
        /* CSV, BASE64 */
        const { encoding, compression } = $
        const layerData = _.trim()

        switch (encoding) {
            case ENCODING.CSV:
                newLayer.data = layerData.split(',')
                break
            case ENCODING.BASE64:
                const buffer = new Buffer(layerData, encoding)
                switch (compression) {
                    case null:
                    case undefined:
                        newLayer.data = unpackTileBytes(buffer, expectedCount)
                        break
                    case COMPRESSION.GZIP:
                    case COMPRESSION.ZLIB:
                        const decompress = compression === COMPRESSION.GZIP ? zlib.gunzip : zlib.inflate
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
    newLayer.data.map((gid: number, i: number) => {
        if (translateFlips) {
            newLayer.flips[i] = getFlips(gid)
            newLayer.data[i] = getTileId(gid)
        } else newLayer.data[i] = gid
    })
    return newLayer
}

const parseNode = async (
    node: Record<string, any>,
    expectedCount: number,
    translateFlips: boolean
): Promise<TMXLayer | TMXLayerGroup | undefined> => {
    switch (node['#name']) {
        case NODE_TYPE.GROUP:
            return await parseGroup(node, expectedCount, translateFlips)
        case NODE_TYPE.LAYER:
            return await parseTileLayer(node, expectedCount, translateFlips)
        case NODE_TYPE.IMAGE_LAYER:
        case NODE_TYPE.OBJECT_GROUP:
            return parseLayer(node)
    }
    return
}

export { getAttributes, getFlips, getTileId, parseNode, parseTileset, parseXMLString }
