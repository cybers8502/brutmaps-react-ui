import {useAddToCart, useProduct} from '@brutmaps/api';
import classNames from 'classnames';
import parse from 'html-react-parser';
import {useTranslation} from 'react-i18next';
import {useNavigate, useParams} from 'react-router-dom';
import Button from '~/components/Button/Button.tsx';
import {useSetPageLoading} from '~/context/PageLoadingContext.tsx';
import routes from '~/util/routes.ts';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.tsx';
import PageTitle from '../../components/PageTitle/PageTitle.tsx';
import Thumbnail from '../../components/Thumbnail/Thumbnail.tsx';
import SiteLayout from '../../layouts/SiteSimpleLayout/SiteLayout.tsx';
import styles from './ProductPage.module.scss';

export default function ProductPage() {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {slug} = useParams();
  const {product, isLoading, error} = useProduct(slug ?? '');
  const {addToCart, isLoading: isAdding} = useAddToCart();

  useSetPageLoading(isLoading);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product.databaseId, 1);
    navigate(routes.cart);
  };

  if (isLoading) return null;
  if (error) return t('common.serverError');

  if (!product) {
    navigate('/404');
    return null;
  }

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
        {product.image && (
          <Thumbnail image={product.image} images={product.galleryImages.nodes.slice(0, 2)} />
        )}

        <div className={styles.information}>
          <div className={classNames(styles.description, 'article')}>
            {product.description && parse(product.description)}
          </div>

          <div className={styles.footer}>
            <div>
              {product.salePrice && (
                <p className={styles['regular-price']}>
                  <span>{product.regularPrice}</span>
                </p>
              )}
              <p className={styles.price}>{product.salePrice ? product.salePrice : product.regularPrice}</p>
            </div>
            <div className={styles.buttonsWrap}>
              <Button onClick={handleAddToCart} disabled={isAdding}>
                {isAdding ? t('common.loading') : t('common.buyNow')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
