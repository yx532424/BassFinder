import React from 'react';
import { Spot } from '@/stores/appStore';
import { MapPin } from 'lucide-react';
import './SpotRecommend.scss';

interface SpotRecommendProps {
  spots: Spot[];
}

const SpotRecommend: React.FC<SpotRecommendProps> = ({ spots }) => {
  if (!spots || spots.length === 0) {
    return null;
  }

  return (
    <div className="spot-recommend">
      <div className="spot-recommend__title">
        <span className="title-icon">📍</span>
        <span>推荐标点</span>
      </div>
      <div className="spot-recommend__list">
        {spots.map((spot, index) => (
          <div 
            key={index} 
            className="spot-item"
            style={{ animationDelay: `${(index + 3) * 100}ms` }}
          >
            <div className="spot-item__icon">
              <MapPin size={14} />
            </div>
            <div className="spot-item__info">
              <div className="spot-item__name">{spot.name}</div>
              <div className="spot-item__reason">{spot.reason}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpotRecommend;
