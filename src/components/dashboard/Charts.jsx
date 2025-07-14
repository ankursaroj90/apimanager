import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Charts = () => {
  // Mock data for charts
  const apiUsageData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'API Requests',
        data: [1200, 1900, 3000, 5000, 4200, 6100],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const endpointPerformanceData = {
    labels: ['GET /users', 'POST /users', 'GET /products', 'PUT /users', 'DELETE /users'],
    datasets: [
      {
        label: 'Response Time (ms)',
        data: [120, 250, 180, 300, 150],
        backgroundColor: [
          '#10b981',
          '#3b82f6',
          '#f59e0b',
          '#8b5cf6',
          '#ef4444',
        ],
      },
    ],
  };

  const apiStatusData = {
    labels: ['Active', 'Beta', 'Deprecated', 'Draft'],
    datasets: [
      {
        data: [12, 3, 2, 5],
        backgroundColor: [
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#6b7280',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="charts">
      <div className="charts-header">
        <h3>Analytics Dashboard</h3>
        <p>Visual insights into your API performance</p>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h4>API Usage Trend</h4>
            <p>Monthly API request volume</p>
          </div>
          <div className="chart-container">
            <Line data={apiUsageData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h4>Endpoint Performance</h4>
            <p>Average response times by endpoint</p>
          </div>
          <div className="chart-container">
            <Bar data={endpointPerformanceData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h4>API Status Distribution</h4>
            <p>Current status of all APIs</p>
          </div>
          <div className="chart-container">
            <Doughnut data={apiStatusData} options={doughnutOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h4>Request Methods</h4>
            <p>Distribution of HTTP methods</p>
          </div>
          <div className="chart-container">
            <Doughnut 
              data={{
                labels: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
                datasets: [{
                  data: [45, 25, 15, 10, 5],
                  backgroundColor: [
                    '#10b981',
                    '#3b82f6',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6',
                  ],
                  borderWidth: 0,
                }],
              }} 
              options={doughnutOptions} 
            />
          </div>
        </div>
      </div>

      <div className="insights-section">
        <h4>Key Insights</h4>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">📈</div>
            <div className="insight-content">
              <h5>Growing API Usage</h5>
              <p>API requests have increased by 23% this month</p>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">⚡</div>
            <div className="insight-content">
              <h5>Fast Response Times</h5>
              <p>Average response time is under 250ms</p>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">✅</div>
            <div className="insight-content">
              <h5>High Reliability</h5>
              <p>99.9% uptime maintained this quarter</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;