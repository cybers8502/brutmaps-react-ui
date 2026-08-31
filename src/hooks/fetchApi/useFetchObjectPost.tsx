import {useSight} from '@brutmaps/api';

export default function useFetchObjectPost(sightSlug: string) {
  const {sight, isLoading, error} = useSight(sightSlug || null);

  return {
    sight,
    isLoading,
    isError: error,
  };
}
