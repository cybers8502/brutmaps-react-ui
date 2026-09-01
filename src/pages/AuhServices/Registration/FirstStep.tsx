import {useCheckEmail} from '@brutmaps/api';
import {useState} from 'react';
import {type FieldErrors, type UseFormRegister, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import Button from '~/components/Button/Button.tsx';
import PasswordField from '~/pages/AuhServices/components/PasswordField/PasswordField.tsx';
import isEmailValid from '~/util/validationEmail.utility.ts';

interface FirstStepProps {
  initialData: {email: string; password: string};
  handleFirstStep: ({email, password}: {email: string; password: string}) => void;
}

export default function FirstStep({initialData, handleFirstStep}: FirstStepProps) {
  const {t} = useTranslation();
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<{email: string; password: string}>();

  const [apiError, setApiError] = useState('');
  const {checkEmail, isLoading: isMutating} = useCheckEmail();

  const onSubmit = async (data: {email: string; password: string}) => {
    setApiError('');

    try {
      const response = await checkEmail(data.email);

      if (response.exists) {
        setApiError(response.message ?? t('common.somethingWentWrong'));
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
