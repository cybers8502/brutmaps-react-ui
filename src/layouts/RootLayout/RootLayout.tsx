import {Outlet} from 'react-router-dom';
import PageLoader from '~/components/PageLoader/PageLoader.tsx';
import SiteHead from '~/components/SiteHead/SiteHead.tsx';
import {PageLoadingProvider} from '~/context/PageLoadingContext.tsx';
import styles from './RootLayout.module.scss';

export default function RootLayout() {
  return (
    <PageLoadingProvider>
      <div className={styles.root}>
        <SiteHead />
        <main className={styles.main}>
          <Outlet />
        </main>
        <PageLoader />
      </div>
    </PageLoadingProvider>
  );
}
