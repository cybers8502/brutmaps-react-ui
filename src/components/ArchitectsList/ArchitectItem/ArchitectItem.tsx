import type {Architect} from '@brutmaps/api';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {getInitials} from '~/util/getInitials.ts';
import routes from '~/util/routes.ts';
import styles from './ArchitectItem.module.scss';

interface ArchitectItemProps {
  architect: Architect;
}

export default function ArchitectItem({architect}: ArchitectItemProps) {
  const {t} = useTranslation();
  const [imageFailed, setImageFailed] = useState(false);

  const {slug, fullName, title, image, count} = architect;
  const name = fullName || title;
  const showImage = Boolean(image?.url) && !imageFailed;

  return (
    <Link to={`${routes.architects}/${slug}`} className={styles.item}>
      <picture className={styles.picture}>
        {showImage ? (
          <img src={image.url} alt={image.alt || name} loading='lazy' onError={() => setImageFailed(true)} />
        ) : (
          <span className={styles.pictureFallback} aria-hidden='true'>
            {getInitials(architect)}
          </span>
        )}
      </picture>
      <div className={styles.body}>
        <h3 className={styles.title}>{name}</h3>
        <p className={styles.meta}>{t('architects.buildingsCount', {count})}</p>
      </div>
    </Link>
  );
}
