export interface GoogleSignUpProps {
  withUserCheckUp?: boolean;
  errorMessage: (message: string) => void;
  inProgress: (status: boolean) => void;
}

export interface DecodedCredentialResponse {
  email: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

export interface CredentialProps {
  credential?: string;
}
