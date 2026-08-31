import {Link, useNavigate} from 'react-router-dom';
import routes from '~/util/routes.ts';
import {clearTokens} from '~/util/auth.ts';
import useProfileData from '~/hooks/fetchApi/useFetchUserProfile.tsx';
import styles from './AuthControls.module.scss';
import {invalidateMapData} from '~/util/mutateMapData.ts';
import {useTranslation} from 'react-i18next';

export default function AuthControls() {
  const {t} = useTranslation();
  const {data: userProfile} = useProfileData();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('logout');
    clearTokens();
    invalidateMapData();
    navigate(routes.login);
  };

  return (
    <div className={styles.container}>
      {userProfile?.data?.photo_url && (
        <picture className={styles.picture}>
          <img src={userProfile?.data?.photo_url} alt={t('account.profileAlt')} className='profile-photo' />
        </picture>
      )}
      <span className={styles.name}>{userProfile?.data?.first_name}</span>

      <svg xmlns='http://www.w3.org/2000/svg' width='14' height='8' viewBox='0 0 14 8' fill='none'>
        <path d='M7 7.5L0.938144 -3.44413e-06L13.0625 -2.38419e-06L7 7.5Z' fill='white' />
      </svg>

      <ul className={styles.popup}>
        <li>
          <Link to={routes.myAccount}>{t('siteHead.myAccount')}</Link>
        </li>
        <li>
          <Link to={routes.favoriteSights}>{t('siteHead.myFavoriteObjects')}</Link>
        </li>
        <li>
          <button onClick={handleLogout}>{t('siteHead.logout')}</button>
        </li>
      </ul>
    </div>
  );
}
