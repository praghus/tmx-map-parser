import { TMXParser } from './tmx-parser'

export { getFlips, getTileId } from './helpers'
export { TMXTiledMap, TMXLayer, TMXLayerGroup, TMXTileset, TMXImage, TMXTile, TMXObject, TMXFlips } from './types'

export const tmx = async (xmlString: string, translateFlips = false): Promise<Record<string, any>> =>
    await TMXParser(xmlString, translateFlips)
