import {ReactNode} from 'react';
import classNames from 'classnames';
import styles from './SitePopupLayout.module.scss';

// The site header lives in RootLayout now (rendered once, outside the routed
// page tree) so it doesn't remount on every navigation — this wraps only the
// page content area within it.
interface SitePopupLayoutProps {
  className?: string;
  children: ReactNode;
}

export default function SitePopupLayout({className, children}: SitePopupLayoutProps) {
  return (
    <div className={classNames(styles.site, className, 'popup-page')}>
      <section className={classNames(styles.content, className)}>
        <div className={'site-centered'}>{children}</div>
      </section>
    </div>
  );
}
