import React from 'react';
import { Search, RefreshCw, MapPin, User } from 'lucide-react';
import './Header.scss';

interface HeaderProps {
  locationName: string;
  onSearchClick: () => void;
  onRefreshClick: () => void;
  isLoading?: boolean;
  isLoggedIn?: boolean;
  signInDays?: number;
  onUserClick?: () => void;
  onSignInClick?: () => void;
  offlineMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  locationName,
  onSearchClick,
  onRefreshClick,
  isLoading = false,
  isLoggedIn = false,
  signInDays = 0,
  onUserClick,
  onSignInClick,
  offlineMode = false,
}) => {
  return (
    <header className="header">
      {/* 离线模式提示 */}
      {offlineMode && (
        <div className="offline-badge">
          📴 离线模式
        </div>
      )}
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
        {isLoggedIn && signInDays > 0 && (
          <button 
            className="header__btn header__signin" 
            onClick={onSignInClick}
            title="签到"
          >
            <span className="signin-fire">🔥</span>
            <span className="signin-days">{signInDays}</span>
          </button>
        )}
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
        <button 
          className="header__btn header__user-btn" 
          onClick={onUserClick}
          aria-label="用户中心"
        >
          <User size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
