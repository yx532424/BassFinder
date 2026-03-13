/**
 * 高德地图类型定义
 */

declare global {
  interface Window {
    AMap: typeof AMap;
    _AMapSecurityConfig: {
      securityJsCode: string;
    };
  }
}

declare namespace AMap {
  // 地图类
  class Map {
    constructor(container: string | HTMLElement, opts?: MapOptions);
    setCenter(lnglat: LngLat | [number, number], animate?: boolean): void;
    getCenter(): LngLat;
    setZoom(zoom: number, animate?: boolean): void;
    getZoom(): number;
    addControl(control: any): void;
    addLayer(layer: any): void;
    removeControl(control: any): void;
    clearMap(): void;
    destroy(): void;
    on(event: string, handler: any): void;
    off(event: string, handler: any): void;
  }

  interface MapOptions {
    version?: number;
    zoom?: number;
    center?: LngLat | [number, number];
    mapStyle?: string;
    showIndoorMap?: boolean;
    showBuildingBlock?: boolean;
    pitchEnable?: boolean;
    rotateEnable?: boolean;
    dragEnable?: boolean;
    zoomEnable?: boolean;
    doubleClickZoom?: boolean;
    touchZoomCenter?: number;
  }

  // 经纬度类
  class LngLat {
    constructor(lng: number, lat: number);
    getLng(): number;
    getLat(): number;
  }

  // 标记类
  class Marker {
    constructor(opts?: MarkerOptions);
    setPosition(position: LngLat | [number, number]): void;
    getPosition(): LngLat;
    setMap(map: Map): void;
    setContent(content: string | HTMLElement): void;
    setTitle(title: string): void;
    setIcon(icon: string | Icon): void;
    setOffset(offset: Pixel): void;
    on(event: string, handler: any): void;
  }

  interface MarkerOptions {
    position?: LngLat | [number, number];
    map?: Map;
    content?: string | HTMLElement;
    title?: string;
    icon?: string | Icon;
    offset?: Pixel;
    draggable?: boolean;
    clickable?: boolean;
  }

  // 图标类
  class Icon {
    constructor(opts: IconOptions);
  }

  interface IconOptions {
    size?: Size;
    image?: string;
    imageSize?: Size;
    imageOffset?: Pixel;
  }

  // 像素类
  class Pixel {
    constructor(x: number, y: number);
    getX(): number;
    getY(): number;
  }

  // 尺寸类
  class Size {
    constructor(width: number, height: number);
  }

  // 圆类
  class Circle {
    constructor(opts: CircleOptions);
    setCenter(center: LngLat | [number, number]): void;
    setMap(map: Map): void;
    setRadius(radius: number): void;
    getRadius(): number;
  }

  interface CircleOptions {
    center: LngLat | [number, number];
    radius: number;
    fillColor?: string;
    fillOpacity?: number;
    strokeColor?: string;
    strokeWeight?: number;
    strokeOpacity?: number;
    strokeStyle?: string;
    strokeDashArray?: number[];
  }

  // 信息窗口类
  class InfoWindow {
    constructor(opts?: InfoWindowOptions);
    open(map: Map, position: LngLat | [number, number]): void;
    close(): void;
    setContent(content: string | HTMLElement): void;
    setPosition(position: LngLat | [number, number]): void;
  }

  interface InfoWindowOptions {
    isCustom?: boolean;
    autoMove?: boolean;
    closeWhenClickMap?: boolean;
    content?: string | HTMLElement;
    offset?: Pixel;
    showShadow?: boolean;
    position?: LngLat | [number, number];
  }

  // 地理编码类
  class Geocoder {
    constructor(opts?: GeocoderOptions);
    getLocation(address: string, callback: (status: string, result: any) => void): void;
    getAddress(lnglat: LngLat | [number, number], callback: (status: string, result: any) => void): void;
  }

  interface GeocoderOptions {
    city?: string;
    radius?: number;
  }

  // 地点搜索类
  class PlaceSearch {
    constructor(opts?: PlaceSearchOptions);
    search(keyword: string, callback: (status: string, result: any) => void): void;
    setCity(city: string): void;
    setCityLimit(limit: boolean): void;
    setPageSize(size: number): void;
    setPageIndex(index: number): void;
    setType(type: string): void;
    setAutoFitView(autoFitView: boolean): void;
  }

  interface PlaceSearchOptions {
    city?: string;
    citylimit?: boolean;
    pageSize?: number;
    pageIndex?: number;
    type?: string;
    autoFitView?: boolean;
  }

  // 比例尺插件
  class Scale {
    constructor(opts?: ScaleOptions);
  }

  interface ScaleOptions {
    position?: string;
    offset?: Pixel;
  }

  // 工具条插件
  class ToolBar {
    constructor(opts?: ToolBarOptions);
  }

  interface ToolBarOptions {
    position?: string;
    liteStyle?: boolean;
    direction?: boolean;
    locate?: boolean;
    autoPosition?: boolean;
  }

  // 定位插件
  class Geolocation {
    constructor(opts?: GeolocationOptions);
    getCurrentPosition(callback: (status: string, result: any) => void): void;
    watchPosition(callback: (status: string, result: any) => void): void;
    clearWatch(watchId: number): void;
  }

  interface GeolocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
    convert?: boolean;
    showButton?: boolean;
    buttonPosition?: string;
    buttonOffset?: Pixel;
    showMarker?: boolean;
    showCircle?: boolean;
    panToLocation?: boolean;
    zoomToAccuracy?: boolean;
  }
}

export {};
