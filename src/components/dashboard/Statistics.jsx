import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';

const Statistics = () => {
  const { apis, endpoints, requestHistory } = useApp();

  // Calculate statistics
  const totalApis = apis.length;
  const activeApis = apis.filter(api => api.status === 'active').length;
  const totalEndpoints = endpoints.length;
  const totalRequests = requestHistory.length;

  // Calculate trends (mock data for demo)
  const apiTrend = { value: 15, direction: 'up' };
  const endpointTrend = { value: 8, direction: 'up' };
  const requestTrend = { value: 23, direction: 'down' };

  const getTrendIcon = (direction) => {
    switch (direction) {
      case 'up': return <FiTrendingUp />;
      case 'down': return <FiTrendingDown />;
      default: return <FiMinus />;
    }
  };

  const getTrendColor = (direction) => {
    switch (direction) {
      case 'up': return '#10b981';
      case 'down': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const stats = [
    {
      title: 'Total APIs',
      value: totalApis,
      trend: apiTrend,
      color: '#3b82f6'
    },
    {
      title: 'Active APIs',
      value: activeApis,
      trend: { value: 5, direction: 'up' },
      color: '#10b981'
    },
    {
      title: 'Total Endpoints',
      value: totalEndpoints,
      trend: endpointTrend,
      color: '#8b5cf6'
    },
    {
      title: 'Total Requests',
      value: totalRequests,
      trend: requestTrend,
      color: '#f59e0b'
    }
  ];

  return (
    <div className="statistics">
      <div className="stats-header">
        <h3>Statistics Overview</h3>
        <p>Key metrics for your API management platform</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <div className="stat-title">{stat.title}</div>
              <div 
                className="stat-trend"
                style={{ color: getTrendColor(stat.trend.direction) }}
              >
                {getTrendIcon(stat.trend.direction)}
                <span>{stat.trend.value}%</span>
              </div>
            </div>
            
            <div className="stat-value" style={{ color: stat.color }}>
              {stat.value.toLocaleString()}
            </div>
            
            <div className="stat-footer">
              <div className="stat-change">
                <span style={{ color: getTrendColor(stat.trend.direction) }}>
                  {stat.trend.direction === 'up' ? '+' : '-'}{stat.trend.value}%
                </span>
                <span className="stat-period">from last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="detailed-stats">
        <div className="detailed-stat-card">
          <h4>API Health</h4>
          <div className="health-metrics">
            <div className="health-metric">
              <span className="metric-label">Healthy APIs:</span>
              <span className="metric-value">{activeApis}</span>
            </div>
            <div className="health-metric">
              <span className="metric-label">APIs with Issues:</span>
              <span className="metric-value">0</span>
            </div>
            <div className="health-metric">
              <span className="metric-label">Success Rate:</span>
              <span className="metric-value">99.8%</span>
            </div>
          </div>
        </div>

        <div className="detailed-stat-card">
          <h4>Performance</h4>
          <div className="performance-metrics">
            <div className="performance-metric">
              <span className="metric-label">Avg Response Time:</span>
              <span className="metric-value">245ms</span>
            </div>
            <div className="performance-metric">
              <span className="metric-label">Uptime:</span>
              <span className="metric-value">99.9%</span>
            </div>
            <div className="performance-metric">
              <span className="metric-label">Error Rate:</span>
              <span className="metric-value">0.2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;