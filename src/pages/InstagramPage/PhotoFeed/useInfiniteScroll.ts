import {useEffect, useRef} from 'react';

export function useInfiniteScroll(callback: () => void, canLoad: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canLoad || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) callback();
      },
      {threshold: 1.0},
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [callback, canLoad]);

  return ref;
}
