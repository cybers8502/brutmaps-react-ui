import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useDeleteAccount} from '@brutmaps/api';
import Button from '~/components/Button/Button.tsx';
import routes from '~/util/routes.ts';
import {clearTokens} from '~/util/auth.ts';
import {invalidateMapData} from '~/util/mutateMapData.ts';

export default function AccountDelete() {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {deleteAccount, isLoading} = useDeleteAccount();

  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setError(null);

    try {
      await deleteAccount();
      clearTokens();
      invalidateMapData();
      navigate(routes.login);
    } catch {
      setError(t('common.somethingWentWrong'));
    }
  };

  if (isConfirming) {
    return (
      <div>
        <p className='error'>{t('account.deleteAccountConfirm')}</p>
        {error && <p className='error'>{error}</p>}
        <Button onClick={handleConfirm} disabled={isLoading} variant={'fillDarkShadeGray'}>
          {isLoading ? t('account.deleting') : t('account.yes')}
        </Button>
        <Button onClick={() => setIsConfirming(false)} disabled={isLoading}>
          {t('common.cancel')}
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={() => setIsConfirming(true)} variant={'fillDarkShadeGray'}>
      {t('account.deleteAccount')}
    </Button>
  );
}
