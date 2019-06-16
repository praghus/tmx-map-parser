'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.tmxParser = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

require('babel-polyfill');

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

var _xml2js = require('xml2js');

var _helpers = require('./helpers');

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var tmxParser = exports.tmxParser = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(xmlString) {
        var _ref2, _ref2$map, $, $$, map, expectedCount;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return parseTmxFile(xmlString);

                    case 2:
                        _ref2 = _context2.sent;
                        _ref2$map = _ref2.map;
                        $ = _ref2$map.$;
                        $$ = _ref2$map.$$;
                        map = Object.assign.apply(Object, [{ layers: [], tilesets: [] }].concat(_toConsumableArray(getValues($))));
                        expectedCount = map.width * map.height * 4;
                        _context2.next = 10;
                        return Promise.all($$.map(function () {
                            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(node, i) {
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                _context.t0 = node['#name'];
                                                _context.next = _context.t0 === _constants.NODE_TYPE.LAYER ? 3 : _context.t0 === _constants.NODE_TYPE.IMAGE_LAYER ? 7 : _context.t0 === _constants.NODE_TYPE.OBJECT_GROUP ? 7 : _context.t0 === _constants.NODE_TYPE.PROPERTIES ? 9 : _context.t0 === _constants.NODE_TYPE.TILESET ? 11 : 13;
                                                break;

                                            case 3:
                                                _context.next = 5;
                                                return parseTileLayer(node, node['#name'], expectedCount);

                                            case 5:
                                                map.layers[i] = _context.sent;
                                                return _context.abrupt('break', 13);

                                            case 7:
                                                map.layers[i] = parseLayerNode(node, node['#name']);
                                                return _context.abrupt('break', 13);

                                            case 9:
                                                map.properties = Object.assign.apply(Object, _toConsumableArray(node.$$.map(function (_ref4) {
                                                    var _ref4$$ = _ref4.$,
                                                        name = _ref4$$.name,
                                                        value = _ref4$$.value;
                                                    return _defineProperty({}, name, parseValue(value));
                                                })));
                                                return _context.abrupt('break', 13);

                                            case 11:
                                                map.tilesets.push(getTileset(node));
                                                return _context.abrupt('break', 13);

                                            case 13:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, undefined);
                            }));

                            return function (_x2, _x3) {
                                return _ref3.apply(this, arguments);
                            };
                        }()));

                    case 10:
                        map.layers = Object.values(map.layers);
                        return _context2.abrupt('return', map);

                    case 12:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function tmxParser(_x) {
        return _ref.apply(this, arguments);
    };
}();

var parseTmxFile = function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(tmx) {
        var xml;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        if (!(0, _helpers.isDataURL)(tmx)) {
                            _context3.next = 6;
                            break;
                        }

                        _context3.next = 3;
                        return parseDataUrl(tmx);

                    case 3:
                        _context3.t0 = _context3.sent;
                        _context3.next = 7;
                        break;

                    case 6:
                        _context3.t0 = tmx;

                    case 7:
                        xml = _context3.t0;
                        _context3.next = 10;
                        return new Promise(function (resolve) {
                            (0, _xml2js.parseString)(xml, {
                                explicitChildren: true,
                                preserveChildrenOrder: true
                            }, function (err, tmx) {
                                if (err) throw new Error(err);
                                resolve(tmx);
                            });
                        });

                    case 10:
                        return _context3.abrupt('return', _context3.sent);

                    case 11:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function parseTmxFile(_x4) {
        return _ref6.apply(this, arguments);
    };
}();

var parseDataUrl = function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(data) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return new Promise(function (resolve) {
                            fetch(data).then(function (response) {
                                return response.text();
                            }).then(function (body) {
                                return resolve(body);
                            });
                        });

                    case 2:
                        return _context4.abrupt('return', _context4.sent);

                    case 3:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function parseDataUrl(_x5) {
        return _ref7.apply(this, arguments);
    };
}();

