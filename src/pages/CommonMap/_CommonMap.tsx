import {useRef, useState, useCallback, useEffect} from 'react';
import {Map} from 'react-map-gl';
import type {MapRef} from 'react-map-gl';
import MapLayers, {GeoJSONFeature} from '~/components/MapLayers/MapLayers.tsx';
import MapPointPopup from '~/components/MapPointPopup/MapPointPopup.tsx';
import debounce from 'lodash.debounce';
import SightBlogArticle from '~/components/SightBlogArticle/SightBlogArticle.tsx';
import SiteLayout from '~/layouts/SiteSimpleLayout/SiteLayout.tsx';
import styles from './CommonMap.module.scss';
import {clusterLayer, unclutteredPointLayer} from '~/components/MapLayers/layers.ts';
import {GeoJSONSource} from 'mapbox-gl';
import {mapboxToken} from '~/configs/map.configs.ts';
import 'mapbox-gl/dist/mapbox-gl.css';
import useMobileState from '~/hooks/useMobileState.ts';
import {useMapContext} from '~/context/MapContext.tsx';
import useFetchMapDetails from '~/hooks/fetchApi/useFetchMap.tsx';
import useSightSearchParams from '~/hooks/useSightSearchParams.ts';
import SightPreviewPopup from '~/components/SightPreviewPopup/SightPreviewPopup.tsx';
import {useLocation, useNavigate} from 'react-router-dom';
import GeocoderControl from '~/components/GeocoderControl/GeocoderControl.tsx';

