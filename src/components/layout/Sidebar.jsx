import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiHome, FiCode, FiLayers, FiDatabase, FiPlay, FiGlobe, 
  FiUsers, FiPackage, FiTag, FiSettings, FiChevronLeft, 
  FiChevronRight, FiFileText, FiBox, FiActivity 
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';

const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar, currentApi } = useApp();
  const location = useLocation();

  const menuSections = [
    {
      title: 'Main',
      items: [
        { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
        { path: '/apis', icon: FiDatabase, label: 'APIs' },
        { path: '/request', icon: FiPlay, label: 'Request Tester' },
        { path: '/environments', icon: FiGlobe, label: 'Environments' },
      ]
    },
    {
      title: 'API Design',
      items: [
        { 
          path: currentApi ? `/apis/${currentApi.id}/endpoints` : '/endpoints', 
          icon: FiCode, 
          label: 'Endpoints',
          disabled: !currentApi 
        },
        { 
          path: currentApi ? `/apis/${currentApi.id}/schemas` : '/schemas', 
          icon: FiFileText, 
          label: 'Schemas',
          disabled: !currentApi 
        },
        { 
          path: currentApi ? `/apis/${currentApi.id}/components` : '/components', 
          icon: FiBox, 
          label: 'Components',
          disabled: !currentApi 
        },
        { 
          path: currentApi ? `/apis/${currentApi.id}/versions` : '/versions', 
          icon: FiActivity, 
          label: 'Versions',
          disabled: !currentApi 
        },
      ]
    },
    {
      title: 'Data Management',
      items: [
        { path: '/users', icon: FiUsers, label: 'Users' },
        { path: '/products', icon: FiPackage, label: 'Products' },
        { path: '/categories', icon: FiTag, label: 'Categories' },
      ]
    },
    {
      title: 'System',
      items: [
        { path: '/settings', icon: FiSettings, label: 'Settings' },
      ]
    }
  ];

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          {!sidebarCollapsed && (
            <>
              <span className="logo-icon">🚀</span>
              <span className="logo-text">API Manager</span>
            </>
          )}
        </div>
        <button 
          className="sidebar-toggle" 
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuSections.map((section, index) => (
          <div key={index} className="nav-section">
            {!sidebarCollapsed && (
              <div className="section-title">{section.title}</div>
            )}
            <ul className="nav-items">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                                location.pathname.startsWith(item.path.split('/').slice(0, -1).join('/'));
                
                return (
                  <li key={itemIndex} className="nav-item">
                    <NavLink
                      to={item.path}
                      className={`nav-link ${isActive ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`}
                      title={sidebarCollapsed ? item.label : ''}
                      onClick={item.disabled ? (e) => e.preventDefault() : undefined}
                    >
                      <Icon className="nav-icon" />
                      {!sidebarCollapsed && (
                        <span className="nav-label">{item.label}</span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {currentApi && !sidebarCollapsed && (
        <div className="sidebar-footer">
          <div className="current-api-info">
            <div className="api-indicator">
              <div className="api-icon">
                <FiDatabase />
              </div>
              <div className="api-details">
                <div className="api-name">{currentApi.name}</div>
                <div className="api-version">v{currentApi.version}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;