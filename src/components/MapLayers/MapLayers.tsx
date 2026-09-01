import type {SightFeature, SightsFeatureCollection} from '@brutmaps/api';
import {Layer, Source} from 'react-map-gl';
import useFetchMapDetails from '~/hooks/fetchApi/useFetchMap.tsx';
import {clusterCountLayer, clusterLayer, unclutteredPointLayer} from './layers.ts';

export type GeoJSONFeature = SightFeature;
export type IMapLayers = SightsFeatureCollection;

export default function MapLayers() {
  const {featureCollection} = useFetchMapDetails();

  return (
    <Source
      id='earthquakes'
      type='geojson'
      data={featureCollection ?? undefined}
      cluster
      clusterMaxZoom={9}
      clusterRadius={50}>
      <Layer {...clusterLayer} />
      <Layer {...clusterCountLayer} />
      <Layer {...unclutteredPointLayer} />
    </Source>
  );
}
