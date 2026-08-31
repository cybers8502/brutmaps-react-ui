import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import PhotoUploader from '~/components/PhotoUploader/PhotoUploader.tsx';
import {fetchWithToken} from '~/util/auth.ts';
import Button from '~/components/Button/Button.tsx';
import styles from '../MyAccount.module.scss';
import useFetchUserCountries from '~/hooks/fetchApi/useFetchUserCountries.tsx';
import apiRoutes from '~/util/apiRoutes.ts';
import AccountDelete from '~/pages/MyAccount/AccountDelete/AccountDelete.tsx';
import {IUserData} from '~/pages/MyAccount/UserData.interface.ts';
import {useTranslation} from 'react-i18next';

interface ProfileEditFrom {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  is_subscribed: string;
}

interface ProfileFormProps {
  data: IUserData | null;
  mutate: (url: string) => Promise<IUserData>;
  setIsEditing: (isEditing: boolean) => void;
}

const updateUserProfile = async (url: string, {arg}: {arg: FormData}) => {
  return await fetchWithToken(url, {
    method: 'POST',
    body: arg,
  });
};

export default function ProfileForm({data, mutate, setIsEditing}: ProfileFormProps) {
  const {t} = useTranslation();
  const {trigger: updateProfile, isMutating} = useSWRMutation(
    import.meta.env.VITE_SITE_URI + apiRoutes.editProfile,
    updateUserProfile,
  );

  const [photoPreview, setPhotoPreview] = useState<string | null>(data?.photo_url || null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<ProfileEditFrom>();

  const {data: countriesList, isLoading: isLoadingCountries} = useFetchUserCountries();

  useEffect(() => {
    if (data?.photo_url) {
      setPhotoPreview(data.photo_url);
    }
  }, [data]);

  useEffect(() => {
    reset({
      firstName: data?.first_name,
      lastName: data?.last_name,
      email: data?.email,
      country: data?.country,
      is_subscribed: data?.is_subscribed,
    });
  }, [data, reset]);

  const handlePhotoChange = (file: File | null) => {
    setPhotoFile(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  const onSubmit = async (formData: ProfileEditFrom) => {
    try {
      const form = new FormData();
      form.append('email', formData.email);
      form.append('first_name', formData.firstName);
      form.append('last_name', formData.lastName);
      form.append('country', formData.country);
      form.append('subscribe_to_newsletter', String(formData.is_subscribed));

      if (photoFile) {
        form.append('photo', photoFile);
      }

      await updateProfile(form);
      setIsEditing(false);

      await mutate(import.meta.env.VITE_SITE_URI + apiRoutes.userProfile);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  if (!data) return null;

  return (
    <form className={'form'} onSubmit={handleSubmit(onSubmit)}>
      <PhotoUploader onPhotoChange={handlePhotoChange} photoPreview={photoPreview} />

      <div className={'form__fieldsgroup'}>
        <div className='form__fieldset'>
          <label>{t('auth.email')}</label>
          <input type='email' {...register('email', {required: t('errors.emailRequired')})} />
          {errors.email && <p className='error'>{errors.email.message}</p>}
        </div>

        <div className='form__fieldset'>
          <label>{t('auth.firstName')}</label>
          <input type='text' {...register('firstName', {required: t('errors.inputRequired')})} />
          {errors.firstName && <p className='error'>{errors.firstName.message}</p>}
        </div>

        <div className='form__fieldset'>
          <label>{t('auth.lastName')}</label>
          <input type='text' {...register('lastName', {required: t('errors.inputRequired')})} />
          {errors.lastName && <p className='error'>{errors.lastName.message}</p>}
        </div>

        {!isLoadingCountries && countriesList && (
          <div className='form__fieldset'>
            <label>{t('auth.country')}</label>
            <select id='country' {...register('country', {required: t('errors.inputRequired')})}>
              <option defaultChecked>{t('auth.country')}</option>
              {Object.entries(countriesList).map(([code, name]) => (
                <option key={code} value={code} defaultChecked={code === data.country}>
                  {name}
                </option>
              ))}
            </select>
            {errors.country && <p className='error'>{errors.country.message}</p>}
          </div>
        )}

        {/*TODO if user is deleted on mailchimp to show a notification that it couldn't be subscribe*/}
        <label className='checkbox'>
          <input type='checkbox' {...register('is_subscribed')} />
          <span>{t('auth.agreeNewsletter')}</span>
        </label>

        <div className={styles.buttonWrapper}>
          <Button isSubmit disabled={isMutating}>
            {isMutating ? t('common.saving') : t('account.saveChanges')}
          </Button>
          <Button onClick={() => setIsEditing(false)}>{t('common.cancel')}</Button>
          <AccountDelete userId={data.user_id} />
        </div>
      </div>
    </form>
  );
}
