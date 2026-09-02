import {useEffect, useRef} from 'react';

// Starts loading the next page before the sentinel actually reaches the
// bottom of the viewport, so content keeps appearing ahead of the scroll
// instead of the user hitting a visible gap first.
const PREFETCH_MARGIN = '600px';

export function useInfiniteScroll(callback: () => void, canLoad: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canLoad || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) callback();
      },
      {rootMargin: PREFETCH_MARGIN},
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [callback, canLoad]);

  return ref;
}
