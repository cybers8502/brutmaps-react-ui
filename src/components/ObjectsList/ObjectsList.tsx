import {type SightListItem, type SightsListSortBy, useSightsCount, useSightsList} from '@brutmaps/api';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useSearchParams} from 'react-router-dom';
import PageTitle from '~/components/PageTitle/PageTitle.tsx';
import {useSetPageLoading} from '~/context/PageLoadingContext.tsx';
import {useInfiniteScroll} from '~/hooks/useInfiniteScroll.ts';
import ObjectItem from './ObjectItem/ObjectItem.tsx';
import ObjectsFilters from './ObjectsFilters/ObjectsFilters.tsx';
import styles from './ObjectsList.module.scss';

const PER_PAGE = 24;

export default function ObjectsList() {
  const {t} = useTranslation();
  const [searchParams] = useSearchParams();

  const country = searchParams.get('country') || '';
  const architect = searchParams.get('architect') || '';
  const sortBy: SightsListSortBy = searchParams.get('sort') === 'oldest' ? 'oldest' : 'recent';

  const [page, setPage] = useState(1);
  const [items, setItems] = useState<SightListItem[]>([]);

  useEffect(() => {
    setPage(1);
  }, [country, architect, sortBy]);

  const {result, isLoading, error} = useSightsList({
    countries: country ? [country] : undefined,
    architects: architect ? [architect] : undefined,
    sortBy,
    page,
    perPage: PER_PAGE,
  });

  const {count: totalCount} = useSightsCount();

  useEffect(() => {
    if (!result) return;
    setItems((prev) => (page === 1 ? result.items : [...prev, ...result.items]));
  }, [result, page]);

  useSetPageLoading(isLoading && page === 1);

  const hasMore = Boolean(result && result.currentPage < result.totalPages);
  const loaderRef = useInfiniteScroll(() => {
    setPage((prev) => prev + 1);
  }, hasMore && !isLoading);

  return (
    <>
      <div className={styles.pageHeader}>
        <PageTitle>{t('objects.title')}</PageTitle>
        <ObjectsFilters />
      </div>

      <p className={styles.count}>
        {t('objects.count', {shown: result?.totalItems ?? 0, total: totalCount ?? 0})}
      </p>

      {error && <p>{t('common.serverError')}</p>}

      {!error && items.length > 0 && (
        <div className={styles.grid}>
          {items.map((item) => (
            <ObjectItem key={item.id} {...item} />
          ))}
        </div>
      )}

      {!isLoading && !error && items.length === 0 && <p>{t('objects.noResults')}</p>}

      {isLoading && page > 1 && <p>{t('common.loading')}</p>}

      {hasMore && <div ref={loaderRef} style={{height: 1}} />}
    </>
  );
}
