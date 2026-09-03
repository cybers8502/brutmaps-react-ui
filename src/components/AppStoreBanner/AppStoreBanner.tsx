import Cookies from 'js-cookie';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {AppleIcon, CancelIcon} from '~/components/Icons/Icons.tsx';
import {appStoreLink} from '~/util/routes.ts';
import styles from './AppStoreBanner.module.scss';

const DISMISSED_COOKIE = 'appStoreBannerDismissed';

export default function AppStoreBanner() {
  const {t} = useTranslation();
  const [isDismissed, setIsDismissed] = useState(() => Cookies.get(DISMISSED_COOKIE) === 'true');

  if (isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    Cookies.set(DISMISSED_COOKIE, 'true', {expires: 365, secure: true, sameSite: 'Strict'});
    setIsDismissed(true);
  };

  return (
    <div className={styles.banner}>
      <Link to={appStoreLink} target='_blank' rel='noopener noreferrer' className={styles.link}>
        <AppleIcon size={24} />
        <span className={styles.text}>{t('appBanner.text')}</span>
        <span className={styles.cta}>{t('appBanner.cta')}</span>
      </Link>
      <button
        type='button'
        onClick={handleDismiss}
        className={styles.close}
        aria-label={t('appBanner.dismiss')}>
        <CancelIcon size={14} />
      </button>
    </div>
  );
}
