import PageTitle from '../../components/PageTitle/PageTitle.tsx';
import SiteLayout from '../../layouts/SiteSimpleLayout/SiteLayout.tsx';
import Button from '~/components/Button/Button.tsx';
import routes from '~/util/routes.ts';

export default function NotFoundPage() {
  return (
    <SiteLayout>
      <PageTitle>404</PageTitle>
      <p>This page is not found. But try other</p>
      <Button href={routes.commonMap}>Go Home</Button>
    </SiteLayout>
  );
}
