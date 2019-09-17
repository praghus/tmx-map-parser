import zlib from 'zlib'
import { parseString } from 'xml2js'
import { COMPRESSION, ENCODING } from './constants'
import { isDataURL, isValidArray, unpackTileBytes } from './helpers'
import { getFlips, getProperties, getAttributes, getTileId, getTileData, getObjectData } from './formatters'

const parseDataUrl = async (data: string): Promise<string> => {
    return new Promise((resolve) => {
        fetch(data)
            .then((response) => response.text())
            .then((body) => resolve(body))
    })
}

const parseValue = (value: string): any => {
    if (value === 'true') return true
    if (value === 'false') return false
    if (`${value}`.match(/^[+-]?\d+(\.\d+)?$/g)) {
        const parsedValue = parseFloat(value)
        return !isNaN(parsedValue) ? parsedValue : value
    }
    return value
}

const parseTmxFile = async (tmx: string): Promise<any> => {
    const xml = isDataURL(tmx) ? await parseDataUrl(tmx) : tmx
    return new Promise((resolve) =>
        parseString(
            xml,
            {
                explicitChildren: true,
                preserveChildrenOrder: true,
                attrValueProcessors: [
                    (value: string): any => parseValue(value)
                ]
            },
            (error: Error, tmx: any) => {
                if (error) throw error
                resolve(tmx)
            }
        )
    )
}

const parseTileLayer = async (layer: TmxLayer, type: string, expectedCount: number): Promise<Record<string, any>> => {
    const { data, properties } = layer
    const newLayer = Object.assign(
        {
            flips: [],
            type,
            visible: 1,
            ...getProperties(properties)
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
                objects: object.map(object => getObjectData(object))
            }),
            ...getProperties(properties)
        },
        ...getAttributes($)
    )
}

const parseTileset = (data: StringTMap<any>) => {
    const { $, $$, tile } = data
    const image = $$ && Object.assign({}, ...getAttributes($$[0].$))
    if (image) {
        const tiles = isValidArray(tile) && tile.map((t) => getTileData(t))
        return Object.assign({}, ...getAttributes($), { image, tiles })
    }
    else {
        throw new Error('Tilesets should be embeded in a map file.')
    }
}

export {
    parseLayer,
    parseTileLayer,
    parseTileset,
    parseTmxFile
}
