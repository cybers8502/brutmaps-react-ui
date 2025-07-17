import {useSearchParams} from 'react-router-dom';

export default function useSightSearchParams(param: string) {
  const [searchParams] = useSearchParams();
  return searchParams.get(param);
}
