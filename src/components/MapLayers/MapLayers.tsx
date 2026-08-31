import {Source, Layer} from 'react-map-gl';
import {clusterLayer, clusterCountLayer, unclutteredPointLayer} from './layers.ts';
import useFetchMapDetails from '~/hooks/fetchApi/useFetchMap.tsx';
import type {SightFeature, SightsFeatureCollection} from '@brutmaps/api';

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