var parseTileLayer = function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(layer, type, expectedCount) {
        var $, data, properties, newLayer, _data$, _, _$, tile, encoding, compression, layerData, buffer, decompress;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        $ = layer.$, data = layer.data, properties = layer.properties;
                        newLayer = Object.assign.apply(Object, [_extends({
                            type: type,
                            visible: 1,
                            flips: []
                        }, getProperties(properties))].concat(_toConsumableArray(getValues($))));

                        if (!(0, _helpers.isValidArray)(data)) {
                            _context5.next = 31;
                            break;
                        }

                        _data$ = data[0], _ = _data$._, _$ = _data$.$, tile = _data$.tile;
                        /* XML */

                        if (!tile) {
                            _context5.next = 8;
                            break;
                        }

                        newLayer.data = tile.map(function (_ref9) {
                            var $ = _ref9.$;
                            return $ && $.gid || 0;
                        });
                        _context5.next = 29;
                        break;

                    case 8:
                        encoding = _$.encoding, compression = _$.compression;
                        layerData = _.trim();
                        buffer = void 0;
                        decompress = void 0;
                        _context5.t0 = encoding;
                        _context5.next = _context5.t0 === _constants.ENCODING.CSV ? 15 : _context5.t0 === _constants.ENCODING.BASE64 ? 17 : 29;
                        break;

                    case 15:
                        newLayer.data = layerData.split(',');
                        return _context5.abrupt('break', 29);

                    case 17:
                        buffer = new Buffer(layerData, encoding);
                        _context5.t1 = compression;
                        _context5.next = _context5.t1 === null ? 21 : _context5.t1 === undefined ? 21 : _context5.t1 === _constants.COMPRESSION.GZIP ? 23 : _context5.t1 === _constants.COMPRESSION.ZLIB ? 23 : 28;
                        break;

                    case 21:
                        newLayer.data = unpackTileBytes(buffer, expectedCount);
                        return _context5.abrupt('break', 29);

                    case 23:
                        decompress = compression === _constants.COMPRESSION.GZIP ? _zlib2.default.gunzip : _zlib2.default.inflate;
                        _context5.next = 26;
                        return new Promise(function (resolve, reject) {
                            return decompress(buffer, function (err, buf) {
                                if (err) reject(err);
                                resolve(unpackTileBytes(buf, expectedCount));
                            });
                        });

                    case 26:
                        newLayer.data = _context5.sent;
                        return _context5.abrupt('break', 29);

                    case 28:
                        throw new Error('unsupported compression: ' + compression);

                    case 29:
                        newLayer.data.map(function (gid, i) {
                            newLayer.flips[i] = getFlips(gid);
                            newLayer.data[i] = getTileId(gid);
                        });
                        return _context5.abrupt('return', newLayer);

                    case 31:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function parseTileLayer(_x6, _x7, _x8) {
        return _ref8.apply(this, arguments);
    };
}();

var parseLayerNode = function parseLayerNode(layer, type) {
    var $ = layer.$,
        image = layer.image,
        object = layer.object,
        properties = layer.properties;

    return Object.assign.apply(Object, [_extends({
        type: type,
        visible: 1
    }, (0, _helpers.isValidArray)(image) && { image: Object.assign.apply(Object, [{}].concat(_toConsumableArray(getValues(image[0].$)))) }, (0, _helpers.isValidArray)(object) && { objects: object.map(function (object) {
            return getObjectData(object);
        }) }, getProperties(properties))].concat(_toConsumableArray(getValues($))));
};

var parseValue = function parseValue(value) {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value.match(/^[+-]?\d+(\.\d+)?$/g)) {
        var parsedValue = parseFloat(value);
        return !isNaN(parsedValue) ? parsedValue : value;
    }
    return value;
};

var getValues = function getValues($) {
    return $ && Object.entries($).map(function (_ref10) {
        var _ref11 = _slicedToArray(_ref10, 2),
            key = _ref11[0],
            value = _ref11[1];

        return _defineProperty({}, key, parseValue(value));
    });
};

