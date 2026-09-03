import ArchitectsList from '~/components/ArchitectsList/ArchitectsList.tsx';
import SiteLayout from '~/layouts/SiteSimpleLayout/SiteLayout.tsx';
import styles from './ArchitectsPage.module.scss';

export default function ArchitectsPage() {
  return (
    <SiteLayout className={styles.layout}>
      <ArchitectsList />
    </SiteLayout>
  );
}
