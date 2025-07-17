import SiteLayout from '../../layouts/SiteSimpleLayout/SiteLayout.tsx';
import styles from './BlogRootPage.module.scss';
import PostsList from '../../components/PostsList/PostsList.tsx';

export default function BlogRootPage() {
  return (
    <SiteLayout className={styles.layout}>
      <PostsList />
    </SiteLayout>
  );
}
