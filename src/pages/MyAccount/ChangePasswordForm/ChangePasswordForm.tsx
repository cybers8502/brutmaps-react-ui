import {useChangePassword} from '@brutmaps/api';
import {useState} from 'react';
import {type FieldErrors, type UseFormRegister, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import Button from '~/components/Button/Button.tsx';
import PasswordField from '~/pages/AuhServices/components/PasswordField/PasswordField.tsx';
import styles from '../MyAccount.module.scss';

export default function ChangePasswordForm({setIsChangingPassword}) {
  const {t} = useTranslation();
  const [apiError, setApiError] = useState('');
  const {changePassword, isLoading: isMutating} = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setApiError('');

    try {
      await changePassword(data.currentPassword, data.password);
      setIsChangingPassword(false);
      reset();
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError(t('common.unknownError'));
      }
    }
  };

  return (
    <form className={'form'} onSubmit={handleSubmit(onSubmit)}>
      <div className={'form__fieldsgroup'}>
        <div className='form__fieldset'>
          <label>{t('auth.currentPassword')}</label>
          <input type='password' {...register('currentPassword', {required: t('errors.inputRequired')})} />
          {errors.currentPassword && <p className='error'>{errors.currentPassword.message}</p>}
        </div>

        <PasswordField
          register={register as unknown as UseFormRegister<{password: string}>}
          errors={errors as FieldErrors<{password: string}>}
          label={t('auth.newPassword')}
          placeholder={''}
        />

        {apiError && <p className='error'>{apiError}</p>}

        <div className={styles.buttonWrapper}>
          <Button isSubmit disabled={isMutating}>
            {isMutating ? t('common.saving') : t('account.changePassword')}
          </Button>
          <Button onClick={() => setIsChangingPassword(false)}>{t('common.cancel')}</Button>
        </div>
      </div>
    </form>
  );
}
