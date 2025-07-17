import apiRoutes from '~/util/apiRoutes.ts';
import {useHandlerApi} from '~/hooks/useHandlerApi.ts';
import {ArchitectsResponse} from '~/hooks/fetchApi/useFetchArchitects.tsx';

type ResponseData = {
  status: string;
  data: ArchitectsResponse[];
  message: string;
};

export default function useFetchPopularArchitects() {
  const {data, isLoading, error} = useHandlerApi<ResponseData>(apiRoutes.popularArchitects, true);

  return {
    architects: data || null,
    isLoading: isLoading,
    isError: error,
  };
}
