import React from 'react';
import { FiMenu, FiSun, FiMoon, FiBell, FiUser, FiSettings } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
  const { toggleSidebar } = useApp();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <FiMenu />
        </button>
      </div>

      <div className="header-right">
        <button className="header-btn" onClick={toggleTheme}>
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>
        
        <button className="header-btn">
          <FiBell />
          <span className="notification-badge">3</span>
        </button>
        
        <div className="user-menu">
          <button className="user-btn">
            <FiUser />
            <span>Ankur Saroj</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;