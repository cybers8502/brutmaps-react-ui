import classNames from 'classnames';
import type {ReactNode} from 'react';
import styles from './PageTitle.module.scss';

interface PageTitleProps {
  className?: string;
  children: ReactNode;
}

export default function PageTitle({className, children}: PageTitleProps) {
  return <h1 className={classNames(styles.title, className)}>{children}</h1>;
}
