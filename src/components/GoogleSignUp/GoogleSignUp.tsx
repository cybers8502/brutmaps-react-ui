import useSWRMutation from 'swr/mutation';
import {saveTokens} from '~/util/auth.ts';
import {useNavigate} from 'react-router-dom';
import {GoogleLogin} from 'react-oauth-google';
import {jwtDecode} from 'jwt-decode';
import routes from '~/util/routes.ts';
import apiRoutes from '~/util/apiRoutes.ts';
import styles from './GoogleSignUp.module.scss';
import {
  CheckEmailExistsResponse,
  CheckEmailInput,
  CredentialProps,
  DecodedCredentialResponse,
  GoogleSignUpProps,
  RegisterUserInput,
  RegisterUserResponse,
} from '~/components/GoogleSignUp/GoogleSignUp.interface.ts';
import {invalidateMapData} from '~/util/mutateMapData.ts';

const checkEmail = async (url: string, {arg}: {arg: CheckEmailInput}) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(arg),
  });

  if (!res.ok) throw new Error('Email check failed');
  return res.json();
};

const registerUser = async (url: string, {arg}: {arg: RegisterUserInput}) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'X-WP-Nonce': window?.WP_DATA?.nonce || '',
    },
    body: JSON.stringify(arg),
  });

  if (!res.ok) throw new Error((await res.json()).message || 'Registration failed');
  return res.json();
};

export default function GoogleSignUp({withUserCheckUp, errorMessage, inProgress}: GoogleSignUpProps) {
  const navigate = useNavigate();

  const {trigger: register} = useSWRMutation<RegisterUserResponse, Error, string, RegisterUserInput>(
    import.meta.env.VITE_SITE_URI + apiRoutes.googleLogin,
    registerUser,
  );

  const {trigger: checkEmailExists} = useSWRMutation<
    CheckEmailExistsResponse,
    Error,
    string,
    CheckEmailInput
  >(import.meta.env.VITE_SITE_URI + apiRoutes.checkEmail, checkEmail);

  const handleSuccess = async (credentialResponse: CredentialProps) => {
    inProgress(true);

    try {
      const decoded: DecodedCredentialResponse = jwtDecode(credentialResponse.credential as string);

      const email = decoded.email;
      const first_name = decoded.given_name || '';
      const last_name = decoded.family_name || '';
      const picture = decoded.picture || '';

      if (withUserCheckUp) {
        const check = await checkEmailExists({email});

        if (check.data.exists) {
          errorMessage('User with this email already exists. Please log in instead.');
          return;
        }
      }

      const result = await register({
        email,
        first_name,
        last_name,
        avatar: picture,
      });

      saveTokens(result.data.access_token, result.data.refresh_token, email);
      invalidateMapData();
      navigate(routes.myAccount);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Google registration failed';
      errorMessage(message);
    } finally {
      inProgress(false);
    }
  };

  return (
    <div className={styles.container}>
      <GoogleLogin onSuccess={handleSuccess} onError={() => alert('Google login failed')} />
    </div>
  );
}
