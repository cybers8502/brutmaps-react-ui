import styles from './ProductsList.module.scss';
import {useProducts} from '@brutmaps/api';
import ProductItem from './ProductItem/ProductItem.tsx';
import {useTranslation} from 'react-i18next';

export default function ProductsList() {
  const {t} = useTranslation();
  const {products, isLoading, error} = useProducts();

  if (isLoading) return t('common.loading');
  if (error) return t('common.serverError');

  return (
    <div className={styles.section}>
      {products.map((product) => (
        <ProductItem key={product.id} {...product} />
      ))}
    </div>
  );
}
