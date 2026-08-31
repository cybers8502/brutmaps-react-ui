import useSWRMutation from 'swr/mutation';
import {saveTokens} from '~/util/auth.ts';
import {useNavigate} from 'react-router-dom';
import {GoogleLogin} from 'react-oauth-google';
import {jwtDecode} from 'jwt-decode';
import routes from '~/util/routes.ts';
import apiRoutes from '~/util/apiRoutes.ts';
import styles from './GoogleSignUp.module.scss';
import {gqlFetch} from '~/util/graphql.ts';
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
import {useTranslation} from 'react-i18next';

const CHECK_EMAIL_MUTATION = `
  mutation CheckEmail($email: String!) {
    checkEmail(input: {clientMutationId: "1", email: $email}) {
      result { exists message }
    }
  }
`;

const GOOGLE_AUTH_MUTATION = `
  mutation GoogleAuth($email: String!, $firstName: String, $lastName: String, $avatar: String) {
    googleAuth(input: {
      clientMutationId: "1"
      email: $email
      firstName: $firstName
      lastName: $lastName
      avatar: $avatar
    }) {
      authPayload {
        authToken
        refreshToken
        user { email }
      }
    }
  }
`;

const checkEmail = async (_url: string, {arg}: {arg: CheckEmailInput}) => {
  return gqlFetch<CheckEmailExistsResponse>(CHECK_EMAIL_MUTATION, arg as unknown as Record<string, unknown>);
};

const registerUser = async (_url: string, {arg}: {arg: RegisterUserInput}) => {
  return gqlFetch<RegisterUserResponse>(GOOGLE_AUTH_MUTATION, arg as unknown as Record<string, unknown>);
};

export default function GoogleSignUp({withUserCheckUp, errorMessage, inProgress}: GoogleSignUpProps) {
  const {t} = useTranslation();
  const navigate = useNavigate();

  const {trigger: register} = useSWRMutation<RegisterUserResponse, Error, string, RegisterUserInput>(
    import.meta.env.VITE_SITE_URI + apiRoutes.graphql,
    registerUser,
  );

  const {trigger: checkEmailExists} = useSWRMutation<
    CheckEmailExistsResponse,
    Error,
    string,
    CheckEmailInput
  >(import.meta.env.VITE_SITE_URI + apiRoutes.graphql, checkEmail);

  const handleSuccess = async (credentialResponse: CredentialProps) => {
    inProgress(true);

    try {
      const decoded: DecodedCredentialResponse = jwtDecode(credentialResponse.credential as string);

      const email = decoded.email;
      const firstName = decoded.given_name || '';
      const lastName = decoded.family_name || '';
      const picture = decoded.picture || '';

      if (withUserCheckUp) {
        const check = await checkEmailExists({email});

        if (check.checkEmail.result.exists) {
          errorMessage(t('auth.emailAlreadyExists'));
          return;
        }
      }

      const result = await register({
        email,
        firstName,
        lastName,
        avatar: picture,
      });

      const {authToken, refreshToken} = result.googleAuth.authPayload;
      saveTokens(authToken, refreshToken);
      invalidateMapData();
      navigate(routes.myAccount);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('auth.googleRegistrationFailed');
      errorMessage(message);
    } finally {
      inProgress(false);
    }
  };

  return (
    <div className={styles.container}>
      <GoogleLogin onSuccess={handleSuccess} onError={() => alert(t('auth.googleLoginFailed'))} />
    </div>
  );
}
