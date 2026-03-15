/**
 * 海报生成服务
 * 生成钓鱼鱼情分享海报
 */

import { FishAnalysis, WeatherData } from '@/stores/appStore';

interface PosterData {
  locationName: string;
  totalScore: number;
  level: string;
  desc: string;
  temperature: number;
  waterTemp: number;
  windSpeed: number;
  weather: string;
  factors: Array<{ name: string; value: string }>;
  timestamp: string;
}

// 生成海报数据
export const generatePosterData = (analysis: FishAnalysis, weather: WeatherData): PosterData => {
  return {
    locationName: analysis.locationName || '未知钓点',
    totalScore: analysis.totalScore,
    level: analysis.level,
    desc: analysis.desc,
    temperature: weather.temperature,
    waterTemp: weather.waterTemp || 0,
    windSpeed: weather.windSpeed,
    weather: weather.weather,
    factors: analysis.factors.map(f => ({ name: f.name, value: f.value })),
    timestamp: new Date().toLocaleString('zh-CN'),
  };
};

// 生成海报 HTML（供截图使用）
export const generatePosterHTML = (data: PosterData): string => {
  const levelColor = {
    '极佳': '#00d4aa',
    '优秀': '#48b878',
    '良好': '#4299e1',
    '一般': '#ed8936',
    '较差': '#f56565',
  }[data.level] || '#00d4aa';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      width: 375px; 
      min-height: 600px;
      background: linear-gradient(135deg, #0a0f14 0%, #1a2332 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: white;
      padding: 24px;
    }
    .poster {
      border-radius: 20px;
      overflow: hidden;
      background: linear-gradient(180deg, rgba(26, 32, 44, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 24px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .logo-icon { font-size: 28px; }
    .logo-text { font-size: 18px; font-weight: 600; }
    .badge {
      background: ${levelColor}22;
      border: 1px solid ${levelColor};
      color: ${levelColor};
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .score-section {
      text-align: center;
      padding: 30px 0;
    }
    .score-circle {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      background: conic-gradient(${levelColor} ${data.totalScore * 3.6}deg, rgba(255,255,255,0.1) 0deg);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      position: relative;
    }
    .score-circle::before {
      content: '';
      position: absolute;
      width: 110px;
      height: 110px;
      background: linear-gradient(180deg, rgba(26, 32, 44, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%);
      border-radius: 50%;
    }
    .score-value {
      position: relative;
      z-index: 1;
      font-size: 42px;
      font-weight: 700;
      color: ${levelColor};
    }
    .score-label {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
    }
    .desc {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.8);
      margin-top: 8px;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin: 24px 0;
    }
    .metric {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 12px;
    }
    .metric-label {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 4px;
    }
    .metric-value {
      font-size: 18px;
      font-weight: 600;
    }
    .footer {
      text-align: center;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .location {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 8px;
    }
    .timestamp {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.4);
    }
  </style>
</head>
<body>
  <div class="poster">
    <div class="header">
      <div class="logo">
        <span class="logo-icon">🦈</span>
        <span class="logo-text">BassFinder</span>
      </div>
      <div class="badge">${data.level}</div>
    </div>
    
    <div class="score-section">
      <div class="score-circle">
        <span class="score-value">${data.totalScore}</span>
      </div>
      <div class="score-label">鱼情评分</div>
      <div class="desc">${data.desc}</div>
    </div>
    
    <div class="metrics">
      ${data.factors.slice(0, 4).map(f => `
        <div class="metric">
          <div class="metric-label">${f.name}</div>
          <div class="metric-value">${f.value}</div>
        </div>
      `).join('')}
    </div>
    
    <div class="footer">
      <div class="location">📍 ${data.locationName}</div>
      <div class="timestamp">${data.timestamp}</div>
    </div>
  </div>
</body>
</html>
  `;
};
