import Loader from '~/components/Loader/Loader.tsx';
import styles from './PageContentLoader.module.scss';

// Self-contained positioning context + min-height, so it can drop in
// wherever a page's content would otherwise render, with no need for the
// surrounding markup to be sized or positioned itself.
export default function PageContentLoader() {
  return (
    <div className={styles.wrap}>
      <Loader />
    </div>
  );
}
