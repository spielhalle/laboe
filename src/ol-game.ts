import { Map, View, Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { fromLonLat } from 'ol/proj';
import { defaults } from 'ol/interaction';
import { OSM } from 'ol/source';
import { Tile } from 'ol/layer';
import CircleStyle from 'ol/style/Circle';
import { Extent, boundingExtent, getCenter, getTopLeft, getBottomRight } from 'ol/extent';
import BaseTileLayer from 'ol/layer/BaseTile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Polygon from 'ol/geom/Polygon';

const createDefaultBounds: () => Extent = (): Extent => {
    const topLeft: Coordinate = fromLonLat([9.5, 54.5])
    const bottomRight: Coordinate = fromLonLat([11, 54])
    return boundingExtent([topLeft, bottomRight]);

}
interface IZoomConfig {
    default: number,
    max: number,
    min: number,
}
export const testStyle: Style = new Style({
    image: new CircleStyle({
        fill: new Fill({ color: '#111111' }),
        radius: 12,
        stroke: new Stroke({
            color: '#EEEEEE', width: 2,
        }),
    }),
    zIndex: 990,
});
const randomCoord: (ext: Extent) => Coordinate = (ext: Extent): Coordinate => {
    const topLeft: Coordinate = getTopLeft(ext);
    const bottomRight: Coordinate = getBottomRight(ext);
    const lat: number = topLeft[1] + (Math.random() * (bottomRight[1] - topLeft[1]));
    const lng: number = bottomRight[0] + (Math.random() * (topLeft[0] - bottomRight[0]));
    return [lng, lat];
}
const createHexagon = (coordinate: Coordinate, hexagonRadius: number): Feature => {
    const hexagonHeight = hexagonRadius * Math.sqrt(3);
    const coordinates: Coordinate[] = [];
    coordinates.push([coordinate[0] - hexagonRadius, coordinate[1]]);
    coordinates.push([coordinate[0] - hexagonRadius / 2, coordinate[1] + hexagonHeight / 2]);
    coordinates.push([coordinate[0] + hexagonRadius / 2, coordinate[1] + hexagonHeight / 2]);
    coordinates.push([coordinate[0] + hexagonRadius, coordinate[1]]);
    coordinates.push([coordinate[0] + hexagonRadius / 2, coordinate[1] - hexagonHeight / 2]);
    coordinates.push([coordinate[0] - hexagonRadius / 2, coordinate[1] - hexagonHeight / 2]);
    return new Feature({
        geometry: new Polygon([coordinates]),
    });
}
export class LaboeGame {
    public readonly map: Map;
    public readonly backgroundlayer: BaseTileLayer;
    public readonly overlayLayer: VectorLayer;
    public readonly overlayLayerSource: VectorSource;
    public constructor(public readonly canvas: HTMLElement,
        public readonly bounds: Extent = createDefaultBounds(),
        public readonly zoom: IZoomConfig = {
            default: 12,
            max: 17,
            min: 8,
        }) {
        this.backgroundlayer = this.createMapLayer();
        this.overlayLayerSource = new VectorSource({});

        this.overlayLayer = new VectorLayer({
            source: this.overlayLayerSource,
            style: function (feature) {
                return new Style({
                    stroke: new Stroke({
                        color: 'blue',
                        width: 3
                    }),
                    fill: new Fill({
                        color: 'rgba(0, 0, 255, 0.1)'
                    })
                })
            },
        });
        new Map({
            interactions: defaults(),
            layers: [
                this.backgroundlayer,
                this.overlayLayer,
            ],
            target: this.canvas,
            view: new View({
                // projection: 'EPSG:3857', // 'EPSG:4326',
                center: getCenter(this.bounds),

                extent: this.bounds,
                maxZoom: this.zoom.max,
                minZoom: this.zoom.min,
                zoom: this.zoom.default,
            }),
        });
        const c1: Coordinate = randomCoord(this.bounds);
        for (let i = 0; i < 100; i++) {
            for (let j = 0; j < 10; j++) {
                const radiusSize: number = 50;
                const hexagonHeight = radiusSize * Math.sqrt(3);
                const f1: Feature = createHexagon([c1[0] + (j * radiusSize * 2), c1[1] + ((i + (j % 2)) * hexagonHeight)], radiusSize);
                this.overlayLayerSource.addFeature(f1);
            }
        }
        this.overlayLayerSource.changed();
    }

    public start(): void {

    }

    public createMapLayer(): BaseTileLayer {
        return new Tile({
            source: new OSM({
                url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            }),
        });
    }
}