var getProperties = function getProperties(properties) {
    return { properties: properties && Object.assign.apply(Object, _toConsumableArray(properties.map(function (_ref13) {
            var property = _ref13.property;
            return Object.assign.apply(Object, _toConsumableArray(property.map(function (_ref14) {
                var _ref14$$ = _ref14.$,
                    name = _ref14$$.name,
                    value = _ref14$$.value,
                    _ = _ref14._;
                return _defineProperty({}, name, value ? parseValue(value) : _);
            })));
        }))) || null };
};

var getFlips = function getFlips(gid) {
    return {
        H: !!(gid & _constants.FLIPPED.HORIZONTALLY),
        V: !!(gid & _constants.FLIPPED.VERTICALLY),
        D: !!(gid & _constants.FLIPPED.DIAGONALLY)
    };
};

var getTileId = function getTileId(gid) {
    return gid &= ~(_constants.FLIPPED.HORIZONTALLY | _constants.FLIPPED.VERTICALLY | _constants.FLIPPED.DIAGONALLY);
};

var getObjectShape = function getObjectShape(data) {
    return data.point && _constants.SHAPE.POINT || data.ellipse && _constants.SHAPE.ELLIPSE || data.polygon && _constants.SHAPE.POLYGON || _constants.SHAPE.RECTANGLE;
};

var getObjectData = function getObjectData(data) {
    var $ = data.$,
        properties = data.properties,
        polygon = data.polygon,
        text = data.text;

    var object = Object.assign.apply(Object, [_extends({
        shape: getObjectShape(data)
    }, (0, _helpers.isValidArray)(polygon) && {
        points: polygon[0].$.points.split(' ').map(function (point) {
            var _point$split = point.split(','),
                _point$split2 = _slicedToArray(_point$split, 2),
                x = _point$split2[0],
                y = _point$split2[1];

            return [parseFloat(x), parseFloat(y)];
        }) }, getProperties(properties))].concat(_toConsumableArray(getValues($))));

    if (text) {
        object.text = text[0]._;
        object.properties = Object.assign({}, object.properties, text[0].$);
    }
    if (object.gid) {
        object.flips = getFlips(object.gid);
        object.gid = getTileId(object.gid);
    }
    return object;
};

var getTileData = function getTileData(data) {
    var $ = data.$,
        animation = data.animation,
        objectgroup = data.objectgroup;

    var object = (0, _helpers.isValidArray)(objectgroup) && objectgroup[0].object;
    return Object.assign.apply(Object, [_extends({}, (0, _helpers.isValidArray)(animation) && {
        animation: {
            frames: animation[0].frame.map(function (_ref16) {
                var $ = _ref16.$;
                return Object.assign.apply(Object, [{}].concat(_toConsumableArray(getValues($))));
            })
        }
    }, (0, _helpers.isValidArray)(object) && {
        objects: object.map(function (o) {
            return getObjectData(o);
        })
    })].concat(_toConsumableArray(getValues($))));
};

var getTileset = function getTileset(data) {
    var $ = data.$,
        $$ = data.$$,
        tile = data.tile;

    var image = $$ && Object.assign.apply(Object, [{}].concat(_toConsumableArray(getValues($$[0].$))));
    if (image) {
        var tiles = (0, _helpers.isValidArray)(tile) && tile.map(function (t) {
            return getTileData(t);
        });
        return Object.assign.apply(Object, _toConsumableArray(getValues($)).concat([{ image: image, tiles: tiles }]));
    } else {
        throw new Error('Tilesets should be embeded in a map file.');
    }
};

var unpackTileBytes = function unpackTileBytes(buf, expectedCount) {
    var unpackedTiles = [];
    if (buf.length !== expectedCount) {
        throw new Error('Expected ' + expectedCount + ' bytes of tile data; received ' + buf.length);
    }
    for (var i = 0; i < expectedCount; i += 4) {
        unpackedTiles.push(buf.readUInt32LE(i));
    }
    return unpackedTiles;
};