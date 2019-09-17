interface StringTMap<T> { [key: string]: T }
interface NumberTMap<T> { [key: number]: T }

interface TmxLayer {
    readonly $?: Record<string, any>;
    readonly data?: any;
    readonly properties?: any;
    readonly object?: any;
    readonly image?: any;
}

interface TmxMap {
    readonly $?: Record<string, any>;
    readonly backgroundcolor: string;
    readonly height: number;
    readonly infinite: number;
    layers: Array<TmxLayer>;
    readonly nextlayerid: number;
    readonly nextobjectid: 1104;
    readonly orientation: string;
    properties: Record<string, any>;
    readonly renderorder: string;
    readonly tiledversion: string;
    readonly tileheight: number;
    readonly tilewidth: number;
    tilesets: Array<TmxTileset>;
    readonly version: number;
    readonly width: number;    
}

interface TmxTileset {
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

interface TmxObject {
    readonly $: any;
    readonly text?: any;
    readonly properties?: any;
    readonly point?: any;
    readonly ellipse?: any;
    readonly polygon?: any;
}

interface TmxImage {
    readonly height: number;
    readonly width: number;
    readonly source: string;
}
// Map
// layer
// tileset
// object
