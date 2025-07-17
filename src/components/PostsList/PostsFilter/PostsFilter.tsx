import CategoryFilter from '~/components/PostsList/PostsFilter/CategoryFilter/CategoryFilter.tsx';
import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import styles from './PostsFilter.module.scss';

export default function PostsFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCat, setSelectedCat] = useState(searchParams.get('cat')?.toLowerCase() || '');

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (selectedCat) {
      params.set('cat', selectedCat);
    } else {
      params.delete('cat');
    }

    setSearchParams(params, {replace: false});
  }, [selectedCat]);

  return (
    <div className={styles.section}>
      <CategoryFilter selectedCat={selectedCat} setSelectedCat={setSelectedCat} className={''} />
    </div>
  );
}
