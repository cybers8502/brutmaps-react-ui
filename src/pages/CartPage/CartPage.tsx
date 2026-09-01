import {useCart, useRemoveFromCart, useUpdateCartItem} from '@brutmaps/api';
import {Link} from 'react-router-dom';
import styles from './CartPage.module.scss';
import SiteLayout from '~/layouts/SiteSimpleLayout/SiteLayout.tsx';
import PageTitle from '~/components/PageTitle/PageTitle.tsx';
import Button from '~/components/Button/Button.tsx';
import routes from '~/util/routes.ts';
import {useTranslation} from 'react-i18next';

export default function CartPage() {
  const {t} = useTranslation();
  const {cart, isLoading} = useCart();
  const {updateQuantity} = useUpdateCartItem();
  const {removeFromCart} = useRemoveFromCart();

  const items = cart?.contents.nodes ?? [];

  return (
    <SiteLayout>
      <PageTitle>{t('cart.cart')}</PageTitle>

      {isLoading && <p>{t('common.loading')}</p>}

      {!isLoading && items.length === 0 && (
        <p>
          {t('cart.empty')} <Link to={routes.shop}>{t('cart.continueShopping')}</Link>
        </p>
      )}

      {items.length > 0 && (
        <div className={styles.wrapper}>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.key} className={styles.item}>
                {item.product.node?.image && (
                  <img
                    className={styles.image}
                    src={item.product.node.image.sourceUrl}
                    alt={item.product.node.image.altText ?? ''}
                  />
                )}
                <div className={styles.details}>
                  <Link to={`${routes.productSinglePage}/${item.product.node?.slug}`}>{item.product.node?.name}</Link>
                  <label className={styles.quantity}>
                    {t('cart.quantity')}
                    <input
                      type='number'
                      min={1}
                      defaultValue={item.quantity}
                      onBlur={(e) => {
                        const quantity = Number(e.target.value);
                        if (quantity > 0 && quantity !== item.quantity) updateQuantity(item.key, quantity);
                      }}
                    />
                  </label>
                  <button type='button' onClick={() => removeFromCart(item.key)}>
                    {t('cart.remove')}
                  </button>
                </div>
                <p className={styles.itemTotal}>{item.total}</p>
              </li>
            ))}
          </ul>

          <div className={styles.summary}>
            <p>
              {t('cart.subtotal')}: <strong>{cart?.subtotal}</strong>
            </p>
            <p>
              {t('cart.total')}: <strong>{cart?.total}</strong>
            </p>
            <Button href={routes.checkout} variant={'fillRed'}>
              {t('cart.goToCheckout')}
            </Button>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
