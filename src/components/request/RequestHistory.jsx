import React, { useState } from 'react';
import { FiClock, FiTrash2, FiPlay, FiCopy, FiDownload } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

const RequestHistory = ({ onSelectRequest }) => {
  const { requestHistory, clearRequestHistory } = useApp();
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all request history?')) {
      clearRequestHistory();
      toast.success('Request history cleared');
    }
  };

  const handleSelectRequest = (historyItem) => {
    setSelectedRequest(historyItem);
    if (onSelectRequest) {
      onSelectRequest(historyItem);
    }
  };

  const handleCopyRequest = (historyItem) => {
    const requestData = {
      method: historyItem.request.method,
      url: historyItem.request.url,
      headers: historyItem.request.headers,
      body: historyItem.request.body
    };
    
    navigator.clipboard.writeText(JSON.stringify(requestData, null, 2));
    toast.success('Request copied to clipboard');
  };

  const handleExportHistory = () => {
    const exportData = {
      history: requestHistory,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `request-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return '#10b981';
    if (status >= 300 && status < 400) return '#f59e0b';
    if (status >= 400) return '#ef4444';
    return '#6b7280';
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: '#10b981',
      POST: '#3b82f6',
      PUT: '#f59e0b',
      PATCH: '#8b5cf6',
      DELETE: '#ef4444'
    };
    return colors[method] || '#6b7280';
  };

  return (
    <div className="request-history">
      <div className="history-header">
        <div className="header-left">
          <h3>Request History</h3>
          <span className="history-count">{requestHistory.length} requests</span>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-sm btn-secondary"
            onClick={handleExportHistory}
            disabled={requestHistory.length === 0}
          >
            <FiDownload />
            Export
          </button>
          <button 
            className="btn btn-sm btn-danger"
            onClick={handleClearHistory}
            disabled={requestHistory.length === 0}
          >
            <FiTrash2 />
            Clear
          </button>
        </div>
      </div>

      <div className="history-list">
        {requestHistory.length === 0 ? (
          <div className="empty-history">
            <FiClock className="empty-icon" />
            <p>No request history yet</p>
            <small>Send some requests to see them here</small>
          </div>
        ) : (
          requestHistory.map((historyItem) => (
            <div 
              key={historyItem.id} 
              className={`history-item ${selectedRequest?.id === historyItem.id ? 'selected' : ''}`}
              onClick={() => handleSelectRequest(historyItem)}
            >
              <div className="history-item-header">
                <div className="request-info">
                  <span 
                    className="method-badge"
                    style={{ backgroundColor: getMethodColor(historyItem.request.method) }}
                  >
                    {historyItem.request.method}
                  </span>
                  <span className="request-url">
                    {new URL(historyItem.request.url).pathname}
                  </span>
                </div>
                
                <div className="response-info">
                  {historyItem.response.status && (
                    <span 
                      className="status-code"
                      style={{ color: getStatusColor(historyItem.response.status) }}
                    >
                      {historyItem.response.status}
                    </span>
                  )}
                  {historyItem.response.responseTime && (
                    <span className="response-time">
                      {historyItem.response.responseTime}ms
                    </span>
                  )}
                </div>
              </div>

              <div className="history-item-meta">
                <span className="timestamp">
                  {formatRelativeTime(historyItem.timestamp)}
                </span>
                <span className="full-url" title={historyItem.request.url}>
                  {historyItem.request.url}
                </span>
              </div>

              <div className="history-item-actions">
                <button
                  className="action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectRequest(historyItem);
                  }}
                  title="Load request"
                >
                  <FiPlay />
                </button>
                <button
                  className="action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyRequest(historyItem);
                  }}
                  title="Copy request"
                >
                  <FiCopy />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedRequest && (
        <div className="history-details">
          <div className="details-header">
            <h4>Request Details</h4>
            <span className="details-time">
              {formatDate(selectedRequest.timestamp)}
            </span>
          </div>

          <div className="request-summary">
            <div className="summary-row">
              <span className="label">Method:</span>
              <span className="value">{selectedRequest.request.method}</span>
            </div>
            <div className="summary-row">
              <span className="label">URL:</span>
              <span className="value">{selectedRequest.request.url}</span>
            </div>
            <div className="summary-row">
              <span className="label">Status:</span>
              <span 
                className="value"
                style={{ color: getStatusColor(selectedRequest.response.status) }}
              >
                {selectedRequest.response.status} {selectedRequest.response.statusText}
              </span>
            </div>
            <div className="summary-row">
              <span className="label">Response Time:</span>
              <span className="value">{selectedRequest.response.responseTime}ms</span>
            </div>
          </div>

          {selectedRequest.request.headers && Object.keys(selectedRequest.request.headers).length > 0 && (
            <div className="request-headers">
              <h5>Request Headers</h5>
              <div className="headers-list">
                {Object.entries(selectedRequest.request.headers).map(([key, value]) => (
                  <div key={key} className="header-item">
                    <span className="header-key">{key}:</span>
                    <span className="header-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedRequest.request.body && (
            <div className="request-body">
              <h5>Request Body</h5>
              <pre className="body-content">{selectedRequest.request.body}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestHistory;