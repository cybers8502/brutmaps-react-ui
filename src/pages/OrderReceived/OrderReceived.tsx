import {useOrder} from '@brutmaps/api';
import {useTranslation} from 'react-i18next';
import {useLocation, useParams} from 'react-router-dom';
import Button from '~/components/Button/Button.tsx';
import PageContentLoader from '~/components/PageContentLoader/PageContentLoader.tsx';
import routes from '~/util/routes.ts';
import PageTitle from '../../components/PageTitle/PageTitle.tsx';
import SiteLayout from '../../layouts/SiteSimpleLayout/SiteLayout.tsx';
import styles from './OrderReceived.module.scss';

interface CheckoutOrderSummary {
  databaseId: number;
  orderNumber: string | null;
  status: string | null;
  total: string | null;
}

export default function OrderReceived() {
  const {t} = useTranslation();
  const {orderId} = useParams();
  const location = useLocation();

  // The checkout mutation's own response already has the order summary — a
  // guest has no session to re-query `order(id)` with (WooGraphQL requires
  // being the order's owner or an admin), so prefer that over fetching.
  const stateOrder = (location.state as {order?: CheckoutOrderSummary} | null)?.order;
  const {order: fetchedOrder, isLoading} = useOrder(stateOrder ? 0 : Number(orderId));

  const summary = stateOrder ?? fetchedOrder;
  const showLoader = !stateOrder && isLoading;

  return (
    <SiteLayout>
      <div className={styles.header}>
        <span className={styles.badge}>✓</span>
        <PageTitle className={styles.title}>{t('orderReceived.title')}</PageTitle>
      </div>

      {showLoader && <PageContentLoader />}

      {summary && (
        <div className={styles.card}>
          <dl className={styles.meta}>
            <div className={styles.metaRow}>
              <dt>{t('orderReceived.orderNumber')}</dt>
              <dd>{summary.orderNumber}</dd>
            </div>
            {fetchedOrder && (
              <div className={styles.metaRow}>
                <dt>{t('orderReceived.orderDate')}</dt>
                <dd>{fetchedOrder.date}</dd>
              </div>
            )}
            <div className={styles.metaRow}>
              <dt>{t('orderReceived.orderStatus')}</dt>
              <dd>{summary.status}</dd>
            </div>
          </dl>

          {fetchedOrder && fetchedOrder.lineItems.nodes.length > 0 && (
            <ul className={styles.items}>
              {fetchedOrder.lineItems.nodes.map((item, index) => (
                <li key={index} className={styles.item}>
                  <span>{item.product?.node?.name}</span>
                  <span>{item.total}</span>
                </li>
              ))}
            </ul>
          )}

          <div className={styles.totalRow}>
            <span>{t('orderReceived.orderTotal')}</span>
            <strong>{summary.total}</strong>
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <Button href={routes.shop}>{t('orderReceived.backToShop')}</Button>
      </div>
    </SiteLayout>
  );
}
