import {ReactNode} from 'react';
import styles from './AuhServicesLayout.module.scss';

interface AuhServicesLayoutProps {
  children: ReactNode;
}

export default function AuhServicesLayout({children}: AuhServicesLayoutProps) {
  return <div className={styles.frame}>{children}</div>;
}
