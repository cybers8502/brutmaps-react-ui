import useFetchTaxonomies from '~/hooks/fetchApi/useFetchTaxonomies.tsx';
import styles from './CategoryFilter.module.scss';
import classNames from 'classnames';
import CancelButton from '~/components/CancelButton/CancelButton.tsx';
import {Fragment} from 'react';
import {useTranslation} from 'react-i18next';

interface CategoryFilterProps {
  selectedCat: string;
  setSelectedCat: (type: string) => void;
  className: string;
}

export type CategoryResponse = {
  id: string;
  slug: string;
  label: string;
  subcategories?: CategoryResponse[];
};

export default function CategoryFilter({selectedCat, setSelectedCat, className}: CategoryFilterProps) {
  const {t} = useTranslation();
  const {taxonomies: architectureStyles} = useFetchTaxonomies<CategoryResponse[]>('category');

  const handleCancel = () => {
    setSelectedCat('');
  };

  if (!architectureStyles?.length)
    return (
      <div className={classNames(className, styles.container, styles.loader)}>{t('common.loading')}</div>
    );

  return (
    <div className={classNames(className, styles.container)}>
      <select
        value={selectedCat}
        onChange={(e) => setSelectedCat(e.target.value)}
        className={classNames(styles.select, {[styles.selected]: selectedCat})}>
        <option value=''>{t('map.allCategories')}</option>
        {architectureStyles.map((t) => (
          <Fragment key={t.id}>
            <option value={t.slug}>{t.label}</option>
            {t.subcategories?.length
              ? t.subcategories.map((s) => (
                  <option key={s.id} value={s.slug}>
                    &nbsp;&nbsp;&nbsp;&nbsp;{s.label}
                  </option>
                ))
              : null}
          </Fragment>
        ))}
      </select>

      {selectedCat && <CancelButton onCancel={handleCancel} />}
    </div>
  );
}
