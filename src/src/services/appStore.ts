import { create } from 'zustand';

export interface Location {
  lng: number;
  lat: number;
  name?: string;
  address?: string;
}

export interface WeatherData {
  temperature: number;      // 温度
  humidity: number;         // 湿度
  windSpeed: number;        // 风速 (km/h)
  windDir: number;         // 风向 (度)
  pressure: number;        // 气压 (hPa)
  weather: string;         // 天气状况
  updateTime: string;      // 更新时间
}

export interface FishAnalysis {
  totalScore: number;      // 综合得分 0-100
  level: string;           // 等级描述
  levelEmoji: string;      // 等级 emoji
  desc: string;           // 描述
  factors: FactorItem[];
  lures: Lure[];
  spots: Spot[];
  locationName?: string;   // 地点名称
}

export interface FactorItem {
  name: string;
  nameEmoji: string;
  value: string;
  desc: string;
  status: 'good' | 'warning' | 'bad';
  score: number;
}

export interface Lure {
  name: string;
  type: string;
  desc: string;
}

export interface Spot {
  name: string;
  reason: string;
}

interface AppState {
  // 当前位置
  currentLocation: Location | null;
  setCurrentLocation: (location: Location | null) => void;

  // 选中的位置
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;

  // 天气数据
  weatherData: WeatherData | null;
  setWeatherData: (data: WeatherData | null) => void;

  // 鱼情分析
  fishAnalysis: FishAnalysis | null;
  setFishAnalysis: (analysis: FishAnalysis | null) => void;

  // 加载状态
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // 错误信息
  error: string | null;
  setError: (error: string | null) => void;

  // 地图实例
  map: AMap.Map | null;
  setMap: (map: AMap.Map | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // 当前位置
  currentLocation: null,
  setCurrentLocation: (location) => set({ currentLocation: location }),

  // 选中的位置
  selectedLocation: null,
  setSelectedLocation: (location) => set({ selectedLocation: location }),

  // 天气数据
  weatherData: null,
  setWeatherData: (data) => set({ weatherData: data }),

  // 鱼情分析
  fishAnalysis: null,
  setFishAnalysis: (analysis) => set({ fishAnalysis: analysis }),

  // 加载状态
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // 错误信息
  error: null,
  setError: (error) => set({ error }),

  // 地图实例
  map: null,
  setMap: (map) => set({ map }),
}));
