import {RefObject, useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import styles from './MapFilters.module.scss';
import {mapboxToken} from '~/configs/map.configs.ts';
import GeocoderControl from '~/components/GeocoderControl/GeocoderControl.tsx';
import type {MapRef} from 'react-map-gl';
import ArchitectsFilter from '~/components/MapFilters/ArchitectsFilter/ArchitectsFilter.tsx';
import ArchitectureStylesFilter from '~/components/MapFilters/ArchitectureStylesFilter/ArchitectureStylesFilter.tsx';
import classNames from 'classnames';
import Button from '~/components/Button/Button.tsx';
import {CancelIcon, FilterIcon} from '~/components/Icons/Icons.tsx';
import useMobileState from '~/hooks/useMobileState.ts';

interface MapFiltersProps {
  mapRef: RefObject<MapRef>;
}

export default function MapFilters({mapRef}: MapFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobileView = useMobileState();

  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [selectedArchitect, setSelectedArchitect] = useState(searchParams.get('architect') || '');
  const [isShownMobilePopup, setIsShownMobilePopup] = useState(!isMobileView);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (selectedArchitect) {
      params.set('architect', selectedArchitect);
    } else {
      params.delete('architect');
    }

    if (selectedType) {
      params.set('type', selectedType);
    } else {
      params.delete('type');
    }

    setSearchParams(params, {replace: false});
  }, [selectedArchitect, selectedType]);

  useEffect(() => {
    setIsShownMobilePopup(!isMobileView);
  }, [isMobileView]);

  return (
    <div className={classNames(styles.component, {[styles.isOpen]: isShownMobilePopup})}>
      <GeocoderControl
        mapRef={mapRef}
        placeholder={'Search location'}
        accessToken={mapboxToken}
        className={styles.geoControl}
      />

      <Button
        variant={'fillRed'}
        className={classNames(styles.button, 'is-mobile')}
        onClick={() => setIsShownMobilePopup((prev) => !prev)}>
        {isShownMobilePopup ? <CancelIcon size={16} /> : <FilterIcon size={24} />}
      </Button>

      {isShownMobilePopup && (
        <div className={styles.mobileContainer}>
          <ArchitectureStylesFilter
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            className={styles.select}
          />

          <ArchitectsFilter
            selectedArchitect={selectedArchitect}
            setSelectedArchitect={setSelectedArchitect}
            className={styles.filter}
          />
        </div>
      )}
    </div>
  );
}
