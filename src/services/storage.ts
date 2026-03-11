/**
 * 本地存储服务 - 收藏钓点、缓存数据
 */

const STORAGE_KEYS = {
  FAVORITE_SPOTS: 'bass_finder_favorites',
  CATCH_LOGS: 'bass_finder_catches',
  LAST_LOCATION: 'bass_finder_last_location',
  CACHED_WEATHER: 'bass_finder_weather_cache',
};

// 钓点类型
export interface FavoriteSpot {
  id: string;
  name: string;
  lng: number;
  lat: number;
  notes?: string;
  rating?: number;
  createdAt: string;
  fishScore?: number;
}

// 钓获记录
export interface CatchRecord {
  id: string;
  spotId?: string;
  spotName: string;
  lng: number;
  lat: number;
  species?: string;
  length?: number;
  weight?: number;
  lure?: string;
  photo?: string; // base64
  notes?: string;
  createdAt: string;
}

/**
 * 获取所有收藏钓点
 */
export function getFavoriteSpots(): FavoriteSpot[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITE_SPOTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * 添加收藏钓点
 */
export function addFavoriteSpot(spot: Omit<FavoriteSpot, 'id' | 'createdAt'>): FavoriteSpot {
  const spots = getFavoriteSpots();
  
  // 检查是否已存在
  const exists = spots.some(s => 
    Math.abs(s.lng - spot.lng) < 0.001 && 
    Math.abs(s.lat - spot.lat) < 0.001
  );
  
  if (exists) {
    throw new Error('该钓点已收藏');
  }
  
  const newSpot: FavoriteSpot = {
    ...spot,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  spots.push(newSpot);
  localStorage.setItem(STORAGE_KEYS.FAVORITE_SPOTS, JSON.stringify(spots));
  
  return newSpot;
}

/**
 * 移除收藏钓点
 */
export function removeFavoriteSpot(id: string): void {
  const spots = getFavoriteSpots();
  const filtered = spots.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.FAVORITE_SPOTS, JSON.stringify(filtered));
}

/**
 * 检查位置是否已收藏
 */
export function isSpotFavorited(lng: number, lat: number): boolean {
  const spots = getFavoriteSpots();
  return spots.some(s => 
    Math.abs(s.lng - lng) < 0.001 && 
    Math.abs(s.lat - lat) < 0.001
  );
}

/**
 * 获取钓获记录
 */
export function getCatchRecords(): CatchRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CATCH_LOGS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * 添加钓获记录
 */
export function addCatchRecord(record: Omit<CatchRecord, 'id' | 'createdAt'>): CatchRecord {
  const records = getCatchRecords();
  
  const newRecord: CatchRecord = {
    ...record,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  records.unshift(newRecord); // 添加到开头
  localStorage.setItem(STORAGE_KEYS.CATCH_LOGS, JSON.stringify(records));
  
  return newRecord;
}

/**
 * 删除钓获记录
 */
export function deleteCatchRecord(id: string): void {
  const records = getCatchRecords();
  const filtered = records.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.CATCH_LOGS, JSON.stringify(filtered));
}

/**
 * 缓存天气数据
 */
export function cacheWeatherData(key: string, data: any): void {
  try {
    const cache = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${STORAGE_KEYS.CACHED_WEATHER}_${key}`, JSON.stringify(cache));
  } catch {
    // 忽略存储错误
  }
}

/**
 * 获取缓存的天气数据
 */
export function getCachedWeatherData(key: string, maxAge: number = 30 * 60 * 1000): any | null {
  try {
    const cacheStr = localStorage.getItem(`${STORAGE_KEYS.CACHED_WEATHER}_${key}`);
    if (!cacheStr) return null;
    
    const cache = JSON.parse(cacheStr);
    if (Date.now() - cache.timestamp > maxAge) {
      return null; // 过期
    }
    
    return cache.data;
  } catch {
    return null;
  }
}

/**
 * 保存最后位置
 */
export function saveLastLocation(lng: number, lat: number, name?: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_LOCATION, JSON.stringify({ lng, lat, name }));
  } catch {
    // 忽略
  }
}

/**
 * 获取最后位置
 */
export function getLastLocation(): { lng: number; lat: number; name?: string } | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LAST_LOCATION);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}
