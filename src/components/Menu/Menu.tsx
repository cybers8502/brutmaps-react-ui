import {Link, useLocation} from 'react-router-dom';
import styles from './Menu.module.scss';
import classNames from 'classnames';
import routes from '../../util/routes.ts';

export default function Menu() {
  const location = useLocation();

  return (
    <menu className={styles.menu}>
      <li>
        <Link
          to={routes.commonMap}
          className={classNames({[styles['is-active']]: location.pathname === routes.commonMap})}>
          Map
        </Link>
      </li>
      <li>
        <Link
          to={routes.blog}
          className={classNames({[styles['is-active']]: location.pathname === routes.blog})}>
          Blog
        </Link>
      </li>
      <li>
        <Link
          to={routes.shop}
          className={classNames({[styles['is-active']]: location.pathname === routes.shop})}>
          Shop
        </Link>
      </li>
    </menu>
  );
}
