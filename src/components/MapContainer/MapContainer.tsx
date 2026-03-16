import React, { useEffect, useRef, useState, useCallback } from 'react';
import { initMap, getUserLocation, setMapCenter, createMarker, createCircle, reverseGeocode, MapTheme } from '@/services/amap';
import './MapContainer.scss';

interface MapContainerProps {
  onLocationSelect: (lng: number, lat: number) => void;
  onMapReady?: (map: any) => void;
  selectedLocation?: { lng: number; lat: number } | null;
  theme?: MapTheme;
  onSpotsClick?: () => void;
}

const MapContainer: React.FC<MapContainerProps> = ({
  onLocationSelect,
  onMapReady,
  selectedLocation,
  theme = 'normal',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const onLocationSelectRef = useRef(onLocationSelect);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const initializedRef = useRef(false);
  
  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  // 定位按钮点击
  const handleLocateClick = useCallback(async () => {
    if (!mapInstanceRef.current || isLocating) return;
    
    setIsLocating(true);
    try {
      const userLoc = await getUserLocation();
      console.log('[Map] 获取到用户位置:', userLoc);
      setMapCenter(mapInstanceRef.current, userLoc.lng, userLoc.lat);
      onLocationSelectRef.current(userLoc.lng, userLoc.lat);
    } catch (error) {
      console.error('[Map] 定位失败:', error);
      alert('定位失败，请检查定位权限');
    } finally {
      setIsLocating(false);
    }
  }, [isLocating]);

  // 处理位置选择
  const handleLocationChange = useCallback(async (lng: number, lat: number) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 清除之前的标记
    try {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
    } catch (e) {
      console.warn('[Map] 清除标记失败:', e);
    }

    // 创建新标记
    try {
      markerRef.current = createMarker(map, lat, lng);
      circleRef.current = createCircle(map, lat, lng, 1000);
    } catch (e) {
      console.warn('[Map] 创建标记失败:', e);
    }

    // 获取地址
    try {
      const locationName = await reverseGeocode(lat, lng);
      console.log('[Map] 位置:', locationName);
    } catch (e) {
      console.warn('[Map] 获取地址失败');
    }

    console.log('[Map] 已选择位置:', lng, lat);
    onLocationSelectRef.current(lng, lat);
  }, []);

  // 初始化地图
  useEffect(() => {
    if (!mapRef.current) return;

    // 如果已经初始化过，先销毁旧地图
    if (initializedRef.current && mapInstanceRef.current) {
      try {
        mapInstanceRef.current.destroy();
      } catch (e) {
        console.warn('[Map] 销毁旧地图失败:', e);
      }
      mapInstanceRef.current = null;
      initializedRef.current = false;
    }
    
    const initMapInstance = async () => {
      try {
        setIsLoading(true);
        
        // 确保容器尺寸
        mapRef.current!.style.height = '100%';
        mapRef.current!.style.width = '100%';
        
        console.log('[Map] 开始初始化高德地图...');
        
        const map = await initMap(mapRef.current!, undefined, theme);
        mapInstanceRef.current = map;
        
        setIsMapReady(true);
        setIsLoading(false);

        // 暴露到全局
        (window as any).amapMap = map;
        (window as any).mapHandleClick = handleLocationChange;

        // 点击事件
        map.on('click', (e: any) => {
          console.log('[Map] 点击:', e.lnglat.getLng(), e.lnglat.getLat());
          handleLocationChange(e.lnglat.getLng(), e.lnglat.getLat());
        });

        if (onMapReady) onMapReady(map);

        // 尝试获取用户位置
        getUserLocation()
          .then((userLoc) => {
            console.log('[Map] 获取到用户位置:', userLoc);
            setMapCenter(map, userLoc.lng, userLoc.lat);
            handleLocationChange(userLoc.lng, userLoc.lat);
          })
          .catch((err) => {
            console.log('[Map] 定位失败，使用默认位置无锡', err);
            handleLocationChange(120.3014, 31.5747);
          });

      } catch (error) {
        console.error('[Map] 初始化失败:', error);
        setMapError('地图加载失败: ' + (error as Error).message);
        setIsLoading(false);
      }
    };

    // 延迟初始化确保DOM渲染完成
    const timer = setTimeout(initMapInstance, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.destroy();
        } catch (e) {
          console.warn('[Map] 销毁地图失败:', e);
        }
        mapInstanceRef.current = null;
      }
    };
  }, [theme, onMapReady, handleLocationChange]);

  // 外部位置变化
  useEffect(() => {
    if (!selectedLocation || !mapInstanceRef.current || !isMapReady) return;

    const map = mapInstanceRef.current;
    const center = map.getCenter();
    
    if (center) {
      const currentLng = Math.round(center.getLng() * 10000);
      const newLng = Math.round(selectedLocation.lng * 10000);
      const currentLat = Math.round(center.getLat() * 10000);
      const newLat = Math.round(selectedLocation.lat * 10000);
      
      if (currentLng !== newLng || currentLat !== newLat) {
        setMapCenter(map, selectedLocation.lng, selectedLocation.lat);
        handleLocationChange(selectedLocation.lng, selectedLocation.lat);
      }
    }
  }, [selectedLocation, isMapReady, handleLocationChange]);

  if (mapError) {
    return (
      <div className="map-container map-error">
        <div className="map-error-content">
          <span className="error-icon">🗺️</span>
          <p>{mapError}</p>
          <button onClick={() => window.location.reload()}>重新加载</button>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      {/* 加载状态 */}
      {isLoading && (
        <div className="map-loading">
          <div className="map-loading__spinner"></div>
          <p>正在加载高德地图...</p>
        </div>
      )}
      
      <div ref={mapRef} className="map-view" id="amap-container" />
      
      {/* 定位按钮 */}
      <button 
        className={`location-btn ${isLocating ? 'locating' : ''}`}
        onClick={handleLocateClick}
        title="定位到我的位置"
      >
        {isLocating ? (
          <span className="location-spinner"></span>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
          </svg>
        )}
      </button>

      {/* 钓点按钮 */}
      <button 
        className="spots-btn"
        onClick={() => onSpotsClick?.()}
        title="我的钓点"
      >
        📍
      </button>

      {/* 钓获按钮 */}
      <button 
        className="catch-btn"
        onClick={() => onCatchClick?.()}
        title="钓获记录"
      >
        🎣
      </button>
    </div>
  );
};

export default MapContainer;
