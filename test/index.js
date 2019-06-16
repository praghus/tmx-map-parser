import { expect } from 'chai'
import { Tmx } from '../lib'
import tmxFile from './data/map'

let map

describe('Testing', () => {
    before(async () => {
        map = await Tmx(tmxFile) 
    })

    it('Should parse tmx file', () => {
        expect(map).to.have.keys([
            'height',
            'infinite',
            'layers',
            'nextlayerid',
            'nextobjectid',
            'orientation',
            'properties',
            'renderorder',
            'tiledversion',
            'tileheight',
            'tilesets',
            'tilewidth',
            'version',
            'width'
        ])
    })
    
    it('Map object should have its properties', () => {        
        expect(map.properties).to.include({
            'gravity': 0.5,
            'surfaceLevel': 64
        })
    })

    it('Map object should contain all layers', () => {        
        expect(map.layers).to.have.length(4)
    })
})
