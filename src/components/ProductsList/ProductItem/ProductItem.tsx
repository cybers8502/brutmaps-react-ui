import type {Product} from '@brutmaps/api';
import {useAddToCart} from '@brutmaps/api';
import classNames from 'classnames';
import parse from 'html-react-parser';
import {useTranslation} from 'react-i18next';
import {Link, useNavigate} from 'react-router-dom';
import Button from '~/components/Button/Button.tsx';
import routes from '~/util/routes.ts';
import styles from './Product.module.scss';

export default function ProductItem(props: Product) {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {addToCart, isLoading} = useAddToCart();

  const handleAddToCart = async () => {
    await addToCart(props.databaseId, 1);
    navigate(routes.cart);
  };

  return (
    <div className={styles.item}>
      <picture className={styles.picture}>
        <Link to={`/product/${props.slug}`}>
          {props.image && <img src={props.image.sourceUrl} alt={props.image.altText ?? ''} />}
        </Link>
      </picture>
      <div className={styles.rightColl}>
        <div className={classNames(styles.txt)}>
          <h3 className={styles.title}>
            <Link to={`/product/${props.slug}`}>{props.name}</Link>
          </h3>
          <div className={classNames(styles.description, 'article')}>
            {props.shortDescription && parse(props.shortDescription)}
          </div>
        </div>

        <div className={styles.footer}>
          {props.salePrice && (
            <p className={styles['regular-price']}>
              <span>{props.regularPrice}</span>
            </p>
          )}
          <p className={styles.price}>{props.salePrice ? props.salePrice : props.regularPrice}</p>
          <div className={styles.buttonsWrap}>
            <Button onClick={handleAddToCart} disabled={isLoading} variant={'fillRed'}>
              {t('common.buyNow')}
            </Button>
            <Link to={`/product/${props.slug}`} className={'button button--fill-dark-shade-gray'}>
              {t('common.readMore')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
