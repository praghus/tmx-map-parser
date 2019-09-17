export const noop = Function.prototype

export const isValidArray = (arr: any): boolean => !!(arr && arr.length > 0)

export const isDataURL = (s: string): boolean =>
    !!s.match(/^\s*data:([a-z]+\/[a-z]+(;[a-z-]+=[a-z-]+)?)?(;base64)?,[a-z0-9!$&',()*+,;=\-._~:@/?%\s]*\s*$/i)

export const unpackTileBytes = (buf: Buffer, expectedCount: number): Array<number> => {
    const unpackedTiles = []
    if (buf.length !== expectedCount) {
        throw new Error(`Expected ${expectedCount} bytes of tile data; received ${buf.length}`)
    }
    for (let i = 0; i < expectedCount; i += 4) {
        unpackedTiles.push(buf.readUInt32LE(i))
    }
    return unpackedTiles
}
