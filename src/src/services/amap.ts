/**
 * 地图服务 - 高德地图
 * 使用 AMapLoader 2.0 方式加载
 * 参考: https://lbs.amap.com/api/javascript-api-v2/getting-started
 */

// 全局 AMap 加载器
declare global {
  interface Window {
    AMap: any;
    AMapUI: any;
    AMapLoader: any;
  }
}

let amapInstance: any = null;
let mapInstance: any = null;
let loadPromise: Promise<any> | null = null;

// 高德地图安全密钥
const SECURITY_CODE = '82c94bbbfb6b4570506ba31e114fae3a';

/**
 * 加载高德地图 SDK - 使用 AMapLoader.load()
 */
function loadAMapScript(): Promise<any> {
  return new Promise((resolve, reject) => {
    // 如果已加载，直接返回
    if (window.AMap) {
      console.log('[AMap] 已存在，直接使用');
      resolve(window.AMap);
      return;
    }

    // 加载 AMap Loader
    const loaderScript = document.createElement('script');
    loaderScript.src = 'https://webapi.amap.com/loader.js';
    loaderScript.async = true;
    
    loaderScript.onload = () => {
      console.log('[AMap] Loader 加载成功');
      
      // 使用 AMapLoader.load() 加载地图
      AMapLoader.load({
        key: 'f97668d4b30212bd22a1a31c4663d7f3', // 应用Key
        version: '2.0', // JS API 版本
        plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.Geolocation', 'AMap.Geocoder'], // 插件列表
        securityJsCode: SECURITY_CODE, // 安全密钥
      })
        .then((AMap: any) => {
          console.log('[AMap] SDK 加载成功');
          amapInstance = AMap;
          resolve(AMap);
        })
        .catch((error: Error) => {
          console.error('[AMap] 加载失败:', error);
          reject(error);
        });
    };
    
    loaderScript.onerror = (error) => {
      console.error('[AMap] Loader 加载失败:', error);
      reject(new Error('高德地图加载器失败'));
    };

    document.head.appendChild(loaderScript);
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
    mapInstance.destroy();
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
    });

    console.log('[AMap] 地图创建成功');

    // 等待主题加载完成（最多等待 3 秒）
    let themeLoaded = false;
    const themePromise = new Promise<void>((resolve) => {
      mapInstance.on('mapStyleLoad', () => {
        console.log('[AMap] 主题加载完成');
        themeLoaded = true;
        resolve();
      });
    });
    
    // 同时设置超时
    const timeoutPromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        if (!themeLoaded) {
          console.warn('[AMap] 主题加载超时，尝试重新设置主题');
          // 尝试重新设置主题
          mapInstance.setMapStyle('amap://styles/dark');
        }
        resolve();
      }, 3000);
    });
    
    await Promise.race([themePromise, timeoutPromise]);

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
    
    return new Promise((resolve) => {
      const geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: 'base',
      });

      geocoder.getAddress([lng, lat], (status: string, result: any) => {
        if (status === 'complete' && result.regeocode) {
          const address = result.regeocode.addressComponent;
          const city = address.city || address.province || '未知';
          resolve(city);
        } else {
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
