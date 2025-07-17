import styles from './PageTitle.module.scss';
import classNames from 'classnames';
import {ReactNode} from 'react';

interface PageTitleProps {
  className?: string;
  children: ReactNode;
}

export default function PageTitle({className, children}: PageTitleProps) {
  return <h1 className={classNames(styles.title, className)}>{children}</h1>;
}
