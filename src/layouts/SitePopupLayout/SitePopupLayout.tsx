import {ReactNode} from 'react';
import classNames from 'classnames';
import styles from './SitePopupLayout.module.scss';
import SiteHead from '~/components/SiteHead/SiteHead.tsx';

interface SitePopupLayoutProps {
  className?: string;
  children: ReactNode;
}

export default function SitePopupLayout({className, children}: SitePopupLayoutProps) {
  return (
    <main className={classNames(styles.site, className, 'popup-page')}>
      <SiteHead className={classNames(styles.head)} />
      <section className={classNames(styles.content, className)}>
        <div className={'site-centered'}>{children}</div>
      </section>
    </main>
  );
}
