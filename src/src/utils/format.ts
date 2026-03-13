/**
 * 格式化工具
 */

/**
 * 格式化温度
 */
export function formatTemperature(temp: number, unit: 'C' | 'F' = 'C'): string {
  if (unit === 'F') {
    return `${Math.round(temp * 9/5 + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
}

/**
 * 格式化风速
 */
export function formatWindSpeed(speed: number, unit: 'kmh' | 'ms' | 'mph' = 'kmh'): string {
  if (unit === 'ms') {
    return `${(speed / 3.6).toFixed(1)}m/s`;
  }
  if (unit === 'mph') {
    return `${(speed * 0.621371).toFixed(1)}mph`;
  }
  return `${speed.toFixed(1)}km/h`;
}

/**
 * 格式化气压
 */
export function formatPressure(pressure: number, unit: 'hPa' | 'Pa' | 'mmHg' = 'hPa'): string {
  if (unit === 'Pa') {
    return `${Math.round(pressure * 100)}Pa`;
  }
  if (unit === 'mmHg') {
    return `${(pressure * 0.75006).toFixed(0)}mmHg`;
  }
  return `${Math.round(pressure)}hPa`;
}

/**
 * 格式化湿度
 */
export function formatHumidity(humidity: number): string {
  return `${Math.round(humidity)}%`;
}

/**
 * 格式化风向角度为文字
 */
export function formatWindDir(degrees: number): string {
  const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

/**
 * 格式化时间
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

/**
 * 格式化日期
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

/**
 * 格式化得分
 */
export function formatScore(score: number): string {
  return Math.round(score).toString();
}

/**
 * 格式化距离
 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)}km`;
  }
  return `${Math.round(meters)}m`;
}

/**
 * 获取时段名称
 */
export function getTimePeriod(): {
  name: string;
  emoji: string;
  isActive: boolean;
} {
  const hour = new Date().getHours();
  
  // 凌晨窗口 4:00-6:00
  if (hour >= 4 && hour < 6) {
    return { name: '凌晨窗口', emoji: '🌅', isActive: true };
  }
  // 早晨窗口 6:00-9:00
  if (hour >= 6 && hour < 9) {
    return { name: '早晨窗口', emoji: '🌅', isActive: true };
  }
  // 上午 9:00-12:00
  if (hour >= 9 && hour < 12) {
    return { name: '上午', emoji: '☀️', isActive: false };
  }
  // 午间 12:00-14:00
  if (hour >= 12 && hour < 14) {
    return { name: '午间休息', emoji: '🌞', isActive: false };
  }
  // 下午窗口 14:00-17:00
  if (hour >= 14 && hour < 17) {
    return { name: '下午窗口', emoji: '🌤️', isActive: true };
  }
  // 傍晚窗口 17:00-20:00
  if (hour >= 17 && hour < 20) {
    return { name: '傍晚窗口', emoji: '🌆', isActive: true };
  }
  // 夜间 20:00-22:00
  if (hour >= 20 && hour < 22) {
    return { name: '夜间', emoji: '🌙', isActive: false };
  }
  // 深夜
  return { name: '深夜', emoji: '🌙', isActive: false };
}

/**
 * 阿拉伯数字转中文
 */
export function numberToChinese(num: number): string {
  const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  return chineseNumbers[num] || num.toString();
}
