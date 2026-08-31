import Button from '~/components/Button/Button.tsx';
import {useTranslation} from 'react-i18next';

interface AccountDelete {
  userId: string;
}

export default function AccountDelete({userId}) {
  const {t} = useTranslation();
  const deleteRequest = () => {};

  return (
    <>
      {/*TODO show message "are you shoure"*/}
      {/*TODO delete user"*/}
      {/*TODO transparent type of button color"*/}
      <Button onClick={deleteRequest} variant={'fillDarkShadeGray'}>
        {t('account.deleteAccount')}
      </Button>
    </>
  );
}
