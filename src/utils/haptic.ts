/**
 * 触觉反馈工具
 * 为移动端提供震动反馈
 */

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

/**
 * 触发触觉反馈
 * 仅在支持的设备上生效
 */
export function triggerHaptic(type: HapticType = 'light'): void {
  // 检查是否在支持振动的环境中
  if (typeof navigator === 'undefined' || !navigator.vibrate) {
    return;
  }

  // 振动模式 (ms)
  const patterns: Record<HapticType, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 40,
    success: [0, 10, 50, 10],
    warning: [0, 20, 50, 20],
    error: [0, 50, 100, 50],
  };

  try {
    navigator.vibrate(patterns[type]);
  } catch (e) {
    console.warn('[Haptic] 振动失败:', e);
  }
}

/**
 * 触觉反馈Hook
 */
export function useHaptic() {
  return {
    light: () => triggerHaptic('light'),
    medium: () => triggerHaptic('medium'),
    heavy: () => triggerHaptic('heavy'),
    success: () => triggerHaptic('success'),
    warning: () => triggerHaptic('warning'),
    error: () => triggerHaptic('error'),
  };
}

export default triggerHaptic;
