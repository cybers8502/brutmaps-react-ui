import SiteLayout from '../../layouts/SiteSimpleLayout/SiteLayout.tsx';
import styles from './Checkout.module.scss';
import PageTitle from '../../components/PageTitle/PageTitle.tsx';
import {useTranslation} from 'react-i18next';

export default function Checkout() {
  const {t} = useTranslation();

  return (
    <SiteLayout>
      <PageTitle>{t('checkout.checkout')}</PageTitle>
    </SiteLayout>
  );
}
