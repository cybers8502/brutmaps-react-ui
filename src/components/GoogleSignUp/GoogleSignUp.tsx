import {useCheckEmail, useGoogleAuth} from '@brutmaps/api';
import {saveTokens} from '~/util/auth.ts';
import {useNavigate} from 'react-router-dom';
import {GoogleLogin} from 'react-oauth-google';
import {jwtDecode} from 'jwt-decode';
import routes from '~/util/routes.ts';
import styles from './GoogleSignUp.module.scss';
import {CredentialProps, DecodedCredentialResponse, GoogleSignUpProps} from '~/components/GoogleSignUp/GoogleSignUp.interface.ts';
import {invalidateMapData} from '~/util/mutateMapData.ts';
import {useTranslation} from 'react-i18next';

export default function GoogleSignUp({withUserCheckUp, errorMessage, inProgress}: GoogleSignUpProps) {
  const {t} = useTranslation();
  const navigate = useNavigate();

  const {googleAuth} = useGoogleAuth();
  const {checkEmail} = useCheckEmail();

  const handleSuccess = async (credentialResponse: CredentialProps) => {
    inProgress(true);

    try {
      const decoded: DecodedCredentialResponse = jwtDecode(credentialResponse.credential as string);

      const email = decoded.email;
      const firstName = decoded.given_name || '';
      const lastName = decoded.family_name || '';
      const picture = decoded.picture || '';

      if (withUserCheckUp) {
        const result = await checkEmail(email);

        if (result.exists) {
          errorMessage(result.message ?? t('auth.emailAlreadyExists'));
          return;
        }
      }

      const authPayload = await googleAuth({
        email,
        firstName,
        lastName,
        avatar: picture,
      });

      saveTokens(authPayload.authToken, authPayload.refreshToken);
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
