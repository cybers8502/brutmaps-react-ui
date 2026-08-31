import {usePosts} from '@brutmaps/api';
import PostItemPreview from './PostItemPreview/PostItemPreview.tsx';
import styles from './PostsList.module.scss';
import useSightSearchParams from '~/hooks/useSightSearchParams.ts';
import PostsFilter from '~/components/PostsList/PostsFilter/PostsFilter.tsx';
import PageTitle from '~/components/PageTitle/PageTitle.tsx';
import {useTranslation} from 'react-i18next';

export default function PostsList() {
  const {t} = useTranslation();
  const category = useSightSearchParams('cat');

  const {result, isLoading, error} = usePosts({categories: category ? [category] : []});
  const articles = result?.posts || [];

  return (
    <>
      <div className={styles.pageHeader}>
        <PageTitle>{t('nav.blog')}</PageTitle>
        <PostsFilter />
      </div>

      {isLoading ? (
        <p>{t('common.loading')}</p>
      ) : (
        <>
          {error && <p>{t('blog.errorLoadingPosts')}</p>}

          {articles.length > 0 ? (
            <div className={styles['posts-list']}>
              {articles.map((post) => (
                <PostItemPreview {...post} key={post.id} />
              ))}
            </div>
          ) : (
            <p>{t('blog.noPostsTryAnotherCategory')}</p>
          )}
        </>
      )}
    </>
  );
}
