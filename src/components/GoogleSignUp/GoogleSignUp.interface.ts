export interface GoogleSignUpProps {
  withUserCheckUp?: boolean;
  errorMessage: (message: string) => void;
  inProgress: (status: boolean) => void;
}

export interface CheckEmailExistsResponse {
  status: string;
  message: string;
  data: {
    exists: boolean;
  };
}

export interface RegisterUserResponse {
  status: string;
  data: {
    access_token: string;
    refresh_token: string;
    user: {email: string};
  };
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

export interface CheckEmailInput {
  email: string;
}

export interface RegisterUserInput {
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}
