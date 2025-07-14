import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { useApp } from '../../context/AppContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { sidebarCollapsed } = useApp();
  
  // Hide sidebar on certain pages if needed
  const hideSidebar = location.pathname.includes('/login') || location.pathname.includes('/register');

  return (
    <div className="layout">
      {!hideSidebar && <Sidebar />}
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${hideSidebar ? 'no-sidebar' : ''}`}>
        <Header />
        <main className="page-content">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;