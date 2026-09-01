import {useCart, useRemoveFromCart} from '@brutmaps/api';
import {Link} from 'react-router-dom';
import styles from './CartPage.module.scss';
import SiteLayout from '~/layouts/SiteSimpleLayout/SiteLayout.tsx';
import PageTitle from '~/components/PageTitle/PageTitle.tsx';
import Button from '~/components/Button/Button.tsx';
import {CancelIcon} from '~/components/Icons/Icons.tsx';
import routes from '~/util/routes.ts';
import {useTranslation} from 'react-i18next';
import {useSetPageLoading} from '~/context/PageLoadingContext.tsx';

export default function CartPage() {
  const {t} = useTranslation();
  const {cart, isLoading} = useCart();
  const {removeFromCart} = useRemoveFromCart();

  useSetPageLoading(isLoading);

  const items = cart?.contents.nodes ?? [];

  return (
    <SiteLayout>
      <PageTitle>{t('cart.cart')}</PageTitle>

      {!isLoading && items.length === 0 && (
        <div className={styles.empty}>
          <p>{t('cart.empty')}</p>
          <Button href={routes.shop}>{t('cart.continueShopping')}</Button>
        </div>
      )}

      {items.length > 0 && (
        <div className={styles.wrapper}>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.key} className={styles.item}>
                {item.product?.node?.image && (
                  <Link
                    to={`${routes.productSinglePage}/${item.product.node.slug}`}
                    className={styles.picture}>
                    <img
                      src={item.product.node.image.sourceUrl}
                      alt={item.product.node.image.altText ?? ''}
                    />
                  </Link>
                )}

                <div className={styles.details}>
                  {item.product?.node ? (
                    <Link
                      to={`${routes.productSinglePage}/${item.product.node.slug}`}
                      className={styles.name}>
                      {item.product.node.name}
                    </Link>
                  ) : (
                    <span className={styles.name}>{t('cart.productUnavailable')}</span>
                  )}
                </div>

                <p className={styles.itemTotal}>{item.total}</p>

                <button
                  type='button'
                  className={styles.remove}
                  aria-label={t('cart.remove')}
                  onClick={() => removeFromCart(item.key)}>
                  <CancelIcon size={14} />
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>{t('cart.subtotal')}</span>
              <span>{cart?.subtotal}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>{t('cart.total')}</span>
              <strong>{cart?.total}</strong>
            </div>
            <Button href={routes.checkout} variant={'fillRed'} className={styles.checkoutButton}>
              {t('cart.goToCheckout')}
            </Button>
            <Link to={routes.shop} className={styles.continueLink}>
              {t('cart.continueShopping')}
            </Link>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
