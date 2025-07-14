import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiPlus, FiMinus, FiEye, FiEyeOff } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

const EnvironmentEditor = ({ environment, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    baseUrl: '',
    variables: {}
  });
  const [variables, setVariables] = useState([]);
  const [showSecrets, setShowSecrets] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (environment) {
      setFormData(environment);
      const varsArray = Object.entries(environment.variables || {}).map(([key, value]) => ({
        id: uuidv4(),
        key,
        value,
        isSecret: key.toLowerCase().includes('key') || key.toLowerCase().includes('token') || key.toLowerCase().includes('password')
      }));
      setVariables(varsArray);
    } else {
      setFormData({
        id: uuidv4(),
        name: '',
        baseUrl: '',
        variables: {},
        active: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setVariables([]);
    }
  }, [environment]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleVariableChange = (id, field, value) => {
    setVariables(prev => prev.map(variable =>
      variable.id === id ? { ...variable, [field]: value } : variable
    ));
  };

  const addVariable = () => {
    setVariables(prev => [...prev, {
      id: uuidv4(),
      key: '',
      value: '',
      isSecret: false
    }]);
  };

  const removeVariable = (id) => {
    setVariables(prev => prev.filter(variable => variable.id !== id));
  };

  const toggleSecretVisibility = (id) => {
    setShowSecrets(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Environment name is required';
    if (!formData.baseUrl.trim()) newErrors.baseUrl = 'Base URL is required';
    
    // Validate URL format
    try {
      new URL(formData.baseUrl);
    } catch {
      newErrors.baseUrl = 'Please enter a valid URL';
    }

    // Validate variables
    const variableKeys = new Set();
    variables.forEach((variable, index) => {
      if (variable.key && variableKeys.has(variable.key)) {
        newErrors[`variable-${index}`] = 'Duplicate variable name';
      }
      if (variable.key) {
        variableKeys.add(variable.key);
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Convert variables array to object
    const variablesObj = {};
    variables.forEach(variable => {
      if (variable.key && variable.value) {
        variablesObj[variable.key] = variable.value;
      }
    });

    const environmentData = {
      ...formData,
      variables: variablesObj
    };

    onSave(environmentData);
  };

  const presetVariables = [
    { key: 'apiKey', value: '', isSecret: true },
    { key: 'authToken', value: '', isSecret: true },
    { key: 'clientId', value: '', isSecret: false },
    { key: 'version', value: 'v1', isSecret: false },
    { key: 'timeout', value: '5000', isSecret: false }
  ];

  const addPresetVariable = (preset) => {
    setVariables(prev => [...prev, {
      id: uuidv4(),
      ...preset
    }]);
  };

  return (
    <div className="environment-editor">
      <div className="editor-header">
        <h2>{environment ? 'Edit Environment' : 'Create Environment'}</h2>
        <button className="modal-close" onClick={onCancel}>
          <FiX />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="editor-content">
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="envName">Environment Name *</label>
              <input
                id="envName"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Development, Staging, Production..."
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="envBaseUrl">Base URL *</label>
              <input
                id="envBaseUrl"
                type="url"
                value={formData.baseUrl}
                onChange={(e) => handleInputChange('baseUrl', e.target.value)}
                placeholder="https://api.example.com"
                className={errors.baseUrl ? 'error' : ''}
              />
              {errors.baseUrl && <span className="error-text">{errors.baseUrl}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="envDescription">Description</label>
            <textarea
              id="envDescription"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Optional description for this environment..."
              rows={3}
            />
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>Environment Variables</h3>
            <div className="section-actions">
              <button type="button" className="btn btn-sm btn-secondary" onClick={addVariable}>
                <FiPlus />
                Add Variable
              </button>
            </div>
          </div>

          {presetVariables.length > 0 && variables.length === 0 && (
            <div className="preset-variables">
              <p>Quick add common variables:</p>
              <div className="preset-buttons">
                {presetVariables.map((preset, index) => (
                  <button
                    key={index}
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => addPresetVariable(preset)}
                  >
                    {preset.key}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="variables-list">
            {variables.map((variable, index) => (
              <div key={variable.id} className="variable-row">
                <div className="variable-inputs">
                  <input
                    type="text"
                    value={variable.key}
                    onChange={(e) => handleVariableChange(variable.id, 'key', e.target.value)}
                    placeholder="Variable name"
                    className={errors[`variable-${index}`] ? 'error' : ''}
                  />
                  
                  <div className="value-input-container">
                    <input
                      type={variable.isSecret && !showSecrets[variable.id] ? 'password' : 'text'}
                      value={variable.value}
                      onChange={(e) => handleVariableChange(variable.id, 'value', e.target.value)}
                      placeholder="Variable value"
                    />
                    {variable.isSecret && (
                      <button
                        type="button"
                        className="visibility-toggle"
                        onClick={() => toggleSecretVisibility(variable.id)}
                      >
                        {showSecrets[variable.id] ? <FiEyeOff /> : <FiEye />}
                      </button>
                    )}
                  </div>
                </div>

                <div className="variable-controls">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={variable.isSecret}
                      onChange={(e) => handleVariableChange(variable.id, 'isSecret', e.target.checked)}
                    />
                    Secret
                  </label>
                  
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => removeVariable(variable.id)}
                  >
                    <FiMinus />
                  </button>
                </div>

                {errors[`variable-${index}`] && (
                  <span className="error-text">{errors[`variable-${index}`]}</span>
                )}
              </div>
            ))}
          </div>

          {variables.length === 0 && (
            <div className="empty-variables">
              <p>No variables defined. Add variables to customize your environment.</p>
            </div>
          )}
        </div>

        <div className="editor-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <FiSave />
            {environment ? 'Update' : 'Create'} Environment
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnvironmentEditor;