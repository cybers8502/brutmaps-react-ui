import classNames from 'classnames';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useNavigate} from 'react-router-dom';
import LanguageSwitcher from '~/components/LanguageSwitcher/LanguageSwitcher.tsx';
import AuthControls from '~/components/SiteHead/AuthControls/AuthControls.tsx';
import CartLink from '~/components/SiteHead/CartLink/CartLink.tsx';
import SocialLinks from '~/components/SiteHead/SocialLinks/SocialLinks.tsx';
import {clearTokens, getAccessToken} from '~/util/auth.ts';
import {invalidateMapData} from '~/util/mutateMapData.ts';
import routes from '~/util/routes.ts';
import useMobileState from '../../hooks/useMobileState.ts';
import Hamburger from '../Hamburger/Hamburger.tsx';
import {CancelIcon} from '../Icons/Icons.tsx';
import Logo from '../Logo/Logo.tsx';
import Menu from '../Menu/Menu.tsx';
import styles from './SiteHead.module.scss';

interface SiteHeadProps {
  className?: string;
}

export default function SiteHead({className}: SiteHeadProps) {
  const {t} = useTranslation();
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

          <LanguageSwitcher />

          <CartLink />

          <div className={styles.authControls}>
            {getAccessToken() ? (
              <AuthControls />
            ) : (
              <>
                <Link to={routes.login}>{t('siteHead.logIn')}</Link>
                <Link to={routes.registration}>{t('siteHead.signUp')}</Link>
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

          <CartLink />

          <div className={styles.authControls}>
            {getAccessToken() ? (
              <>
                <Link to={routes.myAccount}>{t('siteHead.myAccount')}</Link>
                <Link to={routes.favoriteSights}>{t('siteHead.myFavoriteObjects')}</Link>
                <button onClick={handleLogout}>{t('siteHead.logout')}</button>
              </>
            ) : (
              <>
                <Link to={routes.login}>{t('siteHead.login')}</Link>
                <Link to={routes.registration}>{t('siteHead.register')}</Link>
              </>
            )}
          </div>

          <LanguageSwitcher />

          <SocialLinks />
        </div>
      )}
    </header>
  );
}
