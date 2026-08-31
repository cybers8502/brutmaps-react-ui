import styles from './SightPreviewPopup.module.scss';
import {GeoJSONFeature} from '../MapLayers/MapLayers.tsx';
import {CanselIconButton} from '../Icons/Icons.tsx';
import classNames from 'classnames';
import getJsonObject from '~/util/getImagesArray.ts';
import {useTranslation} from 'react-i18next';

interface SightPreviewPopupProps {
  popupInfo: {
    coordinates: [number, number];
    properties: GeoJSONFeature['properties'];
  } | null;
  closeHandle?: () => void;
  onClick: (sightId: string) => void;
}

export default function SightPreviewPopup({popupInfo, closeHandle, onClick}: SightPreviewPopupProps) {
  const {t} = useTranslation();

  if (!popupInfo) return null;

  return (
    <div className={styles.container}>
      {popupInfo.properties.image &&
        (() => {
          const imgInfo = getJsonObject(popupInfo.properties.image);
          return (
            <button onClick={() => onClick(popupInfo?.properties.slug || '')} className={styles.imgLink}>
              <picture className={styles.picture}>
                <img
                  src={imgInfo.url}
                  alt={imgInfo.alt || t('sightPreviewPopup.imageAlt')}
                  title={imgInfo.title || t('sightPreviewPopup.imageAlt')}
                />
              </picture>
            </button>
          );
        })()}

      <div className={styles.text} onClick={() => onClick(popupInfo?.properties.slug || '')}>
        <p>
          <b>{popupInfo.properties.title}</b>
        </p>
      </div>
      <button className={classNames(styles.closeButton, 'is-mobile')} onClick={closeHandle}>
        <CanselIconButton />
      </button>
    </div>
  );
}
