import React, { useState } from 'react';
import { FiCopy, FiDownload, FiEye, FiCode, FiClock, FiCheck, FiX } from 'react-icons/fi';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';

const ResponseViewer = ({ response }) => {
  const [activeTab, setActiveTab] = useState('body');
  const [formatType, setFormatType] = useState('json');

  if (!response) {
    return (
      <div className="response-viewer empty">
        <div className="empty-message">
          <p>Send a request to see the response here</p>
        </div>
      </div>
    );
  }

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  const handleDownload = () => {
    const content = typeof response.data === 'string' 
      ? response.data 
      : JSON.stringify(response.data, null, 2);
    
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return '#10b981';
    if (status >= 300 && status < 400) return '#f59e0b';
    if (status >= 400) return '#ef4444';
    return '#6b7280';
  };

  const getStatusIcon = (status) => {
    if (status >= 200 && status < 300) return <FiCheck />;
    if (status >= 400) return <FiX />;
    return <FiEye />;
  };

  const formatResponseData = () => {
    if (response.error) {
      return response.error;
    }

    if (typeof response.data === 'string') {
      try {
        return JSON.stringify(JSON.parse(response.data), null, 2);
      } catch {
        return response.data;
      }
    }

    return JSON.stringify(response.data, null, 2);
  };

  const getContentType = () => {
    if (response.headers && response.headers['content-type']) {
      return response.headers['content-type'].split(';')[0];
    }
    return 'application/json';
  };

  const getLanguageFromContentType = (contentType) => {
    const typeMap = {
      'application/json': 'json',
      'text/html': 'html',
      'text/xml': 'xml',
      'application/xml': 'xml',
      'text/plain': 'text',
      'text/css': 'css',
      'application/javascript': 'javascript'
    };
    return typeMap[contentType] || 'text';
  };

  return (
    <div className="response-viewer">
      <div className="response-header">
        <div className="response-status">
          <div className="status-info">
            {response.status && (
              <span 
                className="status-code"
                style={{ color: getStatusColor(response.status) }}
              >
                {getStatusIcon(response.status)}
                {response.status} {response.statusText}
              </span>
            )}
            {response.responseTime && (
              <span className="response-time">
                <FiClock />
                {response.responseTime}ms
              </span>
            )}
          </div>
          <div className="response-meta">
            <span className="content-type">{getContentType()}</span>
            <span className="response-size">
              {new Blob([formatResponseData()]).size} bytes
            </span>
          </div>
        </div>

        <div className="response-actions">
          <button 
            className="btn btn-sm btn-secondary"
            onClick={() => handleCopy(formatResponseData())}
          >
            <FiCopy />
            Copy
          </button>
          <button 
            className="btn btn-sm btn-secondary"
            onClick={handleDownload}
          >
            <FiDownload />
            Download
          </button>
        </div>
      </div>

      <div className="response-tabs">
        <button
          className={`tab ${activeTab === 'body' ? 'active' : ''}`}
          onClick={() => setActiveTab('body')}
        >
          <FiCode />
          Response Body
        </button>
        <button
          className={`tab ${activeTab === 'headers' ? 'active' : ''}`}
          onClick={() => setActiveTab('headers')}
        >
          Headers ({Object.keys(response.headers || {}).length})
        </button>
        <button
          className={`tab ${activeTab === 'cookies' ? 'active' : ''}`}
          onClick={() => setActiveTab('cookies')}
        >
          Cookies
        </button>
      </div>

      <div className="response-content">
        {activeTab === 'body' && (
          <div className="response-body">
            {response.error ? (
              <div className="error-response">
                <div className="error-icon">
                  <FiX />
                </div>
                <div className="error-content">
                  <h4>Request Failed</h4>
                  <p>{response.error}</p>
                </div>
              </div>
            ) : (
              <div className="body-viewer">
                <div className="viewer-controls">
                  <select
                    value={formatType}
                    onChange={(e) => setFormatType(e.target.value)}
                    className="format-select"
                  >
                    <option value="json">JSON</option>
                    <option value="text">Text</option>
                    <option value="html">HTML</option>
                    <option value="xml">XML</option>
                  </select>
                </div>
                
                <Editor
                  height="400px"
                  defaultLanguage={getLanguageFromContentType(getContentType())}
                  value={formatResponseData()}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true
                  }}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="response-headers">
            {response.headers && Object.keys(response.headers).length > 0 ? (
              <div className="headers-table">
                <div className="table-header">
                  <span>Name</span>
                  <span>Value</span>
                </div>
                {Object.entries(response.headers).map(([key, value]) => (
                  <div key={key} className="table-row">
                    <span className="header-name">{key}</span>
                    <span className="header-value">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-headers">
                <p>No headers received</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'cookies' && (
          <div className="response-cookies">
            <div className="empty-cookies">
              <p>No cookies in this response</p>
            </div>
          </div>
        )}
      </div>

      {response.timestamp && (
        <div className="response-footer">
          <span className="timestamp">
            Response received at {new Date(response.timestamp).toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  );
};

export default ResponseViewer;