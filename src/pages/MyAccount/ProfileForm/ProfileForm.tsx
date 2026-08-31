import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import PhotoUploader from '~/components/PhotoUploader/PhotoUploader.tsx';
import Button from '~/components/Button/Button.tsx';
import styles from '../MyAccount.module.scss';
import {useEditProfile, useUploadUserPhoto, useUserCountries, type UserProfile} from '@brutmaps/api';
import AccountDelete from '~/pages/MyAccount/AccountDelete/AccountDelete.tsx';
import {fileToBase64} from '~/util/fileToBase64.ts';
import {useTranslation} from 'react-i18next';

interface ProfileEditFrom {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  is_subscribed: string;
}

interface ProfileFormProps {
  data: UserProfile | null;
  refetch: () => Promise<unknown>;
  setIsEditing: (isEditing: boolean) => void;
}

export default function ProfileForm({data, refetch, setIsEditing}: ProfileFormProps) {
  const {t} = useTranslation();
  const {editProfile, isLoading: isMutating} = useEditProfile();
  const {uploadUserPhoto} = useUploadUserPhoto();

  const [photoPreview, setPhotoPreview] = useState<string | null>(data?.photoUrl || null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<ProfileEditFrom>();

  const {countries, isLoading: isLoadingCountries} = useUserCountries();

  useEffect(() => {
    if (data?.photoUrl) {
      setPhotoPreview(data.photoUrl);
    }
  }, [data]);

  useEffect(() => {
    reset({
      firstName: data?.firstName ?? '',
      lastName: data?.lastName ?? '',
      email: data?.email,
      country: data?.country ?? '',
      is_subscribed: data?.isSubscribed ? 'true' : '',
    });
  }, [data, reset]);

  const handlePhotoChange = (file: File | null) => {
    setPhotoFile(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  const onSubmit = async (formData: ProfileEditFrom) => {
    try {
      const photoUrl = photoFile ? await uploadUserPhoto(await fileToBase64(photoFile), photoFile.name) : undefined;

      await editProfile({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        country: formData.country,
        photoUrl,
      });

      setIsEditing(false);
      await refetch();
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

        {!isLoadingCountries && countries.length > 0 && (
          <div className='form__fieldset'>
            <label>{t('auth.country')}</label>
            <select id='country' {...register('country', {required: t('errors.inputRequired')})}>
              <option defaultChecked>{t('auth.country')}</option>
              {countries.map(({code, name}) => (
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
          <AccountDelete />
        </div>
      </div>
    </form>
  );
}
