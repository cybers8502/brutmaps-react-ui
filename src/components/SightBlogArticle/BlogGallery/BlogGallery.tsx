import {Mousewheel, Pagination, Scrollbar} from 'swiper/modules';
import {Swiper, type SwiperRef, SwiperSlide} from 'swiper/react';
import 'swiper/scss';
import 'swiper/scss/a11y';
import {useRef} from 'react';
import {Link} from 'react-router-dom';
import type {GalleryImage} from '~/components/SightBlogArticle/GalleryImage.interface.ts';
import styles from './BlogGallery.module.scss';

interface BlogGalleryProps {
  gallery: GalleryImage[];
  initialIndex: number;
}

export default function BlogGallery({gallery, initialIndex}: BlogGalleryProps) {
  const swiperRef = useRef<SwiperRef>(null);

  if (!gallery || gallery.length === 0) {
    return null;
  }

  if (gallery.length === 1) {
    const item = gallery[0];
    const figcaption = <figcaption>{item?.author?.figcaption}</figcaption>;

    return (
      <figure>
        <picture>
          <img src={item.url} alt={item.alt || 'img'} title={item.title || 'img'} />
        </picture>
        <figcaption>
          {item?.author?.link ? (
            <Link to={item?.author?.link} target={'_blank'}>
              {figcaption}
            </Link>
          ) : (
            figcaption
          )}
        </figcaption>
      </figure>
    );
  }

  return (
    <Swiper
      ref={swiperRef}
      modules={[Scrollbar, Pagination, Mousewheel]}
      className={styles.swiper}
      slidesPerView={1}
      initialSlide={initialIndex}
      spaceBetween={10}
      threshold={10}
      mousewheel={{
        enabled: true,
        forceToAxis: true,
      }}
      scrollbar={{
        el: '.swiper-scrollbar',
        draggable: true,
      }}
      breakpoints={{
        1024: {
          spaceBetween: 21,
        },
      }}
      onSwiper={(swiperInstance) => {
        swiperRef.current = swiperInstance;
      }}>
      {gallery.map((item, index) => {
        const figcaption = <figcaption>{item?.author?.figcaption}</figcaption>;

        return (
          <SwiperSlide key={`swiper_${index}`}>
            {({isActive}) => (
              <figure
                onClick={() => {
                  if (!isActive && swiperRef.current) {
                    swiperRef.current.slideTo(index);
                  }
                }}
                style={{cursor: !isActive ? 'pointer' : 'default'}}>
                <picture>
                  <img src={item.url} alt={item.alt || 'img'} title={item.title || 'img'} />
                </picture>
                {item?.author?.link ? (
                  <Link to={item?.author?.link} target={'_blank'}>
                    {figcaption}
                  </Link>
                ) : (
                  figcaption
                )}
              </figure>
            )}
          </SwiperSlide>
        );
      })}
      <div className='swiper-pagination'>
        <div className='swiper-scrollbar' />
      </div>
    </Swiper>
  );
}
