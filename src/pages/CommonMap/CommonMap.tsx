import {Suspense, useCallback, useEffect, useRef, useState} from 'react';
import {Map, NavigationControl} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import debounce from 'lodash.debounce';
import {useTranslation} from 'react-i18next';
import type {MapRef} from 'react-map-gl';
import {useLocation, useNavigate} from 'react-router-dom';
import MapFilters from '~/components/MapFilters/MapFilters.tsx';
import {clusterLayer, unclutteredPointLayer} from '~/components/MapLayers/layers.ts';
import MapLayers from '~/components/MapLayers/MapLayers.tsx';
import MapObjectsBadge from '~/components/MapObjectsBadge/MapObjectsBadge.tsx';
import MapPointPopup from '~/components/MapPointPopup/MapPointPopup.tsx';
import SightBlogArticle from '~/components/SightBlogArticle/SightBlogArticle';
import SightPreviewPopup from '~/components/SightPreviewPopup/SightPreviewPopup.tsx';
import {mapboxToken} from '~/configs/map.configs.ts';
import {useMapContext} from '~/context/MapContext.tsx';
import {useSetPageLoading} from '~/context/PageLoadingContext.tsx';
import useFetchMapDetails from '~/hooks/fetchApi/useFetchMap.tsx';
import useMapInteractions from '~/hooks/useMapInteractions.ts';
import useMobileState from '~/hooks/useMobileState.ts';
import useSightSearchParams from '~/hooks/useSightSearchParams.ts';
import SiteLayout from '~/layouts/SiteSimpleLayout/SiteLayout.tsx';
import type {PopupInterface} from '~/pages/CommonMap/CommonMap.interface.ts';
import styles from './CommonMap.module.scss';

export default function CommonMap() {
  const {t} = useTranslation();
  const isMobileView = useMobileState();
  const {featureCollection, isLoading, isError} = useFetchMapDetails();

  useSetPageLoading(isLoading);
  const {viewport, updateViewport} = useMapContext();
  const searchParams = useSightSearchParams('sight');

  const mapRef = useRef<MapRef | null>(null);
  const popupInfoRef = useRef<PopupInterface[]>([]);
  const [popupInfo, setPopupInfo] = useState<PopupInterface[]>([]);
  const [sightSlug, setSightSlug] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    popupInfoRef.current = popupInfo;
  }, [popupInfo]);

  useEffect(() => {
    const handlePopState = () => setSightSlug(null);
    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!location.pathname.startsWith('/sight/')) setSightSlug(null);
  }, [location.pathname]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !featureCollection || !searchParams) return;

    const selected = featureCollection.features.find((f) => String(f.properties.id) === searchParams);

    if (selected) {
      // 1. Переміщення мапи
      const mapInstance = map?.getMap();

      mapInstance.easeTo({
        center: selected.geometry.coordinates,
        zoom: 12,
        duration: 500,
      });

      // 2. Скинути попередні активні стани (опційно)
      featureCollection.features.forEach((f) => {
        if (f.id) {
          mapInstance.setFeatureState({source: 'earthquakes', id: f.id}, {isActive: false});
        }
      });

      // Активувати обране місце
      if (selected.id || selected.properties.id) {
        mapInstance.once('idle', () => {
          mapInstance.setFeatureState(
            {source: 'earthquakes', id: selected.id ?? selected.properties.id},
            {isActive: true},
          );

          setPopupInfo([
            {
              coordinates: [
                Number(selected.geometry.coordinates[0]),
                Number(selected.geometry.coordinates[1]),
              ],
              properties: selected.properties,
            },
          ]);
        });
      }
    }

    // if (selected?.id || selected?.properties?.id) {
    //   debounce(() => {
    //     map.setFeatureState(
    //       {source: 'earthquakes', id: selected.id ?? selected.properties.id},
    //       {isActive: true},
    //     );
    //   }, 300);
    // }
  }, [featureCollection, searchParams, mapRef, isLoading]);

  // Передає в контекст зміну в'юпорта для відображення після переходу з іншої сторінки
  const handleViewportChange = useCallback(
    debounce(() => {
      const mapInstance = mapRef.current?.getMap();
      if (!mapInstance) return;
      updateViewport({
        latitude: mapInstance.getCenter().lat,
        longitude: mapInstance.getCenter().lng,
        zoom: mapInstance.getZoom(),
      });
    }, 300),
    [updateViewport],
  );

  const {handleMapClick, handlePointMouseEnter, handleMouseLeave, handlePopupClick, hidePopup} =
    useMapInteractions({
      mapRef,
      popupInfo,
      setPopupInfo,
      popupInfoRef,
      setSightSlug,
      navigate,
      isMobileView,
    });

  const getInitialView = () => {
    return (
      viewport || {
        latitude: 48.86199106320665,
        longitude: 2.347146829343072,
        zoom: 9,
      }
    );
  };

  if (isError) return <p>{t('common.serverError')}</p>;

  const initialViewport = getInitialView();

  return (
    <Suspense fallback={<div>{t('map.loadingMap')}</div>}>
      <SiteLayout className={styles.commonMap} contentClassName={styles.commonMapContent}>
        <MapFilters mapRef={mapRef} />

        <Map
          ref={mapRef}
          initialViewState={initialViewport}
          mapStyle='mapbox://styles/mapbox/dark-v10'
          mapboxAccessToken={mapboxToken}
          interactiveLayerIds={[clusterLayer.id, unclutteredPointLayer.id] as string[]}
          onClick={handleMapClick}
          onMouseEnter={handlePointMouseEnter}
          onMouseLeave={handleMouseLeave}
          onLoad={handleViewportChange}
          onMoveEnd={handleViewportChange}>
          <NavigationControl position={'bottom-right'} showCompass={false} />
          {!isLoading && <MapLayers />}
          {!isMobileView &&
            popupInfo.map((info, i) => (
              <MapPointPopup key={i} popupInfo={info}>
                <SightPreviewPopup popupInfo={info} onClick={() => handlePopupClick(info.properties.slug)} />
              </MapPointPopup>
            ))}
        </Map>

        <MapObjectsBadge />

        {sightSlug && (
          <SightBlogArticle
            sightSlug={sightSlug}
            onSeeMap={() => setSightSlug(null)}
            className={styles['blog-article']}
          />
        )}

        {isMobileView &&
          popupInfo.map((info, i) => (
            <SightPreviewPopup
              key={i}
              popupInfo={info}
              closeHandle={hidePopup}
              onClick={() => handlePopupClick(info.properties.slug)}
            />
          ))}
      </SiteLayout>
    </Suspense>
  );
}
