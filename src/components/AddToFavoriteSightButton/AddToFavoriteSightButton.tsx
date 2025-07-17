import {useState} from 'react';
import {fetchWithToken, getAccessToken} from '~/util/auth.ts';
import Button from '~/components/Button/Button.tsx';
import {useFavorites} from '~/hooks/useFavoritesSights.ts';
import routes from '~/util/routes.ts';
import apiRoutes from '~/util/apiRoutes.ts';
import {invalidateMapData} from '~/util/mutateMapData.ts';

const CATEGORIES = [
  {key: 'favorite', label: 'Favorite'},
  {key: 'want_to_go', label: 'Want to Go'},
  {key: 'visited', label: 'Visited'},
  {key: 'hidden', label: 'Hidden'},
];

const toggleCategory = async (sightId: number, category: string) => {
  return await fetchWithToken(import.meta.env.VITE_SITE_URI + apiRoutes.userToggleFavorites, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({sight_id: sightId, category}),
  });
};

export default function AddToFavoriteSightButton({sightId}: {sightId: string}) {
  const {favorites, mutate} = useFavorites();
  const [processingCategory, setProcessingCategory] = useState<string | null>(null);

  const preferences = favorites?.data?.favorites || {};

  const isInCategory = (category: string): boolean => {
    return preferences?.[category]?.some((id: string) => Number(id) === Number(sightId));
  };

  const handleToggle = async (category: string) => {
    setProcessingCategory(category);
    try {
      await toggleCategory(Number(sightId), category);
      await mutate();
      invalidateMapData();
    } catch (error) {
      console.error(`Error toggling ${category}:`, error);
    } finally {
      setProcessingCategory(null);
    }
  };

  if (!getAccessToken()) {
    return <Button href={routes.login}>Login to save</Button>;
  }

  return (
    <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
      {CATEGORIES.map(({key, label}) => {
        const isActive = isInCategory(key);
        const isLoading = processingCategory === key;

        return (
          <Button
            key={key}
            onClick={() => handleToggle(key)}
            disabled={isLoading}
            variant={isActive ? 'fillRed' : 'strokeRed'}>
            {isLoading ? 'Processing...' : isActive ? `Remove ${label}` : `Add ${label}`}
          </Button>
        );
      })}
    </div>
  );
}
