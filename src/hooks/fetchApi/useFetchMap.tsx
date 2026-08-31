import {useSightsMap} from '@brutmaps/api';
import {useSearchParams} from 'react-router-dom';

export default function useFetchMapDetails() {
  const [searchParams] = useSearchParams();

  const architectId = searchParams.get('architect');
  const typeId = searchParams.get('type');

  const {featureCollection, isLoading, error} = useSightsMap({
    architects: architectId ? [architectId] : undefined,
    taxonomyTerms: typeId ? [typeId] : undefined,
  });

  return {
    featureCollection,
    isLoading,
    isError: error,
  };
}
