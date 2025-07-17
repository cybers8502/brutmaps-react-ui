import {useState} from 'react';
import {useForm} from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import routes from '~/util/routes.ts';
import {Link, useNavigate} from 'react-router-dom';
import PageTitle from '~/components/PageTitle/PageTitle.tsx';
import errorMessages from '~/constants/errorMessages.const.ts';
import SitePopupLayout from '~/layouts/SitePopupLayout/SitePopupLayout.tsx';
import styles from '~/pages/AuhServices/Login/Login.module.scss';
import Button from '~/components/Button/Button.tsx';
import PhotoUploader from '~/components/PhotoUploader/PhotoUploader.tsx';
import FirstStep from '~/pages/AuhServices/Registration/FirstStep.tsx';
import {ArrowToLeftIcon} from '~/components/Icons/Icons.tsx';
import classNames from 'classnames';
import AuhServicesLayout from '~/pages/AuhServices/components/AuhServicesLayout/AuhServicesLayout.tsx';
import useFetchUserCountries from '~/hooks/fetchApi/useFetchUserCountries.tsx';
import apiRoutes from '~/util/apiRoutes.ts';
import GoogleSignUp from '~/components/GoogleSignUp/GoogleSignUp.tsx';
import Loader from '~/components/Loader/Loader.tsx';

interface RegisterUserFrom {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  country: string;
  agreement: boolean;
  subscribe_to_newsletter: boolean;
}

const registerUser = async (url: string, {arg}: {arg: FormData}) => {
  const response = await fetch(url, {
    method: 'POST',
    body: arg,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'User registration failed.');
  }

  return response.json();
};

export default function RegisterUser() {
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

  const {data: countriesList, isLoading: isLoadingCountries} = useFetchUserCountries();

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

  const {trigger: sendRequest, isMutating} = useSWRMutation(
    import.meta.env.VITE_SITE_URI + apiRoutes.userEmailRegistration,
    registerUser,
  );

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
      const formData = new FormData();
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('first_name', data.firstName);
      formData.append('last_name', data.lastName);
      formData.append('country', data.country);
      formData.append('subscribe_to_newsletter', String(data.subscribe_to_newsletter));

      if (photoFile) {
        formData.append('photo', photoFile);
      }
      await sendRequest(formData);

      navigate(routes.login);
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('Unknown error occurred');
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
                <PageTitle>Sign up</PageTitle>
                <FirstStep initialData={userData} handleFirstStep={handleFirstStep} />
              </>
            ) : (
              <button
                className={styles.buttonBack}
                onClick={() => setStep(1)}
                aria-label={'back on previous step'}>
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
                      placeholder='First name*'
                      {...register('firstName', {required: errorMessages.inputRequired})}
                    />
                    {errors.firstName && <p className='error'>{errors.firstName.message}</p>}
                  </div>

                  <div className='form__fieldset'>
                    <input
                      id='lastName'
                      type='text'
                      placeholder='Last name*'
                      {...register('lastName', {required: errorMessages.inputRequired})}
                    />
                    {errors.lastName && <p className='error'>{errors.lastName.message}</p>}
                  </div>

                  {!isLoadingCountries && countriesList && (
                    <div className='form__fieldset'>
                      <select id='country' {...register('country', {required: errorMessages.inputRequired})}>
                        <option defaultChecked>Country</option>
                        {Object.entries(countriesList).map(([code, name]) => (
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
                        {...register('agreement', {required: errorMessages.inputRequired})}
                      />
                      <span>
                        I Agree to the{' '}
                        <a href={'https://brutmaps.com/terms-conditions'} target={'_blank'}>
                          Terms & Conditions
                        </a>
                      </span>
                    </label>

                    <label className='checkbox'>
                      <input type='checkbox' {...register('subscribe_to_newsletter')} />
                      <span>I Agree to receive news & updates from Brutmaps</span>
                    </label>
                  </div>

                  {apiError && <p className='error'>{apiError}</p>}

                  <Button isSubmit disabled={isMutating}>
                    {!isMutating ? 'Sign up' : 'Loading...'}
                  </Button>
                </div>
              </form>
            )}

            <p style={{textAlign: 'center', margin: '1rem 0'}}>or</p>
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
              Already have an account with us? <Link to={routes.login}>Log in</Link>
            </p>
          )}
        </div>
      </AuhServicesLayout>
    </SitePopupLayout>
  );
}
