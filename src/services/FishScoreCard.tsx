import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FishAnalysis, WeatherData } from '@/stores/appStore';
import ScoreRing from '../ScoreRing';
import MetricItem from '../MetricItem';
import LureRecommend from '../LureRecommend';
import SpotRecommend from '../SpotRecommend';
import './FishScoreCard.scss';

interface FishScoreCardProps {
  analysis: FishAnalysis;
  weather: WeatherData;
  onRefresh?: () => void;
}

// 高度配置
const MIN_HEIGHT = 18;    // 最小高度百分比
const MAX_HEIGHT = 85;     // 最大高度百分比
const COLLAPSED_HEIGHT = 30;  // 收起时的高度
const EXPANDED_HEIGHT = 65;   // 展开时的高度
const SNAP_THRESHOLD = 50;    // 吸附阈值（百分比）

const FishScoreCard: React.FC<FishScoreCardProps> = ({ 
  analysis, 
  weather,
  onRefresh 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [cardHeight, setCardHeight] = useState<number>(COLLAPSED_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);
  
  const startYRef = useRef<number>(0);
  const startHeightRef = useRef<number>(COLLAPSED_HEIGHT);
  const cardRef = useRef<HTMLDivElement>(null);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 隐藏提示
  useEffect(() => {
    hintTimeoutRef.current = setTimeout(() => setShowHint(false), 5000);
    return () => {
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    };
  }, []);

  if (!analysis) return null;

  // 计算新高度
  const calculateHeight = useCallback((currentY: number): number => {
    const deltaY = startYRef.current - currentY;
    const screenHeight = window.innerHeight;
    const deltaPercent = (deltaY / screenHeight) * 100;
    return Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, startHeightRef.current + deltaPercent));
  }, []);

  // 处理指针按下
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // 只允许在拖拽区域触发
    const target = e.target as HTMLElement;
    if (!target.closest('.fish-score-card__handle-area')) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // 设置捕获
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    
    startYRef.current = e.clientY;
    startHeightRef.current = cardHeight;
    setIsDragging(true);
    setShowHint(false);
  }, [cardHeight]);

  // 处理指针移动
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    
    const newHeight = calculateHeight(e.clientY);
    setCardHeight(newHeight);
    setIsCollapsed(newHeight <= COLLAPSED_HEIGHT);
  }, [isDragging, calculateHeight]);

  // 处理指针释放
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    
    // 释放捕获
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {}
    
    setIsDragging(false);
    
    // 自动吸附
    const currentHeight = cardHeight;
    let targetHeight: number;
    let shouldCollapse: boolean;
    
    if (currentHeight >= SNAP_THRESHOLD) {
      targetHeight = EXPANDED_HEIGHT;
      shouldCollapse = false;
    } else {
      targetHeight = COLLAPSED_HEIGHT;
      shouldCollapse = true;
    }
    
    // 使用 CSS transition 进行平滑动画
    setCardHeight(targetHeight);
    setIsCollapsed(shouldCollapse);
  }, [isDragging, cardHeight]);

  // 触摸事件处理（备用）
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.fish-score-card__handle-area')) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    startYRef.current = e.touches[0].clientY;
    startHeightRef.current = cardHeight;
    setIsDragging(true);
    setShowHint(false);
  }, [cardHeight]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    
    const newHeight = calculateHeight(e.touches[0].clientY);
    setCardHeight(newHeight);
    setIsCollapsed(newHeight <= COLLAPSED_HEIGHT);
  }, [isDragging, calculateHeight]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    setIsDragging(false);
    
    const currentHeight = cardHeight;
    let targetHeight: number;
    let shouldCollapse: boolean;
    
    if (currentHeight >= SNAP_THRESHOLD) {
      targetHeight = EXPANDED_HEIGHT;
      shouldCollapse = false;
    } else {
      targetHeight = COLLAPSED_HEIGHT;
      shouldCollapse = true;
    }
    
    setCardHeight(targetHeight);
    setIsCollapsed(shouldCollapse);
  }, [isDragging, cardHeight]);

  return (
    <div 
      ref={cardRef}
      className={`fish-score-card ${isCollapsed ? 'collapsed' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{ 
        height: `${cardHeight}vh`,
      }}
    >
      {/* 拖拽区域 */}
      <div 
        className="fish-score-card__handle-area"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 提示 */}
        <div className={`fish-score-card__hint ${showHint ? 'visible' : ''}`}>
          <span className="hint-icon">{isCollapsed ? '👆' : '👇'}</span>
          <span className="hint-text">{isCollapsed ? '上滑展开' : '下滑收起'}</span>
        </div>
        
        {/* 手柄 */}
        <div className="fish-score-card__handle">
          <div className="handle-bar">
            <div className="handle-grip">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 内容 */}
      <div className="fish-score-card__content">
        <div className="fish-score-card__texture" />
        <div className="fish-score-card__accent-line" />
        
        <div className="fish-score-card__inner">
          {/* 标题 */}
          <div className="fish-score-card__header">
            <div className="header-icon">🎣</div>
            <h2 className="card-title">路亚鱼情分析</h2>
            <div className="header-badge">
              <span className="badge-dot"></span>
              <span className="badge-text">实时</span>
            </div>
          </div>

          {/* 得分 */}
          <ScoreRing 
            score={analysis.totalScore}
            level={analysis.level}
            emoji={analysis.levelEmoji}
            desc={analysis.desc}
          />

          {/* 指标 */}
          <div className="fish-score-card__metrics">
            {analysis.factors.map((factor, index) => (
              <MetricItem key={index} factor={factor} />
            ))}
          </div>

          {/* 拟饵 */}
          <LureRecommend lures={analysis.lures} />

          {/* 标点 */}
          <SpotRecommend spots={analysis.spots} />

          {/* 底部 */}
          <div className="fish-score-card__footer">
            <div className="footer-location">
              <span className="location-icon">📍</span>
              <span className="location-text">{analysis.locationName || '未知钓点'}</span>
            </div>
            <div className="footer-time">
              <span className="time-icon">🕐</span>
              <span className="time-text">{weather.updateTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FishScoreCard;
