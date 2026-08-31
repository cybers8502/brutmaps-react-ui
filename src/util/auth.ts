import {ensureFreshToken, forceRefresh} from '~/apolloClient.ts';
import {clearTokens} from '~/util/tokenStorage.ts';

export {
  saveTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
} from '~/util/tokenStorage.ts';

interface RequestInit {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: BodyInit | null;
}

export async function fetchWithToken(url: string, options?: RequestInit) {
  const authToken = await ensureFreshToken();
  if (!authToken) {
    clearTokens();
    throw new Error('Unable to refresh auth token.');
  }

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
    // The token looked fresh but the server rejected it anyway — force a
    // refresh rather than re-checking expiry, which would just hand back
    // the same token again.
    const fresh = await forceRefresh();
    if (!fresh) {
      clearTokens();
      throw new Error('Unauthorized and refresh failed.');
    }
    response = await doFetch(fresh);
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
