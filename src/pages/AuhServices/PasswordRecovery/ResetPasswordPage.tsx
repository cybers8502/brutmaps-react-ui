import PageTitle from '~/components/PageTitle/PageTitle.tsx';
import SitePopupLayout from '~/layouts/SitePopupLayout/SitePopupLayout.tsx';
import styles from './PasswordRecovery.module.scss';
import errorMessages from '~/constants/errorMessages.const.ts';
import {useNavigate, useSearchParams} from 'react-router-dom';
import Button from '~/components/Button/Button.tsx';
import {FieldErrors, useForm, UseFormRegister} from 'react-hook-form';
import {useState} from 'react';
import PasswordField from '~/pages/AuhServices/components/PasswordField/PasswordField.tsx';
import AuhServicesLayout from '~/pages/AuhServices/components/AuhServicesLayout/AuhServicesLayout.tsx';
import apiRoutes from '~/util/apiRoutes.ts';
import routes from '~/util/routes.ts';

interface ResetPasswordInput {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<ResetPasswordInput>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const key = searchParams.get('key');
  const login = searchParams.get('login');

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [disabledButton, setDisabledButton] = useState(false);

  const onSubmit = async (data: ResetPasswordInput) => {
    setApiError('');
    setSuccessMessage('');
    setIsLoading(true);
    setDisabledButton(true);

    try {
      const response = await fetch(import.meta.env.VITE_SITE_URI + apiRoutes.resetPassword, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({key, login, new_password: data.password}),
      });

      const respData = await response.json();
      if (!response.ok) throw new Error(respData.message || 'Could not change password.');

      setSuccessMessage(respData.message || 'Password successfully changed! Redirect...');
      setTimeout(() => navigate(routes.login), 3000);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred.';
      setApiError(message);
      setDisabledButton(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SitePopupLayout>
      <AuhServicesLayout>
        <div className={styles.frame}>
          <div className={styles.mainBlock}>
            <PageTitle>Password reset</PageTitle>
            <form className={'form form__fieldsgroup'} onSubmit={handleSubmit(onSubmit)}>
              <PasswordField
                register={register as unknown as UseFormRegister<{password: string}>}
                errors={errors as FieldErrors<{password: string}>}
                placeholder={'New Password*'}
              />

              <div className={'form__fieldset'}>
                <input
                  type='password'
                  placeholder={'Confirm Password'}
                  {...register('confirmPassword', {required: errorMessages.passwordRequired})}
                />
                {errors.confirmPassword && <p className='error'>{errors.confirmPassword.message}</p>}
              </div>

              {apiError && <p className='error'>{apiError}</p>}
              {successMessage && <p>{successMessage}</p>}

              <div className={styles.buttonWrap}>
                <Button isSubmit disabled={disabledButton}>
                  {!isLoading ? 'Continue' : 'Loading...'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </AuhServicesLayout>
    </SitePopupLayout>
  );
}
