import {createContext, type ReactNode, useContext, useState} from 'react';
import type {PopupInterface, ViewportInterface} from '~/pages/CommonMap/CommonMap.interface.ts';

interface MapContextValue {
  viewport: ViewportInterface | null;
  popupInfo: PopupInterface | null;
  updateViewport: (v: ViewportInterface) => void;
  updatePopupInfo: (p: PopupInterface) => void;
}

const MapContext = createContext<MapContextValue | null>(null);

export const useMapContext = (): MapContextValue => {
  const context = useContext(MapContext);

  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider');
  }

  return context;
};

interface MapProviderProps {
  initialValue?: {
    popupInfo: PopupInterface | null;
    viewport: ViewportInterface | null;
  };
  children: ReactNode;
}

export const MapProvider = ({
  children,
  initialValue = {
    popupInfo: null,
    viewport: null,
  },
}: MapProviderProps) => {
  const [viewport, setViewport] = useState<ViewportInterface | null>(initialValue.viewport);
  const [popupInfo, setPopupInfo] = useState<PopupInterface | null>(initialValue.popupInfo);

  const updateViewport = (v: ViewportInterface) => {
    console.log('!!updateViewport!!');
    setViewport(v);
  };

  const updatePopupInfo = (p: PopupInterface) => {
    console.log('!!updatePopupInfo!!');
    setPopupInfo(p);
  };

  return (
    <MapContext.Provider
      value={{
        viewport,
        popupInfo,
        updateViewport,
        updatePopupInfo,
      }}>
      {children}
    </MapContext.Provider>
  );
};
