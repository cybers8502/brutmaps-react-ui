import {useSightsImages} from '@brutmaps/api';

export type {SightItem as PhotoPost} from '@brutmaps/api';

const SEED = 'abc123';

function useFetchPosts(page: number, pageSize: number = 20) {
  const {result, isLoading, error} = useSightsImages({seed: SEED, page, perPage: pageSize});

  return {
    posts: result?.posts || null,
    current_page: result?.currentPage || 0,
    total_pages: result?.totalPages || 0,
    isLoading,
    isError: !!error,
  };
}

export default useFetchPosts;
