import classNames from 'classnames';
import {useTranslation} from 'react-i18next';
import {CancelIcon} from '~/components/Icons/Icons.tsx';
import styles from './CancelButton.module.scss';

interface CancelButtonProps {
  className?: string;
  onCancel: () => void;
}

export default function CancelButton({className, onCancel}: CancelButtonProps) {
  const {t} = useTranslation();

  return (
    <button
      className={classNames(styles.cancel, className)}
      onClick={onCancel}
      aria-label={t('cancelButton.clearField')}>
      <CancelIcon size={14} />
    </button>
  );
}
