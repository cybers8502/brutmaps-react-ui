import {type Architect, useArchitects, useSearchArchitects} from '@brutmaps/api';
import classNames from 'classnames';
import {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import ArchitectItem from '~/components/ArchitectsList/ArchitectItem/ArchitectItem.tsx';
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs.tsx';
import CancelButton from '~/components/CancelButton/CancelButton.tsx';
import {SearchIcon} from '~/components/Icons/Icons.tsx';
import PageContentLoader from '~/components/PageContentLoader/PageContentLoader.tsx';
import PageTitle from '~/components/PageTitle/PageTitle.tsx';
import useDebounce from '~/hooks/useDebounce.ts';
import {useInfiniteScroll} from '~/hooks/useInfiniteScroll.ts';
import routes from '~/util/routes.ts';
import styles from './ArchitectsList.module.scss';

type SortBy = 'count' | 'name';

const PER_PAGE = 24;

function sortArchitects(architects: Architect[], sortBy: SortBy): Architect[] {
  return [...architects].sort((a, b) =>
    sortBy === 'name' ? a.fullName.localeCompare(b.fullName) : b.count - a.count,
  );
}

export default function ArchitectsList() {
  const {t} = useTranslation();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('count');
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);

  const debouncedSearch = useDebounce(search, 400);
  const isSearching = debouncedSearch.trim().length >= 2;

  const {architects, isLoading, error} = useArchitects();
  const {architects: searchResults, isLoading: isSearchLoading} = useSearchArchitects(
    debouncedSearch,
    isSearching,
  );

  useEffect(() => {
    setVisibleCount(PER_PAGE);
  }, [isSearching, debouncedSearch, sortBy]);

  const loading = isSearching ? isSearchLoading : isLoading;
  const sortedItems = useMemo(
    () => sortArchitects(isSearching ? searchResults : architects, sortBy),
    [isSearching, searchResults, architects, sortBy],
  );

  const items = sortedItems.slice(0, visibleCount);
  const hasMore = visibleCount < sortedItems.length;
  const loaderRef = useInfiniteScroll(() => {
    setVisibleCount((prev) => prev + PER_PAGE);
  }, hasMore && !loading);

  const breadcrumbItems = [{name: t('common.home'), path: routes.commonMap}, {name: t('nav.architects')}];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

      <div className={styles.pageHeader}>
        <PageTitle>{t('architects.title')}</PageTitle>
      </div>

      <p className={styles.count}>{t('architects.count', {total: architects.length})}</p>

      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <SearchIcon size={18} />
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('architects.searchPlaceholder')}
            className={styles.searchInput}
          />
          {search && <CancelButton className={styles.searchCancel} onCancel={() => setSearch('')} />}
        </div>

        <div className={styles.sortToggle}>
          <button
            type='button'
            className={classNames({[styles.active]: sortBy === 'count'})}
            onClick={() => setSortBy('count')}>
            {t('architects.sortByCount')}
          </button>
          <button
            type='button'
            className={classNames({[styles.active]: sortBy === 'name'})}
            onClick={() => setSortBy('name')}>
            {t('architects.sortByName')}
          </button>
        </div>
      </div>

      {error && <p>{t('common.serverError')}</p>}

      {loading && items.length === 0 && <PageContentLoader />}

      {!error && items.length > 0 && (
        <div className={styles.grid}>
          {items.map((architect) => (
            <ArchitectItem key={architect.id} architect={architect} />
          ))}
        </div>
      )}

      {!loading && !error && items.length === 0 && <p>{t('architects.noResults')}</p>}

      {hasMore && <div ref={loaderRef} style={{height: 1}} />}
    </>
  );
}
