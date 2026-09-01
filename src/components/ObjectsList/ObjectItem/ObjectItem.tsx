import type {SightListItem} from '@brutmaps/api';
import {Link} from 'react-router-dom';
import {useState} from 'react';
import styles from './ObjectItem.module.scss';
import routes from '~/util/routes.ts';

export default function ObjectItem({slug, title, image, country, address, establishedYear, architects}: SightListItem) {
  const [imageFailed, setImageFailed] = useState(false);

  const location = country || address;
  const metaLine = [location, establishedYear].filter(Boolean).join(' · ');
  const architectsLine = architects.map((architect) => architect.fullName || architect.title).join(', ');
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
        {architectsLine && <p className={styles.architects}>{architectsLine}</p>}
      </div>
    </Link>
  );
}
