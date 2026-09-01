import {Link, useLocation} from 'react-router-dom';
import styles from './Menu.module.scss';
import classNames from 'classnames';
import routes from '../../util/routes.ts';
import {useTranslation} from 'react-i18next';

export default function Menu() {
  const {t} = useTranslation();
  const location = useLocation();

  return (
    <menu className={styles.menu}>
      <li>
        <Link
          to={routes.commonMap}
          className={classNames({[styles['is-active']]: location.pathname === routes.commonMap})}>
          {t('nav.map')}
        </Link>
      </li>
      <li>
        <Link
          to={routes.objects}
          className={classNames({[styles['is-active']]: location.pathname === routes.objects})}>
          {t('nav.objects')}
        </Link>
      </li>
      <li>
        <Link
          to={routes.blog}
          className={classNames({[styles['is-active']]: location.pathname === routes.blog})}>
          {t('nav.blog')}
        </Link>
      </li>
      <li>
        <Link
          to={routes.shop}
          className={classNames({[styles['is-active']]: location.pathname === routes.shop})}>
          {t('nav.shop')}
        </Link>
      </li>
      <li>
        <Link
          to={routes.about}
          className={classNames({[styles['is-active']]: location.pathname === routes.about})}>
          {t('nav.about')}
        </Link>
      </li>
    </menu>
  );
}
