import {usePosts} from '@brutmaps/api';
import {useTranslation} from 'react-i18next';
import PageContentLoader from '~/components/PageContentLoader/PageContentLoader.tsx';
import PageTitle from '~/components/PageTitle/PageTitle.tsx';
import PostsFilter from '~/components/PostsList/PostsFilter/PostsFilter.tsx';
import useSightSearchParams from '~/hooks/useSightSearchParams.ts';
import PostItemPreview from './PostItemPreview/PostItemPreview.tsx';
import styles from './PostsList.module.scss';

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

      {isLoading && <PageContentLoader />}

      {!isLoading && (
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
