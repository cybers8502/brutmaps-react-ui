import {useHandlerApi} from '~/hooks/useHandlerApi.ts';
import apiRoutes from '~/util/apiRoutes.ts';

interface ImageAuthor {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  full_name: string;
  instagram: string;
  figcaption: string;
  link: string;
}

export interface PhotoPost {
  post_id: string;
  title: string;
  link: string;
  preview_image_url: string;
  first_gallery_image_url: string;
  author: ImageAuthor;
}

interface PostsData {
  seed: string;
  current_page: string;
  total_pages: string;
  total_posts: string;
  posts: PhotoPost[];
}

interface ResponseData {
  status: string;
  data: PostsData;
}

const SEED = 'abc123';

function useFetchPosts(page: number, pageSize: number = 20) {
  const query = new URLSearchParams({
    page: encodeURIComponent(page),
    per_page: encodeURIComponent(pageSize),
    seed: encodeURIComponent(SEED),
  }).toString();

  const {data, isLoading, error} = useHandlerApi<ResponseData>(
    `${apiRoutes.instagramGalleryList}?${query}`,
    true,
    {
      dedupingInterval: 5000,
    },
  );

  return {
    posts: data?.data.posts || null,
    current_page: data?.data.current_page || 0,
    total_pages: data?.data.total_pages || 0,
    isLoading,
    isError: !!error,
  };
}

export default useFetchPosts;
