import {MutableRefObject, RefObject, useCallback} from 'react';
import type {MapRef} from 'react-map-gl';
import type {GeoJSONFeature} from '~/components/MapLayers/MapLayers';
import type {MapLayerMouseEvent} from 'react-map-gl';
import type {NavigateFunction} from 'react-router-dom';
import {PopupInterface} from '~/pages/CommonMap/CommonMap.interface.ts';

interface UseMapInteractionsProps {
  mapRef: RefObject<MapRef>;
  popupInfo: PopupInterface[];
  setPopupInfo: (info: PopupInterface[]) => void;
  popupInfoRef: MutableRefObject<PopupInterface[]>;
  setSightSlug: (slug: string | null) => void;
  navigate: NavigateFunction;
  isMobileView: boolean;
}

export default function useMapInteractions({
  mapRef,
  popupInfo,
  setPopupInfo,
  popupInfoRef,
  setSightSlug,
  navigate,
  isMobileView,
}: UseMapInteractionsProps) {
  const hidePopup = () => {
    const map = mapRef.current?.getMap();
    const activeId = popupInfoRef.current[0]?.properties.id;
    if (activeId) {
      map?.setFeatureState({source: 'earthquakes', id: activeId}, {hover: false, isActive: false});
    }
    setPopupInfo([]);
  };

  const cleanActivePoint = useCallback(
    (mapInstance: mapboxgl.Map) => {
      const features = (mapInstance.getSource('earthquakes') as any)?.serialize()?.data?.features || [];
      features.forEach((f: any) => {
        if (f.id) mapInstance.setFeatureState({source: 'earthquakes', id: f.id}, {isActive: false});
      });
      setPopupInfo([]);
    },
    [setPopupInfo],
  );

  const handleMapClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const map = mapRef.current;
      const mapInstance = map?.getMap();
      const feature = event.features?.[0];
      if (!mapInstance || !feature) {
        if (popupInfo.length > 0) cleanActivePoint(mapInstance!);
        return;
      }

      if (feature.layer.id === 'clusters') {
        const clusterId = feature?.properties?.cluster_id;
        const source = map?.getSource('earthquakes') as any;
        source.getClusterExpansionZoom(clusterId, (err: never, zoom: number) => {
          if (!err) {
            map?.easeTo({center: feature?.geometry?.coordinates, zoom, duration: 500});
          }
        });
      } else if (feature.layer.id === 'sight-points') {
        const id = feature.id;
        mapInstance.setFeatureState({source: 'earthquakes', id}, {isActive: true});
        const info = {coordinates: feature.geometry.coordinates, properties: feature.properties};

        if (isMobileView) {
          cleanActivePoint(mapInstance);
          setPopupInfo([info]);
        } else {
          handleOpenSingleSightArticle(feature?.properties?.slug);
        }
      }
    },
    [mapRef, popupInfo.length, isMobileView, cleanActivePoint],
  );

  const handlePointMouseEnter = useCallback(
    (event: MapLayerMouseEvent) => {
      if (isMobileView) return;
      hidePopup();
      const feature = event.features?.[0] as GeoJSONFeature;
      console.log('feature?.layer?.id ', feature?.layer?.id);
      if (feature?.layer?.id === 'sight-points') {
        const map = mapRef.current?.getMap();
        map?.setFeatureState({source: 'earthquakes', id: feature.id}, {hover: true});
        map?.getCanvas().style.setProperty('cursor', 'pointer');

        setPopupInfo([{coordinates: feature.geometry.coordinates, properties: feature.properties}]);
      }
    },
    [isMobileView],
  );

  const handleMouseLeave = useCallback(() => {
    if (!isMobileView) hidePopup();
  }, [isMobileView]);

  const handlePopupClick = useCallback((slug: string) => {
    handleOpenSingleSightArticle(slug);
  }, []);

  const handleOpenSingleSightArticle = useCallback(
    (slug: string) => {
      setSightSlug(slug);
      navigate(`/sight/${slug}`);
    },
    [navigate],
  );

  return {
    handleMapClick,
    handlePointMouseEnter,
    handleMouseLeave,
    handlePopupClick,
    hidePopup,
  };
}
