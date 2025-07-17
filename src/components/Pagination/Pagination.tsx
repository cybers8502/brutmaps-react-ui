import styles from './Pagination.module.scss';
import classNames from 'classnames';
import {Link} from 'react-router-dom';

interface PaginationProps {
  page: number;
  pageCount: number;
}

export default function Pagination({page, pageCount}: PaginationProps) {
  if (pageCount <= 1) return null;

  const renderPages = () => {
    if (pageCount <= 5) {
      return Array.from({length: pageCount}, (_, i) => (
        <Link
          key={i + 1}
          to={`?page=${i + 1}`}
          className={classNames(styles.item, {[styles.active]: page === i + 1})}>
          {i + 1}
        </Link>
      ));
    }

    const pages = [];
    pages.push(
      <Link key={1} to={`?page=1`} className={classNames(styles.item, {[styles.active]: page === 1})}>
        1
      </Link>,
    );

    if (page > 3) {
      pages.push(
        <span key='dots-start' className={styles.space}>
          ...
        </span>,
      );
    }

    const start = Math.max(2, page - 1);
    let end = Math.min(pageCount - 1, page + 1);

    if (end < 3) end = 3;

    for (let i = start; i <= end; i++) {
      pages.push(
        <Link key={i} to={`?page=${i}`} className={classNames(styles.item, {[styles.active]: page === i})}>
          {i}
        </Link>,
      );
    }

    if (page <= pageCount - 3) {
      pages.push(
        <span key='dots-end' className={styles.space}>
          ...
        </span>,
      );
    }

    pages.push(
      <Link
        key={pageCount}
        to={`?page=${pageCount}`}
        className={classNames(styles.item, {[styles.active]: page === pageCount})}>
        {pageCount}
      </Link>,
    );

    return pages;
  };

  return (
    <div className={styles.container}>
      <div className={styles.pages}>{renderPages()}</div>
    </div>
  );
}
