import {useSightsCount} from '@brutmaps/api';
import {useTranslation} from 'react-i18next';
import styles from './MapObjectsBadge.module.scss';

export default function MapObjectsBadge() {
  const {t} = useTranslation();
  const {count} = useSightsCount();

  if (count === null) return null;

  return <div className={styles.badge}>{t('map.objectsCount', {count})}</div>;
}
