// Loading Skeleton Component
// 用于数据加载时显示骨架屏，提升用户体验

import React from 'react';
import './Skeleton.scss';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '4px',
  className = ''
}) => {
  return (
    <div 
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  );
};

// 骨架屏组合 - 评分卡片
export const ScoreCardSkeleton: React.FC = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card__header">
        <Skeleton width="120px" height="24px" borderRadius="8px" />
        <Skeleton width="60px" height="20px" borderRadius="10px" />
      </div>
      
      <div className="skeleton-card__score">
        <Skeleton width="100px" height="100px" borderRadius="50%" />
        <Skeleton width="80px" height="16px" />
      </div>
      
      <div className="skeleton-card__metrics">
        <Skeleton width="100%" height="60px" borderRadius="8px" />
        <Skeleton width="100%" height="60px" borderRadius="8px" />
        <Skeleton width="100%" height="60px" borderRadius="8px" />
      </div>
      
      <div className="skeleton-card__lures">
        <Skeleton width="80px" height="32px" borderRadius="16px" />
        <Skeleton width="80px" height="32px" borderRadius="16px" />
        <Skeleton width="80px" height="32px" borderRadius="16px" />
      </div>
    </div>
  );
};

export default Skeleton;
