/**
 * 数据导出服务
 * 导出用户的钓鱼数据
 */

import { getCatches } from './catches';
import { getSpots } from './spots';
import { getHistory } from './history';

// 导出所有数据
export const exportAllData = (): string => {
  const data = {
    exportTime: new Date().toISOString(),
    app: 'BassFinder Pro',
    version: '1.0.0',
    catches: getCatches(),
    spots: getSpots(),
    history: getHistory(),
  };
  
  return JSON.stringify(data, null, 2);
};

// 导出为可读格式
export const exportAsText = (): string => {
  const catches = getCatches();
  const spots = getSpots();
  const history = getHistory();
  
  let text = '🎣 BassFinder Pro 数据导出\n';
  text += `导出时间: ${new Date().toLocaleString('zh-CN')}\n\n`;
  
  // 钓获统计
  text += '=== 钓获记录 ===\n';
  if (catches.length === 0) {
    text += '暂无记录\n';
  } else {
    const totalWeight = catches.reduce((sum, c) => sum + (c.weight || 0), 0);
    text += `总记录: ${catches.length}条\n`;
    text += `总重量: ${totalWeight}斤\n\n`;
    catches.forEach((c, i) => {
      const date = new Date(c.timestamp);
      text += `${i + 1}. ${c.fishType} - ${c.weight || '-'}斤 - ${c.location} (${date.toLocaleDateString()})\n`;
    });
  }
  
  text += '\n=== 钓点 ===\n';
  if (spots.length === 0) {
    text += '暂无记录\n';
  } else {
    spots.forEach((s, i) => {
      text += `${i + 1}. ${s.name} - 评分${s.rating}星 - 访问${s.visitedCount}次\n`;
    });
  }
  
  text += '\n=== 查询历史 ===\n';
  if (history.length === 0) {
    text += '暂无记录\n';
  } else {
    history.slice(0, 10).forEach((h, i) => {
      text += `${i + 1}. ${h.name} - 评分${h.score}分\n`;
    });
  }
  
  return text;
};

// 下载数据文件
export const downloadData = (format: 'json' | 'txt' = 'json'): void => {
  let content: string;
  let filename: string;
  let mimeType: string;
  
  if (format === 'json') {
    content = exportAllData();
    filename = `bassfinder_backup_${Date.now()}.json`;
    mimeType = 'application/json';
  } else {
    content = exportAsText();
    filename = `bassfinder_export_${Date.now()}.txt`;
    mimeType = 'text/plain';
  }
  
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 分享到社交媒体
export const shareToSocial = async (): Promise<void> => {
  const catches = getCatches();
  const totalWeight = catches.reduce((sum, c) => sum + (c.weight || 0), 0);
  
  const shareText = `🎣 BassFinder Pro 钓鱼记录\n
📊 钓获: ${catches.length}条
⚖️ 总重量: ${totalWeight}斤
🏆 累计查询: ${getHistory().length}次

#BassFinder #钓鱼日记`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'BassFinder Pro',
        text: shareText,
      });
    } catch (e) {
      // 用户取消分享
    }
  } else {
    // 复制到剪贴板
    navigator.clipboard.writeText(shareText);
    alert('已复制到剪贴板');
  }
};
