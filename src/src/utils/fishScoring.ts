/**
 * 鱼情评分算法
 * 基于多项指标计算路亚鱼情综合得分
 */

import { WeatherData, FishAnalysis, FactorItem, Lure, Spot } from '@/stores/appStore';
import { getMoonPhase, getTideType } from './moonPhase';
import { formatWindDir, getTimePeriod } from './format';

/**
 * 鱼情评分主函数
 */
export function calculateFishScore(weather: WeatherData): FishAnalysis {
  // 计算各项因子得分
  const tempScore = calculateTempScore(weather.temperature);
  const pressureScore = calculatePressureScore(weather.pressure);
  const windScore = calculateWindScore(weather.windSpeed);
  const windDirScore = calculateWindDirScore(weather.windDir);
  const humidityScore = calculateHumidityScore(weather.humidity);
  const moonScore = calculateMoonScore();
  const timeScore = calculateTimeScore();

  // 计算综合得分 (加权平均)
  const weights = {
    temp: 0.20,
    pressure: 0.15,
    wind: 0.15,
    windDir: 0.10,
    humidity: 0.10,
    moon: 0.15,
    time: 0.15,
  };

  const totalScore = Math.round(
    tempScore * weights.temp +
    pressureScore * weights.pressure +
    windScore * weights.wind +
    windDirScore * weights.windDir +
    humidityScore * weights.humidity +
    moonScore * weights.moon +
    timeScore * weights.time
  );

  // 获取各项数据
  const moonPhase = getMoonPhase();
  const tide = getTideType();
  const timePeriod = getTimePeriod();
  const windDirName = formatWindDir(weather.windDir);

  // 构建因子列表
  const factors: FactorItem[] = [
    {
      name: '水温',
      nameEmoji: '🌡️',
      value: `${Math.round(weather.temperature)}°C`,
      desc: tempScore >= 70 ? '适宜' : tempScore >= 40 ? '一般' : '停口',
      status: tempScore >= 70 ? 'good' : tempScore >= 40 ? 'warning' : 'bad',
      score: tempScore,
    },
    {
      name: '气压',
      nameEmoji: '📊',
      value: `${Math.round(weather.pressure)}hPa`,
      desc: pressureScore >= 70 ? '活跃' : pressureScore >= 40 ? '一般' : '低活性',
      status: pressureScore >= 70 ? 'good' : pressureScore >= 40 ? 'warning' : 'bad',
      score: pressureScore,
    },
    {
      name: '月相',
      nameEmoji: '🌙',
      value: moonPhase.phase,
      desc: tide.desc,
      status: moonScore >= 70 ? 'good' : moonScore >= 40 ? 'warning' : 'bad',
      score: moonScore,
    },
    {
      name: '风向',
      nameEmoji: '🧭',
      value: windDirName,
      desc: windDirScore >= 70 ? '活饵风向' : windDirScore >= 40 ? '尚可' : '不佳',
      status: windDirScore >= 70 ? 'good' : windDirScore >= 40 ? 'warning' : 'bad',
      score: windDirScore,
    },
    {
      name: '风力',
      nameEmoji: '💨',
      value: `${weather.windSpeed.toFixed(1)}km/h`,
      desc: windScore >= 70 ? '完美风力' : windScore >= 40 ? '尚可' : '风大/风小',
      status: windScore >= 70 ? 'good' : windScore >= 40 ? 'warning' : 'bad',
      score: windScore,
    },
    {
      name: '时段',
      nameEmoji: '⏰',
      value: timePeriod.name,
      desc: timePeriod.isActive ? '窗口期' : '非窗口',
      status: timeScore >= 70 ? 'good' : timeScore >= 40 ? 'warning' : 'bad',
      score: timeScore,
    },
  ];

  // 生成推荐
  const lures = generateLureRecommendations(weather, totalScore);
  const spots = generateSpotRecommendations(weather, totalScore);

  // 确定等级
  const { level, levelEmoji, desc } = getLevelInfo(totalScore);

  return {
    totalScore,
    level,
    levelEmoji,
    desc,
    factors,
    lures,
    spots,
  };
}

/**
 * 计算水温得分
 * 路亚最佳水温: 15-25°C
 */
function calculateTempScore(temp: number): number {
  if (temp >= 15 && temp <= 25) {
    return 100;
  } else if (temp >= 10 && temp < 15) {
    return 70 + (temp - 10) * 6; // 70-100
  } else if (temp > 25 && temp <= 30) {
    return 100 - (temp - 25) * 10; // 50-100
  } else if (temp >= 5 && temp < 10) {
    return 40 + (temp - 5) * 6; // 40-70
  } else if (temp > 30 && temp <= 35) {
    return 30;
  } else {
    return 10; // 极端温度
  }
}

/**
 * 计算气压得分
 * 最佳气压: 1000-1020 hPa (标准大气压附近)
 */
function calculatePressureScore(pressure: number): number {
  if (pressure >= 1000 && pressure <= 1020) {
    return 100;
  } else if (pressure >= 990 && pressure < 1000) {
    return 70 + (pressure - 990) * 3; // 70-100
  } else if (pressure > 1020 && pressure <= 1030) {
    return 100 - (pressure - 1020) * 3; // 70-100
  } else if (pressure >= 980 && pressure < 990) {
    return 50 + (pressure - 980) * 2; // 50-70
  } else if (pressure > 1030 && pressure <= 1040) {
    return 50 - (pressure - 1030) * 2;
  } else {
    return 30; // 极端气压
  }
}

