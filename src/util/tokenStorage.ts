import Cookies from 'js-cookie';

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
