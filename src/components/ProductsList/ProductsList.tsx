import styles from './ProductsList.module.scss';
import useFetchProducts from '~/hooks/fetchApi/useFetchProducts.tsx';
import ProductItem from './ProductItem/ProductItem.tsx';

export default function ProductsList() {
  const {products: fetchedProducts, isLoading, isError} = useFetchProducts();

  if (isLoading) return 'Loading...';
  if (isError) return 'Server Error';

  return (
    <div className={styles.section}>
      {fetchedProducts?.data.products.map((product, index) => <ProductItem key={index} {...product} />)}
    </div>
  );
}
