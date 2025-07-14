import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiDatabase, FiCode, FiActivity, FiUsers, FiTrendingUp,
  FiClock, FiCheckCircle, FiAlertCircle, FiPlay
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import Statistics from './Statistics';
import Charts from './Charts';
import RecentActivity from './RecentActivity';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    apis, 
    endpoints, 
    schemas, 
    requestHistory,
    environments,
    currentEnvironment 
  } = useApp();

  const stats = {
    totalApis: apis.length,
    totalEndpoints: endpoints.length,
    totalSchemas: schemas.length,
    totalRequests: requestHistory.length,
    activeApis: apis.filter(api => api.status === 'active').length,
    recentRequests: requestHistory.filter(req => {
      const requestTime = new Date(req.timestamp);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return requestTime > oneDayAgo;
    }).length
  };

  const quickActions = [
    {
      title: 'Create New API',
      description: 'Design and document a new API',
      icon: FiDatabase,
      action: () => navigate('/apis/new'),
      color: '#3b82f6'
    },
    {
      title: 'Test Endpoint',
      description: 'Send requests and test your APIs',
      icon: FiPlay,
      action: () => navigate('/request'),
      color: '#10b981'
    },
    {
      title: 'Design Schema',
      description: 'Create data models and schemas',
      icon: FiCode,
      action: () => navigate('/schemas/new'),
      color: '#8b5cf6'
    },
    {
      title: 'Manage Environments',
      description: 'Configure API environments',
      icon: FiActivity,
      action: () => navigate('/environments'),
      color: '#f59e0b'
    }
  ];

  const currentEnv = environments.find(env => env.id === currentEnvironment);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Dashboard</h1>
            <p>Welcome back! Here's what's happening with your APIs.</p>
          </div>
          <div className="header-right">
            <div className="current-environment">
              <span className="env-label">Environment:</span>
              <span className="env-name">{currentEnv?.name || 'Unknown'}</span>
              <span className="env-status active">Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card primary">
          <div className="stat-icon">
            <FiDatabase />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalApis}</div>
            <div className="stat-label">Total APIs</div>
            <div className="stat-change positive">
              <FiTrendingUp />
              {stats.activeApis} active
            </div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <FiCode />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalEndpoints}</div>
            <div className="stat-label">Endpoints</div>
            <div className="stat-change">
              Across all APIs
            </div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <FiActivity />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalRequests}</div>
            <div className="stat-label">Total Requests</div>
            <div className="stat-change positive">
              <FiClock />
              {stats.recentRequests} today
            </div>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <FiUsers />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalSchemas}</div>
            <div className="stat-label">Schemas</div>
            <div className="stat-change">
              Data models
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
            <p>Get started with common tasks</p>
          </div>
          
          <div className="quick-actions">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div 
                  key={index} 
                  className="quick-action-card"
                  onClick={action.action}
                  style={{ borderLeftColor: action.color }}
                >
                  <div className="action-icon" style={{ color: action.color }}>
                    <Icon />
                  </div>
                  <div className="action-content">
                    <h3>{action.title}</h3>
                    <p>{action.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>API Health</h2>
            <p>Status overview of your APIs</p>
          </div>
          
          <div className="health-grid">
            {apis.slice(0, 4).map(api => (
              <div key={api.id} className="health-card">
                <div className="health-header">
                  <span className="api-name">{api.name}</span>
                  <span className={`health-status ${api.status}`}>
                    {api.status === 'active' ? <FiCheckCircle /> : <FiAlertCircle />}
                  </span>
                </div>
                <div className="health-stats">
                  <div className="health-stat">
                    <span className="stat-label">Endpoints:</span>
                    <span className="stat-value">
                      {endpoints.filter(ep => ep.apiId === api.id).length}
                    </span>
                  </div>
                  <div className="health-stat">
                    <span className="stat-label">Version:</span>
                    <span className="stat-value">v{api.version}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="dashboard-section">
          <Statistics />
        </div>
        
        <div className="dashboard-section">
          <RecentActivity />
        </div>
      </div>

      <div className="dashboard-section full-width">
        <Charts />
      </div>
    </div>
  );
};

export default Dashboard;