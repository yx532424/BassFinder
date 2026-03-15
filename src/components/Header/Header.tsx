import React from 'react';
import { Search, RefreshCw, MapPin, User, Download } from 'lucide-react';
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
  onRankingClick?: () => void;
  onCatchClick?: () => void;
  onExportClick?: () => void;
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
  onRankingClick,
  onCatchClick,
  onExportClick,
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
        {isLoggedIn && (
          <button 
            className="header__btn header__signin" 
            onClick={onSignInClick}
            title="签到"
          >
            <span className="signin-badge">📅</span>
            {signInDays > 0 && <span className="signin-days">{signInDays}天</span>}
          </button>
        )}
        
        <button 
          className="header__btn header__ranking" 
          onClick={onRankingClick}
          title="排行榜"
        >
          🏆
        </button>

        <button 
          className="header__btn header__catch" 
          onClick={onCatchClick}
          title="钓获记录"
        >
          🎣
        </button>

        <button 
          className="header__btn header__export" 
          onClick={onExportClick}
          title="导出数据"
        >
          📤
        </button>
        
        <button 
          className="header__btn header__refresh" 
          onClick={onRefreshClick}
          disabled={isLoading}
          title="刷新"
        >
          <RefreshCw size={18} className={isLoading ? 'spinning' : ''} />
        </button>
        
        <button 
          className="header__btn header__user" 
          onClick={onUserClick}
          title="用户"
        >
          <User size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
