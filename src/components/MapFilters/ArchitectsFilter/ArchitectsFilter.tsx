import {type Architect, useArchitect, usePopularArchitects, useSearchArchitects} from '@brutmaps/api';
import classNames from 'classnames';
import {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import CancelButton from '~/components/CancelButton/CancelButton.tsx';
import useDebounce from '~/hooks/useDebounce.ts';
import styles from './ArchitectsFilter.module.scss';

interface ArchitectsFilterProps {
  className: string;
  selectedArchitect: string;
  setSelectedArchitect: (architect: string) => void;
}

export default function ArchitectsFilter({
  className,
  selectedArchitect,
  setSelectedArchitect,
}: ArchitectsFilterProps) {
  const {t} = useTranslation();
  const [isPopupShown, setIsPopupShown] = useState(false);
  const [search, setSearch] = useState('');
  const [architectName, setArchitectName] = useState('');

  const debouncedSearch = useDebounce(search, 400);
  const isSearching = debouncedSearch.trim().length >= 2;

  const {architects: searchResults, isLoading: loadingSearch} = useSearchArchitects(
    debouncedSearch,
    isSearching,
  );
  const {architects: popularArchitects, isLoading: loadingPopular} = usePopularArchitects();
  const {architect: preselectedArchitect} = useArchitect(selectedArchitect);

  useEffect(() => {
    setArchitectName(preselectedArchitect?.fullName || '');
  }, [preselectedArchitect]);

  const architectOptions = useMemo(() => {
    return isSearching ? searchResults : popularArchitects;
  }, [isSearching, searchResults, popularArchitects]);

  const handleLink = (architect: Architect) => {
    setIsPopupShown(false);
    setSelectedArchitect(String(architect.id));
  };

  const handleCancel = () => {
    setSelectedArchitect('');
  };

  return (
    <div className={classNames(className, styles.wrap)}>
      <button className={styles.button} onClick={() => setIsPopupShown(!isPopupShown)}>
        <span>{architectName ? architectName : t('map.allArchitects')}</span>
      </button>

      {selectedArchitect && <CancelButton onCancel={handleCancel} />}

      {isPopupShown && (
        <>
          <div className={styles.overlay} onClick={() => setIsPopupShown(false)}></div>
          <div className={styles.popup}>
            <div className={styles.searchWrapper}>
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('map.search')}
                className={styles.searchInput}
              />
              {search && <CancelButton onCancel={() => setSearch('')} />}
            </div>

            {search?.length >= 2 ? (
              <div className={styles.list}>
                <p>{t('map.searchResult')}</p>
                {loadingSearch ? (
                  <p>{t('common.loading')}</p>
                ) : architectOptions?.length ? (
                  <div className={styles.grid}>
                    {architectOptions?.map((a) => (
                      <button key={a.id} className={styles.item} onClick={() => handleLink(a)}>
                        <picture>
                          <img src={a.image?.url} alt={a.image?.alt || a.fullName} />
                        </picture>
                        {a.fullName}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p>{t('map.nothingFound')}</p>
                )}
              </div>
            ) : (
              <div className={styles.list}>
                <p>{t('map.mostPopularSearches')}</p>
                {loadingPopular ? (
                  <p>{t('common.loading')}</p>
                ) : (
                  <div className={styles.grid}>
                    {popularArchitects.map((a) => (
                      <button key={a.id} className={styles.item} onClick={() => handleLink(a)}>
                        <picture>
                          <img src={a.image?.url} alt={a.image?.alt || a.fullName} />
                        </picture>
                        {a.fullName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
