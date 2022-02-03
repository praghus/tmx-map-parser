import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'

export default [
    {
        input: 'src/index.ts',
        external: ['xml2js', 'zlib'],
        output: {
            globals: {
                xml2js: 'xml2js',
                zlib: 'zlib'
            },
            name: 'tmx-map-parser',
            file: pkg.browser,
            format: 'umd'
        },
        plugins: [nodeResolve(), commonjs(), typescript({ tsconfig: './tsconfig.json' })]
    },
    {
        input: 'src/index.ts',
        external: ['xml2js', 'zlib'],
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' }
        ],
        plugins: [nodeResolve(), typescript({ tsconfig: './tsconfig.json' })]
    }
]
