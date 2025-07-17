import {ReactNode} from 'react';
import {Popup} from 'react-map-gl';
import styles from './MapPointPopup.module.scss';

interface PopupInfoProps {
  popupInfo: {
    coordinates: [number, number];
  };
  children: ReactNode;
}

const MapPointPopup = ({popupInfo, children}: PopupInfoProps) => {
  return (
    <>
      {popupInfo && (
        <Popup
          longitude={popupInfo.coordinates[0]}
          latitude={popupInfo.coordinates[1]}
          closeButton={false}
          closeOnClick={false}
          className={styles.popup}>
          {children}
        </Popup>
      )}
    </>
  );
};

export default MapPointPopup;
