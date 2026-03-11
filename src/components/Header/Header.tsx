import React from 'react';
import { Search, RefreshCw, MapPin } from 'lucide-react';
import './Header.scss';

interface HeaderProps {
  locationName: string;
  onSearchClick: () => void;
  onRefreshClick: () => void;
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  locationName,
  onSearchClick,
  onRefreshClick,
  isLoading = false,
}) => {
  return (
    <header className="header">
      <div className="header__left">
        <div className="header__logo">
          <span className="logo-icon">🦈</span>
        </div>
        <div className="header__location">
          <MapPin size={14} className="location-icon" />
          <span className="location-name">{locationName || '定位中...'}</span>
        </div>
      </div>
      
      <div className="header__right">
        <button 
          className="header__btn" 
          onClick={onSearchClick}
          aria-label="搜索地点"
        >
          <Search size={20} />
        </button>
        <button 
          className="header__btn" 
          onClick={onRefreshClick}
          disabled={isLoading}
          aria-label="刷新数据"
        >
          <RefreshCw size={20} className={isLoading ? 'spin' : ''} />
        </button>
      </div>
    </header>
  );
};

export default Header;
