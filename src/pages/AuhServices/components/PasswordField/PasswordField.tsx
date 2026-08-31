import {UseFormRegister, FieldErrors} from 'react-hook-form';
import {EayIcon} from '~/components/Icons/Icons.tsx';
import {useState} from 'react';
import styles from './PasswordField.module.scss';
import {useTranslation} from 'react-i18next';

interface PasswordFieldProps {
  register: UseFormRegister<{password: string}>;
  errors: FieldErrors<{password: string}>;
  defaultValue?: string;
  label?: string;
  placeholder?: string;
}

export default function PasswordField({
  register,
  errors,
  defaultValue,
  label,
  placeholder,
}: PasswordFieldProps) {
  const {t} = useTranslation();
  const [visiblePassword, seVisiblePassword] = useState(false);

  return (
    <div className='form__fieldset'>
      {label && <label>{label}</label>}
      <div className={styles.wrap}>
        <input
          id='password'
          type={visiblePassword ? 'text' : 'password'}
          placeholder={placeholder}
          defaultValue={defaultValue || ''}
          {...register('password', {
            required: t('errors.passwordRequired'),
            minLength: {value: 6, message: t('errors.enterAtLeast6Characters')},
          })}
        />
        <button
          type={'button'}
          className={styles.button}
          onClick={() => seVisiblePassword(!visiblePassword)}
          aria-label={t('auth.showPassword')}>
          <EayIcon />
        </button>
      </div>
      {errors.password && <p className='error'>{errors.password.message}</p>}
    </div>
  );
}
