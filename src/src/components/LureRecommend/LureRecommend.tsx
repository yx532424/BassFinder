import React from 'react';
import { Lure } from '@/stores/appStore';
import { Zap, Waves, Target } from 'lucide-react';
import './LureRecommend.scss';

interface LureRecommendProps {
  lures: Lure[];
}

const LureRecommend: React.FC<LureRecommendProps> = ({ lures }) => {
  const getTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'VIB': return <Zap size={14} />;
      case 'POPPER':
      case 'PENCIL': return <Waves size={14} />;
      default: return <Target size={14} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'VIB': return 'type-vib';
      case 'MINNOW': return 'type-minnow';
      case 'PENCIL': return 'type-pencil';
      case 'POPPER': return 'type-popper';
      case 'GRUB': return 'type-grub';
      default: return '';
    }
  };

  if (!lures || lures.length === 0) {
    return null;
  }

  return (
    <div className="lure-recommend">
      <div className="lure-recommend__title">
        <span className="title-icon">🎣</span>
        <span>推荐拟饵</span>
      </div>
      <div className="lure-recommend__list">
        {lures.map((lure, index) => (
          <div 
            key={index} 
            className={`lure-item ${getTypeColor(lure.type)}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="lure-item__icon">
              {getTypeIcon(lure.type)}
            </div>
            <div className="lure-item__info">
              <div className="lure-item__name">{lure.name}</div>
              <div className="lure-item__desc">{lure.desc}</div>
            </div>
            <div className="lure-item__type">{lure.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LureRecommend;