export default function CommonMap() {
  const isMobileView = useMobileState();
  const searchParams = useSightSearchParams('sight');
  const {sightDetails, featureCollection, isLoading, isError} = useFetchMapDetails();
  const {viewport, updateViewport} = useMapContext();
  const [popupInfo, setPopupInfo] = useState<
    Array<{
      coordinates: [number, number];
      properties: GeoJSONFeature['properties'];
    }>
  >([]);
  const popupInfoRef = useRef(popupInfo);
  const mapRef = useRef<MapRef | null>(null);
  const [sightSlug, setSightSlug] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handlePopState = () => {
      handleCloseSingleSightArticle();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      handleCloseSingleSightArticle();
    };

    if (!location.pathname.startsWith('/sight/')) {
      handlePopState();
    }
  }, [location.pathname]);

  useEffect(() => {
    popupInfoRef.current = popupInfo;
  }, [popupInfo]);

  useEffect(() => {
    if (searchParams && featureCollection) {
      const map = mapRef.current;
      if (!map) return;
      const mapInstance = map?.getMap();
      mapInstance.setFeatureState({source: 'earthquakes', id: searchParams}, {isActive: true});

      const selectedSight = featureCollection.features.filter((sight) => {
        return sight.properties.id == searchParams;
      })[0];

      setPopupInfo([
        {
          coordinates: selectedSight.geometry.coordinates,
          properties: selectedSight.properties,
        },
      ]);
    }
  }, [mapRef.current, searchParams, featureCollection]);

  const handleViewportChange = useCallback(
    debounce(() => {
      const mapInstance = mapRef.current?.getMap();
      if (!mapInstance) return;

      const currentViewport = {
        latitude: mapInstance.getCenter().lat,
        longitude: mapInstance.getCenter().lng,
        zoom: mapInstance.getZoom(),
      };
      updateViewport(currentViewport);
    }, 300),
    [mapRef, updateViewport],
  );

  const hidePopup = () => {
    const mapInstance = mapRef.current?.getMap();
    if (popupInfoRef.current[0]?.properties.id) {
      mapInstance?.setFeatureState(
        {source: 'earthquakes', id: popupInfoRef.current[0].properties.id},
        {hover: false, isActive: false},
      );
    }
    setPopupInfo([]);
  };

  const cleanActivePoint = useCallback((mapInstance) => {
    const source = mapInstance.getSource('earthquakes') as GeoJSONSource;
    const features = source?.serialize()?.data?.features;

    if (features) {
      features.forEach((feature) => {
        if (feature.id) {
          mapInstance.setFeatureState({source: 'earthquakes', id: feature.id}, {isActive: false});
        }
      });
    }

    setPopupInfo([]);
  });

  const handleMapClick = useCallback(
    (event) => {
      const map = mapRef.current;
      if (!map) return;
      const mapInstance = map?.getMap();
      if (!mapInstance) return;
      const feature = event.features && event.features[0];

      if (!feature) {
        if (popupInfo.length > 0) {
          cleanActivePoint(mapInstance);
        }
        return;
      }

      if (feature.layer.id === 'clusters') {
        const clusterId = feature.properties.cluster_id;
        const mapboxSource = map.getSource('earthquakes') as GeoJSONSource;
        mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          map.easeTo({
            center: feature.geometry.coordinates,
            zoom: zoom as number,
            duration: 500,
          });
        });
      }

      if (feature.layer.id === 'sight-points') {
        if (isMobileView) {
          cleanActivePoint(mapInstance);

          mapInstance.setFeatureState({source: 'earthquakes', id: feature.id}, {isActive: true});
          setPopupInfo([
            {
              coordinates: feature.geometry.coordinates,
              properties: feature.properties,
            },
          ]);
        } else {
          const sightSlug = feature.properties.slug;
          handleOpenSingleSightArticle(sightSlug);
        }
      }
    },
    [mapRef, popupInfo.length],
  );

  const handlePointMouseEnter = useCallback((event) => {
    if (isMobileView) return;

    hidePopup();

    const feature: GeoJSONFeature = event.features && event.features[0];
    const map = mapRef.current;

    if (feature.layer.id === 'sight-points') {
      const mapInstance = map?.getMap();
      mapInstance.setFeatureState({source: 'earthquakes', id: feature.id}, {hover: true});
      mapInstance.getCanvas().style.cursor = 'pointer';

      setPopupInfo([
        {
          coordinates: feature.geometry.coordinates,
          properties: feature.properties,
        },
      ]);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isMobileView) return;
    hidePopup();
  }, []);

  const handlePopupClick = useCallback((sightSlug: string) => {
    handleOpenSingleSightArticle(sightSlug);
  }, []);

  const handleOpenSingleSightArticle = useCallback((slug: string) => {
    setSightSlug(slug);
    navigate(`/sight/${slug}`, {replace: false});
    // window.history.pushState({}, '', `/sight/${slug}`);
  }, []);

  const handleCloseSingleSightArticle = useCallback(() => {
    setSightSlug(null);
  }, []);

  const getCurrentSightLocation = useCallback((featureCollection, searchParams) => {
    const selectedSight = featureCollection.features.filter((sight) => {
      return sight.properties.id == searchParams;
    })[0];

    return {
      latitude: selectedSight.geometry.coordinates[1],
      longitude: selectedSight.geometry.coordinates[0],
      zoom: 12,
    };
  }, []);

  if (isLoading) return <p>Loading</p>;
  if (isError) return <p>Server Error</p>;

  const {settings} = sightDetails.data;

  const initialViewport = (searchParams && getCurrentSightLocation(featureCollection, searchParams)) ||
    viewport || {
      latitude: settings.default_center.coordinates.lat,
      longitude: settings.default_center.coordinates.long,
      zoom: 9,
    };

  return (
    <SiteLayout className={styles['common-map']}>
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
        onViewportChange={handleViewportChange}
        onMoveEnd={handleViewportChange}>
        <MapLayers />
        {!isMobileView &&
          popupInfo.length > 0 &&
          popupInfo.map((info, index) => (
            <MapPointPopup key={index} popupInfo={info}>
              <SightPreviewPopup popupInfo={info} onClick={() => handlePopupClick(info.properties.slug)} />
            </MapPointPopup>
          ))}
      </Map>

      {sightSlug && (
        <SightBlogArticle
          sightSlug={sightSlug}
          onSeeMap={handleCloseSingleSightArticle}
          className={styles['blog-article']}
        />
      )}

      {isMobileView &&
        popupInfo.length > 0 &&
        popupInfo.map((info, index) => (
          <SightPreviewPopup
            key={index}
            popupInfo={info}
            closeHandle={hidePopup}
            onClick={() => handlePopupClick(info.properties.slug)}
          />
        ))}

      <GeocoderControl
        mapRef={mapRef}
        placeholder={'Search location'}
        accessToken={mapboxToken}
        onResult={(result) => {
          mapRef.current?.easeTo({
            center: result.center,
            zoom: 12,
            duration: 500,
          });
        }}
        className={styles['geo-control']}
      />
    </SiteLayout>
  );
}
