/**
 * 数据缓存服务
 * 使用 localStorage 缓存鱼情数据，支持离线查看
 */

const CACHE_KEY = 'bass_finder_cache';
const CACHE_EXPIRY = 1000 * 60 * 30; // 30分钟过期

interface CacheData {
  locationKey: string;
  data: any;
  timestamp: number;
}

interface CacheStore {
  [key: string]: CacheData;
}

// 生成位置key
const getLocationKey = (lng: number, lat: number): string => {
  // 精度到小数点后3位（约100米范围）
  const precision = 1000;
  const keyLng = Math.round(lng * precision) / precision;
  const keyLat = Math.round(lat * precision) / precision;
  return `${keyLng},${keyLat}`;
};

// 获取缓存
export const getCache = (lng: number, lat: number): any | null => {
  try {
    const store = localStorage.getItem(CACHE_KEY);
    if (!store) return null;
    
    const cacheStore: CacheStore = JSON.parse(store);
    const key = getLocationKey(lng, lat);
    const cached = cacheStore[key];
    
    if (!cached) return null;
    
    // 检查是否过期
    if (Date.now() - cached.timestamp > CACHE_EXPIRY) {
      // 删除过期缓存
      delete cacheStore[key];
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheStore));
      return null;
    }
    
    return cached.data;
  } catch (e) {
    console.warn('读取缓存失败:', e);
    return null;
  }
};

// 设置缓存
export const setCache = (lng: number, lat: number, data: any): void => {
  try {
    const store = localStorage.getItem(CACHE_KEY);
    const cacheStore: CacheStore = store ? JSON.parse(store) : {};
    const key = getLocationKey(lng, lat);
    
    cacheStore[key] = {
      locationKey: key,
      data,
      timestamp: Date.now()
    };
    
    // 限制缓存数量（最多50个位置）
    const keys = Object.keys(cacheStore);
    if (keys.length > 50) {
      // 删除最老的缓存
      const oldestKey = keys.reduce((a, b) => 
        cacheStore[a].timestamp < cacheStore[b].timestamp ? a : b
      );
      delete cacheStore[oldestKey];
    }
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheStore));
  } catch (e) {
    console.warn('设置缓存失败:', e);
  }
};

// 获取缓存列表
export const getCacheList = (): Array<{ key: string; timestamp: number; data: any }> => {
  try {
    const store = localStorage.getItem(CACHE_KEY);
    if (!store) return [];
    
    const cacheStore: CacheStore = JSON.parse(store);
    return Object.values(cacheStore)
      .map(c => ({ key: c.locationKey, timestamp: c.timestamp, data: c.data }))
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch (e) {
    return [];
  }
};

// 清除所有缓存
export const clearCache = (): void => {
  localStorage.removeItem(CACHE_KEY);
};

// 清除单个缓存
export const removeCache = (lng: number, lat: number): void => {
  try {
    const store = localStorage.getItem(CACHE_KEY);
    if (!store) return;
    
    const cacheStore: CacheStore = JSON.parse(store);
    const key = getLocationKey(lng, lat);
    delete cacheStore[key];
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheStore));
  } catch (e) {
    console.warn('删除缓存失败:', e);
  }
};
