import {useProducts} from '@brutmaps/api';
import {useTranslation} from 'react-i18next';
import {useSetPageLoading} from '~/context/PageLoadingContext.tsx';
import ProductItem from './ProductItem/ProductItem.tsx';
import styles from './ProductsList.module.scss';

export default function ProductsList() {
  const {t} = useTranslation();
  const {products, isLoading, error} = useProducts();

  useSetPageLoading(isLoading);

  if (isLoading) return null;
  if (error) return t('common.serverError');

  return (
    <div className={styles.section}>
      {products.map((product) => (
        <ProductItem key={product.id} {...product} />
      ))}
    </div>
  );
}
