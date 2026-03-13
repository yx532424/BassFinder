import React from 'react';
import { FactorItem } from '@/stores/appStore';
import './MetricItem.scss';

interface MetricItemProps {
  factor: FactorItem;
}

const MetricItem: React.FC<MetricItemProps> = ({ factor }) => {
  const getStatusClass = () => {
    switch (factor.status) {
      case 'good': return 'metric--good';
      case 'warning': return 'metric--warning';
      case 'bad': return 'metric--bad';
      default: return '';
    }
  };

  return (
    <div className={`metric ${getStatusClass()}`}>
      <div className="metric__header">
        <span className="metric__icon">{factor.nameEmoji}</span>
        <span className="metric__name">{factor.name}</span>
      </div>
      <div className="metric__value">{factor.value}</div>
      <div className="metric__desc">{factor.desc}</div>
      <div className="metric__bar">
        <div 
          className="metric__bar-fill" 
          style={{ width: `${factor.score}%` }}
        />
      </div>
    </div>
  );
};

export default MetricItem;
