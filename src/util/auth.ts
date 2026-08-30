import {jwtDecode, JwtPayload} from 'jwt-decode';
import Cookies from 'js-cookie';
import {gqlFetch} from '~/util/graphql.ts';

const LEEWAY_SEC = 45;
let inFlightRefresh: Promise<string | null> | null = null;

interface RequestInit {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: BodyInit | null;
}

function isExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded?.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < (now + LEEWAY_SEC);
  } catch {
    return true;
  }
}

export const saveTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set('authToken', accessToken, {
    expires: 1 / 96,
    secure: true,
    sameSite: 'Strict',
  });
  Cookies.set('refreshToken', refreshToken, {
    expires: 7,
    secure: true,
    sameSite: 'Strict',
  });
};

export const clearTokens = () => {
  Cookies.remove('authToken');
  Cookies.remove('refreshToken');
};

export const getAccessToken = () => Cookies.get('authToken');

export const getRefreshToken = () => Cookies.get('refreshToken');

export const removeAccessToken = () => Cookies.remove('authToken');

export const removeRefreshToken = () => Cookies.remove('refreshToken');

const REFRESH_TOKEN_MUTATION = `
  mutation RefreshJwtAuthToken($jwtRefreshToken: String!) {
    refreshJwtAuthToken(input: {clientMutationId: "1", jwtRefreshToken: $jwtRefreshToken}) {
      authToken
    }
  }
`;

async function refreshAuthToken() {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    throw new Error('Refresh token is missing.');
  }

  const data = await gqlFetch<{refreshJwtAuthToken: {authToken: string} | null}>(
    REFRESH_TOKEN_MUTATION,
    {jwtRefreshToken: refreshToken},
  );

  const authToken = data.refreshJwtAuthToken?.authToken;
  if (!authToken) throw new Error('Failed to refresh token');

  Cookies.set('authToken', authToken);
  return authToken;
}

async function ensureFreshToken(): Promise<string> {
  let token = getAccessToken();
  console.log('token ', token);
  if (!token || isExpired(token)) {
    console.log('!token');
    if (!inFlightRefresh) {
      inFlightRefresh = (async () => {
        try {
          const newToken = await refreshAuthToken();
          console.log('newToken ', newToken);
          return newToken || getAccessToken() || null;
        } finally {
          console.log('finally');
          const t = inFlightRefresh;
          setTimeout(() => { if (inFlightRefresh === t) inFlightRefresh = null; }, 0);
        }
      })();
    }
    const refreshed = await inFlightRefresh;
    console.log('refreshed ', refreshed);
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
  console.log('authToken ', authToken);
  const doFetch = (bearer: string) =>
    fetch(url, {
      ...options,
      headers: {
        ...(options?.headers || {}),
        Authorization: `Bearer ${bearer}`,
      },
    });

  let response = await doFetch(authToken);

  console.log('response ', response);
  console.log('response.status ', response.status);
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
    console.log('Error fetching token.');
  }

  if (!response.ok) {
    throw new Error(responseData?.message || 'Request failed.');
  }

  return responseData;
}
