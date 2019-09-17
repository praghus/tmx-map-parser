export enum SHAPE {
    POINT = 'point',
    ELLIPSE = 'ellipse',
    POLYGON = 'polygon',
    RECTANGLE = 'rectangle'
}

export enum NODE_TYPE {
    IMAGE_LAYER = 'imagelayer',
    LAYER = 'layer',
    OBJECT_GROUP = 'objectgroup',
    PROPERTIES = 'properties',
    TILESET = 'tileset'
}

export enum ENCODING {
    CSV = 'csv',
    BASE64 = 'base64'
}

export enum COMPRESSION {
    GZIP = 'gzip',
    ZLIB = 'zlib'
}

export enum FLIPPED {
    HORIZONTALLY = 0x80000000,
    VERTICALLY = 0x40000000,
    DIAGONALLY = 0x20000000
}
