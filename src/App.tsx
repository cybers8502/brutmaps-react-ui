import {ApolloProvider} from '@apollo/client/react';
import {lazy, Suspense} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {useTranslation} from 'react-i18next';
import {GoogleOAuthProvider} from 'react-oauth-google';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import RootLayout from '~/layouts/RootLayout/RootLayout.tsx';
// CommonMap stays eager: it's the "/" landing route, and lazy-loading it
// would add a fetch waterfall (entry chunk -> route chunk) on the page
// that gets hit the most.
import CommonMap from '~/pages/CommonMap/CommonMap.tsx';
import AuthRedirect from '~/routes/AuthRedirect.tsx';
import apolloClient from './apolloClient.ts';
import {MapProvider} from './context/MapContext.tsx';
import routes from './util/routes.ts';

const AboutPage = lazy(() => import('~/pages/AboutPage/AboutPage.tsx'));
const Login = lazy(() => import('~/pages/AuhServices/Login/Login.tsx'));
const LostPasswordPage = lazy(() => import('~/pages/AuhServices/PasswordRecovery/LostPasswordPage.tsx'));
const ResetPasswordPage = lazy(() => import('~/pages/AuhServices/PasswordRecovery/ResetPasswordPage.tsx'));
const Registration = lazy(() => import('~/pages/AuhServices/Registration/Registration.tsx'));
const BlogArticle = lazy(() => import('~/pages/BlogArticle/BlogArticle.tsx'));
const BlogRootPage = lazy(() => import('~/pages/BlogRootPage/BlogRootPage.tsx'));
const CartPage = lazy(() => import('~/pages/CartPage/CartPage.tsx'));
const Checkout = lazy(() => import('~/pages/Checkout/Checkout.tsx'));
const FavoriteSights = lazy(() => import('~/pages/FavoriteSights/FavoriteSights.tsx'));
const InstagramPage = lazy(() => import('~/pages/InstagramPage/InstagramPage.tsx'));
const MyAccount = lazy(() => import('~/pages/MyAccount/MyAccount.tsx'));
const ObjectsPage = lazy(() => import('~/pages/ObjectsPage/ObjectsPage.tsx'));
const OrderReceived = lazy(() => import('~/pages/OrderReceived/OrderReceived.tsx'));
const ProductPage = lazy(() => import('~/pages/ProductPage/ProductPage.tsx'));
const ShopPage = lazy(() => import('~/pages/ShopPage/ShopPage.tsx'));
const SightPage = lazy(() => import('~/pages/SightPage/SightPage.tsx'));
const TermsNConditions = lazy(() => import('~/pages/TermsNConditions/TermsNConditions.tsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage/NotFoundPage.tsx'));

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
