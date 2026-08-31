import {useRef} from 'react';
import styles from './Thumbnail.module.scss';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';
import {Image} from '../ProductsList/Product.interface.ts';
import {NavigationOptions} from 'swiper/types';
import {useTranslation} from 'react-i18next';

interface ThumbnailProps {
  image: Image;
  images: Image[];
}

export default function Thumbnail({image, images}: ThumbnailProps) {
  const {t} = useTranslation();
  const swiperRef = useRef(null);

  const handleThumbnailClick = (index: number) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideToLoop(index);
    }
  };

  const navigation = {
    nextEl: `.${styles.swiperNext}`,
    prevEl: `.${styles.swiperPrev}`,
  } as NavigationOptions;

  return (
    <div className={styles.thumbnail}>
      <Swiper
        ref={swiperRef}
        spaceBetween={10}
        loop={true}
        navigation={navigation}
        modules={[Navigation]}
        slidesPerView={1}>
        <SwiperSlide key='main-image' data-index={0}>
          <picture>
            <img src={image.src} alt={image.name} />
          </picture>
        </SwiperSlide>
        {images.slice(0, 2).map((image, index) => (
          <SwiperSlide key={index} data-index={index + 1}>
            <picture>
              <img src={image.src} alt={image.name} />
            </picture>
          </SwiperSlide>
        ))}

        <button className={styles.swiperPrev} aria-label={t('thumbnail.previousSlide')}>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' aria-hidden='true'>
            <path d='M22,9a1,1,0,0,0,0,1.42l4.6,4.6H3.06a1,1,0,1,0,0,2H26.58L22,21.59A1,1,0,0,0,22,23a1,1,0,0,0,1.41,0l6.36-6.36a.88.88,0,0,0,0-1.27L23.42,9A1,1,0,0,0,22,9Z' />
          </svg>
        </button>

        <button className={styles.swiperNext} aria-label={t('thumbnail.nextSlide')}>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' aria-hidden='true'>
            <path d='M22,9a1,1,0,0,0,0,1.42l4.6,4.6H3.06a1,1,0,1,0,0,2H26.58L22,21.59A1,1,0,0,0,22,23a1,1,0,0,0,1.41,0l6.36-6.36a.88.88,0,0,0,0-1.27L23.42,9A1,1,0,0,0,22,9Z' />
          </svg>
        </button>
      </Swiper>

      <picture onClick={() => handleThumbnailClick(0)} className={styles.pagination}>
        <img src={image.src} alt={image.name} />
      </picture>
      {images.slice(0, 2).map((image, index) => (
        <picture key={index} onClick={() => handleThumbnailClick(index + 1)} className={styles.pagination}>
          <img src={image.src} alt={image.name} />
        </picture>
      ))}
    </div>
  );
}
