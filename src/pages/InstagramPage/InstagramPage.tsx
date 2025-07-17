import SiteLayout from '../../layouts/SiteSimpleLayout/SiteLayout.tsx';
import styles from './InstagramPage.module.scss';
import PhotoFeed from '~/pages/InstagramPage/PhotoFeed/PhotoFeed.tsx';

export default function InstagramPage() {
  return (
    <SiteLayout className={styles.layout}>
      <PhotoFeed />
    </SiteLayout>
  );
}
