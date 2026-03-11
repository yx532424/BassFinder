import React from 'react';
import './LoadingOverlay.scss';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isLoading, 
  message = '正在分析鱼情...' 
}) => {
  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-logo">
          <span className="logo-icon">🦈</span>
          <div className="logo-ring" />
        </div>
        <div className="loading-text">{message}</div>
        <div className="loading-dots">
          <span className="dot dot-1">.</span>
          <span className="dot dot-2">.</span>
          <span className="dot dot-3">.</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
