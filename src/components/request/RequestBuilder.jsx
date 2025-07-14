import React, { useState } from 'react';
import { FiPlus, FiMinus, FiSave, FiUpload } from 'react-icons/fi';
import Editor from '@monaco-editor/react';

const RequestBuilder = ({ onSendRequest, environments, currentEnvironment }) => {
  const [request, setRequest] = useState({
    method: 'GET',
    url: '',
    headers: [{ key: 'Content-Type', value: 'application/json', enabled: true }],
    params: [],
    body: '',
    bodyType: 'json'
  });

  const [savedRequests, setSavedRequests] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [requestName, setRequestName] = useState('');

  const handleMethodChange = (method) => {
    setRequest(prev => ({ ...prev, method }));
  };

  const handleUrlChange = (url) => {
    setRequest(prev => ({ ...prev, url }));
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

  const handleBodyChange = (value) => {
    setRequest(prev => ({ ...prev, body: value || '' }));
  };

  const handleSaveRequest = () => {
    if (requestName.trim()) {
      const savedRequest = {
        id: Date.now().toString(),
        name: requestName,
        ...request,
        savedAt: new Date().toISOString()
      };
      setSavedRequests(prev => [...prev, savedRequest]);
      setShowSaveDialog(false);
      setRequestName('');
    }
  };

  const loadSavedRequest = (savedRequest) => {
    setRequest({
      method: savedRequest.method,
      url: savedRequest.url,
      headers: savedRequest.headers,
      params: savedRequest.params,
      body: savedRequest.body,
      bodyType: savedRequest.bodyType
    });
  };

  const importFromCurl = (curlCommand) => {
    // Simple curl parser (basic implementation)
    const methodMatch = curlCommand.match(/-X\s+(\w+)/);
    const urlMatch = curlCommand.match(/curl\s+['"]?([^'">\s]+)['"]?/);
    const headerMatches = curlCommand.match(/-H\s+['"]([^'"]+)['"]/g);
    
    const newRequest = { ...request };
    
    if (methodMatch) {
      newRequest.method = methodMatch[1].toUpperCase();
    }
    
    if (urlMatch) {
      newRequest.url = urlMatch[1];
    }
    
    if (headerMatches) {
      newRequest.headers = headerMatches.map(match => {
        const header = match.match(/-H\s+['"]([^'"]+)['"]/)[1];
        const [key, ...valueParts] = header.split(':');
        return {
          key: key.trim(),
          value: valueParts.join(':').trim(),
          enabled: true
        };
      });
    }
    
    setRequest(newRequest);
  };

  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

  return (
    <div className="request-builder">
      <div className="builder-header">
        <h3>Request Builder</h3>
        <div className="builder-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowSaveDialog(true)}
          >
            <FiSave />
            Save
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              const curlCommand = prompt('Paste cURL command:');
              if (curlCommand) {
                importFromCurl(curlCommand);
              }
            }}
          >
            <FiUpload />
            Import cURL
          </button>
        </div>
      </div>

      <div className="request-line">
        <select
          value={request.method}
          onChange={(e) => handleMethodChange(e.target.value)}
          className="method-select"
        >
          {methods.map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
        
        <input
          type="text"
          value={request.url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="Enter request URL"
          className="url-input"
        />
        
        <button
          className="btn btn-primary send-btn"
          onClick={() => onSendRequest(request)}
        >
          Send
        </button>
      </div>

      <div className="request-sections">
        <div className="section">
          <div className="section-header">
            <h4>Query Parameters</h4>
            <button className="btn btn-sm btn-secondary" onClick={addParam}>
              <FiPlus />
              Add
            </button>
          </div>
          <div className="params-list">
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
                  <FiMinus />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h4>Headers</h4>
            <button className="btn btn-sm btn-secondary" onClick={addHeader}>
              <FiPlus />
              Add
            </button>
          </div>
          <div className="headers-list">
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
                  <FiMinus />
                </button>
              </div>
            ))}
          </div>
        </div>

        {['POST', 'PUT', 'PATCH'].includes(request.method) && (
          <div className="section">
            <div className="section-header">
              <h4>Request Body</h4>
              <select
                value={request.bodyType}
                onChange={(e) => setRequest(prev => ({ ...prev, bodyType: e.target.value }))}
              >
                <option value="json">JSON</option>
                <option value="text">Text</option>
                <option value="xml">XML</option>
                <option value="form">Form Data</option>
              </select>
            </div>
            <div className="body-editor">
              <Editor
                height="200px"
                defaultLanguage={request.bodyType}
                value={request.body}
                onChange={handleBodyChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {savedRequests.length > 0 && (
        <div className="saved-requests">
          <h4>Saved Requests</h4>
          <div className="saved-list">
            {savedRequests.map(saved => (
              <div key={saved.id} className="saved-item">
                <span className="saved-name">{saved.name}</span>
                <span className="saved-method">{saved.method}</span>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => loadSavedRequest(saved)}
                >
                  Load
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSaveDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Save Request</h3>
              <button onClick={() => setShowSaveDialog(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Request Name</label>
                <input
                  type="text"
                  value={requestName}
                  onChange={(e) => setRequestName(e.target.value)}
                  placeholder="Enter request name"
                />
              </div>
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowSaveDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveRequest}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestBuilder;