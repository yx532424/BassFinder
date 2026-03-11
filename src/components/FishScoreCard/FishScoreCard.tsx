import React, { useRef, useState, useEffect, useCallback } from 'react';
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

const MIN_HEIGHT = 18;  // 最小高度百分比
const MAX_HEIGHT = 85;  // 最大高度百分比
const COLLAPSED_HEIGHT = 30;  // 收起时的高度
const EXPANDED_HEIGHT = 65;  // 展开时的高度
const SNAP_THRESHOLD = 35;   // 吸附阈值

const FishScoreCard: React.FC<FishScoreCardProps> = ({ 
  analysis, 
  weather,
  onRefresh 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [cardHeight, setCardHeight] = useState<number>(COLLAPSED_HEIGHT);
  const [gestureState, setGestureState] = useState<GestureState>('idle');
  const [showHint, setShowHint] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  
  const startYRef = useRef<number>(0);
  const startHeightRef = useRef<number>(COLLAPSED_HEIGHT);
  const cardRef = useRef<HTMLDivElement>(null);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 隐藏提示的定时器
  useEffect(() => {
    hintTimeoutRef.current = setTimeout(() => {
      setShowHint(false);
    }, 4000);
    return () => {
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    };
  }, []);

  if (!analysis) return null;

  // 处理触摸开始
  const handleTouchStart = useCallback((e: React.TouchEvent | MouseEvent) => {
    // 只在拖拽手柄区域响应
    const target = e.target as HTMLElement;
    if (!target.closest('.fish-score-card__handle-area')) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    startYRef.current = clientY;
    startHeightRef.current = cardHeight;
    setIsDragging(true);
    setGestureState('dragging');
    setShowHint(false);
  }, [cardHeight]);

  // 处理触摸移动
  const handleTouchMove = useCallback((e: React.TouchEvent | MouseEvent) => {
    if (!isDragging || gestureState !== 'dragging') return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    const deltaY = startYRef.current - clientY;  // 向上滑为正，向下滑为负
    const screenHeight = window.innerHeight;
    const deltaPercent = (deltaY / screenHeight) * 100;
    
    // 向上滑动展开，向下滑动收起
    const newHeight = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, startHeightRef.current + deltaPercent));
    setCardHeight(newHeight);
    setIsCollapsed(newHeight <= COLLAPSED_HEIGHT);
  }, [isDragging, gestureState]);

  // 处理触摸结束
  const handleTouchEnd = useCallback((e: React.TouchEvent | MouseEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(false);
    setGestureState('snapping');
    
    const currentHeight = cardHeight;
    let targetHeight: number;
    let shouldCollapse: boolean;
    
    // 根据当前位置和滑动方向决定目标高度
    if (currentHeight >= SNAP_THRESHOLD) {
      targetHeight = EXPANDED_HEIGHT;
      shouldCollapse = false;
    } else {
      targetHeight = COLLAPSED_HEIGHT;
      shouldCollapse = true;
    }
    
    // 动画过渡到目标高度
    setCardHeight(targetHeight);
    setIsCollapsed(shouldCollapse);
    
    setTimeout(() => {
      setGestureState('idle');
    }, 400);
  }, [isDragging, cardHeight]);

  // 添加全局事件监听
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // 使用非被动监听器以允许 preventDefault
    const options = { passive: false };
    
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
      }
    };
    
    card.addEventListener('touchmove', onTouchMove, options);
    
    return () => {
      card.removeEventListener('touchmove', onTouchMove);
    };
  }, [isDragging]);

  // 手动绑定事件（更可靠）
  const handleAreaTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientY = e.touches[0].clientY;
    startYRef.current = clientY;
    startHeightRef.current = cardHeight;
    setIsDragging(true);
    setGestureState('dragging');
    setShowHint(false);
  };

  const handleAreaTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || gestureState !== 'dragging') return;
    
    e.preventDefault();
    
    const clientY = e.touches[0].clientY;
    const deltaY = startYRef.current - clientY;
    const screenHeight = window.innerHeight;
    const deltaPercent = (deltaY / screenHeight) * 100;
    
    const newHeight = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, startHeightRef.current + deltaPercent));
    setCardHeight(newHeight);
    setIsCollapsed(newHeight <= COLLAPSED_HEIGHT);
  };

  const handleAreaTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    
    setIsDragging(false);
    setGestureState('snapping');
    
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
    
    setTimeout(() => {
      setGestureState('idle');
    }, 400);
  };

  return (
    <div 
      ref={cardRef}
      className={`fish-score-card ${isCollapsed ? 'collapsed' : ''} ${gestureState} ${isDragging ? 'dragging' : ''}`}
      style={{ 
        height: `${cardHeight}vh`,
        touchAction: 'none',
      }}
    >
      {/* 拖拽手柄区域 - 整个顶部可拖拽 */}
      <div 
        className="fish-score-card__handle-area"
        onTouchStart={handleAreaTouchStart}
        onTouchMove={handleAreaTouchMove}
        onTouchEnd={handleAreaTouchEnd}
      >
        {/* 提示文案 */}
        <div className={`fish-score-card__hint ${showHint ? 'visible' : ''}`}>
          <span className="hint-icon">{isCollapsed ? '👆' : '👇'}</span>
          <span className="hint-text">{isCollapsed ? '上滑展开详情' : '下滑收起'}</span>
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
