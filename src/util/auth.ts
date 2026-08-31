import {refreshAuthToken as refreshAuthTokenMutation} from '@brutmaps/api';
import apolloClient from '~/apolloClient.ts';
import {clearTokens, getAccessToken, getRefreshToken, isExpired, setAccessToken} from '~/util/tokenStorage.ts';

export {saveTokens, clearTokens, getAccessToken, getRefreshToken, removeAccessToken, removeRefreshToken} from '~/util/tokenStorage.ts';

let inFlightRefresh: Promise<string | null> | null = null;

interface RequestInit {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: BodyInit | null;
}

async function refreshAuthToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('Refresh token is missing.');
  }

  const authToken = await refreshAuthTokenMutation(apolloClient, refreshToken);
  setAccessToken(authToken);
  return authToken;
}

async function ensureFreshToken(): Promise<string> {
  let token = getAccessToken();
  if (!token || isExpired(token)) {
    if (!inFlightRefresh) {
      inFlightRefresh = (async () => {
        try {
          return await refreshAuthToken();
        } finally {
          const t = inFlightRefresh;
          setTimeout(() => {
            if (inFlightRefresh === t) inFlightRefresh = null;
          }, 0);
        }
      })();
    }
    const refreshed = await inFlightRefresh;
    if (!refreshed) {
      clearTokens();
      throw new Error('Unable to refresh auth token.');
    }
    token = refreshed;
  }

  return token;
}

export async function fetchWithToken(url: string, options?: RequestInit) {
  const authToken = await ensureFreshToken();
  const doFetch = (bearer: string) =>
    fetch(url, {
      ...options,
      headers: {
        ...(options?.headers || {}),
        Authorization: `Bearer ${bearer}`,
      },
    });

  let response = await doFetch(authToken);

  if (response.status === 401 || response.status === 419) {
    try {
      const fresh = await ensureFreshToken();
      response = await doFetch(fresh);
    } catch (e) {
      clearTokens();
      throw e instanceof Error ? e : new Error('Unauthorized and refresh failed.');
    }
  }

  let responseData = null;
  try {
    responseData = await response.json();
  } catch {
    // no JSON body in the response
  }

  if (!response.ok) {
    throw new Error(responseData?.message || 'Request failed.');
  }

  return responseData;
}
