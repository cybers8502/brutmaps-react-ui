import {useTranslation} from 'react-i18next';
import classNames from 'classnames';
import styles from './LanguageSwitcher.module.scss';
import {supportedLanguages} from '~/i18n/index.ts';

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({className}: LanguageSwitcherProps) {
  const {i18n} = useTranslation();

  return (
    <div className={classNames(styles.switcher, className)}>
      {supportedLanguages.map((lng) => (
        <button
          key={lng}
          type='button'
          className={classNames(styles.button, {[styles.active]: i18n.resolvedLanguage === lng})}
          onClick={() => i18n.changeLanguage(lng)}>
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
