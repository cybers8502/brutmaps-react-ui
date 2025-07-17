import {Link} from 'react-router-dom';
import {PhotoPost} from '~/hooks/fetchApi/useFetchInstagramGallery.tsx';
import styles from './PhotoItem.module.scss';

type PhotoItemProps = PhotoPost;

export default function PhotoItem({title, link, preview_image_url, author}: PhotoItemProps) {
  const figcaption = <figcaption>{author?.figcaption}</figcaption>;

  return (
    <Link to={link} className={styles.item}>
      <figure>
        <picture>
          <img src={preview_image_url} alt={title || 'img'} title={title || 'img'} />
        </picture>
        <figcaption>
          {author?.link ? (
            <Link to={author?.link} target={'_blank'}>
              {figcaption}
            </Link>
          ) : (
            figcaption
          )}
        </figcaption>
      </figure>
    </Link>
  );
}
