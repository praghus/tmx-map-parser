import { NODE_TYPE } from './constants'
import { getAttributes, parseNode, parseTileset, parseXMLString } from './helpers'
import { TMXLayer, TMXTiledMap, TMXTileset } from './types'

export async function TMXParser(xmlString: string, translateFlips: boolean): Promise<TMXTiledMap> {
    const {
        map: { $, $$ }
    } = await parseXMLString(xmlString)

    const data: TMXTiledMap = Object.assign(
        {
            layers: [] as TMXLayer[],
            tilesets: [] as TMXTileset[],
            backgroundcolor: '',
            height: 0,
            infinite: 0,
            nextlayerid: 0,
            nextobjectid: 0,
            orientation: '',
            renderorder: '',
            tiledversion: '',
            tileheight: 0,
            tilewidth: 0,
            version: 0,
            width: 0,
            properties: undefined
        },
        ...getAttributes($)
    )

    const expectedCount = data.width * data.height * 4

    await Promise.all(
        $$.map(async (node: Record<string, any>, i: number) => {
            switch (node['#name']) {
                case NODE_TYPE.PROPERTIES:
                    data.properties = Object.assign(
                        {},
                        ...node.$$.map(({ $: { name, value } }: Record<string, any>) => ({ [name]: value }))
                    )
                    break
                case NODE_TYPE.EDITOR_SETTINGS:
                    data.editorsettings = Object.assign({}, ...node.$$.map((s: any) => ({ [s['#name']]: s.$ })))
                    break
                case NODE_TYPE.TILESET:
                    data.tilesets.push(parseTileset(node))
                    break
                case NODE_TYPE.GROUP:
                case NODE_TYPE.IMAGE_LAYER:
                case NODE_TYPE.LAYER:
                case NODE_TYPE.OBJECT_GROUP:
                    data.layers[i] = (await parseNode(node, expectedCount, translateFlips)) as TMXLayer
                    break
            }
        })
    )
    return { ...data, layers: Object.values(data.layers) }
}
