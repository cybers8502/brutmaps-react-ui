import {useHandlerApi} from '~/hooks/useHandlerApi.ts';
import apiRoutes from '~/util/apiRoutes.ts';

interface ResponseData {
  status: string;
  data: Record<string, string>;
}

function useFetchUserCountries() {
  const {data, isLoading, error} = useHandlerApi<ResponseData>(apiRoutes.userAvailableCountries, true);

  return {
    data: data?.data ?? {},
    isLoading: isLoading,
    isError: !!error,
  };
}

export default useFetchUserCountries;
