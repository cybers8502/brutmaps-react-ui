import {createApolloClient} from '@brutmaps/api';
import {clearTokens, getAccessToken} from '~/util/tokenStorage.ts';

const apolloClient = createApolloClient({
  uri: import.meta.env.VITE_SITE_URI,
  getAccessToken: () => getAccessToken() ?? null,
  onAuthError: () => clearTokens(),
});

export default apolloClient;
