import test from 'ava'
import { tmx } from '../tmx'

const tmxFileDataUrl = `<?xml version="1.0" encoding="UTF-8"?>
<map version="1.2" tiledversion="1.2.4" orientation="orthogonal" renderorder="right-down" width="4" height="4" tilewidth="16" tileheight="16" infinite="0" nextlayerid="2" nextobjectid="1">
    <tileset firstgid="1" name="tileset" tilewidth="16" tileheight="16" tilecount="40" columns="10">
        <image source="tileset.png" width="320" height="192"/>
        <tile id="0">
            <animation>
                <frame tileid="0" duration="200"/>
                <frame tileid="1" duration="200"/>
                <frame tileid="2" duration="200"/>
                <frame tileid="3" duration="200"/>
            </animation>
        </tile>
    </tileset>    
    <layer id="1" name="Layer 1" width="4" height="4">
        <data encoding="base64" compression="zlib">eJxjYKAMAAAAQAAB</data>
    </layer>
    <objectgroup id="1" name="objects">
        <properties>
            <property name="property" type="bool" value="true"/>
        </properties>
        <object id="1" name="Player" type="player" gid="1" x="0" y="0" width="16" height="16"/>    
    </objectgroup>
</map>`

const noFlips = {
    D: false,
    H: false,
    V: false
}

test('tmxMapParser', async (t) => {
    t.deepEqual(await tmx(tmxFileDataUrl), {
        height: 4,
        infinite: 0,
        layers: [{
            data: [
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0
            ],
            flips: [
                noFlips, noFlips, noFlips, noFlips,
                noFlips, noFlips, noFlips, noFlips,
                noFlips, noFlips, noFlips, noFlips,
                noFlips, noFlips, noFlips, noFlips
            ],
            height: 4,
            id: 1,
            name: 'Layer 1',
            properties: null,
            type: 'layer',
            visible: 1,
            width: 4
        }, {
            id: 1,
            name: 'objects',
            objects: [
                {
                    flips: noFlips,
                    gid: 1,
                    height: 16,
                    id: 1,
                    name: 'Player',
                    properties: null,
                    shape: 'rectangle',
                    type: 'player',
                    width: 16,
                    x: 0,
                    y: 0
                }
            ],
            properties: {
                property: true
            },
            type: 'objectgroup',
            visible: 1
        }],
        nextlayerid: 2,
        nextobjectid: 1,
        orientation: 'orthogonal',
        renderorder: 'right-down',
        tiledversion: '1.2.4',
        tileheight: 16,
        tilesets: [{
            columns: 10,
            firstgid: 1,
            image: {
                height: 192,
                source: 'tileset.png',
                width: 320
            },
            name: 'tileset',
            tilecount: 40,
            tileheight: 16,
            tiles: [{
                animation: {
                    frames: [
                        { duration: 200, tileid: 0 },
                        { duration: 200, tileid: 1 },
                        { duration: 200, tileid: 2 },
                        { duration: 200, tileid: 3 }
                    ]
                },
                id: 0
            }],
            tilewidth: 16
        }],
        tilewidth: 16,
        version: 1.2,
        width: 4
    })
})