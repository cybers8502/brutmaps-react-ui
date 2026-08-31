import styles from './SightBlogArticle.module.scss';
import classNames from 'classnames';
import {useNavigate} from 'react-router-dom';
import useFetchObjectPost from '~/hooks/fetchApi/useFetchObjectPost.tsx';
import AddToFavoriteSightButton from '~/components/AddToFavoriteSightButton/AddToFavoriteSightButton.tsx';
import Button from '~/components/Button/Button.tsx';
import PostContent from '~/components/SightBlogArticle/PostContent/PostContent.tsx';
import TopGallery from '~/components/SightBlogArticle/TopGallery/TopGallery.tsx';
import {useTranslation} from 'react-i18next';

interface SightDetailProps {
  sightSlug: string;
  className?: string;
  onSeeMap?: () => void;
}

export default function SightBlogArticle({sightSlug, onSeeMap, className}: SightDetailProps) {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {sightDetails, isLoading, isError} = useFetchObjectPost(sightSlug || '');

  if (isLoading) return <p>{t('common.loading')}</p>;
  if (isError) navigate('/404');

  if (!sightDetails?.status || sightDetails.status !== 'success') {
    navigate('/404');
    return;
  }

  const objDetail = sightDetails.data;

  const seeOnMap = () => {
    navigate(`/?sight=${sightDetails?.data?.id || 0}`);
    if (onSeeMap) onSeeMap();
  };

  return (
    <div className={classNames(styles.section, className)}>
      <article className={classNames(styles.wrap)}>
        <div className={'article'}>
          <div className={classNames(styles.header)}>
            <h1>{objDetail?.title || ''}</h1>

            <address className={styles.info}>
              <span>{objDetail?.address || ''}</span>
            </address>

            <div className={styles.buttonWrapper}>
              <Button variant={'strokeRed'} onClick={seeOnMap}>
                {t('common.seeOnMap')}
              </Button>
              {objDetail?.id && <AddToFavoriteSightButton sightId={String(objDetail?.id)} />}
            </div>
          </div>
        </div>

        <div className={classNames(styles.content, 'site-centered', 'article')}>
          {objDetail.topGallery?.length && <TopGallery gallery={objDetail.topGallery} />}
          <PostContent description={objDetail?.description || ''} gallery={objDetail.gallery} />
        </div>
      </article>
    </div>
  );
}
