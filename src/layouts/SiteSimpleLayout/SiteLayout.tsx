import styles from './SiteSimpleLayout.module.scss';
import {ReactNode} from 'react';
import classNames from 'classnames';

interface SiteLayoutProps {
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}

// The site header lives in RootLayout now (rendered once, outside the routed
// page tree) so it doesn't remount on every navigation — this wraps only the
// page content area within it.
export default function SiteLayout({className, contentClassName, children}: SiteLayoutProps) {
  return (
    <div className={classNames(styles.site, className)}>
      <section className={classNames(styles.content, contentClassName)}>
        <div className={'site-centered'}>{children}</div>
      </section>
    </div>
  );
}
