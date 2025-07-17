import ObjectsItem from './ObjectItem/ObjectsItem.tsx';
import styles from './ObjectsList.module.scss';
import classNames from 'classnames';
import {GeoJSONFeature} from '~/components/MapLayers/MapLayers.tsx';

interface ObjectsListProps {
  visibleObjects: GeoJSONFeature[];
  className?: string;
  onHover?: (feature: GeoJSONFeature) => void;
  onLeave?: () => void;
  onClick?: (feature: GeoJSONFeature) => void;
}

export default function ObjectsList({
  visibleObjects,
  className,
  onHover,
  onLeave,
  onClick,
}: ObjectsListProps) {
  return (
    <div className={classNames(styles.list, className)}>
      {visibleObjects.length ? (
        visibleObjects.map((feature) => (
          <ObjectsItem
            key={feature.properties.id}
            geoJSONFeature={feature}
            onHover={() => onHover && onHover(feature)}
            onLeave={() => onLeave && onLeave()}
            onClick={() => onClick && onClick(feature)}
          />
        ))
      ) : (
        <p>Drag or zoom the map to see results</p>
      )}
    </div>
  );
}
