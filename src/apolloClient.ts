import {createApolloClient} from '@brutmaps/api';
import {clearTokens, getAccessToken, getRefreshToken, setAccessToken} from '~/util/tokenStorage.ts';

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
});

export {ensureFreshToken, forceRefresh};
export default apolloClient;
