/// <reference types="node" />

declare module 'tmx-tiledmap' {
    export interface StringTMap<T> { [key: string]: T }
    
    export interface Layer {
        readonly $$?: Record<string, any>;
        readonly $?: Record<string, any>;
        readonly data?: any;
        readonly properties?: any;
        readonly object?: any;
        readonly image?: any;
    }
    
    export interface Data {
        readonly $?: Record<string, any>;
        readonly backgroundcolor: string;
        readonly height: number;
        readonly infinite: number;
        readonly nextlayerid: number;
        readonly nextobjectid: number;
        readonly orientation: string;
        readonly renderorder: string;
        readonly tiledversion: string;
        readonly tileheight: number;
        readonly tilewidth: number;
        readonly version: number;
        readonly width: number;    
        editorsettings?: Record<string, any>;
        layers: Array<Layer>;
        properties: Record<string, any>;
        tilesets: Array<Tileset>;
    }
    
    export interface Tileset {
        readonly $?: Record<string, any>;
        readonly columns: number;
        readonly firstgid: number;
        readonly name: string;
        readonly image: TmxImage;
        readonly spacing?: number;
        readonly margin?: number;
        readonly tilecount: number;
        readonly tileheight: number;
        readonly tilewidth: number;
    }

    export interface TmxImage {
        readonly height: number;
        readonly width: number;
        readonly source: string;
    }

    export class TMXParser {
        xmlString: string;
        expectedCount: number;
        data: Data;
        constructor(xmlString: string);
        parse(): Promise<Data>;
        parseXMLString(): Promise<any>;
        parseNode(node: Layer): Promise<any>;
        parseTileset(data: StringTMap<any>): any;
        parseTileLayer(layer: Layer): Promise<Record<string, any>>;
        parseLayer(layer: Layer): any;
        parseObjectData(data: StringTMap<any>): any;
        parseTileData(data: StringTMap<any>): any;
    }
}