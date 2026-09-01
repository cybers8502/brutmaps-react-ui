import {createApolloClient} from '@brutmaps/api';
import {clearTokens, getAccessToken, getRefreshToken, setAccessToken} from '~/util/tokenStorage.ts';
import {getWcSessionToken, saveWcSessionToken} from '~/util/wcSession.ts';

const {
  client: apolloClient,
  ensureFreshToken,
  forceRefresh,
} = createApolloClient({
  uri: import.meta.env.VITE_SITE_URI,
  getAccessToken: () => getAccessToken() ?? null,
  onAuthError: () => clearTokens(),
  refresh: {
    getRefreshToken: () => getRefreshToken() ?? null,
    saveAccessToken: (token) => {
      setAccessToken(token);
    },
    onRefreshFailure: () => clearTokens(),
  },
  getSessionToken: () => getWcSessionToken(),
  saveSessionToken: (token) => {
    saveWcSessionToken(token);
  },
});

export {ensureFreshToken, forceRefresh};
export default apolloClient;
