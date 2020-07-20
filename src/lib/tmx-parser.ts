/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as Tmx from 'tmx-tiledmap'
import zlib from 'zlib'
import { parseString } from 'xml2js'
import { 
    fetchDataURL,
    getAttributes,
    getFlips,
    getObjectShape,
    getProperties,
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

export class TMXParser {
    public xmlString: string;
    public expectedCount: number;
    public data: Tmx.Data = {
        layers: [] as Tmx.Layer[], 
        tilesets: [] as Tmx.Tileset[],
        backgroundcolor: null,
        editorsettings: null,
        height: null,
        infinite: null,
        nextlayerid: null,
        nextobjectid: null,
        orientation: null,
        properties: null,
        renderorder: null,
        tiledversion: null,
        tileheight: null,
        tilewidth: null,
        version: null,
        width: null
    }

    constructor (xmlString: string) {
        this.xmlString = xmlString 
    }

    async parse (): Promise<Tmx.Data> {
        const { map: { $, $$ } } = await this.parseXMLString()

        this.data = Object.assign({
            layers: [],
            tilesets: []
        }, ...getAttributes($))
        this.expectedCount = this.data.width * this.data.height * 4

        await Promise.all(
            $$.map(async (node: any, i: number) => {
                switch (node['#name']) {
                case NODE_TYPE.PROPERTIES:
                    this.data.properties = Object.assign({},
                        ...node.$$.map(({ $: { name, value } }) => ({[name]: value}))
                    )
                    break
                case NODE_TYPE.EDITOR_SETTINGS:
                    this.data.editorsettings =  Object.assign({},
                        ...node.$$.map((s: any) => ({[s['#name']]: s.$}))
                    )
                    break
                case NODE_TYPE.TILESET:
                    this.data.tilesets.push(this.parseTileset(node))
                    break
                case NODE_TYPE.GROUP :
                case NODE_TYPE.IMAGE_LAYER:
                case NODE_TYPE.LAYER :
                case NODE_TYPE.OBJECT_GROUP: 
                    this.data.layers[i] = await this.parseNode(node)
                    break 
                }
            })
        )
        return Object.assign(this.data, {layers: Object.values(this.data.layers)})
    }

    async parseXMLString (): Promise<any> {
        const xml = isDataURL(this.xmlString) ? await fetchDataURL(this.xmlString) : this.xmlString
        return new Promise((resolve) =>
            parseString(xml, {
                explicitChildren: true,
                preserveChildrenOrder: true,
                attrValueProcessors: [(value: string): any => getValue(value)]
            }, (error: Error, tmx: any) => {
                if (error) throw error
                resolve(tmx)
            })
        )
    }

    async parseNode (node: Tmx.Layer) {
        switch (node['#name']) {
        case NODE_TYPE.GROUP:
            return await this.parseGroup(node)
        case NODE_TYPE.LAYER:
            return await this.parseTileLayer(node)
        case NODE_TYPE.IMAGE_LAYER:
        case NODE_TYPE.OBJECT_GROUP:
            return this.parseLayer(node)
        }
    }

    async parseGroup (layer: Tmx.Layer) {
        const { $, $$, properties } = layer
        return Object.assign({
            type: layer['#name'],
            layers: await Promise.all($$.map((l: Tmx.Layer) => this.parseNode(l))),
            ...getProperties(properties)
        }, ...getAttributes($))
    }

    async parseTileLayer (layer: Tmx.Layer): Promise<Record<string, any>> {
        const { data, properties } = layer
        const newLayer = Object.assign({
            flips: [],
            type: layer['#name'],
            visible: 1,
            ...getProperties(properties)
        }, ...getAttributes(layer.$))
    
        if (!isValidArray(data)) {
            return undefined
        }
    
        const { _, $, tile } = data[0]
        /* XML */
        if (tile) {
            newLayer.data = tile.map(({ $ }) => ($ && $.gid) || 0)
        }
        /* CSV, BASE64 */
        else {
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
                    newLayer.data = unpackTileBytes(buffer, this.expectedCount)
                    break
                case COMPRESSION.GZIP:
                case COMPRESSION.ZLIB:
                    const decompress = compression === COMPRESSION.GZIP 
                        ? zlib.gunzip 
                        : zlib.inflate
                    newLayer.data = await new Promise((resolve, reject) =>
                        decompress(buffer, (err, buf) => {
                            if (err) reject(err)
                            resolve(unpackTileBytes(buf, this.expectedCount))
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

    parseTileset (data: Tmx.StringTMap<any>) {
        const { $, $$, tile } = data
        const image = $$ && Object.assign({}, ...getAttributes($$[0].$))
        if (image) {
            const tiles = isValidArray(tile) && tile.map((t: any) => this.parseTileData(t))
            return Object.assign({}, ...getAttributes($), { image, tiles })
        }
        else {
            throw new Error('Tilesets should be embeded in a map file.')
        }
    }

    parseLayer (layer: Tmx.Layer) {
        const { $, image, object, properties } = layer
        return Object.assign({
            type: layer['#name'],
            visible: 1,
            ...(isValidArray(image) && { image: Object.assign({}, ...getAttributes(image[0].$)) }),
            ...(isValidArray(object) && { objects: object.map((o: Tmx.StringTMap<any>) => this.parseObjectData(o)) }),
            ...getProperties(properties)
        }, ...getAttributes($))
    }
    
    parseObjectData (data: Tmx.StringTMap<any>)  {
        const { $, properties, polygon, text } = data
        const object = Object.assign({
            shape: getObjectShape(data),
            ...(isValidArray(polygon) && {
                points: polygon[0].$.points.split(' ').map((point: { split: (arg0: string) => [any, any] }) => {
                    const [x, y] = point.split(',')
                    return [
                        parseFloat(x), 
                        parseFloat(y)
                    ]
                })
            }),
            ...getProperties(properties)
        }, ...getAttributes($))

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

    parseTileData  (data: Tmx.StringTMap<any>) {
        const { $, animation, objectgroup } = data
        const obj = isValidArray(objectgroup) && objectgroup[0].object
        return Object.assign({
            ...(isValidArray(animation) && {
                animation: {
                    frames: animation[0].frame.map(({ $ }) => Object.assign({}, ...getAttributes($))) // check simple getAttributes($)
                }
            }),
            ...(isValidArray(obj) && {
                objects: obj.map((o: Tmx.StringTMap<any>) => this.parseObjectData(o))
            })
        }, ...getAttributes($))
    }
}
