import {useTaxonomy} from '@brutmaps/api';
import styles from './CountryFilter.module.scss';
import classNames from 'classnames';
import CancelButton from '~/components/CancelButton/CancelButton.tsx';
import {useTranslation} from 'react-i18next';

interface CountryFilterProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  className: string;
}

export default function CountryFilter({selectedCountry, setSelectedCountry, className}: CountryFilterProps) {
  const {t} = useTranslation();
  const {terms: countries, isLoading} = useTaxonomy('country');

  const handleCancel = () => {
    setSelectedCountry('');
  };

  if (isLoading) {
    return (
      <div className={classNames(className, styles.container, styles.loader)}>{t('common.loading')}</div>
    );
  }

  return (
    <div className={classNames(className, styles.container)}>
      <select
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
        className={classNames(styles.select, {[styles.selected]: selectedCountry})}>
        <option value=''>{t('objects.allCountries')}</option>
        {countries.map((country) => (
          <option key={country.id} value={country.slug}>
            {country.label}
          </option>
        ))}
      </select>

      {selectedCountry && <CancelButton onCancel={handleCancel} />}
    </div>
  );
}
