import useFetchObjectPost from '~/hooks/fetchApi/useFetchObjectPost.tsx';
import AddToFavoriteSightButton from '~/components/AddToFavoriteSightButton/AddToFavoriteSightButton.tsx';
import styles from './FavoriteSightItem.module.scss';
import Button from '~/components/Button/Button.tsx';
import routes from '~/util/routes.ts';

interface FavoriteSightItemProps {
  id: string;
  removeFromFavorites: (id: string) => void;
}

export default function FavoriteSightItem({id}: FavoriteSightItemProps) {
  const {sightDetails, isLoading} = useFetchObjectPost(id);

  const objDetail = sightDetails?.data;

  return (
    <li className={styles.item}>
      {isLoading ? (
        'Loading...'
      ) : (
        <>
          {objDetail?.main_data.image && objDetail?.main_data.image.length > 0 && (
            <picture className={styles.picture}>
              <img src={objDetail?.main_data.image} alt={objDetail?.main_data.title} />
            </picture>
          )}
          <div className={styles.info}>
            <h3 className={styles.title}>{objDetail?.main_data.title || ''}</h3>
            <p className={styles.address}>{objDetail?.main_data.sub_title || ''}</p>
            <div className={styles.buttonsWrapper}>
              <Button href={`/?sight=${objDetail?.id || 0}`}>See on Map</Button>
              <Button href={`${routes.sightSinglePage}/${objDetail?.slug}`}>See Details</Button>
              <AddToFavoriteSightButton sightId={id} />
            </div>
          </div>
        </>
      )}
    </li>
  );
}
