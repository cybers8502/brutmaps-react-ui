import {Suspense} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {ApolloProvider} from '@apollo/client/react';
import {GoogleOAuthProvider} from 'react-oauth-google';
import {ErrorBoundary} from 'react-error-boundary';
import {useTranslation} from 'react-i18next';
import routes from './util/routes.ts';
import apolloClient from './apolloClient.ts';
import {MapProvider} from './context/MapContext.tsx';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.tsx';
import AuthRedirect from '~/routes/AuthRedirect.tsx';

import CommonMap from '~/pages/CommonMap/CommonMap.tsx';
import SightPage from '~/pages/SightPage/SightPage.tsx';
import BlogRootPage from '~/pages/BlogRootPage/BlogRootPage.tsx';
import BlogArticle from '~/pages/BlogArticle/BlogArticle.tsx';
import ShopPage from '~/pages/ShopPage/ShopPage.tsx';
import ProductPage from '~/pages/ProductPage/ProductPage.tsx';
import MyAccount from '~/pages/MyAccount/MyAccount.tsx';
import Login from '~/pages/AuhServices/Login/Login.tsx';
import Registration from '~/pages/AuhServices/Registration/Registration.tsx';
import LostPasswordPage from '~/pages/AuhServices/PasswordRecovery/LostPasswordPage.tsx';
import ResetPasswordPage from '~/pages/AuhServices/PasswordRecovery/ResetPasswordPage.tsx';
import FavoriteSights from '~/pages/FavoriteSights/FavoriteSights.tsx';
import TermsNConditions from '~/pages/TermsNConditions/TermsNConditions.tsx';
import OrderReceived from '~/pages/OrderReceived/OrderReceived.tsx';
import Checkout from '~/pages/Checkout/Checkout.tsx';
import InstagramPage from '~/pages/InstagramPage/InstagramPage.tsx';

function ErrorFallback() {
  const {t} = useTranslation();
  return <div>{t('common.somethingWentWrong')}</div>;
}

export default function App() {
  const {t} = useTranslation();

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <ApolloProvider client={apolloClient}>
        <MapProvider>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <BrowserRouter>
              <Suspense fallback={<div>{t('common.loadingData')}</div>}>
                <Routes>
                  <Route path={routes.commonMap} element={<CommonMap />} />
                  <Route path={`${routes.sightSinglePage}/:slug`} element={<SightPage />} />
                  <Route path={routes.blog} element={<BlogRootPage />} />
                  <Route path={routes.instagram} element={<InstagramPage />} />
                  <Route path={`${routes.blog}/:slug`} element={<BlogArticle />} />
                  <Route path={routes.shop} element={<ShopPage />} />
                  <Route path={`${routes.productSinglePage}/:slug`} element={<ProductPage />} />
                  <Route path={routes.checkout} element={<Checkout />} />
                  <Route path={routes.termsNConditions} element={<TermsNConditions />} />
                  <Route path='/checkout/order-received/:orderId' element={<OrderReceived />} />
                  <Route
                    path={routes.login}
                    element={
                      <AuthRedirect>
                        <Login />
                      </AuthRedirect>
                    }
                  />
                  <Route
                    path={routes.registration}
                    element={
                      <AuthRedirect>
                        <Registration />
                      </AuthRedirect>
                    }
                  />
                  <Route
                    path={routes.lostPassword}
                    element={
                      <AuthRedirect>
                        <LostPasswordPage />
                      </AuthRedirect>
                    }
                  />
                  <Route
                    path={routes.resetPassword}
                    element={
                      <AuthRedirect>
                        <ResetPasswordPage />
                      </AuthRedirect>
                    }
                  />
                  <Route
                    path={routes.myAccount}
                    element={
                      <AuthRedirect privateRoute>
                        <MyAccount />
                      </AuthRedirect>
                    }
                  />
                  <Route
                    path={routes.favoriteSights}
                    element={
                      <AuthRedirect privateRoute>
                        <FavoriteSights />
                      </AuthRedirect>
                    }
                  />
                  <Route path='*' element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </GoogleOAuthProvider>
        </MapProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
}
