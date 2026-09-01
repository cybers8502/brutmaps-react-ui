import PageTitle from '../../components/PageTitle/PageTitle.tsx';
import SitePopupLayout from '~/layouts/SitePopupLayout/SitePopupLayout.tsx';
import styles from './MyAccount.module.scss';
import {useState} from 'react';
import {useProfile, useUserCountries} from '@brutmaps/api';
import Button from '~/components/Button/Button.tsx';
import ProfileForm from '~/pages/MyAccount/ProfileForm/ProfileForm.tsx';
import ChangePasswordForm from '~/pages/MyAccount/ChangePasswordForm/ChangePasswordForm.tsx';
import {useTranslation} from 'react-i18next';
import {useSetPageLoading} from '~/context/PageLoadingContext.tsx';

export default function MyAccount() {
  const {t} = useTranslation();
  const {profile, error, isLoading, refetch} = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {countries, isLoading: isLoadingCountries} = useUserCountries();

  useSetPageLoading(isLoading);

  if (isLoading) return null;
  if (error) return <p>{t('account.errorLoadingProfile')}</p>;

  return (
    <SitePopupLayout>
      <div className={styles.container}>
        <div className={styles.frame}>
          <div className={styles.mainBlock}>
            <div style={{textAlign: 'center'}}>
              <PageTitle>{t('account.myProfile')}</PageTitle>
            </div>

            {isEditing ? (
              <ProfileForm data={profile} refetch={refetch} setIsEditing={setIsEditing} />
            ) : isChangingPassword ? (
              <ChangePasswordForm setIsChangingPassword={setIsChangingPassword} />
            ) : (
              <>
                <div className={styles.grid}>
                  <div>
                    {profile?.photoUrl ? (
                      <picture className={styles.picture}>
                        <img src={profile.photoUrl} alt={t('account.profileAlt')} className='profile-photo' />
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
                      {profile?.firstName || t('account.notAvailable')}
                    </p>
                    <p>
                      <strong>{t('account.lastNameLabel')}</strong>{' '}
                      {profile?.lastName || t('account.notAvailable')}
                    </p>
                    {!isLoadingCountries && countries.length > 0 && (
                      <p>
                        <strong>{t('account.countryLabel')}</strong>{' '}
                        {countries.find((c) => c.code === profile?.country)?.name ||
                          t('account.notAvailable')}
                      </p>
                    )}
                    <p>
                      <strong>{t('account.subscribedToNewsletter')}</strong>{' '}
                      {profile?.isSubscribed ? t('account.yes') : t('account.no')}
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
