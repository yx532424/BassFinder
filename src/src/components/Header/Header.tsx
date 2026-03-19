import React, { useState } from 'react';
import { MapPin, Menu, Search, RefreshCw, User, Flame, LogOut } from 'lucide-react';
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
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    setShowMenu(false);
  };

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
        {/* 菜单按钮 */}
        <div className="header__menu-wrapper">
          <button 
            className="header__btn header__menu-btn" 
            onClick={handleMenuClick}
            aria-label="菜单"
          >
            <Menu size={22} />
          </button>
          
          {/* 下拉菜单 */}
          {showMenu && (
            <div className="header__menu-dropdown">
              <button 
                className="menu-item" 
                onClick={() => handleMenuItemClick(onSearchClick)}
              >
                <Search size={18} />
                <span>搜索地点</span>
              </button>
              <button 
                className="menu-item" 
                onClick={() => handleMenuItemClick(onRefreshClick)}
                disabled={isLoading}
              >
                <RefreshCw size={18} className={isLoading ? 'spin' : ''} />
                <span>刷新数据</span>
              </button>
              {isLoggedIn && signInDays > 0 && (
                <button 
                  className="menu-item" 
                  onClick={() => handleMenuItemClick(onSignInClick!)}
                >
                  <Flame size={18} />
                  <span>签到 ({signInDays}天)</span>
                </button>
              )}
              <div className="menu-divider"></div>
              <button 
                className="menu-item" 
                onClick={() => handleMenuItemClick(onUserClick!)}
              >
                {isLoggedIn ? <LogOut size={18} /> : <User size={18} />}
                <span>{isLoggedIn ? '退出登录' : '登录/注册'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 点击其他区域关闭菜单 */}
      {showMenu && <div className="menu-overlay" onClick={() => setShowMenu(false)}></div>}
    </header>
  );
};

export default Header;
