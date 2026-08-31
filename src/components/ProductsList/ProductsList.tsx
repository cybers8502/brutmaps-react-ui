import styles from './ProductsList.module.scss';
import useFetchProducts from '~/hooks/fetchApi/useFetchProducts.tsx';
import ProductItem from './ProductItem/ProductItem.tsx';
import {useTranslation} from 'react-i18next';

export default function ProductsList() {
  const {t} = useTranslation();
  const {products: fetchedProducts, isLoading, isError} = useFetchProducts();

  if (isLoading) return t('common.loading');
  if (isError) return t('common.serverError');

  return (
    <div className={styles.section}>
      {fetchedProducts?.data.products.map((product, index) => <ProductItem key={index} {...product} />)}
    </div>
  );
}
