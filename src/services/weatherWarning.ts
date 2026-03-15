/**
 * 天气预警服务
 * 基于天气数据生成钓鱼预警提示
 */

import { WeatherData } from '@/stores/appStore';

interface WeatherWarning {
  type: 'storm' | 'rain' | 'wind' | 'temp' | 'pressure' | 'good';
  level: 'info' | 'warning' | 'danger';
  title: string;
  desc: string;
  icon: string;
}

// 生成天气预警
export const getWeatherWarnings = (weather: WeatherData): WeatherWarning[] => {
  const warnings: WeatherWarning[] = [];
  
  // 风力预警
  if (weather.windSpeed > 30) {
    warnings.push({
      type: 'wind',
      level: 'danger',
      title: '大风警告',
      desc: `当前风速${weather.windSpeed}km/h，不宜出钓`,
      icon: '💨'
    });
  } else if (weather.windSpeed > 20) {
    warnings.push({
      type: 'wind',
      level: 'warning',
      title: '注意风力',
      desc: `风速${weather.windSpeed}km/h，建议选择避风钓点`,
      icon: '💨'
    });
  }

  // 气压预警
  if (weather.pressure < 1000) {
    warnings.push({
      type: 'pressure',
      level: 'danger',
      title: '低压警告',
      desc: `气压${weather.pressure}hPa，鱼活性低，建议深水钓法`,
      icon: '📉'
    });
  } else if (weather.pressure > 1025) {
    warnings.push({
      type: 'pressure',
      level: 'info',
      title: '高压天气',
      desc: `气压${weather.pressure}hPa，鱼活性高，是钓鱼好时机`,
      icon: '📈'
    });
  }

  // 温度预警
  if (weather.waterTemp && weather.waterTemp < 10) {
    warnings.push({
      type: 'temp',
      level: 'danger',
      title: '水温过低',
      desc: `水温${weather.waterTemp}°C，鱼不活跃，建议午后出钓`,
      icon: '🥶'
    });
  } else if (weather.waterTemp && weather.waterTemp > 32) {
    warnings.push({
      type: 'temp',
      level: 'warning',
      title: '水温过高',
      desc: `水温${weather.waterTemp}°C，建议早晚出钓`,
      icon: '🥵'
    });
  }

  // 天气预警
  if (weather.weather.includes('雨') || weather.weather.includes('雪')) {
    warnings.push({
      type: 'rain',
      level: 'warning',
      title: '降水天气',
      desc: `当前${weather.weather}，注意防滑`,
      icon: '🌧️'
    });
  }

  // 好天气提示
  if (warnings.length === 0 || (weather.windSpeed < 15 && weather.pressure > 1010)) {
    warnings.push({
      type: 'good',
      level: 'info',
      title: '钓鱼良机',
      desc: '天气条件良好，适合出钓！',
      icon: '🎣'
    });
  }

  return warnings;
};

// 获取综合钓鱼指数
export const getFishingIndex = (weather: WeatherData): { score: number; level: string; desc: string } => {
  let score = 50; // 基础分

  // 气压贡献 (30分)
  if (weather.pressure > 1010 && weather.pressure < 1025) {
    score += 15;
  } else if (weather.pressure >= 1005 && weather.pressure <= 1030) {
    score += 5;
  }

  // 风力贡献 (25分)
  if (weather.windSpeed < 10) {
    score += 15;
  } else if (weather.windSpeed < 20) {
    score += 10;
  } else if (weather.windSpeed > 30) {
    score -= 15;
  }

  // 温度贡献 (25分)
  if (weather.waterTemp) {
    if (weather.waterTemp >= 15 && weather.waterTemp <= 28) {
      score += 15;
    } else if (weather.waterTemp >= 10 && weather.waterTemp <= 32) {
      score += 5;
    } else {
      score -= 10;
    }
  }

  // 天气贡献 (20分)
  const goodWeather = ['晴', '多云', '阴'];
  if (goodWeather.some(w => weather.weather.includes(w))) {
    score += 10;
  }

  // 限制范围
  score = Math.max(0, Math.min(100, score));

  let level: string;
  let desc: string;
  
  if (score >= 80) {
    level = '极佳';
    desc = '黄金钓鱼时机，不要错过！';
  } else if (score >= 60) {
    level = '良好';
    desc = '天气不错，适合出钓';
  } else if (score >= 40) {
    level = '一般';
    desc = '可以尝试，但收获可能有限';
  } else {
    level = '较差';
    desc = '建议改日再战';
  }

  return { score, level, desc };
};
