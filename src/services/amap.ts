/**
 * 地图服务 - 高德地图
 * 使用官方直接加载方式，确保移动端兼容性
 */

declare global {
  interface Window {
    AMap: any;
    AMapUI: any;
    _AMapSecurityConfig: any;
  }
}

let amapInstance: any = null;
let mapInstance: any = null;
let loadPromise: Promise<any> | null = null;

/**
 * 动态加载高德地图 SDK
 */
function loadAMapScript(): Promise<any> {
  return new Promise((resolve, reject) => {
    // 如果已加载，直接返回
    if (window.AMap) {
      console.log('[AMap] 已存在，直接使用');
      amapInstance = window.AMap;
      resolve(window.AMap);
      return;
    }

    // 设置安全配置（v2.0需要）
    window._AMapSecurityConfig = {
      securityJsCode: '',
    };

    // 动态创建 script 标签
    const script = document.createElement('script');
    // 使用 1.4.15 稳定版本
    script.src = 'https://webapi.amap.com/maps?v=1.4.15&key=840bef19b8611f8b7054ddbba4bc6d32&plugin=AMap.Scale,AMap.ToolBar,AMap.Geolocation,AMap.Geocoder';
    script.async = true;
    script.charset = 'utf-8';
    
    script.onload = () => {
      console.log('[AMap] 脚本加载成功, 版本:', window.AMap?.version);
      amapInstance = window.AMap;
      resolve(window.AMap);
    };
    
    script.onerror = (error) => {
      console.error('[AMap] 脚本加载失败:', error);
      reject(new Error('高德地图加载失败'));
    };

    document.head.appendChild(script);
  });
}

/**
 * 加载高德地图
 */
export async function loadAMap(): Promise<any> {
  if (amapInstance) return amapInstance;

  if (loadPromise) return loadPromise;
  
  loadPromise = loadAMapScript();
  return loadPromise;
}

/**
 * 初始化地图
 */
export async function initMap(container: HTMLElement, center?: [number, number]): Promise<any> {
  const defaultLng = center ? center[0] : 120.3014;
  const defaultLat = center ? center[1] : 31.5747;

  console.log('[AMap] 初始化地图，容器尺寸:', container.offsetHeight, 'x', container.offsetWidth);

  // 清理旧地图
  if (mapInstance) {
    console.log('[AMap] 清理旧地图');
    try {
      mapInstance.destroy();
    } catch (e) {
      console.warn('[AMap] 销毁旧地图失败:', e);
    }
    mapInstance = null;
  }

  // 确保容器有尺寸
  container.style.height = '100%';
  container.style.width = '100%';

  try {
    // 加载 AMap
    const AMap = await loadAMap();
    console.log('[AMap] SDK 加载成功');

    // 创建地图
    mapInstance = new AMap.Map(container, {
      zoom: 14,
      center: [defaultLng, defaultLat],
      viewMode: '2D',
      mapStyle: 'amap://styles/dark',
      showIndoorMap: false,
      resizeEnable: true,  // 窗口大小变化时自动调整
    });

    console.log('[AMap] 地图创建成功');

    // 添加控件
    mapInstance.addControl(new AMap.Scale());
    mapInstance.addControl(new AMap.ToolBar({
      position: 'RT',
      liteStyle: true,
    }));

    // 地图加载完成
    mapInstance.on('complete', () => {
      console.log('[AMap] 地图加载完成');
    });

    return mapInstance;
  } catch (error) {
    console.error('[AMap] 初始化失败:', error);
    throw error;
  }
}

/**
 * 获取地图实例
 */
export function getMap(): any {
  return mapInstance;
}

/**
 * 设置地图中心
 */
export function setMapCenter(map: any, lng: number, lat: number): void {
  if (map && map.setCenter) {
    map.setCenter([lng, lat]);
    map.setZoom(14);
  }
}

/**
 * 获取用户位置
 */
export function getUserLocation(): Promise<{ lng: number; lat: number }> {
  return new Promise(async (resolve, reject) => {
    try {
      const AMap = await loadAMap();
      
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
        showButton: false,  // 隐藏默认定位按钮
        showMarker: false,
        showCircle: true,
      });

      geolocation.getCurrentPosition((status: string, result: any) => {
        if (status === 'complete' && result.info === 'SUCCESS') {
          resolve({
            lng: result.position.lng,
            lat: result.position.lat,
          });
        } else {
          reject(new Error(result?.info || '定位失败'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 逆地理编码
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const AMap = await loadAMap();
    
    // 确保 Geocoder 已加载
    await loadPlugin('AMap.Geocoder');
    
    return new Promise((resolve) => {
      const geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: 'base',
        city: '全国',
      });

      // 参数顺序是 [lng, lat] 而不是 [lat, lng]
      geocoder.getAddress([lng, lat], (status: string, result: any) => {
        console.log('[AMap] 逆地理编码结果:', status, result);
        if (status === 'complete' && result.regeocode) {
          const address = result.regeocode.addressComponent;
          const city = address.city || address.province || '未知';
          console.log('[AMap] 获取到城市:', city);
          resolve(city);
        } else {
          console.warn('[AMap] 逆地理编码失败:', result?.info);
          resolve('未知地点');
        }
      });
    });
  } catch (error) {
    console.error('[AMap] 逆地理编码失败:', error);
    return '未知地点';
  }
}

/**
 * 加载插件
 */
async function loadPlugin(pluginName: string): Promise<void> {
  const AMap = await loadAMap();
  return new Promise((resolve, reject) => {
    AMap.plugin(pluginName, () => {
      resolve();
    });
  });
}

/**
 * 地理编码
 */
export async function geocode(address: string): Promise<{ lng: number; lat: number }> {
  const AMap = await loadAMap();
  
  return new Promise((resolve, reject) => {
    const geocoder = new AMap.Geocoder({
      city: '全国',
    });

    geocoder.getLocation(address, (status: string, result: any) => {
      if (status === 'complete' && result.geocodes.length > 0) {
        const location = result.geocodes[0].location;
        resolve({
          lng: location.getLng(),
          lat: location.getLat(),
        });
      } else {
        reject(new Error('未找到地点'));
      }
    });
  });
}

/**
 * 创建标记
 */
export function createMarker(map: any, lat: number, lng: number): any {
  // 创建自定义内容
  const content = document.createElement('div');
  content.className = 'amap-marker-custom';
  content.innerHTML = `
    <div class="marker-inner">
      <span class="marker-icon">🦈</span>
    </div>
  `;
  content.style.cssText = `
    position: relative;
    width: 40px;
    height: 40px;
    cursor: pointer;
  `;

  const marker = new window.AMap.Marker({
    position: [lng, lat],
    content: content,
    offset: new window.AMap.Pixel(-20, -40),
    extData: { lat, lng },
  });

  marker.setMap(map);
  return marker;
}

/**
 * 创建圆形区域
 */
export function createCircle(map: any, lat: number, lng: number, radius: number = 1000): any {
  const circle = new window.AMap.Circle({
    center: [lng, lat],
    radius: radius,
    strokeColor: '#00d4aa',
    strokeWeight: 2,
    strokeOpacity: 0.8,
    fillColor: '#00d4aa',
    fillOpacity: 0.1,
    strokeStyle: 'dashed',
    strokeDasharray: [5, 5],
  });

  circle.setMap(map);
  return circle;
}

/**
 * 清除标记
 */
export function clearMarkers(map: any): void {
  if (map && map.clearMap) {
    map.clearMap();
  }
}
