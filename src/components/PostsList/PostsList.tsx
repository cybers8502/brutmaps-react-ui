import useFetchPosts from '~/hooks/fetchApi/useFetchPosts.tsx';
import PostItemPreview from './PostItemPreview/PostItemPreview.tsx';
import styles from './PostsList.module.scss';
import useSightSearchParams from '~/hooks/useSightSearchParams.ts';
import PostsFilter from '~/components/PostsList/PostsFilter/PostsFilter.tsx';
import PageTitle from '~/components/PageTitle/PageTitle.tsx';

export default function PostsList() {
  const query = useSightSearchParams('cat');

  const {posts, isLoading, isError} = useFetchPosts(query);
  const articles = posts?.data?.posts || [];

  return (
    <>
      <div className={styles.pageHeader}>
        <PageTitle>Blog</PageTitle>
        <PostsFilter />
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {isError && <p>Error loading posts</p>}

          {articles.length > 0 ? (
            <div className={styles['posts-list']}>
              {articles.map((post) => (
                <PostItemPreview {...post} key={post.id} />
              ))}
            </div>
          ) : (
            <p>No posts, try another category</p>
          )}
        </>
      )}
    </>
  );
}
