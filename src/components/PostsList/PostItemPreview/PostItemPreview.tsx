import type {BlogPostSummary} from '@brutmaps/api';
import classNames from 'classnames';
import {Fragment} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import routes from '~/util/routes.ts';
import styles from './PostItem.module.scss';

export default function PostItemPreview({...props}: BlogPostSummary) {
  const {t} = useTranslation();

  return (
    <div className={styles.item}>
      <Link to={`${routes.blog}/${props.slug}`}>
        <picture className={styles.picture}>
          <img src={props.thumbnail} alt={props.title} />
        </picture>
      </Link>
      <div className={styles.content}>
        <h3 className={styles.topic}>
          <Link to={`/blog/${props.slug}`}>{props.title}</Link>
        </h3>
        <div>
          <p>
            {props.categories?.map((category, index) => (
              <Fragment key={index}>
                <Link to={`/blog/?cat=${category.toLowerCase()}`}>{category}</Link>
                {index < props.categories.length - 1 ? ' | ' : ''}
              </Fragment>
            ))}
          </p>
          <p>
            <u>{props.author}</u>
          </p>
        </div>
      </div>
      <Link to={`${routes.blog}/${props.slug}`} className={classNames(styles['read-more'], 'button')}>
        {t('common.readMore')}
      </Link>
    </div>
  );
}
