import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import classNames from 'classnames';
import {type RefObject, useEffect, useRef, useState} from 'react';
import type {MapRef} from 'react-map-gl';
import CancelButton from '~/components/CancelButton/CancelButton.tsx';
import {ArrowLeftIcon} from '../Icons/Icons.tsx';
import styles from './GeocoderControl.module.scss';

interface GeocoderControlResult {
  bbox?: [number, number, number, number];
  center?: [number, number];
  place_type?: string[];
}

interface GeocoderControlProps {
  className?: string;
  accessToken: string;
  mapRef?: RefObject<MapRef>;
  placeholder?: string;
  withButton?: boolean;
  onResult?: (result: GeocoderControlResult) => void;
}

export default function GeocoderControl({
  accessToken,
  mapRef,
  placeholder = 'Type address / location',
  onResult,
  className,
  withButton = false,
}: GeocoderControlProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [geocoderInstance, setGeocoderInstance] = useState<MapboxGeocoder | null>(null);
  const [hasValue, setHasValue] = useState(false);

  const handleCancel = () => {
    if (geocoderInstance) {
      geocoderInstance.clear();
      setHasValue(false);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const map = mapRef?.current?.getMap();

    const geocoder = new MapboxGeocoder({
      accessToken,
      // mapboxgl: mapRef ? map : undefined,
      placeholder,
    });

    if ('appendChild' in containerRef.current) {
      containerRef.current.appendChild(geocoder.onAdd(map));
    }
    setGeocoderInstance(geocoder);

    // Слухаємо input подію
    geocoder.on('results', () => {
      const inputEl = containerRef.current?.querySelector('input');
      if (inputEl) {
        setHasValue(inputEl.value.length > 0);
      }
    });

    geocoder.on('clear', () => {
      setHasValue(false);
    });

    geocoder.on('result', handlerResultState);

    return () => {
      geocoder.off('result', handlerResultState);
      if (containerRef.current && 'appendChild' in containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [mapRef, containerRef]);

  const handlerResultState = (e: {result: GeocoderControlResult}) => {
    const {result} = e;

    if (mapRef?.current) {
      const map = mapRef.current.getMap();

      if (result.bbox) {
        // Якщо є bounding box → масштабуємо під нього
        map.fitBounds(result.bbox, {
          padding: 40,
          duration: 1000,
        });
      } else if (result.center) {
        // Додатково перевіряємо тип місця
        const placeType = result.place_type?.[0] || '';

        let zoomLevel = 12;

        if (placeType === 'country') {
          zoomLevel = 4;
        } else if (placeType === 'region') {
          zoomLevel = 6;
        } else if (placeType === 'place') {
          zoomLevel = 10;
        }

        map.easeTo({
          center: result.center,
          zoom: zoomLevel,
          duration: 500,
        });
      }
    }

    if (onResult) onResult(result);
  };

  return (
    <div className={classNames(styles.geocoder, className)}>
      {withButton && (
        <button className={styles.button}>
          <ArrowLeftIcon />
        </button>
      )}
      <div ref={containerRef}></div>

      {hasValue && <CancelButton onCancel={handleCancel} />}
    </div>
  );
}
