import type {SightListItem} from '@brutmaps/api';
import {useState} from 'react';
import {Link} from 'react-router-dom';
import routes from '~/util/routes.ts';
import styles from './ArchitectBuildingItem.module.scss';

interface ArchitectBuildingItemProps {
  item: SightListItem;
}

export default function ArchitectBuildingItem({item}: ArchitectBuildingItemProps) {
  const {slug, title, image, country, address, establishedYear} = item;
  const [imageFailed, setImageFailed] = useState(false);

  const location = country || address;
  const metaLine = [location, establishedYear].filter(Boolean).join(' · ');
  const showImage = Boolean(image?.url) && !imageFailed;

  return (
    <Link to={`${routes.sightSinglePage}/${slug}`} className={styles.item}>
      <picture className={styles.picture}>
        {showImage ? (
          <img src={image.url} alt={image.alt || title} loading='lazy' onError={() => setImageFailed(true)} />
        ) : (
          <span className={styles.pictureFallback} aria-hidden='true' />
        )}
      </picture>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {metaLine && <p className={styles.meta}>{metaLine}</p>}
      </div>
    </Link>
  );
}
