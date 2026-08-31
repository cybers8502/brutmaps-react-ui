import PageTitle from '~/components/PageTitle/PageTitle.tsx';
import SitePopupLayout from '~/layouts/SitePopupLayout/SitePopupLayout.tsx';
import styles from './PasswordRecovery.module.scss';
import {useNavigate, useSearchParams} from 'react-router-dom';
import Button from '~/components/Button/Button.tsx';
import {FieldErrors, useForm, UseFormRegister} from 'react-hook-form';
import {useState} from 'react';
import PasswordField from '~/pages/AuhServices/components/PasswordField/PasswordField.tsx';
import AuhServicesLayout from '~/pages/AuhServices/components/AuhServicesLayout/AuhServicesLayout.tsx';
import {useResetPassword} from '@brutmaps/api';
import routes from '~/util/routes.ts';
import {useTranslation} from 'react-i18next';

interface ResetPasswordInput {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const {t} = useTranslation();
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<ResetPasswordInput>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const key = searchParams.get('key');
  const login = searchParams.get('login');

  const {resetPassword, isLoading} = useResetPassword();
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [disabledButton, setDisabledButton] = useState(false);

  const onSubmit = async (data: ResetPasswordInput) => {
    setApiError('');
    setSuccessMessage('');
    setDisabledButton(true);

    try {
      if (!key || !login) throw new Error(t('auth.couldNotChangePassword'));

      await resetPassword(key, login, data.password);

      setSuccessMessage(t('auth.passwordChangedRedirect'));
      setTimeout(() => navigate(routes.login), 3000);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('auth.errorOccurred');
      setApiError(message);
      setDisabledButton(false);
    }
  };

  return (
    <SitePopupLayout>
      <AuhServicesLayout>
        <div className={styles.frame}>
          <div className={styles.mainBlock}>
            <PageTitle>{t('auth.passwordReset')}</PageTitle>
            <form className={'form form__fieldsgroup'} onSubmit={handleSubmit(onSubmit)}>
              <PasswordField
                register={register as unknown as UseFormRegister<{password: string}>}
                errors={errors as FieldErrors<{password: string}>}
                placeholder={t('auth.newPasswordPlaceholder')}
              />

              <div className={'form__fieldset'}>
                <input
                  type='password'
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  {...register('confirmPassword', {required: t('errors.passwordRequired')})}
                />
                {errors.confirmPassword && <p className='error'>{errors.confirmPassword.message}</p>}
              </div>

              {apiError && <p className='error'>{apiError}</p>}
              {successMessage && <p>{successMessage}</p>}

              <div className={styles.buttonWrap}>
                <Button isSubmit disabled={disabledButton}>
                  {!isLoading ? t('common.continue') : t('common.loading')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </AuhServicesLayout>
    </SitePopupLayout>
  );
}
