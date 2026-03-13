/**
 * 月相计算工具
 * 基于农历计算月相
 */

/**
 * 获取指定日期的月相
 */
export function getMoonPhase(date: Date = new Date()): {
  phase: string;
  emoji: string;
  description: string;
} {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 计算月龄
  const moonAge = getMoonAge(year, month, day);

  // 根据月龄判断月相
  let phase: string;
  let emoji: string;
  let description: string;

  if (moonAge <= 1 || moonAge >= 29) {
    phase = '新月';
    emoji = '🌑';
    description: '大潮日，鱼类活跃';
  } else if (moonAge >= 2 && moonAge <= 6) {
    phase = '峨眉月';
    emoji = '🌒';
    description: '潮汐逐渐上涨';
  } else if (moonAge >= 7 && moonAge <= 9) {
    phase = '上弦月';
    emoji = '🌓';
    description: '中潮日';
  } else if (moonAge >= 10 && moonAge <= 13) {
    phase = '盈凸月';
    emoji = '🌔';
    description: '潮汐较大';
  } else if (moonAge >= 14 && moonAge <= 16) {
    phase = '满月';
    emoji = '🌕';
    description: '大潮日-爆钓';
  } else if (moonAge >= 17 && moonAge <= 20) {
    phase = '亏凸月';
    emoji = '🌖';
    description: '潮汐开始回落';
  } else if (moonAge >= 21 && moonAge <= 23) {
    phase = '下弦月';
    emoji = '🌗';
    description: '中潮日';
  } else {
    phase = '残月';
    emoji = '🌘';
    description: '小潮日';
  }

  return { phase, emoji, description };
}

/**
 * 计算月龄
 * @param year 年
 * @param month 月
 * @param day 日
 */
function getMoonAge(year: number, month: number, day: number): number {
  // 基准日期：2000年1月6日是新月
  const baseDate = new Date(2000, 0, 6);
  const currentDate = new Date(year, month - 1, day);
  
  // 计算相差天数
  const diffTime = currentDate.getTime() - baseDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // 月球周期约29.53天
  const lunarCycle = 29.53;
  
  // 计算月龄
  let moonAge = diffDays % lunarCycle;
  if (moonAge < 0) moonAge += lunarCycle;
  
  return moonAge;
}

/**
 * 获取潮汐类型
 */
export function getTideType(date: Date = new Date()): {
  type: '大潮' | '中潮' | '小潮';
  desc: string;
} {
  const { phase } = getMoonPhase(date);
  
  if (phase === '新月' || phase === '满月') {
    return { type: '大潮', desc: '潮汐变化大，鱼类活跃' };
  } else if (phase === '上弦月' || phase === '下弦月') {
    return { type: '中潮', desc: '中等潮汐' };
  } else {
    return { type: '小潮', desc: '潮汐变化小' };
  }
}

export default getMoonPhase;
