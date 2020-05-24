import { TMXParser } from './lib/tmx-parser'
export const tmx = async (xmlString: string): Promise<Record<string, any>> => {
    const tmxParser = new TMXParser(xmlString)
    return await tmxParser.parse()
}