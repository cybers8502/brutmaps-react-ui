import useFetchObjectPost from '~/hooks/fetchApi/useFetchObjectPost.tsx';
import AddToFavoriteSightButton from '~/components/AddToFavoriteSightButton/AddToFavoriteSightButton.tsx';
import styles from './FavoriteSightItem.module.scss';
import Button from '~/components/Button/Button.tsx';
import routes from '~/util/routes.ts';
import {useTranslation} from 'react-i18next';

interface FavoriteSightItemProps {
  id: string;
  removeFromFavorites: (id: string) => void;
}

export default function FavoriteSightItem({id}: FavoriteSightItemProps) {
  const {t} = useTranslation();
  const {sight, isLoading} = useFetchObjectPost(id);

  const objDetail = sight;
  const previewImage = objDetail?.topGallery?.[0] || objDetail?.gallery?.[0];

  return (
    <li className={styles.item}>
      {isLoading ? (
        t('common.loading')
      ) : (
        <>
          {previewImage && (
            <picture className={styles.picture}>
              <img src={previewImage.url} alt={previewImage.alt || objDetail?.title} />
            </picture>
          )}
          <div className={styles.info}>
            <h3 className={styles.title}>{objDetail?.title || ''}</h3>
            <p className={styles.address}>{objDetail?.address || ''}</p>
            <div className={styles.buttonsWrapper}>
              <Button href={`/?sight=${objDetail?.id || 0}`}>{t('common.seeOnMap')}</Button>
              <Button href={`${routes.sightSinglePage}/${objDetail?.slug}`}>{t('common.seeDetails')}</Button>
              <AddToFavoriteSightButton sightId={id} />
            </div>
          </div>
        </>
      )}
    </li>
  );
}
