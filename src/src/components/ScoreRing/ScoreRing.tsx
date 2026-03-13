import React from 'react';
import './ScoreRing.scss';

interface ScoreRingProps {
  score: number;
  level: string;
  emoji: string;
  desc: string;
}

const ScoreRing: React.FC<ScoreRingProps> = ({ score, level, emoji, desc }) => {
  // 计算圆环进度
  const circumference = 2 * Math.PI * 40; // 半径40
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  // 根据分数确定颜色和渐变
  const getColor = () => {
    if (score >= 90) return '#00c853';
    if (score >= 70) return '#00d4aa';
    if (score >= 50) return '#ffab00';
    return '#ff1744';
  };

  const getGradientId = () => {
    if (score >= 90) return 'score-gradient-success';
    if (score >= 70) return 'score-gradient-primary';
    if (score >= 50) return 'score-gradient-warning';
    return 'score-gradient-danger';
  };

  return (
    <div className="score-ring">
      <svg className="score-ring__svg" viewBox="0 0 100 100">
        <defs>
          {/* 成功渐变 */}
          <linearGradient id="score-gradient-success" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00c853" />
            <stop offset="100%" stopColor="#00e676" />
          </linearGradient>
          {/* 主要渐变 */}
          <linearGradient id="score-gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4aa" />
            <stop offset="100%" stopColor="#00a8cc" />
          </linearGradient>
          {/* 警告渐变 */}
          <linearGradient id="score-gradient-warning" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffab00" />
            <stop offset="100%" stopColor="#ffd600" />
          </linearGradient>
          {/* 危险渐变 */}
          <linearGradient id="score-gradient-danger" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff1744" />
            <stop offset="100%" stopColor="#ff5252" />
          </linearGradient>
          
          {/* 发光滤镜 */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* 背景圆环 - 带纹理 */}
        <circle
          className="score-ring__bg"
          cx="50"
          cy="50"
          r="40"
          fill="none"
          strokeWidth="6"
        />
        
        {/* 外圈光晕 */}
        <circle
          className="score-ring__glow"
          cx="50"
          cy="50"
          r="40"
          fill="none"
          strokeWidth="10"
          style={{ stroke: getColor() }}
        />
        
        {/* 进度圆环 */}
        <circle
          className="score-ring__progress"
          cx="50"
          cy="50"
          r="40"
          fill="none"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          stroke={`url(#${getGradientId()})`}
          filter="url(#glow)"
        />
        
        {/* 端点高光 */}
        <circle
          className="score-ring__endpoint"
          cx={50 + 40 * Math.sin((progress / circumference) * 2 * Math.PI)}
          cy={50 - 40 * Math.cos((progress / circumference) * 2 * Math.PI)}
          r="4"
          fill={getColor()}
        />
      </svg>
      
      <div className="score-ring__content">
        <div className="score-ring__score" style={{ color: getColor() }}>
          {score}
        </div>
        <div className="score-ring__level">
          <span className="level-emoji">{emoji}</span>
          <span className="level-text">{level}</span>
        </div>
      </div>

      <div className="score-ring__desc">{desc}</div>
    </div>
  );
};

export default ScoreRing;
