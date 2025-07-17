import Logo from '../Logo/Logo.tsx';
import classNames from 'classnames';
import styles from './SiteHead.module.scss';
import Menu from '../Menu/Menu.tsx';
import Hamburger from '../Hamburger/Hamburger.tsx';
import {useState} from 'react';
import useMobileState from '../../hooks/useMobileState.ts';
import {CancelIcon} from '../Icons/Icons.tsx';
import {Link, useNavigate} from 'react-router-dom';
import routes from '~/util/routes.ts';
import {clearTokens, getAccessToken} from '~/util/auth.ts';
import AuthControls from '~/components/SiteHead/AuthControls/AuthControls.tsx';
import SocialLinks from '~/components/SiteHead/SocialLinks/SocialLinks.tsx';
import {invalidateMapData} from '~/util/mutateMapData.ts';

interface SiteHeadProps {
  className?: string;
}

export default function SiteHead({className}: SiteHeadProps) {
  const [isActive, setIsActive] = useState(false);
  const isMobileView = useMobileState();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('logout');
    clearTokens();
    invalidateMapData();
    navigate(routes.login);
  };

  return (
    <header className={classNames(className, styles.head)}>
      <Logo />
      {!isMobileView && (
        <div
          className={'is-desktop'}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
          <Menu />

          <SocialLinks />

          <div className={styles.authControls}>
            {getAccessToken() ? (
              <AuthControls />
            ) : (
              <>
                <Link to={routes.login}>Log In</Link>
                <Link to={routes.registration}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
      {isMobileView && <Hamburger onClick={() => setIsActive((prevState) => !prevState)} />}
      {isActive && (
        <div className={classNames(styles['mobile-head'], 'is-mobile')}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBlockEnd: 29,
              padding: 20,
            }}>
            <Logo />
            <button onClick={() => setIsActive((prevState) => !prevState)} style={{color: '#DFDDD9'}}>
              <CancelIcon />
            </button>
          </div>
          <Menu />

          <div className={styles.authControls}>
            {getAccessToken() ? (
              <>
                <Link to={routes.myAccount}>My Account</Link>
                <Link to={routes.favoriteSights}>My Favorite Objects</Link>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to={routes.login}>Login</Link>
                <Link to={routes.registration}>Register</Link>
              </>
            )}
          </div>

          <SocialLinks />
        </div>
      )}
    </header>
  );
}
