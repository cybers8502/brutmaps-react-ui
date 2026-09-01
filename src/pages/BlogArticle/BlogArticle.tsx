import {Fragment} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {usePost} from '@brutmaps/api';
import parse from 'html-react-parser';
import classNames from 'classnames';
import styles from './BlogArticle.module.scss';
import SiteLayout from '../../layouts/SiteSimpleLayout/SiteLayout.tsx';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.tsx';
import routes from '~/util/routes.ts';
import PostContent from '~/components/SightBlogArticle/PostContent/PostContent.tsx';
import {useTranslation} from 'react-i18next';
import {useSetPageLoading} from '~/context/PageLoadingContext.tsx';

export default function BlogArticle() {
  const {t} = useTranslation();
  const {slug} = useParams();
  const navigate = useNavigate();
  const {post: articleDetail, isLoading, error} = usePost(slug || '');

  useSetPageLoading(isLoading);

  if (isLoading) return null;
  if (error) navigate('/404');

  if (!articleDetail) {
    navigate('/404');
    return;
  }

  const breadcrumbItems = [
    {name: t('common.home'), path: routes.commonMap},
    {name: t('nav.blog'), path: routes.blog},
    {name: articleDetail.title},
  ];

  return (
    <SiteLayout className={styles.layout}>
      <div className={classNames(styles.section)}>
        <article className={classNames(styles.wrap, 'article')}>
          <div className={styles.header}>
            <h1>{articleDetail.title}</h1>
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          <PostContent description={articleDetail.content} gallery={articleDetail.gallery} />
        </article>
        {articleDetail.banners && articleDetail.banners.length > 0 && (
          <div className={styles.aside}>
            {articleDetail.banners.map((banner, index) => (
              <Fragment key={index}>{parse(banner.html)}</Fragment>
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
