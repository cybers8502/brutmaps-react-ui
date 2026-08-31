import styles from './PostContent.module.scss';
import classNames from 'classnames';
import parse from 'html-react-parser';
import type {GalleryImage} from '~/components/SightBlogArticle/GalleryImage.interface.ts';
import BlogGallery from '~/components/SightBlogArticle/BlogGallery/BlogGallery.tsx';
import {useEffect, useRef, useState} from 'react';
import PopupLayout from '~/layouts/PopupLayout/PopupLayout.tsx';

interface PostContentProps {
  description?: string;
  gallery?: GalleryImage[];
}

export default function PostContent({description, gallery}: PostContentProps) {
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

  return (
    <>
      <div ref={contentRef} className={classNames('article')}>
        {parse(description || '')}
      </div>

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
