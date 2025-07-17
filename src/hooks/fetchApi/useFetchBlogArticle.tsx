import {useHandlerApi} from '~/hooks/useHandlerApi.ts';
import apiRoutes from '~/util/apiRoutes.ts';
import {ImageItem} from '~/hooks/fetchApi/useFetchObjectPost.tsx';

interface Banner {
  'data-banner': string;
  html: string;
  content: string;
}

interface ArticleData {
  id: number;
  title: string;
  content: string;
  banners: Banner[];
  excerpt: string;
  date: string;
  author: string;
  thumbnail: string;
  permalink: string;
  gallery: ImageItem[];
}

interface ResponseData {
  status: string;
  data?: ArticleData;
  message?: string;
}

function useBlogArticle(articleId: string) {
  const {data, isLoading, error} = useHandlerApi<ResponseData>(`${apiRoutes.blogPost}/${articleId}`, true);

  return {
    article: data || null,
    isLoading: isLoading,
    isError: !!error,
  };
}

export default useBlogArticle;
