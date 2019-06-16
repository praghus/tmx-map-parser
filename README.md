# tmx-tiledmap [![npm version](https://badge.fury.io/js/tmx-tiledmap.svg)](//npmjs.com/package/tmx-tiledmap) [![Build Status](https://travis-ci.org/praghus/tmx-tiledmap.svg?branch=master)](https://travis-ci.org/praghus/tmx-tiledmap)

Parser for [Tiled Map Editor](http://www.mapeditor.org/) maps for use with [Webpack](https://webpack.js.org/).


## Installation

```sh
npm install tmx-tiledmap
```

or using yarn

```sh
yarn add tmx-tiledmap
```
## Usage

You can import and parse tiled map like this:

```js
// TMX file loaded using webpack 'url-loader',
// can be either a string or URL encoded data.
import tmxFile from './levels/map.tmx'
import { tmxParser } from 'tmx-tiledmap'

tmxParser(tmxFile).then((data) => {
  console.info(data)
})
```

webpack.config.js

```js
const path = require('path')

module.exports = {
    target: 'web',
    entry: [
        path.join(process.cwd(), 'src/index.js')
    ],
    module: {
        rules: [
            // ...
            {
                test: /\.tmx$/,
                include: path.join(process.cwd(), 'src/assets/levels'),
                use: 'url-loader'
            },
           // ...
        ]
    }
}
```

## Documentation

Example parsed data

```js
{
    tiledversion: "1.2.4"
    tilewidth: 16,
    tileheight: 16,
    version: 1.2,
    width: 512,
    height: 128,
    infinite: 0,
    nextlayerid: 5,
    nextobjectid: 165,
    orientation: "orthogonal",
    renderorder: "right-down",
    properties: {
        property1: 'value', 
        property2: 0.5
    },
    layers: [{
        id: 1,
        name: "layer name",
        type: "layer"
        visible: 1,
        data: [0, 1, 1, 10, 10, 10, 1, 1, 0, 0, 0, 0, …],
        flips: [
            {H: false, V: false, D: false},
            {H: true, V: false, D: true},
            {H: false, V: false, D: false},
            {…}
        ],
        width: 512,
        height: 128,
        opacity: 0.77,
        properties: {
           property1: 'value',
           property2: false   
        }
    }, {
        id: 2,
        name: "objects",
        type: "objectgroup",
        visible: 1,
        objects: [{…}, {…}, {…}],
        properties: {
           property1: 'value',
           property2: false   
        }
    }, {
        …
    }]
    tilesets: [{
        columns: 32,
        firstgid: 1,
        image: {source: "../images/tiles.png", width: 512, height: 512},
        name: "tiles",
        tilecount: 1024,
        tilewidth: 16,
        tileheight: 16,
        tiles: [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
    }, {
        …
    }]
}
```

## License

[MIT licensed](./LICENSE).
