import styles from './ArchitectsFilter.module.scss';
import useFetchPopularArchitects from '~/hooks/fetchApi/useFetchPopularArchitects.tsx';
import {useEffect, useMemo, useState} from 'react';
import useDebounce from '~/hooks/useDebounce.ts';
import useSearchArchitects from '~/hooks/fetchApi/useSearchArchitects.tsx';
import classNames from 'classnames';
import CancelButton from '~/components/CancelButton/CancelButton.tsx';
import useFetchArchitectBySlug from '~/hooks/fetchApi/useFetchArchitectBySlug.tsx';
import {ArchitectsResponse} from '~/hooks/fetchApi/useFetchArchitects.tsx';
import {useTranslation} from 'react-i18next';

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

  const {architects: searchResults, isLoading: loadingSearch} = useSearchArchitects(debouncedSearch);
  const {architects: popularArchitects, isLoading: loadingPopular} = useFetchPopularArchitects();
  const {architect: preselectedArchitect} = useFetchArchitectBySlug(selectedArchitect);

  useEffect(() => {
    setArchitectName(preselectedArchitect?.data?.full_name || '');
  }, [preselectedArchitect]);

  const architectOptions = useMemo(() => {
    if (search.trim().length >= 2) {
      return searchResults ? searchResults?.data : [];
    }
    return popularArchitects?.data || [];
  }, [search, searchResults, popularArchitects]);

  const handleLink = (architect: ArchitectsResponse) => {
    setIsPopupShown(false);
    setSelectedArchitect(architect.id);
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
                          <img src={a.image?.url} alt={a.image?.name} />
                        </picture>
                        {a.full_name}
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
                    {popularArchitects?.data.map((a) => (
                      <button key={a.id} className={styles.item} onClick={() => handleLink(a)}>
                        <picture>
                          <img src={a.image?.url} alt={a.image?.name} />
                        </picture>
                        {a.full_name}
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
