import SiteLayout from '~/layouts/SiteSimpleLayout/SiteLayout.tsx';
import styles from './ObjectsPage.module.scss';
import ObjectsList from '~/components/ObjectsList/ObjectsList.tsx';

export default function ObjectsPage() {
  return (
    <SiteLayout className={styles.layout}>
      <ObjectsList />
    </SiteLayout>
  );
}
