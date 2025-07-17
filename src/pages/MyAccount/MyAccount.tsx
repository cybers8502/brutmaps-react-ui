import PageTitle from '../../components/PageTitle/PageTitle.tsx';
import SitePopupLayout from '~/layouts/SitePopupLayout/SitePopupLayout.tsx';
import styles from './MyAccount.module.scss';
import {useState} from 'react';
import useProfileData from '~/hooks/fetchApi/useFetchUserProfile.tsx';
import Button from '~/components/Button/Button.tsx';
import ProfileForm from '~/pages/MyAccount/ProfileForm/ProfileForm.tsx';
import ChangePasswordForm from '~/pages/MyAccount/ChangePasswordForm/ChangePasswordForm.tsx';
import useFetchUserCountries from '~/hooks/fetchApi/useFetchUserCountries.tsx';

export default function MyAccount() {
  const {data: userData, isError, isLoading, mutate} = useProfileData();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {data: countriesList, isLoading: isLoadingCountries} = useFetchUserCountries();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading profile.</p>;

  const profile = userData?.data || null;

  return (
    <SitePopupLayout>
      <div className={styles.container}>
        <div className={styles.frame}>
          <div className={styles.mainBlock}>
            <div style={{textAlign: 'center'}}>
              <PageTitle>My profile</PageTitle>
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
                        <img src={profile.photo_url} alt='Profile' className='profile-photo' />
                      </picture>
                    ) : (
                      <div className={styles.picture}>No profile photo</div>
                    )}
                  </div>

                  <div className={styles.profileDetails}>
                    <p>
                      <strong>Email:</strong> {profile?.email}
                    </p>
                    <p>
                      <strong>First Name:</strong> {profile?.first_name || 'N/A'}
                    </p>
                    <p>
                      <strong>Last Name:</strong> {profile?.last_name || 'N/A'}
                    </p>
                    {!isLoadingCountries && countriesList && (
                      <p>
                        <strong>Country:</strong> {countriesList[profile?.country || ''] || 'N/A'}
                      </p>
                    )}
                    <p>
                      <strong>Subscribed to Newsletter:</strong> {profile?.is_subscribed ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>

                <div className={styles.buttonWrapper}>
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  <Button onClick={() => setIsChangingPassword(true)}>Change Password</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </SitePopupLayout>
  );
}
