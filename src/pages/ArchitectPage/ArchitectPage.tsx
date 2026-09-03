import {useNavigate, useParams} from 'react-router-dom';
import ArchitectDetail from '~/components/ArchitectDetail/ArchitectDetail.tsx';
import SiteLayout from '~/layouts/SiteSimpleLayout/SiteLayout.tsx';
import styles from './ArchitectPage.module.scss';

export default function ArchitectPage() {
  const {slug} = useParams();
  const navigate = useNavigate();

  if (!slug) {
    navigate('/404');
    return;
  }

  return (
    <SiteLayout className={styles.layout}>
      <ArchitectDetail slug={slug} />
    </SiteLayout>
  );
}
