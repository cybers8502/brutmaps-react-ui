import type {GeoJSONFeature} from '~/components/MapLayers/MapLayers.tsx';

export interface PopupInterface {
  coordinates: [number, number];
  properties: GeoJSONFeature['properties'];
}

export interface ViewportInterface {
  latitude: number;
  longitude: number;
  zoom: number;
}
