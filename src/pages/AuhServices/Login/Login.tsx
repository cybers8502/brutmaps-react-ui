import {useState} from 'react';
import {FieldErrors, useForm, UseFormRegister} from 'react-hook-form';
import {Link, useNavigate} from 'react-router-dom';
import routes from '~/util/routes.ts';
import styles from './Login.module.scss';

import PageTitle from '~/components/PageTitle/PageTitle.tsx';
import SitePopupLayout from '~/layouts/SitePopupLayout/SitePopupLayout.tsx';
import Button from '~/components/Button/Button.tsx';
import errorMessages from '~/constants/errorMessages.const.ts';
import PasswordField from '~/pages/AuhServices/components/PasswordField/PasswordField.tsx';
import AuhServicesLayout from '~/pages/AuhServices/components/AuhServicesLayout/AuhServicesLayout.tsx';
import useSWRMutation from 'swr/mutation';
import {saveTokens} from '~/util/auth.ts';
import apiRoutes from '~/util/apiRoutes.ts';
import {gqlFetch} from '~/util/graphql.ts';
import GoogleSignUp from '~/components/GoogleSignUp/GoogleSignUp.tsx';
import Loader from '~/components/Loader/Loader.tsx';
import {invalidateMapData} from '~/util/mutateMapData.ts';

interface LoginInput {
  username: string;
  password: string;
}

interface ResponseData {
  login: {
    authToken: string;
    refreshToken: string;
    user: {
      email: string;
    };
  };
}

const LOGIN_MUTATION = `
  mutation Login($username: String!, $password: String!) {
    login(input: {clientMutationId: "1", username: $username, password: $password}) {
      authToken
      refreshToken
      user { email }
    }
  }
`;

const loginUser = async (_url: string, {arg}: {arg: LoginInput}): Promise<ResponseData> => {
  return gqlFetch<ResponseData>(LOGIN_MUTATION, arg as unknown as Record<string, unknown>);
};

export default function LoginUser() {
  const [inProgressGoogleAut, setIInProgressGoogleAut] = useState(false);
  const [googleAuthError, setGoogleAuthError] = useState('');
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginInput>();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const {trigger: authTrigger, isMutating} = useSWRMutation<ResponseData, Error, string, LoginInput>(
    import.meta.env.VITE_SITE_URI + apiRoutes.graphql,
    loginUser,
  );

  const onSubmit = async (data: LoginInput) => {
    setApiError('');

    try {
      const responseData = await authTrigger(data);

      saveTokens(responseData.login.authToken, responseData.login.refreshToken);
      invalidateMapData();
      navigate(routes.myAccount);
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
            <PageTitle>Log In</PageTitle>
            <form className={'form form__fieldsgroup'} onSubmit={handleSubmit(onSubmit)}>
              <div className={'form__fieldset'}>
                <input
                  id='username'
                  type='text'
                  placeholder={'Email*'}
                  {...register('username', {required: errorMessages.emailRequired})}
                />
                {errors.username && <p className='error'>{errors.username.message}</p>}
              </div>

              <PasswordField
                register={register as unknown as UseFormRegister<{password: string}>}
                errors={errors as FieldErrors<{password: string}>}
                placeholder={'Password*'}
              />

              <p style={{textAlign: 'right'}}>
                <Link to={routes.lostPassword}>Forgot password?</Link>
              </p>

              {apiError && <p className='error'>{apiError}</p>}
              {googleAuthError && <p className='error'>{googleAuthError}</p>}

              <div className={styles.buttonWrap}>
                <Button isSubmit disabled={isMutating}>
                  {!isMutating ? 'Continue' : 'Loading...'}
                </Button>
              </div>
            </form>

            {inProgressGoogleAut && <>Loading...</>}
            <p style={{textAlign: 'center', margin: '1rem 0'}}>or</p>
            <GoogleSignUp
              withUserCheckUp={false}
              inProgress={setIInProgressGoogleAut}
              errorMessage={setGoogleAuthError}
            />
          </div>

          <p className={styles.footer}>
            Don't have an account? <Link to={routes.registration}>Sign up</Link>
          </p>
        </div>
      </AuhServicesLayout>
    </SitePopupLayout>
  );
}
