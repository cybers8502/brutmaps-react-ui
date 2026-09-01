import type {SightsListSortBy} from '@brutmaps/api';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useSearchParams} from 'react-router-dom';
import ArchitectsFilter from '~/components/MapFilters/ArchitectsFilter/ArchitectsFilter.tsx';
import CountryFilter from './CountryFilter/CountryFilter.tsx';
import styles from './ObjectsFilters.module.scss';

export default function ObjectsFilters() {
  const {t} = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || '');
  const [selectedArchitect, setSelectedArchitect] = useState(searchParams.get('architect') || '');
  const [sortBy, setSortBy] = useState<SightsListSortBy>(
    searchParams.get('sort') === 'oldest' ? 'oldest' : 'recent',
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (selectedCountry) {
      params.set('country', selectedCountry);
    } else {
      params.delete('country');
    }

    if (selectedArchitect) {
      params.set('architect', selectedArchitect);
    } else {
      params.delete('architect');
    }

    if (sortBy !== 'recent') {
      params.set('sort', sortBy);
    } else {
      params.delete('sort');
    }

    setSearchParams(params, {replace: false});
  }, [selectedCountry, selectedArchitect, sortBy]);

  return (
    <div className={styles.filters}>
      <CountryFilter
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        className={styles.select}
      />

      <ArchitectsFilter
        selectedArchitect={selectedArchitect}
        setSelectedArchitect={setSelectedArchitect}
        className={styles.filter}
      />

      <div className={styles.select}>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SightsListSortBy)}>
          <option value='recent'>{t('objects.sortRecent')}</option>
          <option value='oldest'>{t('objects.sortOldest')}</option>
        </select>
      </div>
    </div>
  );
}
