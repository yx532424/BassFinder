/**
 * 最佳钓鱼时间推荐服务
 * 基于时间、天气、月相等数据推荐最佳钓鱼时机
 */

import { getHistory } from './history';
import { getMoonPhase } from './tideMoon';

interface TimeSlot {
  hour: number;
  score: number;      // 0-100 推荐分数
  level: string;      // '极佳'|'良好'|'一般'|'较差'
  reason: string;     // 推荐原因
}

// 获取一天中每个小时的钓鱼评分
export const getHourlyRecommendations = (): TimeSlot[] => {
  const history = getHistory();
  const moon = getMoonPhase();
  
  // 基于经验的路亚最佳时间
  const baseScores: Record<number, number> = {
    5: 70,   // 清晨 - 较好
    6: 85,   // 清晨 - 最佳
    7: 90,   // 早晨 - 黄金时间
    8: 80,   // 早晨 - 较好
    9: 60,   // 上午 - 一般
    10: 45,  // 上午 - 较差
    11: 35,  // 中午 - 较差
    12: 30,  // 中午 - 差
    13: 35,  // 下午 - 较差
    14: 45,  // 下午 - 一般
    15: 55,  // 下午 - 一般
    16: 65,  // 傍晚 - 较好
    17: 80,  // 傍晚 - 黄金时间
    18: 85,  // 傍晚 - 最佳
    19: 75,  // 傍晚 - 较好
    20: 60,  // 晚上 - 一般
    21: 45,  // 晚上 - 较差
    22: 30,  // 晚上 - 差
    23: 25,  // 深夜 - 差
    0: 25,   // 深夜 - 差
    1: 20,   // 深夜 - 差
    2: 20,   // 深夜 - 差
    3: 25,   // 深夜 - 差
    4: 40,   // 凌晨 - 较差
  };
  
  // 月相影响
  let moonBonus = 0;
  if (moon.name === '满月') moonBonus = 10;
  else if (moon.name === '新月') moonBonus = 5;
  else if (moon.name.includes('弦月')) moonBonus = 8;
  
  // 生成每小时推荐
  const now = new Date();
  const currentHour = now.getHours();
  
  return Array.from({ length: 24 }, (_, hour) => {
    let score = baseScores[hour] || 50;
    score += moonBonus;
    score = Math.min(100, score);
    
    let level: string;
    let reason: string;
    
    if (score >= 80) {
      level = '极佳';
      if (hour >= 5 && hour <= 8) {
        reason = '清晨鱼类活跃，窗口期';
      } else if (hour >= 17 && hour <= 19) {
        reason = '傍晚黄昏时段，鱼类觅食活跃';
      } else {
        reason = '综合条件极佳';
      }
    } else if (score >= 60) {
      level = '良好';
      if (hour >= 4 && hour <= 6) {
        reason = '凌晨气温适宜';
      } else if (hour >= 15 && hour <= 18) {
        reason = '傍晚水温下降，鱼类活跃';
      } else if (hour >= 20 && hour <= 22) {
        reason = '夜间气温凉爽';
      } else {
        reason = '条件适宜';
      }
    } else if (score >= 40) {
      level = '一般';
      reason = '可尝试，非最佳时段';
    } else {
      level = '较差';
      if (hour >= 11 && hour <= 14) {
        reason = '午间气温高，鱼类活性低';
      } else if (hour >= 21 || hour <= 3) {
        reason = '夜间鱼类休息中';
      } else {
        reason = '条件不佳';
      }
    }
    
    return { hour, score, level, reason };
  });
};

// 获取今日最佳时段
export const getBestTimesToday = (): { time: string; score: number }[] => {
  const hourly = getHourlyRecommendations();
  
  // 找出最佳时段
  const sorted = [...hourly].sort((a, b) => b.score - a.score);
  
  // 返回前3个最佳时段
  return sorted.slice(0, 3).map(t => ({
    time: `${t.hour}:00 - ${t.hour + 1}:00`,
    score: t.score
  }));
};

// 获取现在是否在最佳时段
export const isBestTimeNow = (): { isBest: boolean; nextBest: string; waitMinutes: number } => {
  const hourly = getHourlyRecommendations();
  const now = new Date();
  const currentHour = now.getHours();
  
  const currentScore = hourly[currentHour]?.score || 50;
  
  if (currentScore >= 80) {
    return { isBest: true, nextBest: '', waitMinutes: 0 };
  }
  
  // 找下一个最佳时段
  for (let i = 1; i <= 24; i++) {
    const checkHour = (currentHour + i) % 24;
    if (hourly[checkHour].score >= 80) {
      const waitMinutes = i * 60 - now.getMinutes();
      return { 
        isBest: false, 
        nextBest: `${checkHour}:00`, 
        waitMinutes 
      };
    }
  }
  
  return { isBest: false, nextBest: '明天早6点', waitMinutes: 0 };
};
