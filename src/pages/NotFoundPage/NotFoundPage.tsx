import PageTitle from '../../components/PageTitle/PageTitle.tsx';
import SiteLayout from '../../layouts/SiteSimpleLayout/SiteLayout.tsx';
import Button from '~/components/Button/Button.tsx';
import routes from '~/util/routes.ts';
import {useTranslation} from 'react-i18next';

export default function NotFoundPage() {
  const {t} = useTranslation();

  return (
    <SiteLayout>
      <PageTitle>404</PageTitle>
      <p>{t('notFound.message')}</p>
      <Button href={routes.commonMap}>{t('common.goHome')}</Button>
    </SiteLayout>
  );
}
