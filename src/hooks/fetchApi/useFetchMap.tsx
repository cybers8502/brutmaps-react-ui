import {IMapLayers} from '../../components/MapLayers/MapLayers.tsx';
import apiRoutes from '~/util/apiRoutes.ts';
import {useHandlerApi} from '~/hooks/useHandlerApi.ts';
import {useSearchParams} from 'react-router-dom';

interface CommonMap {
  featureCollection: IMapLayers;
}

interface ResponseData {
  status: string;
  data?: CommonMap;
  message?: string;
}

const keyPrefix = 'map_data';

export default function useFetchMapDetails() {
  const [searchParams] = useSearchParams();

  const architectId = searchParams.get('architect');
  const typeId = searchParams.get('type');

  const {data, isLoading, error, mutate} = useHandlerApi<ResponseData>(
    `${apiRoutes.objectsPost}?architects[]=${architectId || ''}&taxonomy_terms[]=${typeId || ''}`,
    true,
    {
      keyPrefix,
    },
  );

  return {
    featureCollection: data?.data?.featureCollection,
    isLoading: isLoading,
    isError: error,
    mutate,
  };
}
