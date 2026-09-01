import {ApolloProvider} from '@apollo/client/react';
import {Suspense} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {useTranslation} from 'react-i18next';
import {GoogleOAuthProvider} from 'react-oauth-google';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import RootLayout from '~/layouts/RootLayout/RootLayout.tsx';
import AboutPage from '~/pages/AboutPage/AboutPage.tsx';
import Login from '~/pages/AuhServices/Login/Login.tsx';
import LostPasswordPage from '~/pages/AuhServices/PasswordRecovery/LostPasswordPage.tsx';
import ResetPasswordPage from '~/pages/AuhServices/PasswordRecovery/ResetPasswordPage.tsx';
import Registration from '~/pages/AuhServices/Registration/Registration.tsx';
import BlogArticle from '~/pages/BlogArticle/BlogArticle.tsx';
import BlogRootPage from '~/pages/BlogRootPage/BlogRootPage.tsx';
import CartPage from '~/pages/CartPage/CartPage.tsx';
import Checkout from '~/pages/Checkout/Checkout.tsx';
import CommonMap from '~/pages/CommonMap/CommonMap.tsx';
import FavoriteSights from '~/pages/FavoriteSights/FavoriteSights.tsx';
import InstagramPage from '~/pages/InstagramPage/InstagramPage.tsx';
import MyAccount from '~/pages/MyAccount/MyAccount.tsx';
import ObjectsPage from '~/pages/ObjectsPage/ObjectsPage.tsx';
import OrderReceived from '~/pages/OrderReceived/OrderReceived.tsx';
import ProductPage from '~/pages/ProductPage/ProductPage.tsx';
import ShopPage from '~/pages/ShopPage/ShopPage.tsx';
import SightPage from '~/pages/SightPage/SightPage.tsx';
import TermsNConditions from '~/pages/TermsNConditions/TermsNConditions.tsx';
import AuthRedirect from '~/routes/AuthRedirect.tsx';
import apolloClient from './apolloClient.ts';
import {MapProvider} from './context/MapContext.tsx';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.tsx';
import routes from './util/routes.ts';

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
                  <Route element={<RootLayout />}>
                    <Route path={routes.commonMap} element={<CommonMap />} />
                    <Route path={`${routes.sightSinglePage}/:slug`} element={<SightPage />} />
                    <Route path={routes.objects} element={<ObjectsPage />} />
                    <Route path={routes.blog} element={<BlogRootPage />} />
                    <Route path={routes.instagram} element={<InstagramPage />} />
                    <Route path={`${routes.blog}/:slug`} element={<BlogArticle />} />
                    <Route path={routes.shop} element={<ShopPage />} />
                    <Route path={routes.about} element={<AboutPage />} />
                    <Route path={`${routes.productSinglePage}/:slug`} element={<ProductPage />} />
                    <Route path={routes.cart} element={<CartPage />} />
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
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </GoogleOAuthProvider>
        </MapProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
}
