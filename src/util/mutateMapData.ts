import {mutate} from 'swr';

export const invalidateMapData = () => {
  mutate(
    (key) => typeof key === 'object' && key !== null && 'key' in key && key.key.startsWith('map_data:'),
    undefined,
    {
      revalidate: true,
    },
  );
};
