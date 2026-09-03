import type {LayerProps} from 'react-map-gl/mapbox';

export const clusterLayer: LayerProps = {
  id: 'clusters',
  type: 'circle',
  source: 'earthquakes',
  filter: ['has', 'point_count'],
  paint: {
    'circle-radius': 15,
    'circle-color': '#EAE9E6',
  },
};

export const clusterCountLayer: LayerProps = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'earthquakes',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12,
  },
};

export const unclutteredPointLayer: LayerProps = {
  id: 'sight-points',
  type: 'circle',
  source: 'earthquakes',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-radius': 11,
    'circle-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      '#C61212', // 🔴 колір при hover
      ['boolean', ['feature-state', 'isActive'], false],
      '#C61212', // 🔴 колір при активності
      // 🔽 інакше перевірка категорії:
      [
        'match',
        ['get', 'category'],
        'favorite',
        '#FFD700', // золота
        'want_to_go',
        '#1E90FF', // синя
        'visited',
        '#32CD32', // зелена
        '#454545', // сірий — за замовчуванням
      ],
    ],
    'circle-stroke-width': 5,
    'circle-stroke-color': '#D9D9D9',
  },
};
