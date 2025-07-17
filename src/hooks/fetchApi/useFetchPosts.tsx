import {Post} from '~/components/PostsList/Post.interface.ts';
import {useHandlerApi} from '~/hooks/useHandlerApi.ts';
import apiRoutes from '~/util/apiRoutes.ts';

interface PostsData {
  posts: Post[];
}

interface ResponseData {
  status: string;
  data: PostsData;
}

function useFetchPosts(category: string | string[] | null) {
  const categoryArray = Array.isArray(category) ? category : category ? [category] : [];
  const query = new URLSearchParams({
    cat: encodeURIComponent(JSON.stringify(categoryArray)),
  }).toString();

  const {data, isLoading, error} = useHandlerApi<ResponseData>(`${apiRoutes.blogPost}?${query}`, true, {
    revalidateOnFocus: true,
    dedupingInterval: 5000,
  });

  return {
    posts: data || null,
    isLoading,
    isError: !!error,
  };
}

export default useFetchPosts;
