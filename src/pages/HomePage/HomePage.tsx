import React, { useEffect, useState, useCallback } from 'react';
import { useAppStore, Location, WeatherData, FishAnalysis } from '@/stores/appStore';
import { getWeatherData, estimateWaterTemp } from '@/services/weather';
import { reverseGeocode, MapTheme } from '@/services/amap';
import { calculateFishScore } from '@/utils/fishScoring';
import * as api from '@/services/api';
import { getCache, setCache, getCacheList, clearCache } from '@/services/cache';
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
  
  // 地图主题
  const [mapTheme, setMapTheme] = useState<MapTheme>('normal');

  // 用户状态
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [signInDays, setSignInDays] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', password: '', nickname: '' });
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // 缓存状态
  const [offlineMode, setOfflineMode] = useState(false);
  const [cacheList, setCacheList] = useState<any[]>([]);
  const [showCacheModal, setShowCacheModal] = useState(false);

  // 检查登录状态
  useEffect(() => {
    if (api.isLoggedIn()) {
      setIsLoggedIn(true);
      api.getSignInStats().then(stats => {
        setSignInDays(stats.current_streak);
      }).catch(() => {});
    }
  }, []);

  // 登录
  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      setAuthError('请填写完整');
      return;
    }
    setIsAuthLoading(true);
    setAuthError('');
    try {
      await api.login(loginForm.username, loginForm.password);
      setIsLoggedIn(true);
      setShowLoginModal(false);
      const stats = await api.getSignInStats();
      setSignInDays(stats.current_streak);
    } catch (e: any) {
      setAuthError(e.message || '登录失败');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // 注册
  const handleRegister = async () => {
    if (!registerForm.username || !registerForm.password || !registerForm.nickname) {
      setAuthError('请填写完整');
      return;
    }
    setIsAuthLoading(true);
    setAuthError('');
    try {
      await api.register(registerForm.username, registerForm.password, registerForm.nickname);
      setIsLoggedIn(true);
      setShowRegisterModal(false);
    } catch (e: any) {
      setAuthError(e.message || '注册失败');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // 签到
  const handleSignIn = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    try {
      const result = await api.doSignIn();
      setSignInDays(result.streak);
      alert(`签到成功！连续${result.streak}天，获得${result.score_earned}积分`);
    } catch (e: any) {
      alert(e.message || '签到失败');
    }
  };

  // 退出登录
  const handleLogout = () => {
    api.logout();
    setIsLoggedIn(false);
    setSignInDays(0);
  };

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
      const analysis = calculateFishScore(weatherWithWaterTemp);
      console.log('Fish analysis:', analysis);
      setFishAnalysis(analysis);

      // 保存到缓存
      setCache(lng, lat, { analysis: analysis, weather: weatherWithWaterTemp, name, timestamp: Date.now() });
      setOfflineMode(false);

    } catch (error) {
      console.error('获取数据失败:', error);
      // 尝试从缓存加载
      const cached = getCache(lng, lat);
      if (cached) {
        setFishAnalysis(cached.analysis);
        setWeatherData(cached.weather);
        setLocationName(cached.name);
        setOfflineMode(true);
        alert('网络异常，已加载缓存数据');
      } else {
        setError('获取数据失败，请重试');
      }
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
      // 加载默认位置（无锡）
      handleLocationSelect(120.3014, 31.5747);
    }
  }, [selectedLocation, isLoading]);

  return (
    <div className="home-page">
      <Header 
        locationName={locationName}
        onSearchClick={handleSearchClick}
        onRefreshClick={handleRefresh}
        isLoading={isLoading}
        isLoggedIn={isLoggedIn}
        signInDays={signInDays}
        onUserClick={() => isLoggedIn ? handleLogout() : setShowLoginModal(true)}
        onSignInClick={handleSignIn}
        offlineMode={offlineMode}
      />

      <main className="home-page__main">
        <div className="map-wrapper">
          <MapContainer
            onLocationSelect={handleLocationSelect}
            selectedLocation={selectedLocation}
            theme={mapTheme}
          />
          {/* 主题切换按钮 */}
          <button 
            className="theme-toggle-btn"
            onClick={() => setMapTheme(mapTheme === 'dark' ? 'normal' : 'dark')}
            title={mapTheme === 'dark' ? '切换白色主题' : '切换黑色主题'}
          >
            {mapTheme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

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

      {/* 登录弹窗 */}
      {showLoginModal && (
        <div className="auth-modal" onClick={() => setShowLoginModal(false)}>
          <div className="auth-modal__content" onClick={e => e.stopPropagation()}>
            <h3>登录</h3>
            {authError && <p className="auth-error">{authError}</p>}
            <div className="auth-form">
              <input 
                type="text" 
                placeholder="用户名"
                value={loginForm.username}
                onChange={e => setLoginForm({...loginForm, username: e.target.value})}
              />
              <input 
                type="password" 
                placeholder="密码"
                value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
              />
              <button onClick={handleLogin} disabled={isAuthLoading}>
                {isAuthLoading ? '登录中...' : '登录'}
              </button>
              <p className="auth-switch">
                没有账号？<span onClick={() => { setShowLoginModal(false); setShowRegisterModal(true); }}>立即注册</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 注册弹窗 */}
      {showRegisterModal && (
        <div className="auth-modal" onClick={() => setShowRegisterModal(false)}>
          <div className="auth-modal__content" onClick={e => e.stopPropagation()}>
            <h3>注册</h3>
            {authError && <p className="auth-error">{authError}</p>}
            <div className="auth-form">
              <input 
                type="text" 
                placeholder="用户名"
                value={registerForm.username}
                onChange={e => setRegisterForm({...registerForm, username: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="昵称"
                value={registerForm.nickname}
                onChange={e => setRegisterForm({...registerForm, nickname: e.target.value})}
              />
              <input 
                type="password" 
                placeholder="密码"
                value={registerForm.password}
                onChange={e => setRegisterForm({...registerForm, password: e.target.value})}
              />
              <button onClick={handleRegister} disabled={isAuthLoading}>
                {isAuthLoading ? '注册中...' : '注册'}
              </button>
              <p className="auth-switch">
                已有账号？<span onClick={() => { setShowRegisterModal(false); setShowLoginModal(true); }}>立即登录</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
