import React, { useRef, useCallback, useState } from 'react';
import { WeatherData, FishAnalysis } from '@/stores/appStore';
import './SharePoster.scss';

interface SharePosterProps {
  weather: WeatherData | null;
  analysis: FishAnalysis | null;
  locationName: string;
  waterTemp?: number;
}

const SharePoster: React.FC<SharePosterProps> = ({
  weather,
  analysis,
  locationName,
  waterTemp,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // 绘制海报
  const generatePoster = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsGenerating(true);

    // 设置画布大小 (竖版海报 9:16)
    const width = 540;
    const height = 960;
    canvas.width = width;
    canvas.height = height;

    // 背景渐变
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0a1628');
    gradient.addColorStop(0.5, '#142238');
    gradient.addColorStop(1, '#0d1c2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 装饰性圆形
    ctx.globalAlpha = 0.1;
    ctx.beginPath();
    ctx.arc(100, 200, 150, 0, Math.PI * 2);
    ctx.fillStyle = '#00d4aa';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(450, 700, 200, 0, Math.PI * 2);
    ctx.fillStyle = '#00a8ff';
    ctx.fill();
    ctx.globalAlpha = 1;

    // 顶部 Logo 区域
    ctx.fillStyle = '#00d4aa';
    ctx.font = 'bold 36px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🦈 BassFinder', width / 2, 80);

    // 副标题
    ctx.fillStyle = '#8b9caa';
    ctx.font = '16px Outfit, sans-serif';
    ctx.fillText('今日钓鱼指数分享', width / 2, 115);

    // 分割线
    ctx.strokeStyle = 'rgba(0, 212, 170, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 140);
    ctx.lineTo(width - 40, 140);
    ctx.stroke();

    // 钓鱼分数圆环
    const score = analysis?.totalScore || 0;
    const centerX = width / 2;
    const centerY = 280;
    const radius = 100;

    // 外圈背景
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 12;
    ctx.stroke();

    // 分数进度圈
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (score / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    
    // 根据分数颜色
    let scoreColor = '#ff6b6b';
    if (score >= 60) scoreColor = '#ffd93d';
    if (score >= 80) scoreColor = '#00d4aa';
    
    ctx.strokeStyle = scoreColor;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // 分数文字
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(score.toString(), centerX, centerY + 20);

    // 等级
    ctx.fillStyle = scoreColor;
    ctx.font = '24px Outfit, sans-serif';
    ctx.fillText(analysis?.level || '未知', centerX, centerY + 55);

    // 等级 emoji
    ctx.font = '28px sans-serif';
    ctx.fillText(analysis?.levelEmoji || '🐟', centerX - 60, centerY + 25);

    // 位置信息卡片
    drawCard(ctx, 40, 420, width - 80, 80, () => {
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px Outfit, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('📍 位置', 60, 455);
      
      ctx.fillStyle = '#8b9caa';
      ctx.font = '16px Outfit, sans-serif';
      ctx.fillText(locationName || '未知地点', 60, 480);
    });

    // 天气信息
    const weatherY = 530;
    const cardWidth = (width - 100) / 2;
    
    // 气温卡片
    drawCard(ctx, 40, weatherY, cardWidth, 100, () => {
      ctx.fillStyle = '#00a8ff';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌡️', width / 4, weatherY + 35);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px Outfit, sans-serif';
      ctx.fillText(`${weather?.temperature || '--'}°C`, width / 4, weatherY + 65);
      
      ctx.fillStyle = '#8b9caa';
      ctx.font = '14px Outfit, sans-serif';
      ctx.fillText('气温', width / 4, weatherY + 85);
    });

    // 水温卡片
    drawCard(ctx, 50 + cardWidth, weatherY, cardWidth, 100, () => {
      ctx.fillStyle = '#00d4aa';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💧', width * 3 / 4, weatherY + 35);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px Outfit, sans-serif';
      ctx.fillText(`${waterTemp !== undefined ? waterTemp : '--'}°C`, width * 3 / 4, weatherY + 65);
      
      ctx.fillStyle = '#8b9caa';
      ctx.font = '14px Outfit, sans-serif';
      ctx.fillText('水温', width * 3 / 4, weatherY + 85);
    });

    // 气压卡片
    const pressureY = 660;
    drawCard(ctx, 40, pressureY, cardWidth, 100, () => {
      ctx.fillStyle = '#a855f7';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌊', width / 4, pressureY + 35);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Outfit, sans-serif';
      ctx.fillText(`${weather?.pressure || '--'}`, width / 4, pressureY + 65);
      
      ctx.fillStyle = '#8b9caa';
      ctx.font = '14px Outfit, sans-serif';
      ctx.fillText('气压 hPa', width / 4, pressureY + 85);
    });

    // 风力卡片
    drawCard(ctx, 50 + cardWidth, pressureY, cardWidth, 100, () => {
      ctx.fillStyle = '#f59e0b';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💨', width * 3 / 4, pressureY + 35);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Outfit, sans-serif';
      ctx.fillText(`${weather?.windSpeed || '--'}`, width * 3 / 4, pressureY + 65);
      
      ctx.fillStyle = '#8b9caa';
      ctx.font = '14px Outfit, sans-serif';
      ctx.fillText('风速 km/h', width * 3 / 4, pressureY + 85);
    });

    // 底部信息
    ctx.fillStyle = '#8b9caa';
    ctx.font = '14px Outfit, sans-serif';
    ctx.textAlign = 'center';
    
    const now = new Date();
    const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    ctx.fillText(dateStr, width / 2, height - 50);
    
    ctx.fillText('由 BassFinder 生成', width / 2, height - 28);

    // 生成图片
    const dataUrl = canvas.toDataURL('image/png', 0.9);
    setGeneratedImage(dataUrl);
    setIsGenerating(false);
  }, [weather, analysis, locationName, waterTemp]);

  // 绘制卡片辅助函数
  const drawCard = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    content: () => void
  ) => {
    // 卡片背景
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 12);
    ctx.fill();
    
    // 卡片边框
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    content();
  };

  // 下载海报
  const downloadPoster = useCallback(() => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.download = `bass-finder-${Date.now()}.png`;
    link.href = generatedImage;
    link.click();
  }, [generatedImage]);

  return (
    <div className="share-poster">
      <button className="share-btn" onClick={generatePoster} disabled={isGenerating}>
        {isGenerating ? '生成中...' : '📤 分享海报'}
      </button>
      
      {generatedImage && (
        <div className="poster-preview">
          <img src={generatedImage} alt="分享海报" />
          <button className="download-btn" onClick={downloadPoster}>
            ⬇️ 下载图片
          </button>
        </div>
      )}
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default SharePoster;
