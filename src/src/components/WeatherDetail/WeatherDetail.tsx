import React from 'react';
import { Gauge, Sunrise, Sunset, Cloud, CloudRain, Wind, Thermometer } from 'lucide-react';
import { WeatherData } from '@/stores/appStore';
import './WeatherDetail.scss';

interface WeatherDetailProps {
  weather: WeatherData;
}

// 获取钓鱼窗口期
function getFishingWindows(): { time: string; status: string; rating: number }[] {
  const windows = [
    { time: '清晨 5-8点', status: '窗口', rating: 5 },
    { time: '上午 8-11点', status: '一般', rating: 3 },
    { time: '中午 11-14点', status: '较差', rating: 1 },
    { time: '下午 14-17点', status: '一般', rating: 3 },
    { time: '傍晚 17-20点', status: '窗口', rating: 5 },
    { time: '夜间 20-23点', status: '窗口', rating: 4 },
  ];
  
  return windows;
}

// 获取天气状况描述
function getWeatherDesc(weather: WeatherData): { text: string; emoji: string } {
  const { temperature, windSpeed, condition } = weather;
  
  if (temperature < 5) return { text: '水温较低', emoji: '❄️' };
  if (temperature > 30) return { text: '水温较高', emoji: '🔥' };
  if (windSpeed > 20) return { text: '风力较大', emoji: '💨' };
  if (windSpeed < 5) return { text: '风力较小', emoji: '🍃' };
  if (condition.includes('雨')) return { text: '有小雨', emoji: '🌧️' };
  
  return { text: '天气晴好', emoji: '☀️' };
}

const WeatherDetail: React.FC<WeatherDetailProps> = ({ weather }) => {
  const windows = getFishingWindows();
  const weatherInfo = getWeatherDesc(weather);
  
  // 当前时段
  const now = new Date();
  const hour = now.getHours();
  let currentWindow = '未知时段';
  if (hour >= 5 && hour < 8) currentWindow = '🐟 清晨黄金';
  else if (hour >= 8 && hour < 11) currentWindow = '☀️ 上午时段';
  else if (hour >= 11 && hour < 14) currentWindow = '☀️ 中午休息';
  else if (hour >= 14 && hour < 17) currentWindow = '⏰ 下午时段';
  else if (hour >= 17 && hour < 20) currentWindow = '🌅 傍晚黄金';
  else if (hour >= 20 || hour < 5) currentWindow = '🌙 夜间活跃';

  // 当前月份（用于判断季节）
  const month = now.getMonth() + 1;
  let season = '';
  if (month >= 3 && month <= 5) season = '春季';
  else if (month >= 6 && month <= 8) season = '夏季';
  else if (month >= 9 && month <= 11) season = '秋季';
  else season = '冬季';

  return (
    <div className="weather-detail">
      {/* 钓鱼窗口期 */}
      <div className="weather-detail__section">
        <div className="section-header">
          <span>🎯</span>
          <span>今日窗口</span>
          <span className="season-badge">{season}</span>
        </div>
        <div className="windows-list">
          {windows.map((window, index) => (
            <div 
              key={index} 
              className={`window-item ${window.rating >= 4 ? 'active' : ''}`}
            >
              <span className="window-time">{window.time}</span>
              <div className="window-rating">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className={i <= window.rating ? 'filled' : ''}>★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="current-window">
          <span>当前: </span>
          <span className="highlight">{currentWindow}</span>
        </div>
      </div>

      {/* 气压与活跃度 */}
      <div className="weather-detail__section">
        <div className="section-header">
          <Gauge size={18} className="section-icon" />
          <span>气压与鱼情</span>
        </div>
        <div className="pressure-grid">
          <div className="pressure-card">
            <span className="pressure-value">{weather.pressure}</span>
            <span className="pressure-label">hPa</span>
          </div>
          <div className="pressure-card">
            <span className={`pressure-trend ${weather.pressure < 1010 ? 'good' : ''}`}>
              {weather.pressure < 1010 ? '↓ 气压低' : weather.pressure > 1015 ? '↑ 气压高' : '→ 气压稳'}
            </span>
            <span className="pressure-tip">
              {weather.pressure < 1010 ? '🐟 鱼更活跃！' : '📊 正常范围'}
            </span>
          </div>
        </div>
      </div>

      {/* 天气与水温 */}
      <div className="weather-detail__section">
        <div className="section-header">
          <Thermometer size={18} className="section-icon" />
          <span>水温与天气</span>
        </div>
        <div className="water-temp-grid">
          <div className="temp-card">
            <span className="temp-icon">🌡️</span>
            <div className="temp-info">
              <span className="temp-value">{weather.waterTemperature}°C</span>
              <span className="temp-label">水温</span>
            </div>
          </div>
          <div className="temp-card">
            <span className="temp-icon">💧</span>
            <div className="temp-info">
              <span className="temp-value">{weather.temperature}°C</span>
              <span className="temp-label">气温</span>
            </div>
          </div>
          <div className="temp-card wide">
            <span className="temp-icon">{weatherInfo.emoji}</span>
            <div className="temp-info">
              <span className="temp-value">{weatherInfo.text}</span>
              <span className="temp-label">{weather.condition}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 风力与风向 */}
      <div className="weather-detail__section">
        <div className="section-header">
          <Wind size={18} className="section-icon" />
          <span>风力与风向</span>
        </div>
        <div className="wind-grid">
          <div className="wind-card">
            <Wind size={20} />
            <div className="wind-info">
              <span className="wind-value">{weather.windSpeed}</span>
              <span className="wind-unit">km/h</span>
            </div>
            <span className="wind-label">风速</span>
          </div>
          <div className="wind-card">
            <span className="wind-direction">{weather.windDirection}</span>
            <span className="wind-label">风向</span>
            {weather.windSpeed > 15 && (
              <span className="wind-tip">⚠️ 风力较大</span>
            )}
            {weather.windSpeed >= 8 && weather.windSpeed <= 15 && (
              <span className="wind-tip good">✅ 理想风力</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetail;
