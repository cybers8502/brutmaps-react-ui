import apiRoutes from '~/util/apiRoutes.ts';
import {useHandlerApi} from '~/hooks/useHandlerApi.ts';

type ArchitectsPicture = {
  url: string;
  name: string;
};

export type ArchitectsResponse = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  image: ArchitectsPicture;
  sights_count: string;
};

type ResponseData = {
  status: string;
  data: ArchitectsResponse[];
  message: string;
};

export default function useFetchArchitects() {
  const {data, isLoading, error} = useHandlerApi<ResponseData>(apiRoutes.architectsList, true);

  return {
    architects: data || null,
    isLoading: isLoading,
    isError: error,
  };
}
