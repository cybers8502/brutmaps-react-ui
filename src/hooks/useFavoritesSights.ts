import useSWR from 'swr';
import {fetchWithToken} from '~/util/auth.ts';
import apiRoutes from '~/util/apiRoutes.ts';

const fetchFavorites = async (url: string) => {
  return await fetchWithToken(url);
};

export function useFavorites() {
  const {data, error, isLoading, mutate} = useSWR(
    import.meta.env.VITE_SITE_URI + apiRoutes.userFavorites,
    fetchFavorites,
  );

  return {
    favorites: data || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}
