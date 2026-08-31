import {FieldErrors, useForm, UseFormRegister} from 'react-hook-form';
import Button from '~/components/Button/Button.tsx';
import isEmailValid from '~/util/validationEmail.utility.ts';
import PasswordField from '~/pages/AuhServices/components/PasswordField/PasswordField.tsx';
import {useState} from 'react';
import useSWRMutation from 'swr/mutation';
import apiRoutes from '~/util/apiRoutes.ts';
import {gqlFetch} from '~/util/graphql.ts';
import {useTranslation} from 'react-i18next';

interface FirstStepProps {
  initialData: {email: string; password: string};
  handleFirstStep: ({email, password}: {email: string; password: string}) => void;
}

interface CheckEmailResponse {
  checkEmail: {
    result: {exists: boolean; message: string};
  };
}

const CHECK_EMAIL_MUTATION = `
  mutation CheckEmail($email: String!) {
    checkEmail(input: {clientMutationId: "1", email: $email}) {
      result { exists message }
    }
  }
`;

const checkEmailExists = async (_url: string, {arg}: {arg: {email: string}}) => {
  const data = await gqlFetch<CheckEmailResponse>(CHECK_EMAIL_MUTATION, arg as Record<string, unknown>);
  return data.checkEmail.result;
};

export default function FirstStep({initialData, handleFirstStep}: FirstStepProps) {
  const {t} = useTranslation();
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<{email: string; password: string}>();

  const [apiError, setApiError] = useState('');
  const {trigger: checkEmail, isMutating} = useSWRMutation(
    import.meta.env.VITE_SITE_URI + apiRoutes.graphql,
    checkEmailExists,
  );

  const onSubmit = async (data: {email: string; password: string}) => {
    setApiError('');

    try {
      const response = await checkEmail({email: data.email});

      if (response.exists) {
        setApiError(response.message);
        return;
      }

      handleFirstStep(data);
    } catch {
      setApiError(t('common.somethingWentWrong'));
    }
  };

  return (
    <form className='form' onSubmit={handleSubmit(onSubmit)}>
      <div className='form__fieldsgroup'>
        <div className='form__fieldset'>
          <input
            id='email'
            type='email'
            placeholder={t('auth.emailPlaceholder')}
            defaultValue={initialData.email || ''}
            {...register('email', {
              required: t('errors.emailRequired'),
              validate: {
                isEmailValid: (value: string) => isEmailValid(value) || t('errors.enterCorrectEmail'),
              },
            })}
          />
          {errors.email && <p className='error'>{errors.email.message}</p>}
        </div>

        <PasswordField
          register={register as unknown as UseFormRegister<{password: string}>}
          errors={errors as FieldErrors<{password: string}>}
          defaultValue={initialData.password}
          placeholder={t('auth.passwordPlaceholder')}
        />

        {apiError && <p className='error'>{apiError}</p>}

        <Button isSubmit disabled={isMutating}>
          {!isMutating ? t('common.continue') : t('common.loading')}
        </Button>
      </div>
    </form>
  );
}
