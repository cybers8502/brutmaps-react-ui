import classNames from 'classnames';
import {type RefObject, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import type {MapRef} from 'react-map-gl/mapbox';
import {useSearchParams} from 'react-router-dom';
import Button from '~/components/Button/Button.tsx';
import GeocoderControl from '~/components/GeocoderControl/GeocoderControl.tsx';
import {CancelIcon, FilterIcon} from '~/components/Icons/Icons.tsx';
import ArchitectsFilter from '~/components/MapFilters/ArchitectsFilter/ArchitectsFilter.tsx';
import ArchitectureStylesFilter from '~/components/MapFilters/ArchitectureStylesFilter/ArchitectureStylesFilter.tsx';
import {mapboxToken} from '~/configs/map.configs.ts';
import useMobileState from '~/hooks/useMobileState.ts';
import styles from './MapFilters.module.scss';

interface MapFiltersProps {
  mapRef: RefObject<MapRef | null>;
}

export default function MapFilters({mapRef}: MapFiltersProps) {
  const {t} = useTranslation();
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
        placeholder={t('map.searchLocation')}
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
