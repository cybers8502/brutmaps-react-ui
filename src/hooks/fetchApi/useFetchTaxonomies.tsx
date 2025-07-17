import apiRoutes from '~/util/apiRoutes.ts';
import {useHandlerApi} from '~/hooks/useHandlerApi.ts';

type ResponseData<T> = {
  status: string;
  data: T;
  message: string;
};

export default function useFetchTaxonomies<T>(query: string) {
  const {data, isLoading, error} = useHandlerApi<ResponseData<T>>(
    `${apiRoutes.architectsStyles}?taxonomy=${query}`,
    true,
  );

  return {
    taxonomies: data?.data || null,
    isLoading,
    isError: error,
  };
}
