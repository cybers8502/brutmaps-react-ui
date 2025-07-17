import Button from '~/components/Button/Button.tsx';

interface AccountDelete {
  userId: string;
}

export default function AccountDelete({userId}) {
  const deleteRequest = () => {};

  return (
    <>
      {/*TODO show message "are you shoure"*/}
      {/*TODO delete user"*/}
      {/*TODO transparent type of button color"*/}
      <Button onClick={deleteRequest} variant={'fillDarkShadeGray'}>
        Delete account
      </Button>
    </>
  );
}
