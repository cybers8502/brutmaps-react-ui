import styles from './ShopPage.module.scss';
import SiteLayout from '../../layouts/SiteSimpleLayout/SiteLayout.tsx';
import ProductsList from '../../components/ProductsList/ProductsList.tsx';
import PageTitle from '../../components/PageTitle/PageTitle.tsx';

export default function ShopPage() {
  return (
    <SiteLayout className={styles.layout}>
      <PageTitle>Store</PageTitle>
      <ProductsList />
    </SiteLayout>
  );
}
