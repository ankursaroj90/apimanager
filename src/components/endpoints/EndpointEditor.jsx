import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiPlay, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import endpointService from '../../services/endpointService';

const EndpointEditor = () => {
  const { apiId, endpointId } = useParams();
  const navigate = useNavigate();
  const { endpoints, addEndpoint, updateEndpoint, currentApi } = useApp();

  const [endpoint, setEndpoint] = useState({
    id: '',
    apiId: currentApi.id,
    name: '',
    method: 'GET',
    path: '',
    summary: '',
    description: '',
    parameters: [],
    requestBody: null,
    responses: {
      '200': {
        description: 'Success',
        content: {
          'application/json': {
            schema: { type: 'object' }
          }
        }
      }
    },
    tags: [],
    operationId: '',
    security: []
  });

  const [activeTab, setActiveTab] = useState('general');
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (endpointId && endpointId !== 'new') {
      const existingEndpoint = endpoints.find(ep => ep.id === endpointId);
      if (existingEndpoint) {
        setEndpoint(existingEndpoint);
      }
    } else {
      setEndpoint(prev => ({
        ...prev,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
    }
  }, [endpointId, endpoints]);

  const handleInputChange = (field, value) => {
    setEndpoint(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString()
    }));
    setIsDirty(true);
  };

  const handleParameterChange = (index, field, value) => {
    const newParameters = [...endpoint.parameters];
    newParameters[index] = { ...newParameters[index], [field]: value };
    handleInputChange('parameters', newParameters);
  };

  const addParameter = () => {
    const newParameter = {
      id: uuidv4(),
      name: '',
      in: 'query',
      type: 'string',
      required: false,
      description: ''
    };
    handleInputChange('parameters', [...endpoint.parameters, newParameter]);
  };

  const removeParameter = (index) => {
    const newParameters = endpoint.parameters.filter((_, i) => i !== index);
    handleInputChange('parameters', newParameters);
  };

  const addResponse = () => {
    const statusCode = prompt('Enter status code (e.g., 201, 400, 404):');
    if (statusCode && !endpoint.responses[statusCode]) {
      const newResponses = {
        ...endpoint.responses,
        [statusCode]: {
          description: '',
          content: {
            'application/json': {
              schema: { type: 'object' }
            }
          }
        }
      };
      handleInputChange('responses', newResponses);
    }
  };

  const removeResponse = (statusCode) => {
    const newResponses = { ...endpoint.responses };
    delete newResponses[statusCode];
    handleInputChange('responses', newResponses);
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      const newErrors = {};
      if (!endpoint.name.trim()) newErrors.name = 'Endpoint name is required';
      if (!endpoint.path.trim()) newErrors.path = 'Path is required';
      if (!endpoint.path.startsWith('/')) newErrors.path = 'Path must start with /';
  
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
  
      // Generate operationId if not provided
      const operationId = endpoint.operationId || 
        `${endpoint.method.toLowerCase()}${endpoint.path.replace(/[^a-zA-Z0-9]/g, '')}`;
  
      const updatedEndpoint = {
        ...endpoint,
        operationId,
      };
  
      if (endpointId && endpointId !== 'new') {
        // Update existing endpoint
        toast.success('Updating endpoint...');
        await endpointService.updateEndpoint(apiId, endpointId, updatedEndpoint);
        // Optionally, refresh or update local state here
        // dispatch({ type: 'UPDATE_ENDPOINT', payload: { ...updatedEndpoint, id: endpointId } });
        toast.success('Endpoint updated successfully');
      } else {
        addEndpoint(updateEndpoint);       
        const createdEndpoint = await endpointService.createEndpoint(apiId, updatedEndpoint);
        // The API likely returns the created object, including its id
        toast.success('Endpoint created successfully');
  
        // Navigate to new endpoint's page with its ID
        // Ensure `createdEndpoint.id` is available
        if (createdEndpoint && createdEndpoint.id) {
          navigate(`/apis/${apiId}/endpoints/${createdEndpoint.id}`);
        }
      }
  
      setIsDirty(false);
      setErrors({});
    } catch (error) {
      toast.error('Failed to save endpoint');
      toast.error(error.message || 'An error occurred while saving the endpoint');
      console.error('Save error:', error);
    }
  };

  const handleTest = () => {
    navigate(`/request?endpoint=${endpoint.id}`);
  };

  return (
    <div className="endpoint-editor">
      <div className="editor-header">
        <div className="header-content">
          <div className="header-left">
            <h1>{endpointId === 'new' ? 'Create Endpoint' : 'Edit Endpoint'}</h1>
            {endpoint.name && <p>{endpoint.method} {endpoint.path}</p>}
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={handleTest}>
              <FiPlay />
              Test
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleSave}
              disabled={!isDirty}
            >
              <FiSave />
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="editor-tabs">
        <button
          className={`tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
        <button
          className={`tab ${activeTab === 'parameters' ? 'active' : ''}`}
          onClick={() => setActiveTab('parameters')}
        >
          Parameters
        </button>
        <button
          className={`tab ${activeTab === 'request' ? 'active' : ''}`}
          onClick={() => setActiveTab('request')}
        >
          Request Body
        </button>
        <button
          className={`tab ${activeTab === 'responses' ? 'active' : ''}`}
          onClick={() => setActiveTab('responses')}
        >
          Responses
        </button>
      </div>

      <div className="editor-content">
        {activeTab === 'general' && (
          <div className="general-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="endpointName">Name *</label>
                <input
                  id="endpointName"
                  type="text"
                  value={endpoint.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Get user by ID"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="endpointMethod">HTTP Method</label>
                <select
                  id="endpointMethod"
                  value={endpoint.method}
                  onChange={(e) => handleInputChange('method', e.target.value)}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="endpointPath">Path *</label>
                <input
                  id="endpointPath"
                  type="text"
                  value={endpoint.path}
                  onChange={(e) => handleInputChange('path', e.target.value)}
                  placeholder="/users/{id}"
                  className={errors.path ? 'error' : ''}
                />
                {errors.path && <span className="error-text">{errors.path}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="operationId">Operation ID</label>
                <input
                  id="operationId"
                  type="text"
                  value={endpoint.operationId}
                  onChange={(e) => handleInputChange('operationId', e.target.value)}
                  placeholder="getUserById"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="endpointSummary">Summary</label>
              <input
                id="endpointSummary"
                type="text"
                value={endpoint.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                placeholder="Retrieve user information by ID"
              />
            </div>

            <div className="form-group">
              <label htmlFor="endpointDescription">Description</label>
              <textarea
                id="endpointDescription"
                value={endpoint.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed description of the endpoint..."
                rows={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endpointTags">Tags</label>
              <input
                id="endpointTags"
                type="text"
                value={endpoint.tags.join(', ')}
                onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
                placeholder="users, authentication"
              />
              <small>Separate tags with commas</small>
            </div>
          </div>
        )}

        {activeTab === 'parameters' && (
          <div className="parameters-form">
            <div className="section-header">
              <h3>Parameters</h3>
              <button className="btn btn-secondary" onClick={addParameter}>
                <FiPlus />
                Add Parameter
              </button>
            </div>

            {endpoint.parameters.length === 0 ? (
              <div className="empty-state">
                <p>No parameters defined</p>
                <button className="btn btn-primary" onClick={addParameter}>
                  <FiPlus />
                  Add Your First Parameter
                </button>
              </div>
            ) : (
              <div className="parameters-list">
                {endpoint.parameters.map((param, index) => (
                  <div key={param.id || index} className="parameter-item">
                    <div className="parameter-grid">
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          value={param.name}
                          onChange={(e) => handleParameterChange(index, 'name', e.target.value)}
                          placeholder="Parameter name"
                        />
                      </div>

                      <div className="form-group">
                        <label>Location</label>
                        <select
                          value={param.in}
                          onChange={(e) => handleParameterChange(index, 'in', e.target.value)}
                        >
                          <option value="query">Query</option>
                          <option value="path">Path</option>
                          <option value="header">Header</option>
                          <option value="cookie">Cookie</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Type</label>
                        <select
                          value={param.type}
                          onChange={(e) => handleParameterChange(index, 'type', e.target.value)}
                        >
                          <option value="string">String</option>
                          <option value="integer">Integer</option>
                          <option value="number">Number</option>
                          <option value="boolean">Boolean</option>
                          <option value="array">Array</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={param.required || false}
                            onChange={(e) => handleParameterChange(index, 'required', e.target.checked)}
                          />
                          Required
                        </label>
                      </div>

                      <div className="form-group">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeParameter(index)}
                        >
                          <FiMinus />
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <input
                        type="text"
                        value={param.description}
                        onChange={(e) => handleParameterChange(index, 'description', e.target.value)}
                        placeholder="Parameter description"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'request' && (
          <div className="request-body-form">
            <div className="section-header">
              <h3>Request Body</h3>
              <label>
                <input
                  type="checkbox"
                  checked={!!endpoint.requestBody}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleInputChange('requestBody', {
                        required: true,
                        content: {
                          'application/json': {
                            schema: { type: 'object' }
                          }
                        }
                      });
                    } else {
                      handleInputChange('requestBody', null);
                    }
                  }}
                />
                Has request body
              </label>
            </div>

            {endpoint.requestBody && (
              <div className="request-body-content">
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={endpoint.requestBody.required || false}
                      onChange={(e) => handleInputChange('requestBody', {
                        ...endpoint.requestBody,
                        required: e.target.checked
                      })}
                    />
                    Required
                  </label>
                </div>

                <div className="form-group">
                  <label>Schema (JSON)</label>
                  <Editor
                    height="200px"
                    defaultLanguage="json"
                    value={JSON.stringify(endpoint.requestBody.content['application/json'].schema, null, 2)}
                    onChange={(value) => {
                      try {
                        const schema = JSON.parse(value);
                        handleInputChange('requestBody', {
                          ...endpoint.requestBody,
                          content: {
                            'application/json': { schema }
                          }
                        });
                      } catch (error) {
                        // Handle JSON parse error
                      }
                    }}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'responses' && (
          <div className="responses-form">
            <div className="section-header">
              <h3>Responses</h3>
              <button className="btn btn-secondary" onClick={addResponse}>
                <FiPlus />
                Add Response
              </button>
            </div>

            <div className="responses-list">
              {Object.entries(endpoint.responses).map(([statusCode, response]) => (
                <div key={statusCode} className="response-item">
                  <div className="response-header">
                    <span className="status-code">{statusCode}</span>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeResponse(statusCode)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <input
                      type="text"
                      value={response.description}
                      onChange={(e) => {
                        const newResponses = {
                          ...endpoint.responses,
                          [statusCode]: {
                            ...response,
                            description: e.target.value
                          }
                        };
                        handleInputChange('responses', newResponses);
                      }}
                      placeholder="Response description"
                    />
                  </div>

                  <div className="form-group">
                    <label>Schema (JSON)</label>
                    <Editor
                      height="150px"
                      defaultLanguage="json"
                      value={JSON.stringify(response.content?.['application/json']?.schema || {}, null, 2)}
                      onChange={(value) => {
                        try {
                          const schema = JSON.parse(value);
                          const newResponses = {
                            ...endpoint.responses,
                            [statusCode]: {
                              ...response,
                              content: {
                                'application/json': { schema }
                              }
                            }
                          };
                          handleInputChange('responses', newResponses);
                        } catch (error) {
                          // Handle JSON parse error
                        }
                      }}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EndpointEditor;