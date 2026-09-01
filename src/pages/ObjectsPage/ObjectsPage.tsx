import ObjectsList from '~/components/ObjectsList/ObjectsList.tsx';
import SiteLayout from '~/layouts/SiteSimpleLayout/SiteLayout.tsx';
import styles from './ObjectsPage.module.scss';

export default function ObjectsPage() {
  return (
    <SiteLayout className={styles.layout}>
      <ObjectsList />
    </SiteLayout>
  );
}
