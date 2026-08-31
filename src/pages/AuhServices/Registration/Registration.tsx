import {useState} from 'react';
import {useForm} from 'react-hook-form';
import routes from '~/util/routes.ts';
import {Link, useNavigate} from 'react-router-dom';
import PageTitle from '~/components/PageTitle/PageTitle.tsx';
import SitePopupLayout from '~/layouts/SitePopupLayout/SitePopupLayout.tsx';
import styles from '~/pages/AuhServices/Login/Login.module.scss';
import Button from '~/components/Button/Button.tsx';
import PhotoUploader from '~/components/PhotoUploader/PhotoUploader.tsx';
import FirstStep from '~/pages/AuhServices/Registration/FirstStep.tsx';
import {ArrowToLeftIcon} from '~/components/Icons/Icons.tsx';
import classNames from 'classnames';
import AuhServicesLayout from '~/pages/AuhServices/components/AuhServicesLayout/AuhServicesLayout.tsx';
import {useRegister, useUploadUserPhoto, useUserCountries} from '@brutmaps/api';
import {saveTokens} from '~/util/auth.ts';
import {invalidateMapData} from '~/util/mutateMapData.ts';
import GoogleSignUp from '~/components/GoogleSignUp/GoogleSignUp.tsx';
import Loader from '~/components/Loader/Loader.tsx';
import {useTranslation} from 'react-i18next';
import {fileToBase64} from '~/util/fileToBase64.ts';

interface RegisterUserFrom {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  country: string;
  agreement: boolean;
  subscribe_to_newsletter: boolean;
}

export default function RegisterUser() {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [apiError, setApiError] = useState('');
  const [userData, setUserData] = useState<{email: string; password: string}>({
    email: '',
    password: '',
  });
  const [inProgressGoogleAut, setIInProgressGoogleAut] = useState(false);
  const [googleAuthError, setGoogleAuthError] = useState('');

  const {countries, isLoading: isLoadingCountries} = useUserCountries();

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<RegisterUserFrom>({
    defaultValues: {
      agreement: true,
      subscribe_to_newsletter: true,
    },
  });

  const {register: registerUser, isLoading: isMutating} = useRegister();
  const {uploadUserPhoto} = useUploadUserPhoto();

  const handleFirstStep = async (data: {email: string; password: string}) => {
    setUserData(data);
    setStep(2);
  };

  const handlePhotoChange = (file: File | null) => {
    setPhotoFile(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  const onSubmit = async (data: RegisterUserFrom) => {
    setApiError('');

    try {
      const photoUrl = photoFile
        ? await uploadUserPhoto(await fileToBase64(photoFile), photoFile.name)
        : undefined;

      const authPayload = await registerUser({
        email: userData.email,
        password: userData.password,
        firstName: data.firstName,
        lastName: data.lastName,
        country: data.country,
        subscribeToNewsletter: data.subscribe_to_newsletter,
        photoUrl,
      });

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
            {step === 1 ? (
              <>
                <PageTitle>{t('auth.signUp')}</PageTitle>
                <FirstStep initialData={userData} handleFirstStep={handleFirstStep} />
              </>
            ) : (
              <button
                className={styles.buttonBack}
                onClick={() => setStep(1)}
                aria-label={t('auth.backOnPreviousStep')}>
                <ArrowToLeftIcon />
              </button>
            )}

            {step === 2 && (
              <form className='form' onSubmit={handleSubmit(onSubmit)}>
                <div className='form__fieldsgroup'>
                  <PhotoUploader onPhotoChange={handlePhotoChange} photoPreview={photoPreview} />

                  <div className='form__fieldset'>
                    <input
                      id='firstName'
                      type='text'
                      placeholder={t('auth.firstNamePlaceholder')}
                      {...register('firstName', {required: t('errors.inputRequired')})}
                    />
                    {errors.firstName && <p className='error'>{errors.firstName.message}</p>}
                  </div>

                  <div className='form__fieldset'>
                    <input
                      id='lastName'
                      type='text'
                      placeholder={t('auth.lastNamePlaceholder')}
                      {...register('lastName', {required: t('errors.inputRequired')})}
                    />
                    {errors.lastName && <p className='error'>{errors.lastName.message}</p>}
                  </div>

                  {!isLoadingCountries && countries.length > 0 && (
                    <div className='form__fieldset'>
                      <select id='country' {...register('country', {required: t('errors.inputRequired')})}>
                        <option defaultChecked>{t('auth.country')}</option>
                        {countries.map(({code, name}) => (
                          <option key={code} value={code}>
                            {name}
                          </option>
                        ))}
                      </select>
                      {errors.country && <p className='error'>{errors.country.message}</p>}
                    </div>
                  )}

                  <div className={styles.agreements}>
                    <label className={classNames('checkbox', {error: errors.agreement})}>
                      <input
                        type='checkbox'
                        {...register('agreement', {required: t('errors.inputRequired')})}
                      />
                      <span>
                        {t('auth.agreeTerms')}{' '}
                        <a href={'https://brutmaps.com/terms-conditions'} target={'_blank'}>
                          {t('auth.termsAndConditions')}
                        </a>
                      </span>
                    </label>

                    <label className='checkbox'>
                      <input type='checkbox' {...register('subscribe_to_newsletter')} />
                      <span>{t('auth.agreeNewsletter')}</span>
                    </label>
                  </div>

                  {apiError && <p className='error'>{apiError}</p>}

                  <Button isSubmit disabled={isMutating}>
                    {!isMutating ? t('auth.signUp') : t('common.loading')}
                  </Button>
                </div>
              </form>
            )}

            <p style={{textAlign: 'center', margin: '1rem 0'}}>{t('common.or')}</p>
            <GoogleSignUp
              withUserCheckUp={true}
              inProgress={setIInProgressGoogleAut}
              errorMessage={setGoogleAuthError}
            />
            {googleAuthError && (
              <p className='error' style={{margin: '1rem 0'}}>
                {googleAuthError}
              </p>
            )}
          </div>

          {step === 1 && (
            <p className={styles.footer}>
              {t('auth.alreadyHaveAccount')} <Link to={routes.login}>{t('auth.logInAction')}</Link>
            </p>
          )}
        </div>
      </AuhServicesLayout>
    </SitePopupLayout>
  );
}
