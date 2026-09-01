import {createContext, ReactNode, useCallback, useContext, useEffect, useId, useRef, useState} from 'react';

interface PageLoadingContextValue {
  isLoading: boolean;
  setLoading: (key: string, isLoading: boolean) => void;
}

const PageLoadingContext = createContext<PageLoadingContextValue | null>(null);

export function PageLoadingProvider({children}: {children: ReactNode}) {
  const loaders = useRef(new Map<string, boolean>());
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = useCallback((key: string, loading: boolean) => {
    if (loading) loaders.current.set(key, true);
    else loaders.current.delete(key);

    setIsLoading(loaders.current.size > 0);
  }, []);

  return (
    <PageLoadingContext.Provider value={{isLoading, setLoading}}>{children}</PageLoadingContext.Provider>
  );
}

function usePageLoadingContext(): PageLoadingContextValue {
  const context = useContext(PageLoadingContext);

  if (!context) {
    throw new Error('usePageLoadingContext must be used within a PageLoadingProvider');
  }

  return context;
}

/** Whether any page/component currently reports itself loading — see useSetPageLoading. */
export function useIsPageLoading(): boolean {
  return usePageLoadingContext().isLoading;
}

/**
 * Reports this component's own loading state into the shared page-loading
 * indicator (see PageLoader). Pass the same `isLoading` flag the component
 * already uses to render its own loading UI — no new data fetching needed.
 * Automatically un-registers on unmount, so navigating away mid-load can't
 * leave the indicator stuck on.
 */
export function useSetPageLoading(isLoading: boolean): void {
  const {setLoading} = usePageLoadingContext();
  const key = useId();

  useEffect(() => {
    setLoading(key, isLoading);
  }, [key, isLoading, setLoading]);

  useEffect(() => {
    return () => setLoading(key, false);
  }, [key, setLoading]);
}
