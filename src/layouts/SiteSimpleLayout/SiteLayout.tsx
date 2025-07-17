import styles from './SiteSimpleLayout.module.scss';
import {ReactNode} from 'react';
import classNames from 'classnames';
import SiteHead from '../../components/SiteHead/SiteHead.tsx';

interface SiteLayoutProps {
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}

export default function SiteLayout({className, contentClassName, children}: SiteLayoutProps) {
  return (
    <main className={classNames(styles.site, className)}>
      <SiteHead className={classNames(styles.head)} />
      <section className={classNames(styles.content, contentClassName)}>
        <div className={'site-centered'}>{children}</div>
      </section>
    </main>
  );
}
