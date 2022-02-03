import { TMXParser } from './tmx-parser'
export const tmx = async (xmlString: string, translateFlips = false): Promise<Record<string, any>> =>
    await TMXParser(xmlString, translateFlips)
