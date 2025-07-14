import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiPlay, FiEye, FiDownload, FiUpload, FiCode, FiSettings } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import apiService from '../../services/apiService'; // Assuming you have an apiService for API calls

const ApiDesigner = () => {
  const { apiId } = useParams();
  const navigate = useNavigate();
  const { currentApi, setCurrentApi, updateApi, addApi, apis, endpoints, schemas} = useApp();
  
  const [api, setApi] = useState({
    id: '',
    name: '',
    description: '',
    version: '1.0.0',
    baseUrl: '',
    status: 'draft',
    tags: [],
    openApiSpec: {
      openapi: '3.0.0',
      info: {
        title: '',
        version: '1.0.0',
        description: ''
      },
      servers: [],
      paths: {},
      components: {
        schemas: {},
        responses: {},
        parameters: {}
      }
    }
  });

  const [activeTab, setActiveTab] = useState('general');
  const [specEditor, setSpecEditor] = useState('');
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (apiId && apiId !== 'new') {
      // Load existing API
      const existingApi = apis.find(a => a.id === apiId);
      if (existingApi) {
        setApi(existingApi);
        setSpecEditor(JSON.stringify(existingApi.openApiSpec, null, 2));
        setCurrentApi(existingApi);
      } else {
        toast.error('API not found');
        navigate('/apis');
      }
    } else {
      // New API
      const newApi = {
        ...api,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setApi(newApi);
      setSpecEditor(JSON.stringify(newApi.openApiSpec, null, 2));
    }
  }, [apiId, currentApi]);

  const handleInputChange = (field, value) => {
    setApi(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString()
    }));
    setIsDirty(true);
  };

  const handleSpecChange = (value) => {
    setSpecEditor(value);
    try {
      const parsedSpec = JSON.parse(value);
      setApi(prev => ({
        ...prev,
        openApiSpec: parsedSpec,
        updatedAt: new Date().toISOString()
      }));
      setErrors(prev => ({ ...prev, spec: null }));
      setIsDirty(true);
    } catch (error) {
      setErrors(prev => ({ ...prev, spec: 'Invalid JSON format' }));
    }
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      const newErrors = {};
      if (!api.name.trim()) newErrors.name = 'API name is required';
      if (!api.description.trim()) newErrors.description = 'Description is required';
      if (!api.baseUrl.trim()) newErrors.baseUrl = 'Base URL is required';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Update OpenAPI spec info
      const updatedApi = {
        ...api,
        endpoints: endpoints.filter(ep => ep.apiId === api.id) || [],
        schemas: schemas.filter(ep => ep.apiId === api.id) || [],
        openApiSpec: {
          ...api.openApiSpec,
          info: {
            ...api.openApiSpec.info,
            title: api.name,
            version: api.version,
            description: api.description
          },
          servers: [
            {
              url: api.baseUrl,
              description: 'API Server'
            }
          ]
        }
      };
      console.log('Updated API object:', updatedApi.id);
      console.log('Updated API object:', apiId);
      if (apiId && apiId !== 'new') {
        console.log('Updating API:', updatedApi);
        updateApi(updatedApi);
        const response = await apiService.updateApi(apiId, updatedApi);
        console.log('Update API response:', response);
        toast.success('API updated successfully');
        navigate(`/apis/${updatedApi.id}/endpoints`);
      } else {
        console.log('Creating API:', updatedApi);
        addApi(updatedApi);
        const response = await apiService.createApi(updatedApi);
        console.log('Create API response:', response);
        toast.success('API created successfully');
        navigate(`/apis/${updatedApi.id}/endpoints`);
      }

      setCurrentApi(updatedApi);
      setIsDirty(false);
      setErrors({});
    } catch (error) {
      toast.error('Failed to save API');
      console.error('Save error:', error);
    }
  };

  const handleTest = () => {
    navigate(`/apis/${api.id}/test`);
  };

  const handlePreview = () => {
    // Open OpenAPI spec in new tab
    const blob = new Blob([JSON.stringify(api.openApiSpec, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    const exportData = {
      ...api,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${api.name.toLowerCase().replace(/\s+/g, '-')}-api.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="api-designer">
      <div className="designer-header">
        <div className="header-content">
          <div className="header-left">
            <h1>{apiId === 'new' ? 'Create New API' : 'Edit API'}</h1>
            {api.name && <p>{api.name}</p>}
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={handlePreview}>
              <FiEye />
              Preview
            </button>
            <button className="btn btn-secondary" onClick={handleExport}>
              <FiDownload />
              Export
            </button>
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

      <div className="designer-tabs">
        <button
          className={`tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
        <button
          className={`tab ${activeTab === 'specification' ? 'active' : ''}`}
          onClick={() => setActiveTab('specification')}
        >
          OpenAPI Specification
        </button>
        <button
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="designer-content">
        {activeTab === 'general' && (
          <div className="general-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="apiName">API Name *</label>
                <input
                  id="apiName"
                  type="text"
                  value={api.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter API name"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="apiVersion">Version</label>
                <input
                  id="apiVersion"
                  type="text"
                  value={api.version}
                  onChange={(e) => handleInputChange('version', e.target.value)}
                  placeholder="1.0.0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="apiBaseUrl">Base URL *</label>
                <input
                  id="apiBaseUrl"
                  type="url"
                  value={api.baseUrl}
                  onChange={(e) => handleInputChange('baseUrl', e.target.value)}
                  placeholder="https://api.example.com/v1"
                  className={errors.baseUrl ? 'error' : ''}
                />
                {errors.baseUrl && <span className="error-text">{errors.baseUrl}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="apiStatus">Status</label>
                <select
                  id="apiStatus"
                  value={api.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="beta">Beta</option>
                  <option value="deprecated">Deprecated</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="apiDescription">Description *</label>
              <textarea
                id="apiDescription"
                value={api.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what this API does..."
                rows={4}
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="apiTags">Tags</label>
              <input
                id="apiTags"
                type="text"
                value={api.tags.join(', ')}
                onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
                placeholder="authentication, users, orders"
              />
              <small>Separate tags with commas</small>
            </div>
          </div>
        )}

        {activeTab === 'specification' && (
          <div className="specification-editor">
            <div className="editor-toolbar">
              <div className="toolbar-left">
                <span className="editor-label">OpenAPI 3.0 Specification</span>
              </div>
              <div className="toolbar-right">
                <button className="btn btn-sm btn-secondary">
                  <FiCode />
                  Format
                </button>
                <button className="btn btn-sm btn-secondary">
                  Validate
                </button>
              </div>
            </div>
            
            <div className="editor-container">
              <Editor
                height="500px"
                defaultLanguage="json"
                value={specEditor}
                onChange={handleSpecChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true
                }}
              />
            </div>
            
            {errors.spec && (
              <div className="error-message">
                {errors.spec}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-form">
            <div className="settings-section">
              <h3>API Configuration</h3>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={api.settings?.validateRequests || false}
                    onChange={(e) => handleInputChange('settings', {
                      ...api.settings,
                      validateRequests: e.target.checked
                    })}
                  />
                  Validate incoming requests
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={api.settings?.generateMocks || false}
                    onChange={(e) => handleInputChange('settings', {
                      ...api.settings,
                      generateMocks: e.target.checked
                    })}
                  />
                  Generate mock responses
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiDesigner;