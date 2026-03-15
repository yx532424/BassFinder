/**
 * 触感反馈服务
 * 移动端触感反馈，提升交互体验
 */

// 检查是否支持振动API
const isSupported = (): boolean => {
  return 'vibrate' in navigator || 'hapticFeedback' in navigator;
};

// 轻触反馈
export const lightImpact = (): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate(10);
  } else if ('hapticFeedback' in navigator) {
    (navigator as any).hapticFeedback.lightImpact();
  }
};

// 中等触感反馈
export const mediumImpact = (): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate(20);
  } else if ('hapticFeedback' in navigator) {
    (navigator as any).hapticFeedback.mediumImpact();
  }
};

// 重触感反馈
export const heavyImpact = (): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate(30);
  } else if ('hapticFeedback' in navigator) {
    (navigator as any).hapticFeedback.heavyImpact();
  }
};

// 成功反馈
export const successFeedback = (): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate([50, 50, 50]);
  }
};

// 错误反馈
export const errorFeedback = (): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate([100, 50, 100]);
  }
};

// 选择反馈
export const selectionFeedback = (): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate(5);
  } else if ('hapticFeedback' in navigator) {
    (navigator as any).hapticFeedback.selection();
  }
};

// 通知反馈
export const notificationFeedback = (): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate([50, 100, 50]);
  }
};

export default {
  lightImpact,
  mediumImpact,
  heavyImpact,
  successFeedback,
  errorFeedback,
  selectionFeedback,
  notificationFeedback,
  isSupported
};
