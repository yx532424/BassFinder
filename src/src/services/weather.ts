/**
 * 天气数据服务
 */

import axios from 'axios';
import { WeatherData } from '@/stores/appStore';

// 高德天气 API Key
const AMAP_KEY = '840bef19b8611f8b7054ddbba4bc6d32';

/**
 * 获取天气数据
 */
export async function getWeatherData(
  lng: number,
  lat: number
): Promise<WeatherData> {
  try {
    // 使用高德天气 API
    const response = await axios.get(
      `https://restapi.amap.com/v3/weather/weatherInfo`, {
        params: {
          key: AMAP_KEY,
          city: await getCityCode(lng, lat),
          extensions: 'base',
          output: 'JSON',
        },
      }
    );

    if (response.data.status === '1' && response.data.lives?.length > 0) {
      const weather = response.data.lives[0];
      
      // 风力值可能是 "3" (风力等级) 或 "12km/h" 格式
      let windSpeedVal = 0;
      if (weather.windpower) {
        if (weather.windpower.includes('km/h')) {
          windSpeedVal = parseFloat(weather.windpower.replace('km/h', '').trim());
        } else {
          // 风力等级转换为大概的 km/h
          const level = parseFloat(weather.windpower);
          windSpeedVal = level * 10; // 1级 ≈ 10km/h
        }
      }
      
      return {
        temperature: parseFloat(weather.temperature) || 20,
        humidity: parseFloat(weather.humidity) || 60,
        windSpeed: isNaN(windSpeedVal) ? 10 : windSpeedVal,
        windDir: parseWindDir(weather.winddirection),
        pressure: parseFloat(weather.pressure) || 1013,
        weather: weather.weather || '晴',
        updateTime: weather.reporttime || new Date().toLocaleString('zh-CN'),
      };
    }

    // 如果高德 API 失败，返回模拟数据
    return getMockWeatherData();
  } catch (error) {
    console.error('获取天气数据失败:', error);
    return getMockWeatherData();
  }
}

/**
 * 获取城市编码 (用于天气 API)
 */
async function getCityCode(lng: number, lat: number): Promise<string> {
  try {
    const response = await axios.get(
      `https://restapi.amap.com/v3/geocode/regeo`, {
        params: {
          key: AMAP_KEY,
          location: `${lng},${lat}`,
          radius: 1000,
        },
      }
    );

    if (response.data.status === '1') {
      return response.data.regeocode.addressComponent.city || 
             response.data.regeocode.addressComponent.province || 
             '全国';
    }
  } catch (error) {
    console.error('获取城市编码失败:', error);
  }
  
  // 默认返回无锡
  return '320200';
}

/**
 * 解析风向文字为角度
 */
function parseWindDir(dir: string): number {
  const dirMap: Record<string, number> = {
    '北': 0,
    '东北': 45,
    '东': 90,
    '东南': 135,
    '南': 180,
    '西南': 225,
    '西': 270,
    '西北': 315,
  };
  
  return dirMap[dir] || 180;
}

/**
 * 获取模拟天气数据 (当 API 不可用时)
 */
function getMockWeatherData(): WeatherData {
  const now = new Date();
  const hour = now.getHours();
  
  // 基于时间生成合理数据
  let baseTemp = 15; // 基础温度
  
  // 温度随时间变化
  if (hour >= 6 && hour < 12) {
    baseTemp = 15 + (hour - 6) * 1.5;
  } else if (hour >= 12 && hour < 14) {
    baseTemp = 24;
  } else if (hour >= 14 && hour < 20) {
    baseTemp = 24 - (hour - 14) * 1.5;
  } else {
    baseTemp = 12;
  }

  // 随机波动
  const temp = baseTemp + (Math.random() * 4 - 2);
  
  return {
    temperature: Math.round(temp * 10) / 10,
    humidity: 55 + Math.random() * 20,
    windSpeed: 8 + Math.random() * 8,
    windDir: 90 + Math.random() * 90,
    pressure: 1010 + Math.random() * 15,
    weather: '晴',
    updateTime: now.toLocaleString('zh-CN'),
  };
}

/**
 * 获取水体温度估算
 * 基于气温和季节估算水温
 */
export function estimateWaterTemp(airTemp: number): number {
  const month = new Date().getMonth();
  
  // 季节系数
  let seasonalOffset: number;
  if (month >= 2 && month <= 4) { // 春
    seasonalOffset = -2;
  } else if (month >= 5 && month <= 7) { // 夏
    seasonalOffset = 2;
  } else if (month >= 8 && month <= 10) { // 秋
    seasonalOffset = 0;
  } else { // 冬
    seasonalOffset = -4;
  }
  
  // 水温通常比气温低或高几度
  const waterTemp = airTemp + seasonalOffset;
  
  return Math.round(waterTemp * 10) / 10;
}

/**
 * 获取小时级天气预报
 */
export async function getHourlyForecast(
  lng: number,
  lat: number
): Promise<Array<{
  hour: string;
  temp: number;
  weather: string;
  windSpeed: number;
}>> {
  try {
    const response = await axios.get(
      `https://restapi.amap.com/v3/weather/weatherInfo`, {
        params: {
          key: AMAP_KEY,
          city: await getCityCode(lng, lat),
          extensions: 'all',
          output: 'JSON',
        },
      }
    );

    if (response.data.status === '1' && response.data.forecasts?.length > 0) {
      const forecast = response.data.forecasts[0];
      return forecast.hours.map((hour: any) => ({
        hour: hour.hour,
        temp: parseFloat(hour.temp),
        weather: hour.weather,
        windSpeed: parseFloat(hour.windpower),
      }));
    }
  } catch (error) {
    console.error('获取小时预报失败:', error);
  }
  
  // 返回空数组
  return [];
}

export default {
  getWeatherData,
  estimateWaterTemp,
  getHourlyForecast,
};
