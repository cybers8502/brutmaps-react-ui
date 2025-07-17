import Product from '~/components/ProductsList/Product.interface.ts';
import {useHandlerApi} from '~/hooks/useHandlerApi.ts';
import apiRoutes from '~/util/apiRoutes.ts';

interface ResponseData {
  status: string;
  data: Product[];
}

export default function useFetchProducts() {
  const {data, isLoading, error} = useHandlerApi<ResponseData>(apiRoutes.shopProductsList, true, {
    revalidateOnFocus: true,
    dedupingInterval: 5000,
  });

  return {
    products: data || null,
    isLoading: isLoading,
    isError: !!error,
  };
}
