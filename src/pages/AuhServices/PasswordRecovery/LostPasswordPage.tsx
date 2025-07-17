import PageTitle from '~/components/PageTitle/PageTitle.tsx';
import SitePopupLayout from '~/layouts/SitePopupLayout/SitePopupLayout.tsx';
import styles from './PasswordRecovery.module.scss';
import errorMessages from '~/constants/errorMessages.const.ts';
import {Link} from 'react-router-dom';
import routes from '~/util/routes.ts';
import Button from '~/components/Button/Button.tsx';
import {useForm} from 'react-hook-form';
import {useState} from 'react';
import AuhServicesLayout from '../components/AuhServicesLayout/AuhServicesLayout';
import apiRoutes from '~/util/apiRoutes.ts';

interface LostPasswordInput {
  email: string;
}

export default function LostPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<LostPasswordInput>();
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LostPasswordInput) => {
    setApiError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_SITE_URI + apiRoutes.lostPassword, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: data.email}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password recovery failed.');
      }

      setSuccessMessage('Instructions for resetting your password have been sent to your email.');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Server is temporary unaccepted. Please, try later';
      setApiError(message);
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
              <p>
                Enter the email address you used when you joined and we’ll send you instructions to reset your
                password.
              </p>

              <div className={'form__fieldset'}>
                <input
                  id='email'
                  type='text'
                  placeholder={'Email*'}
                  {...register('email', {required: errorMessages.emailRequired})}
                />
                {errors.email && <p className='error'>{errors.email.message}</p>}
              </div>

              {apiError && <p className='error'>{apiError}</p>}
              {successMessage && <p>{successMessage}</p>}

              <div className={styles.buttonWrap}>
                <Button isSubmit disabled={isLoading}>
                  {!isLoading ? 'Continue' : 'Loading...'}
                </Button>
              </div>
            </form>
          </div>

          <p className={styles.footer}>
            Don't have an account? <Link to={routes.registration}>Sign up</Link>
          </p>
        </div>
      </AuhServicesLayout>
    </SitePopupLayout>
  );
}
