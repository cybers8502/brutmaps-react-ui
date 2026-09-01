import {useEffect, useRef, useState} from 'react';
import Loader from '~/components/Loader/Loader.tsx';
import {useIsPageLoading} from '~/context/PageLoadingContext.tsx';
import styles from './PageLoader.module.scss';

// Only show once loading has run long enough to matter, and once shown never
// for less than this long — together these are what keep fast navigations
// flash-free instead of blinking a spinner on and off.
const SHOW_DELAY_MS = 200;
const MIN_VISIBLE_MS = 300;

export default function PageLoader() {
  const isLoading = useIsPageLoading();
  const [visible, setVisible] = useState(false);
  const shownAt = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      const showTimer = setTimeout(() => {
        shownAt.current = Date.now();
        setVisible(true);
      }, SHOW_DELAY_MS);

      return () => clearTimeout(showTimer);
    }

    if (shownAt.current === null) return;

    const remaining = Math.max(0, MIN_VISIBLE_MS - (Date.now() - shownAt.current));
    const hideTimer = setTimeout(() => {
      setVisible(false);
      shownAt.current = null;
    }, remaining);

    return () => clearTimeout(hideTimer);
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      <Loader />
    </div>
  );
}
