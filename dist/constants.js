'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var SHAPE = exports.SHAPE = {
    POINT: 'point',
    ELLIPSE: 'ellipse',
    POLYGON: 'polygon',
    RECTANGLE: 'rectangle'
};

var NODE_TYPE = exports.NODE_TYPE = {
    IMAGE_LAYER: 'imagelayer',
    LAYER: 'layer',
    OBJECT_GROUP: 'objectgroup',
    PROPERTIES: 'properties',
    TILESET: 'tileset'
};

var ENCODING = exports.ENCODING = {
    CSV: 'csv',
    BASE64: 'base64'
};

var COMPRESSION = exports.COMPRESSION = {
    GZIP: 'gzip',
    ZLIB: 'zlib'
};

var FLIPPED = exports.FLIPPED = {
    HORIZONTALLY: 0x80000000,
    VERTICALLY: 0x40000000,
    DIAGONALLY: 0x20000000
};