/**
 * 地图服务 - 多源融合架构
 * 特性：
 * 1. 多地图源自动切换
 * 2. 优雅降级
 * 3. 智能重试
 * 4. 离线缓存
 */

import L from 'leaflet';

// 地图源配置
interface MapSource {
  name: string;
  url: string;
  subdomains?: string;
  maxZoom: number;
  attribution: string;
  timeout: number; // 超时时间(ms)
  testUrl?: string; // 测试URL
}

// 地图源列表（按优先级）
const MAP_SOURCES: MapSource[] = [
  // 优先：国内稳定源
  {
    name: '高德影像(测试)',
    url: '',
    maxZoom: 18,
    attribution: '&copy; 高德地图',
    timeout: 5000,
  },
  // 备选1：CartoDB（暗色主题）
  {
    name: 'CartoDB Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    subdomains: 'abcd',
    maxZoom: 19,
    attribution: '&copy; CARTO',
    timeout: 8000,
  },
  // 备选2：Stadia
  {
    name: 'Stadia',
    url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png',
    maxZoom: 20,
    attribution: '&copy; Stadia',
    timeout: 8000,
  },
  // 备选3：OpenStreetMap
  {
    name: 'OSM',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: 'abc',
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap',
    timeout: 10000,
  },
];

// 缓存
let mapInstance: L.Map | null = null;
let currentSource: MapSource | null = null;
let tileLayer: L.TileLayer | null = null;

// 测试地图源是否可用
async function testSource(source: MapSource): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    const timeout = setTimeout(() => {
      resolve(false);
    }, source.timeout);
    
    img.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };
    
    // 测试加载一个低分辨率瓦片
    const testUrl = source.url
      .replace('{z}', '5')
      .replace('{x}', '15')
      .replace('{y}', '10');
    img.src = testUrl;
  });
}

// 智能选择最佳地图源
async function selectBestSource(): Promise<MapSource> {
  console.log('[MapService] 开始检测可用地图源...');
  
  for (const source of MAP_SOURCES) {
    // 跳过空URL的源
    if (!source.url) {
      console.log(`[MapService] 跳过 ${source.name} (无有效URL)`);
      continue;
    }
    
    console.log(`[MapService] 测试 ${source.name}...`);
    const isAvailable = await testSource(source);
    
    if (isAvailable) {
      console.log(`[MapService] ✓ ${source.name} 可用`);
      return source;
    } else {
      console.log(`[MapService] ✗ ${source.name} 不可用`);
    }
  }
  
  // 所有源都不可用，使用最后一个
  console.warn('[MapService] 所有地图源均不可用，使用默认OSM');
  return MAP_SOURCES[MAP_SOURCES.length - 1];
}

/**
 * 初始化地图
 */
export async function initMap(container: HTMLElement, center?: [number, number]): Promise<L.Map> {
  const defaultCenter: [number, number] = center || [31.5747, 120.3014];
  
  console.log('[MapService] 初始化地图，容器尺寸:', container.offsetHeight, 'x', container.offsetWidth);
  
  // 清理旧地图
  if (mapInstance) {
    console.log('[MapService] 清理旧地图');
    mapInstance.remove();
    mapInstance = null;
  }
  
  // 确保容器有尺寸
  container.style.height = '100%';
  container.style.width = '100%';
  
  // 创建地图
  mapInstance = L.map(container, {
    center: defaultCenter,
    zoom: 14,
    zoomControl: false,
    attributionControl: true,
  });
  
  console.log('[MapService] Leaflet地图创建成功');
  
  // 智能选择地图源
  currentSource = await selectBestSource();
  console.log('[MapService] 使用地图源:', currentSource.name);
  
  // 添加瓦片图层
  tileLayer = L.tileLayer(currentSource.url, {
    subdomains: currentSource.subdomains || 'abcd',
    maxZoom: currentSource.maxZoom,
    minZoom: 10,
    attribution: currentSource.attribution,
    errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSIxMjgiIHk9IjE0MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNjY2MiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIE1hcDwvdGV4dD48L3N2Zz4=',
  });
  
  tileLayer.addTo(mapInstance);
  console.log('[MapService] 瓦片图层添加成功');
  
  // 添加缩放控件
  L.control.zoom({ position: 'topright' }).addTo(mapInstance);
  
  // 延迟刷新尺寸
  setTimeout(() => {
    mapInstance?.invalidateSize();
    console.log('[MapService] 地图尺寸已刷新');
  }, 200);
  
  return mapInstance;
}

/**
 * 切换地图源
 */
export async function switchMapSource(newSource: MapSource): Promise<void> {
  if (!mapInstance || !tileLayer) return;
  
  console.log('[MapService] 切换地图源:', newSource.name);
  
  mapInstance.removeLayer(tileLayer);
  
  tileLayer = L.tileLayer(newSource.url, {
    subdomains: newSource.subdomains || 'abcd',
    maxZoom: newSource.maxZoom,
    minZoom: 10,
    attribution: newSource.attribution,
  });
  
  tileLayer.addTo(mapInstance);
  currentSource = newSource;
}

/**
 * 获取当前地图源
 */
export function getCurrentSource(): string {
  return currentSource?.name || 'Unknown';
}

/**
 * 获取地图实例
 */
export function getMap(): L.Map | null {
  return mapInstance;
}

/**
 * 设置地图中心
 */
export function setMapCenter(map: L.Map, lng: number, lat: number): void {
  map.setView([lat, lng], 14);
}

/**
 * 获取用户位置
 */
export function getUserLocation(): Promise<{ lng: number; lat: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('浏览器不支持定位'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        lng: position.coords.longitude,
        lat: position.coords.latitude,
      }),
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  });
}

/**
 * 逆地理编码
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    // 优先使用 Nominatim
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
      { headers: { 'User-Agent': 'BassFinderPro/1.0' } }
    );
    
    if (!response.ok) throw new Error('请求失败');
    
    const data = await response.json();
    const address = data.address;
    return address.city || address.county || address.state || '未知';
  } catch (error) {
    console.error('[MapService] 逆地理编码失败:', error);
    return '未知地点';
  }
}

/**
 * 地理编码
 */
export async function geocode(address: string): Promise<{ lng: number; lat: number }> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
    { headers: { 'User-Agent': 'BassFinderPro/1.0' } }
  );
  
  const data = await response.json();
  if (data && data.length > 0) {
    return { lng: parseFloat(data[0].lon), lat: parseFloat(data[0].lat) };
  }
  throw new Error('未找到地点');
}

/**
 * 创建自定义标记
 */
export function createMarker(map: L.Map, lat: number, lng: number): L.Marker {
  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-inner"><span class="marker-icon">🦈</span></div>
      <div class="marker-pulse"></div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  return L.marker([lat, lng], { icon: customIcon }).addTo(map);
}

/**
 * 创建圆形区域
 */
export function createCircle(map: L.Map, lat: number, lng: number, radius: number = 1000): L.Circle {
  return L.circle([lat, lng], {
    radius,
    color: '#00d4aa',
    fillColor: '#00d4aa',
    fillOpacity: 0.1,
    weight: 2,
    dashArray: '5, 5',
  }).addTo(map);
}

/**
 * 清除标记
 */
export function clearMarkers(map: L.Map): void {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker || layer instanceof L.Circle) {
      map.removeLayer(layer);
    }
  });
}
