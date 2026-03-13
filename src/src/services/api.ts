/**
 * API 服务 - 对接后端
 */

const API_BASE = '/api';

// Token 存储
const TOKEN_KEY = 'bass_finder_token';
const USER_KEY = 'bass_finder_user';

// 用户类型
export interface User {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  phone: string;
  score: number;
  total_check_in: number;
}

// 签到响应
export interface SignInResponse {
  streak: number;
  score_earned: number;
  bonus_score: number;
  total_score: number;
  check_in_date: string;
}

// 签到统计
export interface SignInStats {
  current_streak: number;
  total_days: number;
  total_score: number;
  recent_check_ins: Array<{
    id: number;
    check_in_date: string;
    score_earned: number;
    bonus_score: number;
  }>;
}

// 收藏钓点
export interface FavoriteSpot {
  id: number;
  spot_name: string;
  lng: number;
  lat: number;
  note: string;
  created_at: string;
}

// API 响应类型
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 获取 Token
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * 保存 Token
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * 删除 Token
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * 获取保存的用户信息
 */
export function getStoredUser(): User | null {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * 保存用户信息
 */
export function storeUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * 删除用户信息
 */
export function removeUser(): void {
  localStorage.removeItem(USER_KEY);
}

/**
 * 检查是否已登录
 */
export function isLoggedIn(): boolean {
  return !!getToken();
}

// ============================================
// API 请求
// ============================================

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }

  const result: ApiResponse<T> = await response.json();

  if (result.code !== 200) {
    throw new Error(result.message || '请求失败');
  }

  return result.data;
}

// ============================================
// 用户 API
// ============================================

/**
 * 用户注册
 */
export async function register(
  username: string,
  password: string,
  nickname: string
): Promise<{ token: string; user: User }> {
  const data = await request<{ token: string; user: User }>('/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, nickname }),
  });

  setToken(data.token);
  storeUser(data.user);
  return data;
}

/**
 * 用户登录
 */
export async function login(
  username: string,
  password: string
): Promise<{ token: string; user: User }> {
  const data = await request<{ token: string; user: User }>('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  setToken(data.token);
  storeUser(data.user);
  return data;
}

/**
 * 退出登录
 */
export function logout(): void {
  removeToken();
  removeUser();
}

/**
 * 获取用户信息
 */
export async function getUserInfo(): Promise<User> {
  return request<User>('/user', {
    method: 'GET',
  });
}

/**
 * 更新用户信息
 */
export async function updateUserInfo(
  updates: Partial<Pick<User, 'nickname' | 'avatar' | 'phone'>>
): Promise<User> {
  return request<User>('/user', {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

/**
 * 同步用户数据（从后端获取并更新本地存储）
 */
export async function syncUserData(): Promise<User | null> {
  if (!isLoggedIn()) return null;

  try {
    const user = await getUserInfo();
    storeUser(user);
    return user;
  } catch (error) {
    console.error('同步用户数据失败:', error);
    return getStoredUser();
  }
}

// ============================================
// 签到 API
// ============================================

/**
 * 签到
 */
export async function doSignIn(): Promise<SignInResponse> {
  return request<SignInResponse>('/checkin', {
    method: 'POST',
  });
}

/**
 * 获取签到统计
 */
export async function getSignInStats(): Promise<SignInStats> {
  return request<SignInStats>('/checkin/stats', {
    method: 'GET',
  });
}

// ============================================
// 收藏 API
// ============================================

/**
 * 获取收藏列表
 */
export async function getFavorites(): Promise<FavoriteSpot[]> {
  return request<FavoriteSpot[]>('/favorites', {
    method: 'GET',
  });
}

/**
 * 添加收藏
 */
export async function addFavorite(
  spotName: string,
  lng: number,
  lat: number,
  note?: string
): Promise<FavoriteSpot> {
  return request<FavoriteSpot>('/favorites', {
    method: 'POST',
    body: JSON.stringify({ spot_name: spotName, lng, lat, note }),
  });
}

/**
 * 删除收藏
 */
export async function deleteFavorite(id: number): Promise<void> {
  await request<void>(`/favorites/${id}`, {
    method: 'DELETE',
  });
}
