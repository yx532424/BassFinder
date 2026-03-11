import React, { useRef, useState, useEffect } from 'react';
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

// 手势状态枚举
type GestureState = 'idle' | 'dragging' | 'snapping';

const FishScoreCard: React.FC<FishScoreCardProps> = ({ 
  analysis, 
  weather,
  onRefresh 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [cardHeight, setCardHeight] = useState<number>(30);
  const [gestureState, setGestureState] = useState<GestureState>('idle');
  const [showHint, setShowHint] = useState(true);
  
  const startYRef = useRef<number>(0);
  const startHeightRef = useRef<number>(20);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 隐藏提示的定时器
  useEffect(() => {
    hintTimeoutRef.current = setTimeout(() => {
      setShowHint(false);
    }, 3000);
    return () => {
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    };
  }, []);

  if (!analysis) return null;

  // 拖拽开始
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    startYRef.current = clientY;
    startHeightRef.current = cardHeight;
    setGestureState('dragging');
    setShowHint(false);
  };

  // 拖拽移动 - 实时调整高度
  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (gestureState !== 'dragging') return;
    
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const deltaY = startYRef.current - clientY;
    const screenHeight = window.innerHeight;
    const deltaPercent = (deltaY / screenHeight) * 100;
    
    // 向上滑动展开，向下滑动收起
    const newHeight = Math.min(85, Math.max(18, startHeightRef.current + deltaPercent));
    setCardHeight(newHeight);
    setIsCollapsed(newHeight <= 28);
  };

  // 拖拽结束 - 根据滑动方向自动吸附
  const handleTouchEnd = () => {
    setGestureState('snapping');
    
    const currentHeight = cardHeight;
    let targetHeight: number;
    let shouldCollapse: boolean;
    
    if (currentHeight >= 35 || currentHeight <= 30) {
      targetHeight = 65;
      shouldCollapse = false;
    } else {
      targetHeight = 20;
      shouldCollapse = true;
    }
    
    setCardHeight(targetHeight);
    setIsCollapsed(shouldCollapse);
    
    setTimeout(() => {
      setGestureState('idle');
    }, 400);
  };

  // 阻止事件穿透
  const handlePreventScroll = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={`fish-score-card ${isCollapsed ? 'collapsed' : ''} ${gestureState}`}
      style={{ height: `${cardHeight}vh` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchMoveCapture={handlePreventScroll}
    >
      {/* 顶部渐变遮罩 */}
      <div className="fish-score-card__gradient-mask" />
      
      {/* 拖拽手柄区域 */}
      <div className="fish-score-card__handle-area">
        {/* 提示文案 - 根据状态显示不同提示 */}
        <div className={`fish-score-card__hint ${showHint ? 'visible' : ''}`}>
          <span className="hint-icon">{isCollapsed ? '👆' : '👇'}</span>
          <span className="hint-text">{isCollapsed ? '上滑展开' : '下滑收起'}</span>
        </div>
        
        {/* 拖拽手柄 */}
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
      
      {/* 内容区域 */}
      <div className="fish-score-card__content">
        {/* 背景纹理 */}
        <div className="fish-score-card__texture" />
        
        {/* 顶部装饰线 */}
        <div className="fish-score-card__accent-line" />
        
        <div className="fish-score-card__inner">
          {/* 标题区 */}
          <div className="fish-score-card__header">
            <div className="header-icon">🎣</div>
            <h2 className="card-title">路亚鱼情分析</h2>
            <div className="header-badge">
              <span className="badge-dot"></span>
              <span className="badge-text">实时</span>
            </div>
          </div>

          {/* 得分圆环 */}
          <ScoreRing 
            score={analysis.totalScore}
            level={analysis.level}
            emoji={analysis.levelEmoji}
            desc={analysis.desc}
          />

          {/* 指标网格 */}
          <div className="fish-score-card__metrics">
            {analysis.factors.map((factor, index) => (
              <MetricItem 
                key={index} 
                factor={factor}
              />
            ))}
          </div>

          {/* 拟饵推荐 */}
          <LureRecommend lures={analysis.lures} />

          {/* 标点推荐 */}
          <SpotRecommend spots={analysis.spots} />

          {/* 底部信息 */}
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
