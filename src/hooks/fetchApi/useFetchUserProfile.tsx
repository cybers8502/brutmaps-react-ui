import useSWR, {mutate} from 'swr';
import {fetchWithToken} from '~/util/auth.ts';
import apiRoutes from '~/util/apiRoutes.ts';
import {IUserData} from '~/pages/MyAccount/UserData.interface.ts';

type ResponseData = {
  status: string;
  data: IUserData;
};

function useFetchUserProfile() {
  const {data, error} = useSWR<ResponseData>(
    import.meta.env.VITE_SITE_URI + apiRoutes.userProfile,
    fetchWithToken,
  );

  return {
    data: data || null,
    isLoading: !error && !data,
    isError: !!error,
    mutate,
  };
}

export default useFetchUserProfile;
