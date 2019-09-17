import { NODE_TYPE } from './constants'
import { getAttributes } from './formatters'
import { parseLayer, parseTmxFile, parseTileLayer, parseTileset } from './parsers'

export const Tmx = async (xmlString: string): Promise<Record<string, any>> => {
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
    console.info('MAP', map)
    return map
}
