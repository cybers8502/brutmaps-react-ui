import apiRoutes from '~/util/apiRoutes.ts';
import {useHandlerApi} from '~/hooks/useHandlerApi.ts';
import {ArchitectsResponse} from '~/hooks/fetchApi/useFetchArchitects.tsx';

type ResponseData = {
  status: string;
  data: ArchitectsResponse;
  message: string;
};

export default function useFetchArchitectBySlug(id: string) {
  const {data, isLoading, error} = useHandlerApi<ResponseData>(`${apiRoutes.architectByID}/${id}`, !!id);

  return {
    architect: data || null,
    isLoading: isLoading,
    isError: error,
  };
}
