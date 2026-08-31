import {jwtDecode, JwtPayload} from 'jwt-decode';
import Cookies from 'js-cookie';

const LEEWAY_SEC = 45;

export function isExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded?.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now + LEEWAY_SEC;
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

export const setAccessToken = (accessToken: string) => Cookies.set('authToken', accessToken);

export const clearTokens = () => {
  Cookies.remove('authToken');
  Cookies.remove('refreshToken');
};

export const getAccessToken = () => Cookies.get('authToken');

export const getRefreshToken = () => Cookies.get('refreshToken');

export const removeAccessToken = () => Cookies.remove('authToken');

export const removeRefreshToken = () => Cookies.remove('refreshToken');
