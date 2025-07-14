import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiDatabase, FiPlay, FiGlobe, FiUsers, FiPackage, FiTag } from 'react-icons/fi';

const NavBar = () => {
  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/apis', icon: FiDatabase, label: 'APIs' },
    { path: '/request', icon: FiPlay, label: 'Request Tester' },
    { path: '/environments', icon: FiGlobe, label: 'Environments' },
    { path: '/users', icon: FiUsers, label: 'Users' },
    { path: '/products', icon: FiPackage, label: 'Products' },
    { path: '/categories', icon: FiTag, label: 'Categories' },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default NavBar;