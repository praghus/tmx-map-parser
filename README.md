# tmx-tiledmap [![npm version](https://badge.fury.io/js/tmx-tiledmap.svg)](//npmjs.com/package/tmx-tiledmap)

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

``` javascript
// TMX file loaded using webpack 'url-loader' (can be either a string or URL encoded data)
import tmxFile from './levels/map.tmx'
import { tmxParser } from 'tmx-tiledmap'

tmxParser(tmxFile).then((data) => {
  console.info(data)
})
```

webpack.config.js

``` javascript
const path = require('path')

module.exports = {
    target: 'web',
    entry: [
        path.join(process.cwd(), 'src/index.js')
    ],
    module: {
        rules: [
        //...
            {
                test: /\.tmx$/,
                include: path.join(process.cwd(), 'src/assets/levels'),
                use: 'url-loader'
            },
        //...
        ]
    }
}
```

## License

[MIT licensed](./LICENSE).
