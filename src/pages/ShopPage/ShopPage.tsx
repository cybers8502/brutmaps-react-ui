import {useTranslation} from 'react-i18next';
import PageTitle from '../../components/PageTitle/PageTitle.tsx';
import ProductsList from '../../components/ProductsList/ProductsList.tsx';
import SiteLayout from '../../layouts/SiteSimpleLayout/SiteLayout.tsx';
import styles from './ShopPage.module.scss';

export default function ShopPage() {
  const {t} = useTranslation();

  return (
    <SiteLayout className={styles.layout}>
      <PageTitle>{t('shop.store')}</PageTitle>
      <ProductsList />
    </SiteLayout>
  );
}
