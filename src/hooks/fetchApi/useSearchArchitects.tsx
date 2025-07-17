import apiRoutes from '~/util/apiRoutes.ts';
import {useHandlerApi} from '~/hooks/useHandlerApi.ts';
import {ArchitectsResponse} from '~/hooks/fetchApi/useFetchArchitects.tsx';

type ResponseData = {
  status: string;
  data: ArchitectsResponse[];
  message: string;
};

export default function useSearchArchitects(query: string) {
  const shouldFetch = query.trim().length >= 2;
  const {data, isLoading, error} = useHandlerApi<ResponseData>(
    `${apiRoutes.architectsSearch}?query=${query}`,
    shouldFetch,
  );

  return {
    architects: data || null,
    isLoading,
    isError: error,
  };
}
