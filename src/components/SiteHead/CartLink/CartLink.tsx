import {useCart} from '@brutmaps/api';
import {Link} from 'react-router-dom';
import routes from '~/util/routes.ts';
import {useTranslation} from 'react-i18next';

export default function CartLink() {
  const {t} = useTranslation();
  const {cart} = useCart();

  const count = cart?.contents.nodes.length ?? 0;

  return (
    <Link to={routes.cart}>
      {t('cart.cart')}
      {count > 0 && ` (${count})`}
    </Link>
  );
}
