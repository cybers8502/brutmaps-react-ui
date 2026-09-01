import {useCart} from '@brutmaps/api';
import {Link} from 'react-router-dom';
import styles from './CartLink.module.scss';
import routes from '~/util/routes.ts';
import {useTranslation} from 'react-i18next';

export default function CartLink() {
  const {t} = useTranslation();
  const {cart} = useCart();

  const count = cart?.contents.nodes.length ?? 0;

  return (
    <Link to={routes.cart} className={styles.link}>
      {t('cart.cart')}
      {count > 0 && <span className={styles.count}>{count}</span>}
    </Link>
  );
}
