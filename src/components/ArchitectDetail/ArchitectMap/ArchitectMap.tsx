import type {SightsFeatureCollection} from '@brutmaps/api';
import 'mapbox-gl/dist/mapbox-gl.css';
import {useRef} from 'react';
import type {MapRef} from 'react-map-gl/mapbox';
import {Map, Marker, NavigationControl} from 'react-map-gl/mapbox';
import {mapboxToken} from '~/configs/map.configs.ts';
import styles from './ArchitectMap.module.scss';

interface ArchitectMapProps {
  featureCollection: SightsFeatureCollection | null;
}

export default function ArchitectMap({featureCollection}: ArchitectMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const features = featureCollection?.features ?? [];

  if (!featureCollection || features.length === 0) return null;

  const lngs = features.map((feature) => feature.geometry.coordinates[0]);
  const lats = features.map((feature) => feature.geometry.coordinates[1]);
  const [firstLng, firstLat] = features[0].geometry.coordinates;

  const handleLoad = () => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    if (features.length === 1) {
      map.easeTo({center: [firstLng, firstLat], zoom: 11, duration: 0});
      return;
    }

    map.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      {padding: 48, maxZoom: 14, duration: 0},
    );
  };

  return (
    <Map
      key={features.length}
      ref={mapRef}
      onLoad={handleLoad}
      initialViewState={{longitude: firstLng, latitude: firstLat, zoom: 1}}
      mapStyle='mapbox://styles/mapbox/dark-v10'
      mapboxAccessToken={mapboxToken}>
      <NavigationControl position='bottom-right' showCompass={false} />
      {features.map((feature) => (
        <Marker
          key={feature.id}
          latitude={feature.geometry.coordinates[1]}
          longitude={feature.geometry.coordinates[0]}>
          <span className={styles.pin} />
        </Marker>
      ))}
    </Map>
  );
}
