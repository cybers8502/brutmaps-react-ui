import PageTitle from '~/components/PageTitle/PageTitle.tsx';
import SitePopupLayout from '~/layouts/SitePopupLayout/SitePopupLayout.tsx';
import styles from './PasswordRecovery.module.scss';
import {Link} from 'react-router-dom';
import routes from '~/util/routes.ts';
import Button from '~/components/Button/Button.tsx';
import {useForm} from 'react-hook-form';
import {useState} from 'react';
import AuhServicesLayout from '../components/AuhServicesLayout/AuhServicesLayout';
import apiRoutes from '~/util/apiRoutes.ts';
import {useTranslation} from 'react-i18next';

interface LostPasswordInput {
  email: string;
}

export default function LostPasswordPage() {
  const {t} = useTranslation();
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
        throw new Error(errorData.message || t('auth.passwordRecoveryFailed'));
      }

      setSuccessMessage(t('auth.instructionsSent'));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('auth.serverTemporaryUnavailable');
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
            <PageTitle>{t('auth.passwordReset')}</PageTitle>
            <form className={'form form__fieldsgroup'} onSubmit={handleSubmit(onSubmit)}>
              <p>{t('auth.enterEmailInstructions')}</p>

              <div className={'form__fieldset'}>
                <input
                  id='email'
                  type='text'
                  placeholder={t('auth.emailPlaceholder')}
                  {...register('email', {required: t('errors.emailRequired')})}
                />
                {errors.email && <p className='error'>{errors.email.message}</p>}
              </div>

              {apiError && <p className='error'>{apiError}</p>}
              {successMessage && <p>{successMessage}</p>}

              <div className={styles.buttonWrap}>
                <Button isSubmit disabled={isLoading}>
                  {!isLoading ? t('common.continue') : t('common.loading')}
                </Button>
              </div>
            </form>
          </div>

          <p className={styles.footer}>
            {t('auth.dontHaveAccount')} <Link to={routes.registration}>{t('auth.signUp')}</Link>
          </p>
        </div>
      </AuhServicesLayout>
    </SitePopupLayout>
  );
}
