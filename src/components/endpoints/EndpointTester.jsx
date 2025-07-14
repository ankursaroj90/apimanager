import React, { useState, useEffect } from 'react';
import { FiPlay, FiCopy, FiSave, FiClock } from 'react-icons/fi';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';

const EndpointTester = ({ endpoint, environment, onTest }) => {
  const [testRequest, setTestRequest] = useState({
    headers: {},
    params: {},
    body: ''
  });
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (endpoint) {
      // Pre-populate with endpoint defaults
      const defaultHeaders = { 'Content-Type': 'application/json' };
      const defaultParams = {};
      
      if (endpoint.parameters) {
        endpoint.parameters.forEach(param => {
          if (param.in === 'query') {
            defaultParams[param.name] = param.example || '';
          }
        });
      }

      setTestRequest({
        headers: defaultHeaders,
        params: defaultParams,
        body: endpoint.requestBody ? JSON.stringify(endpoint.requestBody.example || {}, null, 2) : ''
      });
    }
  }, [endpoint]);

  const handleTest = async () => {
    setLoading(true);
    const startTime = Date.now();

    try {
      // Build URL
      const baseUrl = environment?.baseUrl || 'http://localhost:8080';
      let url = `${baseUrl}${endpoint.path}`;
      
      // Replace path parameters
      Object.entries(testRequest.params).forEach(([key, value]) => {
        url = url.replace(`{${key}}`, value);
      });

      // Add query parameters
      const queryParams = new URLSearchParams();
      if (endpoint.parameters) {
        endpoint.parameters
          .filter(param => param.in === 'query' && testRequest.params[param.name])
          .forEach(param => {
            queryParams.append(param.name, testRequest.params[param.name]);
          });
      }
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      // Prepare request options
      const options = {
        method: endpoint.method,
        headers: testRequest.headers
      };

      // Add body for POST, PUT, PATCH
      if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && testRequest.body) {
        options.body = testRequest.body;
      }

      const response = await fetch(url, options);
      const responseTime = Date.now() - startTime;
      
      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      const result = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
        responseTime,
        timestamp: new Date().toISOString()
      };

      setTestResult(result);
      
      if (onTest) {
        onTest(result);
      }

      toast.success(`Request completed in ${responseTime}ms`);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorResult = {
        error: error.message,
        responseTime,
        timestamp: new Date().toISOString()
      };
      
      setTestResult(errorResult);
      toast.error('Request failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHeaderChange = (key, value) => {
    setTestRequest(prev => ({
      ...prev,
      headers: { ...prev.headers, [key]: value }
    }));
  };

  const handleParamChange = (key, value) => {
    setTestRequest(prev => ({
      ...prev,
      params: { ...prev.params, [key]: value }
    }));
  };

  const handleCopyResult = () => {
    if (testResult) {
      navigator.clipboard.writeText(JSON.stringify(testResult, null, 2));
      toast.success('Result copied to clipboard');
    }
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return '#10b981';
    if (status >= 300 && status < 400) return '#f59e0b';
    if (status >= 400) return '#ef4444';
    return '#6b7280';
  };

  return (
    <div className="endpoint-tester">
      <div className="tester-header">
        <h3>Test Endpoint</h3>
        <div className="endpoint-info">
          <span className="method">{endpoint.method}</span>
          <span className="path">{endpoint.path}</span>
        </div>
      </div>

      <div className="test-form">
        <div className="form-section">
          <h4>Headers</h4>
          <div className="headers-list">
            {Object.entries(testRequest.headers).map(([key, value]) => (
              <div key={key} className="header-row">
                <input
                  type="text"
                  value={key}
                  onChange={(e) => {
                    const newHeaders = { ...testRequest.headers };
                    delete newHeaders[key];
                    newHeaders[e.target.value] = value;
                    setTestRequest(prev => ({ ...prev, headers: newHeaders }));
                  }}
                  placeholder="Header name"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleHeaderChange(key, e.target.value)}
                  placeholder="Header value"
                />
              </div>
            ))}
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => handleHeaderChange(`header-${Date.now()}`, '')}
            >
              Add Header
            </button>
          </div>
        </div>

        {endpoint.parameters && endpoint.parameters.length > 0 && (
          <div className="form-section">
            <h4>Parameters</h4>
            <div className="params-list">
              {endpoint.parameters.map(param => (
                <div key={param.name} className="param-row">
                  <label>{param.name}</label>
                  <input
                    type="text"
                    value={testRequest.params[param.name] || ''}
                    onChange={(e) => handleParamChange(param.name, e.target.value)}
                    placeholder={param.description}
                  />
                  <span className="param-info">
                    {param.in} - {param.type} {param.required && '(required)'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {['POST', 'PUT', 'PATCH'].includes(endpoint.method) && (
          <div className="form-section">
            <h4>Request Body</h4>
            <Editor
              height="200px"
              defaultLanguage="json"
              value={testRequest.body}
              onChange={(value) => setTestRequest(prev => ({ ...prev, body: value || '' }))}
              options={{
                minimap: { enabled: false },
                fontSize: 14
              }}
            />
          </div>
        )}

        <div className="test-actions">
          <button
            className="btn btn-primary"
            onClick={handleTest}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" />
                Testing...
              </>
            ) : (
              <>
                <FiPlay />
                Send Request
              </>
            )}
          </button>
        </div>
      </div>

      {testResult && (
        <div className="test-result">
          <div className="result-header">
            <h4>Response</h4>
            <div className="result-meta">
              {testResult.status && (
                <span 
                  className="status-code"
                  style={{ color: getStatusColor(testResult.status) }}
                >
                  {testResult.status} {testResult.statusText}
                </span>
              )}
              {testResult.responseTime && (
                <span className="response-time">
                  <FiClock />
                  {testResult.responseTime}ms
                </span>
              )}
              <button className="btn btn-sm btn-secondary" onClick={handleCopyResult}>
                <FiCopy />
                Copy
              </button>
            </div>
          </div>

          <div className="result-content">
            {testResult.error ? (
              <div className="error-result">
                <h5>Error</h5>
                <p>{testResult.error}</p>
              </div>
            ) : (
              <>
                <div className="response-body">
                  <h5>Response Body</h5>
                  <Editor
                    height="300px"
                    defaultLanguage="json"
                    value={typeof testResult.data === 'string' 
                      ? testResult.data 
                      : JSON.stringify(testResult.data, null, 2)
                    }
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 14
                    }}
                  />
                </div>

                {testResult.headers && (
                  <div className="response-headers">
                    <h5>Response Headers</h5>
                    <div className="headers-grid">
                      {Object.entries(testResult.headers).map(([key, value]) => (
                        <div key={key} className="header-item">
                          <span className="header-key">{key}:</span>
                          <span className="header-value">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EndpointTester;