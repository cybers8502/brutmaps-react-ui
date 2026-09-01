import {useLogin} from '@brutmaps/api';
import {useState} from 'react';
import {type FieldErrors, type UseFormRegister, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {Link, useNavigate} from 'react-router-dom';
import Button from '~/components/Button/Button.tsx';
import GoogleSignUp from '~/components/GoogleSignUp/GoogleSignUp.tsx';
import Loader from '~/components/Loader/Loader.tsx';
import PageTitle from '~/components/PageTitle/PageTitle.tsx';
import SitePopupLayout from '~/layouts/SitePopupLayout/SitePopupLayout.tsx';
import AuhServicesLayout from '~/pages/AuhServices/components/AuhServicesLayout/AuhServicesLayout.tsx';
import PasswordField from '~/pages/AuhServices/components/PasswordField/PasswordField.tsx';
import {saveTokens} from '~/util/auth.ts';
import {invalidateMapData} from '~/util/mutateMapData.ts';
import routes from '~/util/routes.ts';
import styles from './Login.module.scss';

interface LoginInput {
  username: string;
  password: string;
}

export default function LoginUser() {
  const {t} = useTranslation();
  const [inProgressGoogleAut, setIInProgressGoogleAut] = useState(false);
  const [googleAuthError, setGoogleAuthError] = useState('');
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginInput>();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const {login, isLoading: isMutating} = useLogin();

  const onSubmit = async (data: LoginInput) => {
    setApiError('');

    try {
      const authPayload = await login(data.username, data.password);

      saveTokens(authPayload.authToken, authPayload.refreshToken);
      invalidateMapData();
      navigate(routes.myAccount);
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError(t('common.unknownError'));
      }
    }
  };

  return (
    <SitePopupLayout>
      <AuhServicesLayout>
        {inProgressGoogleAut && (
          <div className={styles.loader}>
            <Loader />
          </div>
        )}
        <div className={styles.frame}>
          <div className={styles.mainBlock}>
            <PageTitle>{t('auth.logIn')}</PageTitle>
            <form className={'form form__fieldsgroup'} onSubmit={handleSubmit(onSubmit)}>
              <div className={'form__fieldset'}>
                <input
                  id='username'
                  type='text'
                  placeholder={t('auth.emailPlaceholder')}
                  {...register('username', {required: t('errors.emailRequired')})}
                />
                {errors.username && <p className='error'>{errors.username.message}</p>}
              </div>

              <PasswordField
                register={register as unknown as UseFormRegister<{password: string}>}
                errors={errors as FieldErrors<{password: string}>}
                placeholder={t('auth.passwordPlaceholder')}
              />

              <p style={{textAlign: 'right'}}>
                <Link to={routes.lostPassword}>{t('auth.forgotPassword')}</Link>
              </p>

              {apiError && <p className='error'>{apiError}</p>}
              {googleAuthError && <p className='error'>{googleAuthError}</p>}

              <div className={styles.buttonWrap}>
                <Button isSubmit disabled={isMutating}>
                  {!isMutating ? t('common.continue') : t('common.loading')}
                </Button>
              </div>
            </form>

            {inProgressGoogleAut && <>{t('common.loading')}</>}
            <p style={{textAlign: 'center', margin: '1rem 0'}}>{t('common.or')}</p>
            <GoogleSignUp
              withUserCheckUp={false}
              inProgress={setIInProgressGoogleAut}
              errorMessage={setGoogleAuthError}
            />
          </div>

          <p className={styles.footer}>
            {t('auth.dontHaveAccount')} <Link to={routes.registration}>{t('auth.signUp')}</Link>
          </p>
        </div>
      </AuhServicesLayout>
    </SitePopupLayout>
  );
}
