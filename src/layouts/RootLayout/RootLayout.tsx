import {Outlet} from 'react-router-dom';
import AppStoreBanner from '~/components/AppStoreBanner/AppStoreBanner.tsx';
import SiteHead from '~/components/SiteHead/SiteHead.tsx';
import styles from './RootLayout.module.scss';

export default function RootLayout() {
  return (
    <div className={styles.root}>
      <AppStoreBanner />
      <SiteHead />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
