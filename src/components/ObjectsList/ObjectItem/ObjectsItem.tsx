import styles from './ObjectsItem.module.scss';
import {GeoJSONFeature} from '~/components/MapLayers/MapLayers.tsx';

interface ObjectsItemProps {
  geoJSONFeature: GeoJSONFeature;
  onHover: (arg: GeoJSONFeature) => void;
  onLeave: () => void;
  onClick: (arg: GeoJSONFeature) => void;
}

export default function ObjectsItem({...props}: ObjectsItemProps) {
  const properties = props.geoJSONFeature.properties;

  return (
    <button
      className={styles.item}
      onMouseEnter={() => props.onHover(props.geoJSONFeature)}
      onMouseLeave={props.onLeave}
      onClick={() => props.onClick(props.geoJSONFeature)}>
      {properties?.images && properties.images.length > 0 && (
        <picture className={styles.picture}>
          <img src={properties.images[0]} alt={properties.title} />
        </picture>
      )}
      <div className={styles.info}>
        <h3 className={styles.title}>{properties.title || ''}</h3>
        <p className={styles.address}>{properties.address || ''}</p>
        <strong className={styles.year}>{properties.year || ''}</strong>
      </div>
    </button>
  );
}
