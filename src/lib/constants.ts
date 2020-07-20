export enum SHAPE {
    ELLIPSE = 'ellipse',
    POINT = 'point',
    POLYGON = 'polygon',
    RECTANGLE = 'rectangle'
}
export enum NODE_TYPE {
    EDITOR_SETTINGS = 'editorsettings',
    GROUP = 'group',
    IMAGE_LAYER = 'imagelayer',
    LAYER = 'layer',
    OBJECT_GROUP = 'objectgroup',
    PROPERTIES = 'properties',
    TILESET = 'tileset'
}

export enum ENCODING {
    BASE64 = 'base64',
    CSV = 'csv'
}

export enum COMPRESSION {
    GZIP = 'gzip',
    ZLIB = 'zlib'
}

export enum FLIPPED {
    DIAGONALLY = 0x20000000,
    HORIZONTALLY = 0x80000000,
    VERTICALLY = 0x40000000
}
