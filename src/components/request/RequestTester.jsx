import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiPlay, FiSave, FiCopy, FiDownload, FiClock, FiCheck, FiX } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';

const RequestTester = () => {
  const [searchParams] = useSearchParams();
  const endpointId = searchParams.get('endpoint');
  
  const { 
    endpoints, 
    environments, 
    currentEnvironment, 
    setCurrentEnvironment,
    addRequestHistory 
  } = useApp();

  const [request, setRequest] = useState({
    method: 'GET',
    url: '',
    headers: [{ key: 'Content-Type', value: 'application/json', enabled: true }],
    params: [],
    body: '',
    bodyType: 'json'
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('headers');

  const currentEnv = environments.find(env => env.id === currentEnvironment);

  useEffect(() => {
    if (endpointId) {
      const endpoint = endpoints.find(ep => ep.id === endpointId);
      if (endpoint) {
        populateFromEndpoint(endpoint);
      }
    }
  }, [endpointId, endpoints]);

  const populateFromEndpoint = (endpoint) => {
    const baseUrl = currentEnv?.baseUrl || 'http://localhost:8080';
    
    setRequest(prev => ({
      ...prev,
      method: endpoint.method,
      url: `${baseUrl}${endpoint.path}`,
      params: endpoint.parameters
        ?.filter(param => param.in === 'query')
        .map(param => ({
          key: param.name,
          value: '',
          description: param.description,
          enabled: true
        })) || []
    }));
  };

  const handleSendRequest = async () => {
    setLoading(true);
    const startTime = Date.now();

    try {
      // Build URL with query parameters
      const url = new URL(request.url);
      request.params
        .filter(param => param.enabled && param.key && param.value)
        .forEach(param => {
          url.searchParams.append(param.key, param.value);
        });

      // Build headers
      const headers = {};
      request.headers
        .filter(header => header.enabled && header.key)
        .forEach(header => {
          headers[header.key] = header.value;
        });

      // Add environment variables to headers
      if (currentEnv?.variables) {
        Object.entries(currentEnv.variables).forEach(([key, value]) => {
          if (key.toLowerCase().includes('key') || key.toLowerCase().includes('token')) {
            headers['Authorization'] = `Bearer ${value}`;
          }
        });
      }

      const requestOptions = {
        method: request.method,
        headers
      };

      // Add body for POST, PUT, PATCH requests
      if (['POST', 'PUT', 'PATCH'].includes(request.method) && request.body) {
        if (request.bodyType === 'json') {
          try {
            requestOptions.body = JSON.stringify(JSON.parse(request.body));
          } catch (error) {
            requestOptions.body = request.body;
          }
        } else {
          requestOptions.body = request.body;
        }
      }

      const response = await fetch(url.toString(), requestOptions);
      const responseTime = Date.now() - startTime;
      
      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      const responseObj = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
        responseTime,
        timestamp: new Date().toISOString()
      };

      setResponse(responseObj);

      // Add to history
      addRequestHistory({
        id: Date.now().toString(),
        request: { ...request, url: url.toString() },
        response: responseObj,
        timestamp: new Date().toISOString()
      });

      toast.success(`Request completed in ${responseTime}ms`);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorResponse = {
        error: error.message,
        responseTime,
        timestamp: new Date().toISOString()
      };
      
      setResponse(errorResponse);
      toast.error('Request failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHeaderChange = (index, field, value) => {
    const newHeaders = [...request.headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    setRequest(prev => ({ ...prev, headers: newHeaders }));
  };

  const addHeader = () => {
    setRequest(prev => ({
      ...prev,
      headers: [...prev.headers, { key: '', value: '', enabled: true }]
    }));
  };

  const removeHeader = (index) => {
    setRequest(prev => ({
      ...prev,
      headers: prev.headers.filter((_, i) => i !== index)
    }));
  };

  const handleParamChange = (index, field, value) => {
    const newParams = [...request.params];
    newParams[index] = { ...newParams[index], [field]: value };
    setRequest(prev => ({ ...prev, params: newParams }));
  };

  const addParam = () => {
    setRequest(prev => ({
      ...prev,
      params: [...prev.params, { key: '', value: '', enabled: true }]
    }));
  };

  const removeParam = (index) => {
    setRequest(prev => ({
      ...prev,
      params: prev.params.filter((_, i) => i !== index)
    }));
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return '#10b981';
    if (status >= 300 && status < 400) return '#f59e0b';
    if (status >= 400 && status < 500) return '#ef4444';
    if (status >= 500) return '#ef4444';
    return '#6b7280';
  };

  return (
    <div className="request-tester">
      <div className="tester-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Request Tester</h1>
            <div className="environment-selector">
              <label>Environment:</label>
              <select
                value={currentEnvironment}
                onChange={(e) => setCurrentEnvironment(e.target.value)}
              >
                {environments.map(env => (
                  <option key={env.id} value={env.id}>
                    {env.name} ({env.baseUrl})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="request-panel">
        <div className="request-line">
          <select
            value={request.method}
            onChange={(e) => setRequest(prev => ({ ...prev, method: e.target.value }))}
            className="method-select"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>
          
          <input
            type="text"
            value={request.url}
            onChange={(e) => setRequest(prev => ({ ...prev, url: e.target.value }))}
            placeholder="Enter request URL"
            className="url-input"
          />
          
          <button
            className="btn btn-primary send-btn"
            onClick={handleSendRequest}
            disabled={loading || !request.url}
          >
            {loading ? (
              <>
                <div className="spinner" />
                Sending...
              </>
            ) : (
              <>
                <FiPlay />
                Send
              </>
            )}
          </button>
        </div>

        <div className="request-tabs">
          <button
            className={`tab ${activeTab === 'params' ? 'active' : ''}`}
            onClick={() => setActiveTab('params')}
          >
            Params ({request.params.filter(p => p.enabled && p.key).length})
          </button>
          <button
            className={`tab ${activeTab === 'headers' ? 'active' : ''}`}
            onClick={() => setActiveTab('headers')}
          >
            Headers ({request.headers.filter(h => h.enabled && h.key).length})
          </button>
          <button
            className={`tab ${activeTab === 'body' ? 'active' : ''}`}
            onClick={() => setActiveTab('body')}
          >
            Body
          </button>
        </div>

        <div className="request-content">
          {activeTab === 'params' && (
            <div className="params-editor">
              <div className="editor-header">
                <span>Query Parameters</span>
                <button className="btn btn-sm btn-secondary" onClick={addParam}>
                  Add Parameter
                </button>
              </div>
              
              {request.params.map((param, index) => (
                <div key={index} className="param-row">
                  <input
                    type="checkbox"
                    checked={param.enabled}
                    onChange={(e) => handleParamChange(index, 'enabled', e.target.checked)}
                  />
                  <input
                    type="text"
                    value={param.key}
                    onChange={(e) => handleParamChange(index, 'key', e.target.value)}
                    placeholder="Key"
                  />
                  <input
                    type="text"
                    value={param.value}
                    onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                    placeholder="Value"
                  />
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeParam(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'headers' && (
            <div className="headers-editor">
              <div className="editor-header">
                <span>Request Headers</span>
                <button className="btn btn-sm btn-secondary" onClick={addHeader}>
                  Add Header
                </button>
              </div>
              
              {request.headers.map((header, index) => (
                <div key={index} className="header-row">
                  <input
                    type="checkbox"
                    checked={header.enabled}
                    onChange={(e) => handleHeaderChange(index, 'enabled', e.target.checked)}
                  />
                  <input
                    type="text"
                    value={header.key}
                    onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                    placeholder="Header name"
                  />
                  <input
                    type="text"
                    value={header.value}
                    onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                    placeholder="Header value"
                  />
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeHeader(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'body' && (
            <div className="body-editor">
              <div className="editor-header">
                <span>Request Body</span>
                <select
                  value={request.bodyType}
                  onChange={(e) => setRequest(prev => ({ ...prev, bodyType: e.target.value }))}
                >
                  <option value="json">JSON</option>
                  <option value="text">Text</option>
                  <option value="xml">XML</option>
                </select>
              </div>
              
              <Editor
                height="300px"
                defaultLanguage={request.bodyType}
                value={request.body}
                onChange={(value) => setRequest(prev => ({ ...prev, body: value || '' }))}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on'
                }}
              />
            </div>
          )}
        </div>
      </div>

      {response && (
        <div className="response-panel">
          <div className="response-header">
            <div className="response-status">
              <span 
                className="status-code"
                style={{ color: getStatusColor(response.status) }}
              >
                {response.status} {response.statusText}
              </span>
              {response.responseTime && (
                <span className="response-time">
                  <FiClock />
                  {response.responseTime}ms
                </span>
              )}
            </div>
            <div className="response-actions">
              <button className="btn btn-sm btn-secondary">
                <FiCopy />
                Copy
              </button>
              <button className="btn btn-sm btn-secondary">
                <FiDownload />
                Save
              </button>
            </div>
          </div>

          <div className="response-content">
            {response.error ? (
              <div className="error-response">
                <FiX className="error-icon" />
                <div className="error-message">
                  <h4>Request Failed</h4>
                  <p>{response.error}</p>
                </div>
              </div>
            ) : (
              <Editor
                height="400px"
                defaultLanguage="json"
                value={typeof response.data === 'string' 
                  ? response.data 
                  : JSON.stringify(response.data, null, 2)
                }
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on'
                }}
              />
            )}
          </div>

          {response.headers && (
            <div className="response-headers">
              <h4>Response Headers</h4>
              <div className="headers-list">
                {Object.entries(response.headers).map(([key, value]) => (
                  <div key={key} className="header-item">
                    <span className="header-key">{key}:</span>
                    <span className="header-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestTester;