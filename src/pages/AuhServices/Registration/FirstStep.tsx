import {FieldErrors, useForm, UseFormRegister} from 'react-hook-form';
import errorMessages from '~/constants/errorMessages.const.ts';
import Button from '~/components/Button/Button.tsx';
import isEmailValid from '~/util/validationEmail.utility.ts';
import PasswordField from '~/pages/AuhServices/components/PasswordField/PasswordField.tsx';
import {useState} from 'react';
import useSWRMutation from 'swr/mutation';
import apiRoutes from '~/util/apiRoutes.ts';

interface FirstStepProps {
  initialData: {email: string; password: string};
  handleFirstStep: ({email, password}: {email: string; password: string}) => void;
}

const checkEmailExists = async (url: string, {arg}: {arg: {email: string}}) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(arg),
  });

  return response.json();
};

export default function FirstStep({initialData, handleFirstStep}: FirstStepProps) {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<{email: string; password: string}>();

  const [apiError, setApiError] = useState('');
  const {trigger: checkEmail, isMutating} = useSWRMutation(
    import.meta.env.VITE_SITE_URI + apiRoutes.checkEmail,
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
      setApiError('Something went wrong. Please try again.');
    }
  };

  return (
    <form className='form' onSubmit={handleSubmit(onSubmit)}>
      <div className='form__fieldsgroup'>
        <div className='form__fieldset'>
          <input
            id='email'
            type='email'
            placeholder='Email*'
            defaultValue={initialData.email || ''}
            {...register('email', {
              required: errorMessages.emailRequired,
              validate: {
                isEmailValid: (value: string) => isEmailValid(value) || errorMessages.enterCorrectEmail,
              },
            })}
          />
          {errors.email && <p className='error'>{errors.email.message}</p>}
        </div>

        <PasswordField
          register={register as unknown as UseFormRegister<{password: string}>}
          errors={errors as FieldErrors<{password: string}>}
          defaultValue={initialData.password}
          placeholder={'Password*'}
        />

        {apiError && <p className='error'>{apiError}</p>}

        <Button isSubmit disabled={isMutating}>
          {!isMutating ? 'Continue' : 'Loading...'}
        </Button>
      </div>
    </form>
  );
}
