import {Source, Layer} from 'react-map-gl';
import {clusterLayer, clusterCountLayer, unclutteredPointLayer} from './layers.ts';
import useFetchMapDetails from '~/hooks/fetchApi/useFetchMap.tsx';
import {FeatureCollection, Feature, MultiLineString, Position} from 'geojson';

interface FeatureProperty {
  id: number;
  slug: string;
  title: string;
  address: string;
  year: number;
  image: FeaturePropertyImage;
}

interface FeaturePropertyImage {
  url: string;
  alt: string;
  title: string;
}

interface GeometryMultiLineString extends MultiLineString {
  type: 'MultiLineString';
  coordinates: Position[][];
}

export interface GeoJSONFeature extends Feature {
  type: 'Feature';
  geometry: GeometryMultiLineString;
  properties: FeatureProperty;
}

export interface IMapLayers extends FeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export default function MapLayers() {
  const {featureCollection} = useFetchMapDetails();

  return (
    <Source
      id='earthquakes'
      type='geojson'
      data={featureCollection}
      cluster
      clusterMaxZoom={9}
      clusterRadius={50}>
      <Layer {...clusterLayer} />
      <Layer {...clusterCountLayer} />
      <Layer {...unclutteredPointLayer} />
    </Source>
  );
}