/**
 * 计算风力得分
 * 最佳风力: 6-15 km/h
 */
function calculateWindScore(windSpeed: number): number {
  if (windSpeed >= 6 && windSpeed <= 15) {
    return 100;
  } else if (windSpeed >= 3 && windSpeed < 6) {
    return 60 + (windSpeed - 3) * 13; // 60-100
  } else if (windSpeed > 15 && windSpeed <= 20) {
    return 100 - (windSpeed - 15) * 5; // 75-100
  } else if (windSpeed >= 1 && windSpeed < 3) {
    return 40 + (windSpeed - 1) * 10; // 30-60
  } else if (windSpeed > 20 && windSpeed <= 25) {
    return 40 - (windSpeed - 20) * 5; // 15-40
  } else {
    return 10; // 无法作钓
  }
}

/**
 * 计算风向得分
 * 南/东南/东风为"活饵风向"
 */
function calculateWindDirScore(windDir: number): number {
  const dirNames = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
  const index = Math.round(windDir / 45) % 8;
  const dirName = dirNames[index];

  if (dirName === '南' || dirName === '东南' || dirName === '东') {
    return 100; // 活饵风向
  } else if (dirName === '西南' || dirName === '东北') {
    return 70; // 尚可
  } else {
    return 45; // 不佳
  }
}

/**
 * 计算湿度得分
 * 最佳湿度: 50-80%
 */
function calculateHumidityScore(humidity: number): number {
  if (humidity >= 50 && humidity <= 80) {
    return 100;
  } else if (humidity >= 40 && humidity < 50) {
    return 70 + (humidity - 40) * 3; // 70-100
  } else if (humidity > 80 && humidity <= 90) {
    return 100 - (humidity - 80) * 3; // 70-100
  } else if (humidity >= 30 && humidity < 40) {
    return 50 + (humidity - 30) * 2; // 50-70
  } else if (humidity > 90 && humidity <= 100) {
    return 50 - (humidity - 90) * 4;
  } else {
    return 30;
  }
}

/**
 * 计算月相得分
 */
function calculateMoonScore(): number {
  const { phase } = getMoonPhase();
  
  if (phase === '满月' || phase === '新月') {
    return 100; // 大潮日
  } else if (phase === '上弦月' || phase === '下弦月') {
    return 75; // 中潮日
  } else {
    return 50; // 小潮日
  }
}

/**
 * 计算时段得分
 */
function calculateTimeScore(): number {
  const { isActive } = getTimePeriod();
  return isActive ? 100 : 40;
}

/**
 * 获取等级信息
 */
function getLevelInfo(score: number): {
  level: string;
  levelEmoji: string;
  desc: string;
} {
  if (score >= 90) {
    return {
      level: '爆护级',
      levelEmoji: '🦈',
      desc: '路亚黄金期！立即出钓！',
    };
  } else if (score >= 70) {
    return {
      level: '良好',
      levelEmoji: '🎣',
      desc: '条件不错，装备出发',
    };
  } else if (score >= 50) {
    return {
      level: '一般',
      levelEmoji: '🐟',
      desc: '可尝试但降低预期',
    };
  } else if (score >= 30) {
    return {
      level: '较差',
      levelEmoji: '⚠️',
      desc: '建议整理装备或换时段',
    };
  } else {
    return {
      level: '停钓',
      levelEmoji: '❌',
      desc: '条件不佳，改日再来',
    };
  }
}

/**
 * 生成拟饵推荐
 */
function generateLureRecommendations(weather: WeatherData, score: number): Lure[] {
  const lures: Lure[] = [];
  const temp = weather.temperature;
  const windSpeed = weather.windSpeed;

  // 基于水温推荐
  if (temp < 10) {
    lures.push(
      { name: '深潜型VIB', type: 'VIB', desc: '搜索深水' },
      { name: '缓沉铅笔', type: 'Pencil', desc: '慢速搜索' }
    );
  } else if (temp >= 10 && temp <= 20) {
    lures.push(
      { name: '米诺', type: 'Minnow', desc: '全能型' },
      { name: '卷尾蛆', type: 'Grub', desc: '基础饵' }
    );
  } else {
    lures.push(
      { name: '铅笔', type: 'Pencil', desc: '水面系' },
      { name: '波爬', type: 'Popper', desc: '激活性' }
    );
  }

  // 基于风力补充
  if (windSpeed > 15) {
    lures.push({ name: '重型VIB', type: 'VIB', desc: '抗风深潜' });
  }

  // 限制最多3个
  return lures.slice(0, 3);
}

/**
 * 生成标点推荐
 */
function generateSpotRecommendations(weather: WeatherData, score: number): Spot[] {
  const spots: Spot[] = [];
  const windDir = weather.windDir;
  const windSpeed = weather.windSpeed;

  // 迎风浅滩
  if (windSpeed >= 6) {
    spots.push({
      name: '迎风浅滩',
      reason: '食物聚集，鱼类活跃',
    });
  }

  // 下风深水
  spots.push({
    name: '下风深水',
    reason: '溶氧充足',
  });

  // 深浅交界
  spots.push({
    name: '深浅交界',
    reason: '窗口通道，藏鱼结构',
  });

  // 障碍物附近
  if (windDir > 0) {
    spots.push({
      name: '迎风障碍',
      reason: '避风处+食物堆积',
    });
  }

  return spots.slice(0, 3);
}

export default calculateFishScore;
