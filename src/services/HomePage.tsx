import React, { useEffect, useState, useCallback } from 'react';
import { useAppStore, Location, WeatherData, FishAnalysis } from '@/stores/appStore';
import { getWeatherData, estimateWaterTemp } from '@/services/weather';
import { reverseGeocode } from '@/services/amap';
import { calculateFishScore } from '@/utils/fishScoring';
import Header from '@/components/Header';
import MapContainer from '@/components/MapContainer';
import FishScoreCard from '@/components/FishScoreCard';
import LoadingOverlay from '@/components/LoadingOverlay';
import './HomePage.scss';

const HomePage: React.FC = () => {
  const {
    currentLocation,
    setCurrentLocation,
    selectedLocation,
    setSelectedLocation,
    weatherData,
    setWeatherData,
    fishAnalysis,
    setFishAnalysis,
    isLoading,
    setIsLoading,
    setError,
  } = useAppStore();

  const [locationName, setLocationName] = useState('无锡市');
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualLng, setManualLng] = useState('');
  const [manualLat, setManualLat] = useState('');

  // 处理位置选择
  const handleLocationSelect = useCallback(async (lng: number, lat: number) => {
    console.log('handleLocationSelect called:', lng, lat);
    setIsLoading(true);
    setError(null);

    try {
      // 获取地址名称
      console.log('Reverse geocoding...');
      let name = '未知地点';
      try {
        name = await reverseGeocode(lng, lat);
      } catch (e) {
        console.warn('逆地理编码失败，使用默认名称');
      }
      console.log('Address name:', name);
      setLocationName(name);
      setSelectedLocation({ lng, lat, name });

      // 获取天气数据
      console.log('Getting weather data...');
      let weather;
      try {
        weather = await getWeatherData(lng, lat);
      } catch (e) {
        console.warn('获取天气失败，使用模拟数据');
        // 使用模拟数据作为后备
        weather = {
          temperature: 20,
          humidity: 60,
          windSpeed: 12,
          windDir: 180,
          pressure: 1013,
          weather: '晴',
          updateTime: new Date().toLocaleString('zh-CN'),
        };
      }
      console.log('Weather data:', weather);
      
      // 估算水温
      const waterTemp = estimateWaterTemp(weather.temperature);
      const weatherWithWaterTemp = {
        ...weather,
        waterTemp,
      };
      
      setWeatherData(weatherWithWaterTemp);

      // 计算鱼情得分
      console.log('Calculating fish score...');
      const analysis = calculateFishScore(weatherWithWaterTemp, name);
      console.log('Fish analysis:', analysis);
      setFishAnalysis(analysis);

    } catch (error) {
      console.error('获取数据失败:', error);
      setError('获取数据失败，请重试');
    } finally {
      setIsLoading(false);
      console.log('Loading finished, fishAnalysis should be set');
    }
  }, [setSelectedLocation, setLocationName, setWeatherData, setFishAnalysis, setIsLoading, setError]);

  // 刷新数据
  const handleRefresh = useCallback(() => {
    if (selectedLocation) {
      handleLocationSelect(selectedLocation.lng, selectedLocation.lat);
    }
  }, [selectedLocation, handleLocationSelect]);

  // 搜索点击 (预留)
  const handleSearchClick = useCallback(() => {
    // 显示手动输入坐标弹窗
    setShowManualInput(true);
  }, []);

  // 处理手动输入的坐标
  const handleManualLocation = () => {
    const lng = parseFloat(manualLng);
    const lat = parseFloat(manualLat);
    
    if (isNaN(lng) || isNaN(lat)) {
      alert('请输入有效的经纬度');
      return;
    }
    
    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      alert('经纬度范围无效');
      return;
    }
    
    setShowManualInput(false);
    handleLocationSelect(lng, lat);
  };

  // 初始加载时如果没有选中的位置，显示提示
  useEffect(() => {
    if (!selectedLocation && !isLoading) {
      // 可以在这里触发默认位置的加载
    }
  }, [selectedLocation, isLoading]);

  return (
    <div className="home-page">
      <Header 
        locationName={locationName}
        onSearchClick={handleSearchClick}
        onRefreshClick={handleRefresh}
        isLoading={isLoading}
      />

      <main className="home-page__main">
        <MapContainer
          onLocationSelect={handleLocationSelect}
          selectedLocation={selectedLocation}
        />

        {fishAnalysis && weatherData && (
          <FishScoreCard 
            analysis={fishAnalysis}
            weather={weatherData}
            onRefresh={handleRefresh}
          />
        )}
      </main>

      <LoadingOverlay 
        isLoading={isLoading}
        message="正在分析路亚鱼情..."
      />

      {/* 手动输入坐标弹窗 */}
      {showManualInput && (
        <div className="manual-input-modal" onClick={() => setShowManualInput(false)}>
          <div className="manual-input-modal__content" onClick={e => e.stopPropagation()}>
            <h3>手动输入坐标</h3>
            <p>如果地图无法加载，请手动输入经纬度</p>
            <div className="manual-input-modal__fields">
              <div className="field">
                <label>经度 (Lng)</label>
                <input 
                  type="number" 
                  step="0.0001"
                  placeholder="例: 120.3014"
                  value={manualLng}
                  onChange={e => setManualLng(e.target.value)}
                />
              </div>
              <div className="field">
                <label>纬度 (Lat)</label>
                <input 
                  type="number" 
                  step="0.0001"
                  placeholder="例: 31.5747"
                  value={manualLat}
                  onChange={e => setManualLat(e.target.value)}
                />
              </div>
            </div>
            <div className="manual-input-modal__buttons">
              <button className="btn-cancel" onClick={() => setShowManualInput(false)}>取消</button>
              <button className="btn-confirm" onClick={handleManualLocation}>确认</button>
            </div>
            <div className="preset-locations">
              <button onClick={() => { setManualLng('120.3014'); setManualLat('31.5747'); }}>无锡</button>
              <button onClick={() => { setManualLng('121.4737'); setManualLat('31.2304'); }}>上海</button>
              <button onClick={() => { setManualLng('116.4074'); setManualLat('39.9042'); }}>北京</button>
              <button onClick={() => { setManualLng('120.1536'); setManualLat('30.2873'); }}>杭州</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
