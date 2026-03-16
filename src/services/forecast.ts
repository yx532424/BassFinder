/**
 * 钓鱼天气预报服务
 * 预测未来几天的钓鱼条件
 */

import { getMoonPhase } from './tideMoon';

interface DayForecast {
  date: string;        // 日期
  dayName: string;     // 星期几
  score: number;       // 综合评分 0-100
  level: string;       // 等级描述
  weather: string;     // 天气状况
  temp: { min: number; max: number }; // 温度范围
  wind: number;        // 风力等级
  moon: string;       // 月相
  bestTime: string;    // 最佳时段
  tips: string;       // 钓鱼建议
}

// 生成未来3天预报
export const get3DayForecast = (): DayForecast[] => {
  const moon = getMoonPhase();
  const forecasts: DayForecast[] = [];
  
  for (let i = 0; i < 3; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const dayName = i === 0 ? '今天' : i === 1 ? '明天' : dayNames[date.getDay()];
    
    // 模拟天气数据 (实际应接入天气API)
    const weathers = ['晴', '多云', '阴', '晴转多云'];
    const weather = weathers[Math.floor(Math.random() * weathers.length)];
    
    const tempMin = 18 + Math.floor(Math.random() * 5);
    const tempMax = tempMin + 8 + Math.floor(Math.random() * 4);
    const wind = Math.floor(Math.random() * 4) + 1; // 1-4级
    
    // 计算钓鱼评分
    let score = 70; // 基础分
    
    // 天气影响
    if (weather === '晴') score += 5;
    else if (weather === '多云') score += 10;
    else if (weather === '阴') score -= 5;
    
    // 风力影响
    if (wind <= 2) score += 10;
    else if (wind >= 4) score -= 15;
    
    // 月相影响
    if (moon.name === '满月' || moon.name === '新月') score += 5;
    
    // 温度影响
    if (tempMin >= 20 && tempMax <= 30) score += 10;
    else if (tempMin < 15) score -= 10;
    
    score = Math.max(0, Math.min(100, score));
    
    // 确定等级
    let level: string;
    if (score >= 80) level = '极佳';
    else if (score >= 65) level = '良好';
    else if (score >= 50) level = '一般';
    else level = '较差';
    
    // 最佳时段
    let bestTime: string;
    if (score >= 80) {
      bestTime = '6:00-8:00, 17:00-19:00';
    } else if (score >= 65) {
      bestTime = '6:00-9:00, 16:00-18:00';
    } else {
      bestTime = '7:00-10:00';
    }
    
    // 钓鱼建议
    let tips: string;
    if (score >= 80) {
      tips = '条件极佳！强烈建议出钓，使用亮色拟饵';
    } else if (score >= 65) {
      tips = '条件良好，适合出钓，注意防晒';
    } else if (score >= 50) {
      tips = '可尝试，建议早晚出钓';
    } else {
      tips = '建议休整，等待更好时机';
    }
    
    forecasts.push({
      date: dateStr,
      dayName,
      score,
      level,
      weather,
      temp: { min: tempMin, max: tempMax },
      wind,
      moon: moon.name,
      bestTime,
      tips
    });
  }
  
  return forecasts;
};

// 获取周最佳出钓日
export const getBestDayThisWeek = (): DayForecast[] => {
  const forecasts = get3DayForecast();
  return forecasts.filter(f => f.score >= 70).slice(0, 2);
};
