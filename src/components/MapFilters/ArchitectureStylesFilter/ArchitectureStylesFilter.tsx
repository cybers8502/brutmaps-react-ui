import {useTaxonomy} from '@brutmaps/api';
import styles from './ArchitectureStylesFilter.module.scss';
import classNames from 'classnames';
import CancelButton from '~/components/CancelButton/CancelButton.tsx';
import {Fragment} from 'react';
import {useTranslation} from 'react-i18next';

interface ArchitectureStylesFilterProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
  className: string;
}

export default function ArchitectureStylesFilter({
  selectedType,
  setSelectedType,
  className,
}: ArchitectureStylesFilterProps) {
  const {t} = useTranslation();
  const {terms: architectureStyles} = useTaxonomy('taxonomy');

  const handleCancel = () => {
    setSelectedType('');
  };

  if (!architectureStyles?.length)
    return (
      <div className={classNames(className, styles.container, styles.loader)}>{t('common.loading')}</div>
    );

  return (
    <div className={classNames(className, styles.container)}>
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className={classNames(styles.select, {[styles.selected]: selectedType})}>
        <option value=''>{t('map.allStyles')}</option>
        {architectureStyles.map((t) => (
          <Fragment key={t.id}>
            <option value={t.slug}>{t.label}</option>
            {t.subcategories?.length &&
              t.subcategories.map((s) => (
                <option key={s.id} value={s.slug}>
                  &nbsp;&nbsp;&nbsp;&nbsp;{s.label}
                </option>
              ))}
          </Fragment>
        ))}
      </select>

      {selectedType && <CancelButton onCancel={handleCancel} />}
    </div>
  );
}
