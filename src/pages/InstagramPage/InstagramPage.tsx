import PhotoFeed from '~/pages/InstagramPage/PhotoFeed/PhotoFeed.tsx';
import SiteLayout from '../../layouts/SiteSimpleLayout/SiteLayout.tsx';
import styles from './InstagramPage.module.scss';

export default function InstagramPage() {
  return (
    <SiteLayout className={styles.layout}>
      <PhotoFeed />
    </SiteLayout>
  );
}
