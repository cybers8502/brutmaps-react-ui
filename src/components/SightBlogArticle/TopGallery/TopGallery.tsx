import classNames from 'classnames';
import styles from './TopGallery.module.scss';
import {Link} from 'react-router-dom';
import PopupLayout from '~/layouts/PopupLayout/PopupLayout.tsx';
import BlogGallery from '~/components/SightBlogArticle/BlogGallery/BlogGallery.tsx';
import {ImageItem} from '~/hooks/fetchApi/useFetchObjectPost.tsx';
import {useEffect, useRef, useState} from 'react';
import useMobileState from '~/hooks/useMobileState.ts';
import {Mousewheel, Pagination, Scrollbar} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';

interface TopGalleryProps {
  gallery: ImageItem[];
}

export default function TopGallery({gallery}: TopGalleryProps) {
  const isMobileView = useMobileState();
  const contentRef = useRef<HTMLDivElement>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [openedGalleryIndex, setOpenedGalleryIndex] = useState<number | null>(null);

  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;
    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const img = target.closest('img');

      if (!img) return;

      let finalImageId = img.getAttribute('data-id');

      if (!finalImageId) {
        const classList = img.className;
        const match = classList.match(/wp-image-(\d+)/);
        if (match && match[1]) {
          finalImageId = match[1];
        }
      }
      if (!finalImageId) return;

      const indexInGallery = gallery?.findIndex((item) => item.id.toString() === finalImageId);

      if (indexInGallery !== -1 && indexInGallery !== undefined) {
        setShowGallery(true);
        setOpenedGalleryIndex(indexInGallery);
      }
    };

    contentEl.addEventListener('click', handleImageClick);

    return () => {
      contentEl.removeEventListener('click', handleImageClick);
    };
  }, [gallery]);

  const handleShowMore = () => {
    setOpenedGalleryIndex(5);
    setShowGallery(true);
  };

  if (!gallery?.length) return null;

  return (
    <>
      {isMobileView ? (
        <div ref={contentRef}>
          <Swiper
            modules={[Scrollbar, Pagination, Mousewheel]}
            className={styles.swiper}
            slidesPerView={1}
            spaceBetween={10}
            threshold={10}
            mousewheel={{
              enabled: true,
              forceToAxis: true,
            }}
            scrollbar={{
              el: '.swiper-scrollbar',
              draggable: true,
            }}>
            {gallery.map((img, index) => {
              const figcaption = <figcaption>{img?.author?.figcaption}</figcaption>;

              return (
                <SwiperSlide key={`swiper_${index}`}>
                  {() => (
                    <figure className={styles.picture}>
                      <picture>
                        <img
                          src={img.url}
                          alt={img.alt || `Image`}
                          title={img.title || `Image`}
                          data-id={img.id}
                        />
                      </picture>
                      <figcaption>
                        {img?.author?.link ? (
                          <Link to={img?.author?.link} target={'_blank'}>
                            {figcaption}
                          </Link>
                        ) : (
                          figcaption
                        )}
                      </figcaption>
                    </figure>
                  )}
                </SwiperSlide>
              );
            })}
            <div className='swiper-pagination'>
              <div className='swiper-scrollbar' />
            </div>
          </Swiper>
        </div>
      ) : (
        <div className={classNames(styles.topGallery)} ref={contentRef}>
          {gallery.slice(0, 5).map((img, index) => {
            const figcaption = <figcaption>{img?.author?.figcaption}</figcaption>;

            return (
              <figure key={`${img.id}_${index}`} className={styles.picture}>
                <picture>
                  <img src={img.url} alt={img.alt || `Image`} title={img.title || `Image`} data-id={img.id} />
                </picture>
                <figcaption>
                  {img?.author?.link ? (
                    <Link to={img?.author?.link} target={'_blank'}>
                      {figcaption}
                    </Link>
                  ) : (
                    figcaption
                  )}
                </figcaption>
              </figure>
            );
          })}
          {gallery.slice(4, -1)?.length ? (
            <button className={styles.showMore} onClick={handleShowMore}>
              Show more {gallery.slice(4, -1)?.length} photos
            </button>
          ) : null}
        </div>
      )}

      {showGallery && (
        <PopupLayout
          containerClassNames={styles.galleryPopup}
          onClose={() => {
            setShowGallery(false);
          }}
          closeButton={true}
          className={styles.popup}>
          <BlogGallery gallery={gallery || []} initialIndex={openedGalleryIndex as number} />
        </PopupLayout>
      )}
    </>
  );
}
