import {usePost} from '@brutmaps/api';
import classNames from 'classnames';
import parse from 'html-react-parser';
import {Fragment} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate, useParams} from 'react-router-dom';
import PageContentLoader from '~/components/PageContentLoader/PageContentLoader.tsx';
import PostContent from '~/components/SightBlogArticle/PostContent/PostContent.tsx';
import routes from '~/util/routes.ts';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.tsx';
import SiteLayout from '../../layouts/SiteSimpleLayout/SiteLayout.tsx';
import styles from './BlogArticle.module.scss';

export default function BlogArticle() {
  const {t} = useTranslation();
  const {slug} = useParams();
  const navigate = useNavigate();
  const {post: articleDetail, isLoading, error} = usePost(slug || '');

  if (isLoading) {
    return (
      <SiteLayout className={styles.layout}>
        <PageContentLoader />
      </SiteLayout>
    );
  }

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
