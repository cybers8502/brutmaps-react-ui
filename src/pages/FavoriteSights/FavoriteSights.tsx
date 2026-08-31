import styles from './FavoriteSights.module.scss';
import PageTitle from '~/components/PageTitle/PageTitle.tsx';
import {useFavorites} from '~/hooks/useFavoritesSights.ts';
import {Link} from 'react-router-dom';
import routes from '~/util/routes.ts';
import FavoriteSightItem from '~/pages/FavoriteSights/FavoriteSightItem/FavoriteSightItem.tsx';
import {fetchWithToken} from '~/util/auth.ts';
import SiteLayout from '~/layouts/SiteSimpleLayout/SiteLayout.tsx';
import apiRoutes from '~/util/apiRoutes.ts';
import {useTranslation} from 'react-i18next';

const toggleFavorite = async (sightId: number) => {
  return await fetchWithToken(import.meta.env.VITE_SITE_URI + apiRoutes.userToggleFavorites, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({sight_id: sightId}),
  });
};

export default function FavoriteSights() {
  const {t} = useTranslation();
  const {favorites, isLoading, mutate} = useFavorites();

  const removeFromFavorites = async (id: string) => {
    try {
      await toggleFavorite(Number(id));
      await mutate();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const objects = favorites?.data?.favorites;

  return (
    <SiteLayout>
      <div className={styles.container}>
        <div className={styles.frame}>
          <div className={styles.mainBlock}>
            <PageTitle>{t('siteHead.myFavoriteObjects')}</PageTitle>
            {isLoading ? (
              <p>{t('common.loading')}</p>
            ) : objects && objects?.length > 0 ? (
              <ul className={styles.list}>
                {objects.map((favorite: string) => (
                  <FavoriteSightItem key={favorite} id={favorite} removeFromFavorites={removeFromFavorites} />
                ))}
              </ul>
            ) : (
              <p>
                {t('favorites.emptyBefore')}{' '}
                <Link to={routes.commonMap}>{t('favorites.emptyLinkText')}</Link> {t('favorites.emptyAfter')}
              </p>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
