import {useLocation, useParams} from 'react-router-dom';
import SiteLayout from '../../layouts/SiteSimpleLayout/SiteLayout.tsx';
import PageTitle from '../../components/PageTitle/PageTitle.tsx';
import Button from '~/components/Button/Button.tsx';
import routes from '~/util/routes.ts';
import {useOrder} from '@brutmaps/api';
import {useTranslation} from 'react-i18next';

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

  return (
    <SiteLayout>
      <PageTitle>{t('orderReceived.title')}</PageTitle>

      {!stateOrder && isLoading && <p>{t('common.loading')}</p>}

      {summary && (
        <div>
          <p>
            {t('orderReceived.orderNumber')}: <strong>{summary.orderNumber}</strong>
          </p>
          {fetchedOrder && (
            <p>
              {t('orderReceived.orderDate')}: <strong>{fetchedOrder.date}</strong>
            </p>
          )}
          <p>
            {t('orderReceived.orderStatus')}: <strong>{summary.status}</strong>
          </p>
          <p>
            {t('orderReceived.orderTotal')}: <strong>{summary.total}</strong>
          </p>

          {fetchedOrder && (
            <ul>
              {fetchedOrder.lineItems.nodes.map((item, index) => (
                <li key={index}>
                  {item.product?.node?.name} × {item.quantity} — {item.total}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Button href={routes.shop}>{t('orderReceived.backToShop')}</Button>
    </SiteLayout>
  );
}
