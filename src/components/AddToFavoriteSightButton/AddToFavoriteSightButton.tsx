import {useState} from 'react';
import {getAccessToken} from '~/util/auth.ts';
import Button from '~/components/Button/Button.tsx';
import {useFavorites, useToggleFavorite, type FavoriteCategory, type Favorites} from '@brutmaps/api';
import routes from '~/util/routes.ts';
import {invalidateMapData} from '~/util/mutateMapData.ts';
import {useTranslation} from 'react-i18next';

const useCategories = () => {
  const {t} = useTranslation();

  return [
    {key: 'favorite' as FavoriteCategory, field: 'favorite' as const, label: t('favorites.categoryFavorite')},
    {key: 'want_to_go' as FavoriteCategory, field: 'wantToGo' as const, label: t('favorites.categoryWantToGo')},
    {key: 'visited' as FavoriteCategory, field: 'visited' as const, label: t('favorites.categoryVisited')},
    {key: 'hidden' as FavoriteCategory, field: 'hidden' as const, label: t('favorites.categoryHidden')},
  ];
};

export default function AddToFavoriteSightButton({sightId}: {sightId: string}) {
  const {t} = useTranslation();
  const CATEGORIES = useCategories();
  const {favorites, refetch} = useFavorites();
  const {toggleFavorite} = useToggleFavorite();
  const [processingCategory, setProcessingCategory] = useState<FavoriteCategory | null>(null);

  const isInCategory = (field: keyof Favorites): boolean => {
    return favorites[field]?.some((id) => id === Number(sightId));
  };

  const handleToggle = async (category: FavoriteCategory) => {
    setProcessingCategory(category);
    try {
      await toggleFavorite(Number(sightId), category);
      await refetch();
      invalidateMapData();
    } catch (error) {
      console.error(`Error toggling ${category}:`, error);
    } finally {
      setProcessingCategory(null);
    }
  };

  if (!getAccessToken()) {
    return <Button href={routes.login}>{t('auth.loginToSave')}</Button>;
  }

  return (
    <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
      {CATEGORIES.map(({key, field, label}) => {
        const isActive = isInCategory(field);
        const isLoading = processingCategory === key;

        return (
          <Button
            key={key}
            onClick={() => handleToggle(key)}
            disabled={isLoading}
            variant={isActive ? 'fillRed' : 'strokeRed'}>
            {isLoading
              ? t('favorites.processing')
              : isActive
                ? t('favorites.remove', {label})
                : t('favorites.add', {label})}
          </Button>
        );
      })}
    </div>
  );
}
