import Product from '../Product.interface.ts';
import parse from 'html-react-parser';
import {Link} from 'react-router-dom';
import styles from './Product.module.scss';
import classNames from 'classnames';
import addToCart from '../../../hooks/addToCart.ts';
import {useTranslation} from 'react-i18next';

export default function ProductItem(props: Product) {
  const {t} = useTranslation();

  //TODO: докрутить с корзиной
  const handleAddToCart = async (productId) => {
    await addToCart(productId, 1);
    window.location.replace('/checkout');
  };

  return (
    <div className={styles.item}>
      <picture className={styles.picture}>
        <Link to={`/product/${props.slug}`}>
          <img src={props.image.src} alt={props.image.name} />
        </Link>
      </picture>
      <div className={styles.rightColl}>
        <div className={classNames(styles.txt)}>
          <h3 className={styles.title}>
            <Link to={`/product/${props.slug}`}>{props.name}</Link>
          </h3>
          <div className={classNames(styles.description, 'article')}>{parse(props.short_description)}</div>
        </div>

        <div className={styles.footer}>
          {props.sale_price && (
            <p className={styles['regular-price']}>
              <span>${props.regular_price}</span>
            </p>
          )}
          <p className={styles.price}>${props.sale_price ? props.sale_price : props.regular_price}</p>
          <div className={styles.buttonsWrap}>
            {props.stripe && (
              <Link to={props.stripe} className={'button button--fill-red'}>
                {t('common.buyNow')}
              </Link>
            )}
            <Link to={`/product/${props.slug}`} className={'button button--fill-dark-shade-gray'}>
              {t('common.readMore')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
