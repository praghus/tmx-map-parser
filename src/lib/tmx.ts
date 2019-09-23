import zlib from 'zlib'
import { parseString } from 'xml2js'
import { 
    fetchDataURL,
    getAttributes,
    getFlips,
    getObjectShape,
    getTileId,
    getValue,
    isDataURL, 
    isValidArray, 
    unpackTileBytes
} from './helpers'
import { 
    COMPRESSION, 
    ENCODING, 
    NODE_TYPE 
} from './constants' 


const parseTmxFile = async (tmx: string): Promise<any> => {
    const xml = isDataURL(tmx) ? await fetchDataURL(tmx) : tmx
    return new Promise((resolve) =>
        parseString(xml, {
            explicitChildren: true,
            preserveChildrenOrder: true,
            attrValueProcessors: [
                (value: string): any => getValue(value)
            ]
        }, (error: Error, tmx: any) => {
            if (error) throw error
            resolve(tmx)
        })
    )
}

const parseProperties = (properties: Array<Record<string, any>>) => ({
    properties: properties && Object.assign({},
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


const parseObjectData = (data: StringTMap<any>) => {
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
            ...parseProperties(properties)
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

const parseTileLayer = async (layer: TmxLayer, type: string, expectedCount: number): Promise<Record<string, any>> => {
    const { data, properties } = layer
    const newLayer = Object.assign(
        {
            flips: [],
            type,
            visible: 1,
            ...parseProperties(properties)
        },
        ...getAttributes(layer.$)
    )

    if (!isValidArray(data)) {
        return undefined
    }

    const { _, $, tile } = data[0]
    /* XML */
    if (tile) {
        newLayer.data = tile.map(({ $ }) => ($ && $.gid) || 0)
    }
    else {
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
        newLayer.flips[i] = getFlips(gid)
        newLayer.data[i] = getTileId(gid)
    })
    return newLayer
}

const parseLayer = (layer: TmxLayer, type: string) => {
    const { $, image, object, properties } = layer
    return Object.assign(
        {
            type,
            visible: 1,
            ...(isValidArray(image) && {
                image: Object.assign({}, ...getAttributes(image[0].$))
            }),
            ...(isValidArray(object) && {
                objects: object.map(object => parseObjectData(object))
            }),
            ...parseProperties(properties)
        },
        ...getAttributes($)
    )
}

const parseTileData = (data: StringTMap<any>) => {
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
                objects: obj.map((o) => parseObjectData(o))
            })
        },
        ...getAttributes($)
    )
}

const parseTileset = (data: StringTMap<any>) => {
    const { $, $$, tile } = data
    const image = $$ && Object.assign({}, ...getAttributes($$[0].$))
    if (image) {
        const tiles = isValidArray(tile) && tile.map((t) => parseTileData(t))
        return Object.assign({}, ...getAttributes($), { image, tiles })
    }
    else {
        throw new Error('Tilesets should be embeded in a map file.')
    }
}

export const tmx = async (xmlString: string): Promise<Record<string, any>> => {
    const {
        map: { $, $$ }
    } = await parseTmxFile(xmlString)

    const map: TmxMap = Object.assign({ 
        layers: [], 
        tilesets: []  
    }, ...getAttributes($))
    
    const expectedCount = map.width * map.height * 4

    await Promise.all(
        $$.map(async (node: any, i: number) => {
            switch (node['#name']) {
            case NODE_TYPE.LAYER:
                map.layers[i] = await parseTileLayer(node, node['#name'], expectedCount)
                break
            case NODE_TYPE.IMAGE_LAYER:
            case NODE_TYPE.OBJECT_GROUP:
                map.layers[i] = parseLayer(node, node['#name'])
                break
            case NODE_TYPE.PROPERTIES:
                map.properties = Object.assign({},
                    ...node.$$.map(({ $: { name, value } }) => ({
                        [name]: value
                    }))
                )
                break
            case NODE_TYPE.TILESET:
                map.tilesets.push(parseTileset(node))
                break
            }
        })
    )
    map.layers = Object.values(map.layers)
    return map
}
