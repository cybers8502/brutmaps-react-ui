import {FieldErrors, useForm, UseFormRegister} from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import {fetchWithToken} from '~/util/auth.ts';
import Button from '~/components/Button/Button.tsx';
import styles from '../MyAccount.module.scss';
import PasswordField from '~/pages/AuhServices/components/PasswordField/PasswordField.tsx';
import {useState} from 'react';
import apiRoutes from '~/util/apiRoutes.ts';
import {useTranslation} from 'react-i18next';

const updatePassword = async (url: string, {arg}: {arg: FormData}) => {
  return await fetchWithToken(url, {
    method: 'POST',
    body: arg,
  });
};

export default function ChangePasswordForm({setIsChangingPassword}) {
  const {t} = useTranslation();
  const [apiError, setApiError] = useState('');
  const {trigger: updatePass, isMutating} = useSWRMutation(
    import.meta.env.VITE_SITE_URI + apiRoutes.changePassword,
    updatePassword,
  );

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setApiError('');

    try {
      const form = new FormData();
      form.append('current_password', data.currentPassword);
      form.append('new_password', data.password);

      await updatePass(form);
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
