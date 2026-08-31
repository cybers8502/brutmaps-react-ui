import useFetchProducts from '~/hooks/fetchApi/useFetchProducts.tsx';
import styles from './ProductPage.module.scss';
import {Link, useNavigate, useParams} from 'react-router-dom';
import SiteLayout from '../../layouts/SiteSimpleLayout/SiteLayout.tsx';
import parse from 'html-react-parser';
import classNames from 'classnames';
import addToCart from '../../hooks/addToCart.ts';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.tsx';
import PageTitle from '../../components/PageTitle/PageTitle.tsx';
import Thumbnail from '../../components/Thumbnail/Thumbnail.tsx';
import {useTranslation} from 'react-i18next';

export default function ProductPage() {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {slug} = useParams();
  const {products: fetchedProducts, isLoading, isError} = useFetchProducts();

  //TODO: докрутить с корзиной
  const handleAddToCart = async (productId) => {
    await addToCart(productId, 1);
    window.location.replace('/checkout');
  };

  if (isLoading) return t('common.loading');
  if (isError) return t('common.serverError');

  const product = fetchedProducts.data.products.find((product) => product.slug === slug);

  if (!product) navigate('/404');

  const breadcrumbItems = [
    {name: t('common.home'), path: '/'},
    {name: t('shop.store'), path: '/shop'},
    {name: product.name},
  ];

  return (
    <SiteLayout>
      <PageTitle className={styles.title}>{product.name}</PageTitle>
      <Breadcrumbs items={breadcrumbItems} />
      <div className={styles.grid}>
        <Thumbnail image={product.image} images={product.images.slice(0, 2)} />

        <div className={styles.information}>
          <div className={classNames(styles.description, 'article')}>{parse(product.description)}</div>

          <div className={styles.footer}>
            <div>
              {product.sale_price && (
                <p className={styles['regular-price']}>
                  <span>${product.regular_price}</span>
                </p>
              )}
              <p className={styles.price}>
                ${product.sale_price ? product.sale_price : product.regular_price}
              </p>
            </div>
            <div className={styles.buttonsWrap}>
              {product.stripe && (
                <Link to={product.stripe} target={'_blank'} className={'button button--fill-red'}>
                  {t('common.buyNow')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
