import React from 'react';
import {Link} from 'react-router-dom';
import styles from './Breadcrumbs.module.scss';

interface BreadcrumbItem {
  name: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({items}: BreadcrumbsProps) => {
  return (
    <div className={styles.breadcrumbs}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.path ? <Link to={item.path}>{item.name}</Link> : <span>{item.name}</span>}
          {index < items.length - 1 && ' | '}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
