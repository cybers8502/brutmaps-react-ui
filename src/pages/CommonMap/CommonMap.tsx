import {Suspense, useCallback, useEffect, useRef, useState} from 'react';
import {GeolocateControl, Map, Marker, NavigationControl} from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import debounce from 'lodash.debounce';
import {useTranslation} from 'react-i18next';
import type {MapRef} from 'react-map-gl/mapbox';
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
import useFetchMapDetails from '~/hooks/fetchApi/useFetchMap.tsx';
import useMapInteractions from '~/hooks/useMapInteractions.ts';
import useMobileState from '~/hooks/useMobileState.ts';
import useSightSearchParams from '~/hooks/useSightSearchParams.ts';
import SiteLayout from '~/layouts/SiteSimpleLayout/SiteLayout.tsx';
import type {PopupInterface} from '~/pages/CommonMap/CommonMap.interface.ts';
import routes from '~/util/routes.ts';
import styles from './CommonMap.module.scss';

export default function CommonMap() {
  const {t} = useTranslation();
  const isMobileView = useMobileState();
  const {featureCollection, isLoading, isError} = useFetchMapDetails();

  const {viewport, updateViewport} = useMapContext();
  const searchParams = useSightSearchParams('sight');

  const mapRef = useRef<MapRef | null>(null);
  const popupInfoRef = useRef<PopupInterface[]>([]);
  const [popupInfo, setPopupInfo] = useState<PopupInterface[]>([]);
  const [sightSlug, setSightSlug] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  // Якщо в'юпорт вже збережено в контексті (був попередній перегляд мапи),
  // геолокацію не чекаємо — одразу показуємо мапу з нього.
  const [isLocating, setIsLocating] = useState(() => !viewport);

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
    if (!location.pathname.startsWith(`${routes.sightSinglePage}/`)) setSightSlug(null);
  }, [location.pathname]);

  // Стежимо за геолокацією користувача постійно: перше визначення використовуємо
  // для початкового в'юпорта мапи (якщо той ще не збережений у контексті), а далі
  // просто оновлюємо позначку користувача на мапі, поки дозволено трекання.
  useEffect(() => {
    if (!navigator.geolocation) {
      setIsLocating(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({latitude: position.coords.latitude, longitude: position.coords.longitude});
        setIsLocating(false);
      },
      () => setIsLocating(false),
      {enableHighAccuracy: true, timeout: 5000},
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !featureCollection || !searchParams) return;

    const selected = featureCollection.features.find((f) => String(f.properties.id) === searchParams);

    if (selected) {
      // 1. Переміщення мапи
      const mapInstance = map?.getMap();

      mapInstance.easeTo({
        center: selected.geometry.coordinates as [number, number],
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
    if (viewport) return viewport;
    if (userLocation) return {...userLocation, zoom: 12};

    return {
      latitude: 48.86199106320665,
      longitude: 2.347146829343072,
      zoom: 9,
    };
  };

  if (isError) return <p>{t('common.serverError')}</p>;

  const initialViewport = getInitialView();

  return (
    <Suspense fallback={<div>{t('map.loadingMap')}</div>}>
      <SiteLayout className={styles.commonMap} contentClassName={styles.commonMapContent}>
        {isLocating ? (
          <div>{t('map.loadingMap')}</div>
        ) : (
          <>
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
              <GeolocateControl
                position={'bottom-right'}
                positionOptions={{enableHighAccuracy: true}}
                trackUserLocation
                showUserHeading
              />
              <NavigationControl position={'bottom-right'} showCompass={false} />
              {userLocation && (
                <Marker latitude={userLocation.latitude} longitude={userLocation.longitude} anchor={'center'}>
                  <div className={styles.userLocationMarker} />
                </Marker>
              )}
              {!isLoading && <MapLayers />}
              {!isMobileView &&
                popupInfo.map((info, i) => (
                  <MapPointPopup key={i} popupInfo={info}>
                    <SightPreviewPopup
                      popupInfo={info}
                      onClick={() => handlePopupClick(info.properties.slug)}
                    />
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
          </>
        )}
      </SiteLayout>
    </Suspense>
  );
}
