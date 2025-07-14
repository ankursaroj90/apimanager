import React, { useState, useEffect } from 'react';
import { FiSave, FiX } from 'react-icons/fi';
import Editor from '@monaco-editor/react';
import { v4 as uuidv4 } from 'uuid';

const ComponentEditor = ({ component, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'schemas',
    description: '',
    specification: {}
  });
  const [specEditor, setSpecEditor] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (component) {
      setFormData(component);
      setSpecEditor(JSON.stringify(component.specification || {}, null, 2));
    } else {
      const newComponent = {
        id: uuidv4(),
        name: '',
        type: 'schemas',
        description: '',
        specification: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setFormData(newComponent);
      setSpecEditor('{}');
    }
  }, [component]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleSpecChange = (value) => {
    setSpecEditor(value);
    try {
      const parsedSpec = JSON.parse(value);
      setFormData(prev => ({
        ...prev,
        specification: parsedSpec
      }));
      setErrors(prev => ({ ...prev, spec: null }));
    } catch (error) {
      setErrors(prev => ({ ...prev, spec: 'Invalid JSON format' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Component name is required';
    if (!formData.type) newErrors.type = 'Component type is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  const componentTypes = [
    { value: 'schemas', label: 'Schema' },
    { value: 'responses', label: 'Response' },
    { value: 'parameters', label: 'Parameter' },
    { value: 'examples', label: 'Example' },
    { value: 'requestBodies', label: 'Request Body' },
    { value: 'headers', label: 'Header' },
    { value: 'securitySchemes', label: 'Security Scheme' }
  ];

  const getSpecTemplate = (type) => {
    const templates = {
      schemas: {
        type: 'object',
        properties: {},
        required: []
      },
      responses: {
        description: '',
        content: {
          'application/json': {
            schema: {
              type: 'object'
            }
          }
        }
      },
      parameters: {
        name: '',
        in: 'query',
        description: '',
        required: false,
        schema: {
          type: 'string'
        }
      },
      examples: {
        summary: '',
        description: '',
        value: {}
      },
      requestBodies: {
        description: '',
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object'
            }
          }
        }
      },
      headers: {
        description: '',
        schema: {
          type: 'string'
        }
      },
      securitySchemes: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key'
      }
    };
    return templates[type] || {};
  };

  const handleTypeChange = (newType) => {
    handleInputChange('type', newType);
    const template = getSpecTemplate(newType);
    setSpecEditor(JSON.stringify(template, null, 2));
    handleInputChange('specification', template);
  };

  return (
    <div className="component-editor">
      <div className="editor-header">
        <h2>{component ? 'Edit Component' : 'Create Component'}</h2>
        <button className="modal-close" onClick={onCancel}>
          <FiX />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="editor-content">
        <div className="form-section">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="componentName">Name *</label>
              <input
                id="componentName"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="User Schema, Error Response, etc."
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="componentType">Type *</label>
              <select
                id="componentType"
                value={formData.type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className={errors.type ? 'error' : ''}
              >
                {componentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && <span className="error-text">{errors.type}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="componentDescription">Description</label>
            <textarea
              id="componentDescription"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe this component..."
              rows={3}
            />
          </div>
        </div>

        <div className="spec-section">
          <div className="section-header">
            <h4>Specification</h4>
            <small>Define the OpenAPI specification for this component</small>
          </div>
          
          <div className="spec-editor">
            <Editor
              height="400px"
              defaultLanguage="json"
              value={specEditor}
              onChange={handleSpecChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                lineNumbers: 'on',
                folding: true
              }}
            />
            {errors.spec && (
              <div className="error-message">
                {errors.spec}
              </div>
            )}
          </div>
        </div>

        <div className="editor-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <FiSave />
            {component ? 'Update' : 'Create'} Component
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComponentEditor;