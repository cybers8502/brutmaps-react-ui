import useSWR from 'swr';
import {getAccessToken} from '~/util/auth';

const API_BASE = import.meta.env.VITE_SITE_URI || 'http://localhost:8080';

const fetcherWithAuth = async (endpoint: string | {key: string; url: string}) => {
  const url = typeof endpoint === 'string' ? endpoint : endpoint.url;
  const token = getAccessToken();

  const res = await fetch(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Error ${res.status}`);
  }

  return res.json();
};

export function useHandlerApi<T>(
  endpoint: string,
  enabled: boolean = true,
  options?: {
    keyPrefix?: string;
    revalidateOnFocus?: boolean;
    dedupingInterval?: number;
    fallbackData?: T;
  },
) {
  const fullUrl = `${API_BASE}${endpoint}`;
  const cacheKey = options?.keyPrefix ? {key: `${options.keyPrefix}:${endpoint}`, url: fullUrl} : fullUrl;

  const {data, error, mutate} = useSWR(enabled ? cacheKey : null, fetcherWithAuth, {
    revalidateOnFocus: options?.revalidateOnFocus ?? false,
    dedupingInterval: options?.dedupingInterval ?? 60 * 60 * 1000,
    fallbackData: options?.fallbackData,
  });

  return {
    data: data as T | null,
    isLoading: !data && !error,
    error,
    mutate,
  };
}
