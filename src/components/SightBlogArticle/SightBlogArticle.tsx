import classNames from 'classnames';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import AddToFavoriteSightButton from '~/components/AddToFavoriteSightButton/AddToFavoriteSightButton.tsx';
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs.tsx';
import Button from '~/components/Button/Button.tsx';
import PageContentLoader from '~/components/PageContentLoader/PageContentLoader.tsx';
import PostContent from '~/components/SightBlogArticle/PostContent/PostContent.tsx';
import TopGallery from '~/components/SightBlogArticle/TopGallery/TopGallery.tsx';
import useFetchObjectPost from '~/hooks/fetchApi/useFetchObjectPost.tsx';
import routes from '~/util/routes.ts';
import styles from './SightBlogArticle.module.scss';

interface SightDetailProps {
  sightSlug: string;
  className?: string;
  onSeeMap?: () => void;
}

export default function SightBlogArticle({sightSlug, onSeeMap, className}: SightDetailProps) {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {sight, isLoading, isError} = useFetchObjectPost(sightSlug || '');

  if (isLoading) return <PageContentLoader />;
  if (isError) {
    navigate('/404');
    return null;
  }

  if (!sight) {
    navigate('/404');
    return null;
  }

  const objDetail = sight;

  const seeOnMap = () => {
    navigate(`/?sight=${sight?.id || 0}`);
    if (onSeeMap) onSeeMap();
  };

  // Embedded in the map popup (onSeeMap set) rather than the standalone
  // /sight/:slug page — a breadcrumb trail doesn't make sense there.
  const breadcrumbItems = onSeeMap
    ? null
    : [
        {name: t('common.home'), path: routes.commonMap},
        {name: t('nav.objects'), path: routes.objects},
        {name: objDetail?.title || ''},
      ];

  return (
    <div className={classNames(styles.section, className)}>
      <article className={classNames(styles.wrap)}>
        <div className={'article'}>
          <div className={classNames(styles.header)}>
            {breadcrumbItems && <Breadcrumbs items={breadcrumbItems} />}

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
