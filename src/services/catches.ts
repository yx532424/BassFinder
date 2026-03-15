/**
 * 钓获记录服务
 * 记录用户的钓获，包括鱼种、重量、照片等
 */

const CATCHES_KEY = 'bass_finder_catches';

export interface CatchRecord {
  id: string;
  fishType: string;
  weight?: number; // 斤
  length?: number; // cm
  location: string;
  lng: number;
  lat: number;
  photo?: string; // base64 或 URL
  description?: string;
  rating: number; // 1-5
  timestamp: number;
  weather?: string;
  waterTemp?: number;
}

// 鱼种列表
export const FISH_TYPES = [
  { value: 'bass', label: '黑鲈', emoji: '🐟' },
  { value: 'crappie', label: '鲑鱼', emoji: '🐠' },
  { value: 'catfish', label: '鲶鱼', emoji: '🐡' },
  { value: 'carp', label: '鲤鱼', emoji: '🐠' },
  { value: 'grassCarp', label: '草鱼', emoji: '🐟' },
  { value: 'perch', label: '鲈鱼', emoji: '🐟' },
  { value: 'walleye', label: '梭鲈', emoji: '🐠' },
  { value: 'trout', label: '鳟鱼', emoji: '🐟' },
  { value: 'other', label: '其他', emoji: '🎣' },
];

// 获取所有钓获记录
export const getCatches = (): CatchRecord[] => {
  try {
    const data = localStorage.getItem(CATCHES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

// 添加钓获记录
export const addCatch = (record: Omit<CatchRecord, 'id' | 'timestamp'>): CatchRecord => {
  const catches = getCatches();
  const newRecord: CatchRecord = {
    ...record,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
  };
  catches.unshift(newRecord);
  localStorage.setItem(CATCHES_KEY, JSON.stringify(catches));
  return newRecord;
};

// 删除钓获记录
export const deleteCatch = (id: string): void => {
  const catches = getCatches().filter(c => c.id !== id);
  localStorage.setItem(CATCHES_KEY, JSON.stringify(catches));
};

// 获取统计数据
export const getCatchStats = (): {
  total: number;
  totalWeight: number;
  topFish: string;
  bestCatch: CatchRecord | null;
} => {
  const catches = getCatches();
  
  if (catches.length === 0) {
    return { total: 0, totalWeight: 0, topFish: '-', bestCatch: null };
  }
  
  const totalWeight = catches.reduce((sum, c) => sum + (c.weight || 0), 0);
  
  // 统计鱼种
  const fishCount: Record<string, number> = {};
  catches.forEach(c => {
    fishCount[c.fishType] = (fishCount[c.fishType] || 0) + 1;
  });
  const topFish = Object.entries(fishCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
  
  // 最大的钓获
  const bestCatch = catches.reduce((best, c) => 
    (!best || (c.weight || 0) > (best.weight || 0)) ? c : best
  , catches[0]);
  
  return { total: catches.length, totalWeight, topFish, bestCatch };
};
