import Cookies from 'js-cookie';

const COOKIE_KEY = 'wcSessionToken';

export const getWcSessionToken = () => Cookies.get(COOKIE_KEY) ?? null;

export const saveWcSessionToken = (token: string) =>
  Cookies.set(COOKIE_KEY, token, {expires: 14, secure: true, sameSite: 'Strict'});

export const clearWcSessionToken = () => Cookies.remove(COOKIE_KEY);
