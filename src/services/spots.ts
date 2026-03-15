/**
 * 钓点标注服务
 * 管理和保存用户自定义钓点
 */

const SPOTS_KEY = 'bass_finder_spots';

export interface FishSpot {
  id: string;
  name: string;
  lng: number;
  lat: number;
  type: 'lake' | 'river' | 'pond' | 'reservoir' | 'sea' | 'other';
  description?: string;
  rating: number; // 1-5
  bestTime?: string; // 最佳钓鱼时间
  fishTypes?: string[]; // 鱼种
  createdAt: number;
  visitedCount: number;
}

// 获取所有钓点
export const getSpots = (): FishSpot[] => {
  try {
    const data = localStorage.getItem(SPOTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

// 添加钓点
export const addSpot = (spot: Omit<FishSpot, 'id' | 'createdAt' | 'visitedCount'>): FishSpot => {
  const spots = getSpots();
  const newSpot: FishSpot = {
    ...spot,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    createdAt: Date.now(),
    visitedCount: 0
  };
  spots.push(newSpot);
  localStorage.setItem(SPOTS_KEY, JSON.stringify(spots));
  return newSpot;
};

// 更新钓点
export const updateSpot = (id: string, updates: Partial<FishSpot>): void => {
  const spots = getSpots();
  const index = spots.findIndex(s => s.id === id);
  if (index !== -1) {
    spots[index] = { ...spots[index], ...updates };
    localStorage.setItem(SPOTS_KEY, JSON.stringify(spots));
  }
};

// 删除钓点
export const deleteSpot = (id: string): void => {
  const spots = getSpots().filter(s => s.id !== id);
  localStorage.setItem(SPOTS_KEY, JSON.stringify(spots));
};

// 记录访问
export const markVisited = (id: string): void => {
  const spots = getSpots();
  const spot = spots.find(s => s.id === id);
  if (spot) {
    spot.visitedCount++;
    localStorage.setItem(SPOTS_KEY, JSON.stringify(spots));
  }
};

// 获取附近的钓点
export const getNearbySpots = (lng: number, lat: number, radiusKm: number = 10): FishSpot[] => {
  const spots = getSpots();
  return spots.filter(spot => {
    const distance = getDistance(lng, lat, spot.lng, spot.lat);
    return distance <= radiusKm;
  });
};

// 计算两点间距离（公里）
const getDistance = (lng1: number, lat1: number, lng2: number, lat2: number): number => {
  const R = 6371; // 地球半径（公里）
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const toRad = (deg: number): number => {
  return deg * Math.PI / 180;
};
