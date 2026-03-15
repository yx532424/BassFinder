/**
 * 潮汐月相服务
 * 计算潮汐和月相数据，对钓鱼有重要参考价值
 */

// 月相计算
export interface MoonPhase {
  name: string;       // 月相名称
  emoji: string;     // 月相图标
  value: number;     // 0-1 表示月相进度
  illumination: number; // 亮度百分比
  fishingEffect: string; // 对钓鱼的影响
}

// 计算月相
export const getMoonPhase = (date: Date = new Date()): MoonPhase => {
  // 获取新月时间（2000年1月6日 18:14 UTC）
  const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0);
  const lunarCycle = 29.53058867 * 24 * 60 * 60 * 1000; // 月球周期（毫秒）
  
  const daysSinceNewMoon = (date.getTime() - knownNewMoon) / lunarCycle;
  const normalized = daysSinceNewMoon % 1;
  const value = normalized;
  
  // 计算亮度
  const illumination = Math.round((1 - Math.cos(2 * Math.PI * normalized)) / 2 * 100);
  
  let name: string;
  let emoji: string;
  let fishingEffect: string;
  
  if (normalized < 0.0625) {
    name = '新月';
    emoji = '🌑';
    fishingEffect = '鱼类活性较低，建议深水钓法';
  } else if (normalized < 0.1875) {
    name = '峨眉月';
    emoji = '🌒';
    fishingEffect = '鱼开始活跃，可尝试作钓';
  } else if (normalized < 0.3125) {
    name = '上弦月';
    emoji = '🌓';
    fishingEffect = '钓鱼好时机，鱼类活跃';
  } else if (normal

< 0.4375) {
    name = '盈凸月';
    emoji = '🌔';
    fishingEffect = '鱼情较好，适合出钓';
  } else if (normalized < 0.5625) {
    name = '满月';
    emoji = '🌕';
    fishingEffect = '鱼类极度活跃，钓鱼黄金期';
  } else if (normalized < 0.6875) {
    name = '亏凸月';
    emoji = '🌖';
    fishingEffect = '鱼情不错，值得出钓';
  } else if (normalized < 0.8125) {
    name = '下弦月';
    emoji = '🌗';
    fishingEffect = '鱼类活动减少';
  } else {
    name = '残月';
    emoji = '🌘';
    fishingEffect = '建议休息，等待下次月相';
  }
  
  return { name, emoji, value, illumination, fishingEffect };
};

// 潮汐计算（简化版）
export interface TideData {
  current: '涨潮' | '退潮' | '平潮';
  level: number; // 0-100 潮位
  next: string;
  nextTime: Date;
  fishingEffect: string;
}

// 计算当前潮汐（基于经验公式）
export const getTideData = (date: Date = new Date()): TideData => {
  // 假设高潮在 00:00 和 12:00（可调整）
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  
  // 潮汐周期约12小时
  const tideCycle = 12 * 60; // 720分钟
  const phase = (totalMinutes % tideCycle) / tideCycle;
  
  // 计算潮位 (0-100)
  const level = Math.round(Math.sin(phase * Math.PI) * 100);
  
  let current: '涨潮' | '退潮' | '平潮';
  let fishingEffect: string;
  
  if (level > 70) {
    current = '平潮';
    fishingEffect = '高潮时鱼类在浅水觅食';
  } else if (level < 30) {
    current = '平潮';
    fishingEffect = '低潮时鱼类在深水';
  } else if (phase < 0.5) {
    current = '涨潮';
    fishingEffect = '涨潮时鱼类靠近岸边';
  } else {
    current = '退潮';
    fishingEffect = '退潮时鱼类在深水区';
  }
  
  // 计算下次变化时间
  const nextChangeMinutes = phase < 0.5 ? tideCycle / 2 - (totalMinutes % (tideCycle / 2)) : tideCycle - (totalMinutes % tideCycle);
  const nextTime = new Date(date.getTime() + nextChangeMinutes * 60 * 1000);
  
  // 格式化下次时间
  const next = `${nextTime.getHours().toString().padStart(2, '0')}:${nextTime.getMinutes().toString().padStart(2, '0')}`;
  
  return {
    current,
    level,
    next,
    nextTime,
    fishingEffect
  };
};

// 获取综合垂钓建议
export const getFishingAdvice = (moon: MoonPhase, tide: TideData): string => {
  const effects = [moon.fishingEffect, tide.fishingEffect];
  
  // 满月和新月是钓鱼最佳时机
  if (moon.name === '满月' || moon.name === '新月') {
    return '🌟 黄金钓鱼期！今晚月相极佳，配合潮汐变化，鱼类非常活跃！';
  }
  
  // 上下弦月也不错
  if (moon.name.includes('弦月')) {
    return '⭐ 良好钓鱼时机！月相配合潮汐，适合出钓。';
  }
  
  return effects.join('，') + '。';
};
