import PageTitle from '../../components/PageTitle/PageTitle.tsx';
import SitePopupLayout from '~/layouts/SitePopupLayout/SitePopupLayout.tsx';
import styles from './MyAccount.module.scss';
import {useState} from 'react';
import useProfileData from '~/hooks/fetchApi/useFetchUserProfile.tsx';
import Button from '~/components/Button/Button.tsx';
import ProfileForm from '~/pages/MyAccount/ProfileForm/ProfileForm.tsx';
import ChangePasswordForm from '~/pages/MyAccount/ChangePasswordForm/ChangePasswordForm.tsx';
import useFetchUserCountries from '~/hooks/fetchApi/useFetchUserCountries.tsx';
import {useTranslation} from 'react-i18next';

export default function MyAccount() {
  const {t} = useTranslation();
  const {data: userData, isError, isLoading, mutate} = useProfileData();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {data: countriesList, isLoading: isLoadingCountries} = useFetchUserCountries();

  if (isLoading) return <p>{t('common.loading')}</p>;
  if (isError) return <p>{t('account.errorLoadingProfile')}</p>;

  const profile = userData?.data || null;

  return (
    <SitePopupLayout>
      <div className={styles.container}>
        <div className={styles.frame}>
          <div className={styles.mainBlock}>
            <div style={{textAlign: 'center'}}>
              <PageTitle>{t('account.myProfile')}</PageTitle>
            </div>

            {isEditing ? (
              <ProfileForm data={profile} mutate={mutate} setIsEditing={setIsEditing} />
            ) : isChangingPassword ? (
              <ChangePasswordForm setIsChangingPassword={setIsChangingPassword} />
            ) : (
              <>
                <div className={styles.grid}>
                  <div>
                    {profile?.photo_url ? (
                      <picture className={styles.picture}>
                        <img src={profile.photo_url} alt={t('account.profileAlt')} className='profile-photo' />
                      </picture>
                    ) : (
                      <div className={styles.picture}>{t('account.noProfilePhoto')}</div>
                    )}
                  </div>

                  <div className={styles.profileDetails}>
                    <p>
                      <strong>{t('account.emailLabel')}</strong> {profile?.email}
                    </p>
                    <p>
                      <strong>{t('account.firstNameLabel')}</strong>{' '}
                      {profile?.first_name || t('account.notAvailable')}
                    </p>
                    <p>
                      <strong>{t('account.lastNameLabel')}</strong>{' '}
                      {profile?.last_name || t('account.notAvailable')}
                    </p>
                    {!isLoadingCountries && countriesList && (
                      <p>
                        <strong>{t('account.countryLabel')}</strong>{' '}
                        {countriesList[profile?.country || ''] || t('account.notAvailable')}
                      </p>
                    )}
                    <p>
                      <strong>{t('account.subscribedToNewsletter')}</strong>{' '}
                      {profile?.is_subscribed ? t('account.yes') : t('account.no')}
                    </p>
                  </div>
                </div>

                <div className={styles.buttonWrapper}>
                  <Button onClick={() => setIsEditing(true)}>{t('account.editProfile')}</Button>
                  <Button onClick={() => setIsChangingPassword(true)}>{t('account.changePassword')}</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </SitePopupLayout>
  );
}
