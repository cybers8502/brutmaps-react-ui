import type {ReactNode} from 'react';
import {Navigate} from 'react-router-dom';
import {getAccessToken} from '~/util/auth.ts';
import routes from '~/util/routes.ts';

interface AuthRedirectProps {
  privateRoute?: boolean;
  children: ReactNode;
}

export default function AuthRedirect({privateRoute = false, children}: AuthRedirectProps) {
  const authToken = getAccessToken();

  if (!privateRoute && authToken) {
    return <Navigate to={routes.myAccount} replace />;
  }

  if (privateRoute && !authToken) {
    return <Navigate to={routes.login} replace />;
  }

  return children;
}
