import {GeoJSONFeature} from '~/components/MapLayers/MapLayers.tsx';

export const getVisibleObjectsOnMap = (map: mapboxgl.Map | undefined, layerId: string): GeoJSONFeature[] => {
  if (!map) return [];

  const features = map.queryRenderedFeatures({layers: [layerId]});

  const uniqueFeaturesMap = new Map<number, GeoJSONFeature>();

  features.forEach((feature) => {
    const featureId = feature?.properties?.id;

    if (!uniqueFeaturesMap.has(featureId)) {
      uniqueFeaturesMap.set(featureId, feature);
    }
  });

  return Array.from(uniqueFeaturesMap.values());
};
