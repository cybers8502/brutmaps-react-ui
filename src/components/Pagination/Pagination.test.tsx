import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe, expect, it} from 'vitest';
import Pagination from './Pagination';
import styles from './Pagination.module.scss';

const renderPagination = (page: number, pageCount: number) =>
  render(<Pagination page={page} pageCount={pageCount} />, {wrapper: MemoryRouter});

describe('Pagination', () => {
  it('renders nothing when there is one page or fewer', () => {
    const {container} = renderPagination(1, 1);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a link for every page when the page count is small', () => {
    renderPagination(2, 4);
    ['1', '2', '3', '4'].forEach((label) => {
      expect(screen.getByRole('link', {name: label})).toBeInTheDocument();
    });
  });

  it('marks the current page as active', () => {
    renderPagination(2, 4);
    expect(screen.getByRole('link', {name: '2'})).toHaveClass(styles.active);
    expect(screen.getByRole('link', {name: '1'})).not.toHaveClass(styles.active);
  });

  it('collapses distant pages behind ellipses for a large page count', () => {
    renderPagination(10, 20);

    expect(screen.getByRole('link', {name: '1'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: '20'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: '9'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: '11'})).toBeInTheDocument();
    expect(screen.queryByRole('link', {name: '5'})).not.toBeInTheDocument();

    const dots = screen.getAllByText('...');
    expect(dots).toHaveLength(2);
  });

  it('links each page to the correct query string', () => {
    renderPagination(1, 3);
    expect(screen.getByRole('link', {name: '2'})).toHaveAttribute('href', '/?page=2');
  });
});
