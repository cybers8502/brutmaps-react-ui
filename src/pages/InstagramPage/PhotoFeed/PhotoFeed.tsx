import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import useFetchInstagramGallery, {type PhotoPost} from '~/hooks/fetchApi/useFetchInstagramGallery.tsx';
import {useInfiniteScroll} from '~/pages/InstagramPage/PhotoFeed/useInfiniteScroll.ts';
import PhotoItem from '~/pages/InstagramPage/PhotoItem/PhotoItem.tsx';
import styles from './PhotoFeed.module.scss';

export default function PhotoFeed() {
  const {t} = useTranslation();
  const [page, setPage] = useState(1);
  const [postList, setPostList] = useState<PhotoPost[]>([]);
  const {posts, current_page, total_pages, isLoading, isError} = useFetchInstagramGallery(page, 20);
  const loaderRef = useInfiniteScroll(() => {
    setPage((prevState) => prevState + 1);
  }, !isLoading);

  useEffect(() => {
    setPostList((prevState) => {
      if (!isLoading && posts) {
        return [...prevState, ...posts];
      }
      return prevState;
    });
  }, [posts]);

  return (
    <div className={styles.feed}>
      {postList?.map((post) => (
        <PhotoItem key={post.postId} {...post} />
      ))}

      {isLoading && <p>{t('common.loading')}</p>}
      {isError && <p>{t('common.error')}</p>}

      {current_page !== total_pages && <div ref={loaderRef} style={{height: 1}} />}
    </div>
  );
}
