export interface GoogleSignUpProps {
  withUserCheckUp?: boolean;
  errorMessage: (message: string) => void;
  inProgress: (status: boolean) => void;
}

export interface CheckEmailExistsResponse {
  checkEmail: {
    result: {exists: boolean; message: string};
  };
}

export interface RegisterUserResponse {
  googleAuth: {
    authPayload: {
      authToken: string;
      refreshToken: string;
      user: {email: string};
    };
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
  firstName: string;
  lastName: string;
  avatar: string;
}
