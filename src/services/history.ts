/**
 * 历史记录服务
 * 记录和分析用户的钓鱼查询历史
 */

const HISTORY_KEY = 'bass_finder_history';
const MAX_HISTORY = 50;

interface HistoryItem {
  id: string;
  lng: number;
  lat: number;
  name: string;
  score: number;
  level: string;
  timestamp: number;
  weather?: {
    temperature: number;
    waterTemp: number;
    windSpeed: number;
    pressure: number;
    weather: string;
  };
}

// 添加历史记录
export const addHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>): void => {
  try {
    const history = getHistory();
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    
    // 检查是否已存在相同位置（1km内）
    const existsIndex = history.findIndex(h => 
      Math.abs(h.lng - item.lng) < 0.01 && 
      Math.abs(h.lat - item.lat) < 0.01
    );
    
    if (existsIndex !== -1) {
      // 更新已有记录
      history[existsIndex] = newItem;
    } else {
      // 添加新记录到开头
      history.unshift(newItem);
    }
    
    // 限制数量
    while (history.length > MAX_HISTORY) {
      history.pop();
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('保存历史记录失败:', e);
  }
};

// 获取历史记录
export const getHistory = (): HistoryItem[] => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

// 清除历史记录
export const clearHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};

// 删除单条历史
export const deleteHistoryItem = (id: string): void => {
  try {
    const history = getHistory();
    const filtered = history.filter(h => h.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('删除历史记录失败:', e);
  }
};

// 获取统计数据
export const getStats = (): {
  totalVisits: number;
  avgScore: number;
  topLocations: Array<{ name: string; count: number; avgScore: number }>;
  bestScore: number;
  lastVisit: number;
} => {
  const history = getHistory();
  
  if (history.length === 0) {
    return {
      totalVisits: 0,
      avgScore: 0,
      topLocations: [],
      bestScore: 0,
      lastVisit: 0,
    };
  }
  
  const totalVisits = history.length;
  const avgScore = Math.round(history.reduce((sum, h) => sum + h.score, 0) / totalVisits);
  const bestScore = Math.max(...history.map(h => h.score));
  const lastVisit = history[0]?.timestamp || 0;
  
  // 统计各地点
  const locationMap = new Map<string, { count: number; totalScore: number }>();
  history.forEach(h => {
    const key = h.name || '未知地点';
    const existing = locationMap.get(key) || { count: 0, totalScore: 0 };
    locationMap.set(key, {
      count: existing.count + 1,
      totalScore: existing.totalScore + h.score,
    });
  });
  
  const topLocations = Array.from(locationMap.entries())
    .map(([name, data]) => ({
      name,
      count: data.count,
      avgScore: Math.round(data.totalScore / data.count),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  return { totalVisits, avgScore, topLocations, bestScore, lastVisit };
};
