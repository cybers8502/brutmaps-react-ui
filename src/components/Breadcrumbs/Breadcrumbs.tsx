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

// Escaping "<" keeps a name/title containing "</script>" from breaking out
// of the JSON-LD script tag.
function buildSchema(items: BreadcrumbItem[]): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path ? {item: `${window.location.origin}${item.path}`} : {}),
    })),
  };

  return JSON.stringify(schema).replace(/</g, '\\u003c');
}

const Breadcrumbs = ({items}: BreadcrumbsProps) => {
  return (
    <nav className={styles.breadcrumbs} aria-label='Breadcrumb'>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD, not HTML — React's default escaping would corrupt it; "<" is manually escaped above. */}
      <script type='application/ld+json' dangerouslySetInnerHTML={{__html: buildSchema(items)}} />
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.path ? <Link to={item.path}>{item.name}</Link> : <span>{item.name}</span>}
          {index < items.length - 1 && ' | '}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
