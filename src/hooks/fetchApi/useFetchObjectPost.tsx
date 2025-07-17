import apiRoutes from '~/util/apiRoutes.ts';
import {useHandlerApi} from '~/hooks/useHandlerApi.ts';

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

export interface ImageItem {
  id: number;
  url: string;
  title: string;
  alt: string;
  source: string;
  author: ImageAuthor;
}

interface Architect {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  description: string;
  image: ImageAuthor;
}

interface Coordinates {
  lat: string;
  long: string;
}

export interface ObjectPost {
  id: number;
  slug: string;
  title: string;
  address: string;
  coordinates: Coordinates;
  description: string;
  gallery: ImageItem[];
  topGallery: ImageItem[];
}

type ResponseData = {
  status: string;
  data: ObjectPost;
  message: string;
};

export default function useFetchObjectPost(sightSlug: string) {
  const {data, isLoading, error} = useHandlerApi<ResponseData>(`${apiRoutes.objectsPost}/${sightSlug}`, true);

  return {
    sightDetails: data || null,
    isLoading: isLoading,
    isError: error,
  };
}
