import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';
import apiRoutes from '~/util/apiRoutes.ts';

interface RequestInit {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: BodyInit | null;
}

export const saveTokens = (accessToken: string, refreshToken: string, email: string) => {
  Cookies.set('authToken', accessToken, {
    expires: 1 / 96,
    secure: true,
    sameSite: 'Strict',
  });
  Cookies.set('refreshToken', JSON.stringify({refreshToken: refreshToken, email: email}), {
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

async function refreshAuthToken() {
  const refreshTokenData = await getRefreshToken();

  if (!refreshTokenData) {
    throw new Error('Refresh token is missing.');
  }

  const {email, refreshToken} = JSON.parse(refreshTokenData);

  const response = await fetch(import.meta.env.VITE_SITE_URI + apiRoutes.refreshToken, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, refresh_token: refreshToken}),
  });

  if (!response.ok) throw new Error('Failed to refresh token');

  const data = await response.json();
  Cookies.set('authToken', data.access_token);
  Cookies.set('refreshToken', data.refresh_token);
  return data.access_token;
}

export async function fetchWithToken(url: string, options?: RequestInit) {
  let authToken = Cookies.get('authToken');

  if (authToken) {
    const decodedToken = jwtDecode(authToken);
    const currentTime = Date.now() / 1000;

    if (!decodedToken?.exp) throw new Error('Token decoded is missing.');

    if (decodedToken.exp < currentTime) {
      try {
        authToken = await refreshAuthToken();
      } catch (error) {
        clearTokens();
        throw error;
      }
    }
  } else {
    throw new Error('Authentication token is missing.');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${authToken}`,
    },
  });

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
