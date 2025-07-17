import styles from './CancelButton.module.scss';
import {CancelIcon} from '~/components/Icons/Icons.tsx';
import classNames from 'classnames';

interface CancelButtonProps {
  className?: string;
  onCancel: () => void;
}

export default function CancelButton({className, onCancel}: CancelButtonProps) {
  return (
    <button className={classNames(styles.cancel, className)} onClick={onCancel} aria-label='Claen field'>
      <CancelIcon size={14} />
    </button>
  );
}
