import {useFavorites, useToggleFavorite} from '@brutmaps/api';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import PageTitle from '~/components/PageTitle/PageTitle.tsx';
import {useSetPageLoading} from '~/context/PageLoadingContext.tsx';
import SiteLayout from '~/layouts/SiteSimpleLayout/SiteLayout.tsx';
import FavoriteSightItem from '~/pages/FavoriteSights/FavoriteSightItem/FavoriteSightItem.tsx';
import routes from '~/util/routes.ts';
import styles from './FavoriteSights.module.scss';

export default function FavoriteSights() {
  const {t} = useTranslation();
  const {favorites, isLoading, refetch} = useFavorites();
  const {toggleFavorite} = useToggleFavorite();

  useSetPageLoading(isLoading);

  const removeFromFavorites = async (id: string) => {
    try {
      await toggleFavorite(Number(id), 'favorite');
      await refetch();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const objects = favorites.favorite;

  return (
    <SiteLayout>
      <div className={styles.container}>
        <div className={styles.frame}>
          <div className={styles.mainBlock}>
            <PageTitle>{t('siteHead.myFavoriteObjects')}</PageTitle>
            {isLoading ? null : objects.length > 0 ? (
              <ul className={styles.list}>
                {objects.map((id) => (
                  <FavoriteSightItem key={id} id={String(id)} removeFromFavorites={removeFromFavorites} />
                ))}
              </ul>
            ) : (
              <p>
                {t('favorites.emptyBefore')} <Link to={routes.commonMap}>{t('favorites.emptyLinkText')}</Link>{' '}
                {t('favorites.emptyAfter')}
              </p>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
