import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiGlobe, FiCheck, FiCopy } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import environmentService from '../../services/environmentService'; // Assuming you have a service for environment management

const EnvironmentManager = () => {
  const { 
    environments, 
    currentEnvironment, 
    setCurrentEnvironment,
    addEnvironment, 
    updateEnvironment, 
    deleteEnvironment 
  } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [editingEnvironment, setEditingEnvironment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    baseUrl: '',
    variables: {}
  });

  const [newVariable, setNewVariable] = useState({ key: '', value: '' });

  const handleCreateEnvironment = () => {
    setFormData({ name: '', baseUrl: '', variables: {} });
    setEditingEnvironment(null);
    setShowForm(true);
  };

  const handleEditEnvironment = (env) => {
    setFormData({
      name: env.name,
      baseUrl: env.baseUrl,
      variables: { ...env.variables }
    });
    setEditingEnvironment(env);
    setShowForm(true);
  };

  const handleDeleteEnvironment = (env) => {
    if (env.id === currentEnvironment) {
      toast.error('Cannot delete the active environment');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete "${env.name}"?`)) {
      deleteEnvironment(env.id);
      // Call the service to delete the environment
      environmentService.deleteEnvironment(env.id)
      toast.success('Environment deleted successfully');
    }
  };

  const handleSetActive = (env) => {
    setCurrentEnvironment(env.id);
    toast.success(`Switched to ${env.name} environment`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Environment name is required');
      return;
    }
    
    if (!formData.baseUrl.trim()) {
      toast.error('Base URL is required');
      return;
    }

    const environmentData = {
      ...formData,
      id: editingEnvironment?.id || uuidv4(),
      active: editingEnvironment?.active || false,
      createdAt: editingEnvironment?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingEnvironment) {
      updateEnvironment(environmentData);
      //call the service to update the environment
      environmentService.updateEnvironment(editingEnvironment.id, environmentData)
      toast.success('Environment updated successfully');
    } else {
      addEnvironment(environmentData);
      //call the service to create a new environment
      environmentService.createEnvironment(environmentData)
      toast.success('Environment created successfully');
    }

    setShowForm(false);
    setEditingEnvironment(null);
  };

  const handleAddVariable = () => {
    if (newVariable.key && newVariable.value) {
      setFormData(prev => ({
        ...prev,
        variables: {
          ...prev.variables,
          [newVariable.key]: newVariable.value
        }
      }));
      setNewVariable({ key: '', value: '' });
    }
  };

  const handleRemoveVariable = (key) => {
    const newVariables = { ...formData.variables };
    delete newVariables[key];
    setFormData(prev => ({ ...prev, variables: newVariables }));
  };

  const duplicateEnvironment = (env) => {
    const duplicatedEnv = {
      ...env,
      id: uuidv4(),
      name: `${env.name} (Copy)`,
      active: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    addEnvironment(duplicatedEnv);
    // Call the service to add the environment
    environmentService.createEnvironment(duplicatedEnv);
    toast.success('Environment duplicated successfully');
  };

  return (
    <div className="environment-manager">
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Environment Management</h1>
            <p>Manage different environments for your API testing</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={handleCreateEnvironment}>
              <FiPlus />
              Add Environment
            </button>
          </div>
        </div>
      </div>

      <div className="environments-grid">
        {environments.map(env => (
          <div 
            key={env.id} 
            className={`environment-card ${env.id === currentEnvironment ? 'active' : ''}`}
          >
            <div className="environment-header">
              <div className="environment-info">
                <h3 className="environment-name">
                  {env.name}
                  {env.id === currentEnvironment && (
                    <span className="active-badge">
                      <FiCheck />
                      Active
                    </span>
                  )}
                </h3>
                <div className="environment-url">{env.baseUrl}</div>
              </div>
              
              <div className="environment-actions">
                {env.id !== currentEnvironment && (
                  <button
                    className="action-btn"
                    onClick={() => handleSetActive(env)}
                    title="Set as active"
                  >
                    <FiGlobe />
                  </button>
                )}
                <button
                  className="action-btn"
                  onClick={() => duplicateEnvironment(env)}
                  title="Duplicate environment"
                >
                  <FiCopy />
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleEditEnvironment(env)}
                  title="Edit environment"
                >
                  <FiEdit />
                </button>
                <button
                  className="action-btn danger"
                  onClick={() => handleDeleteEnvironment(env)}
                  title="Delete environment"
                  disabled={env.id === currentEnvironment}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <div className="environment-variables">
              <h4>Variables ({Object.keys(env.variables || {}).length})</h4>
              {Object.keys(env.variables || {}).length > 0 ? (
                <div className="variables-list">
                  {Object.entries(env.variables).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="variable-item">
                      <span className="variable-key">{key}:</span>
                      <span className="variable-value">
                        {key.toLowerCase().includes('key') || key.toLowerCase().includes('token') 
                          ? '••••••••' 
                          : value
                        }
                      </span>
                    </div>
                  ))}
                  {Object.keys(env.variables).length > 3 && (
                    <div className="variable-more">
                      +{Object.keys(env.variables).length - 3} more
                    </div>
                  )}
                </div>
              ) : (
                <p className="no-variables">No variables defined</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingEnvironment ? 'Edit Environment' : 'Create Environment'}</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-content">
              <div className="form-group">
                <label htmlFor="envName">Environment Name *</label>
                <input
                  id="envName"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Development, Staging, Production..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="envBaseUrl">Base URL *</label>
                <input
                  id="envBaseUrl"
                  type="url"
                  value={formData.baseUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, baseUrl: e.target.value }))}
                  placeholder="https://api.example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Environment Variables</label>
                
                <div className="variable-input">
                  <input
                    type="text"
                    value={newVariable.key}
                    onChange={(e) => setNewVariable(prev => ({ ...prev, key: e.target.value }))}
                    placeholder="Variable name"
                  />
                  <input
                    type="text"
                    value={newVariable.value}
                    onChange={(e) => setNewVariable(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="Variable value"
                  />
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={handleAddVariable}
                  >
                    Add
                  </button>
                </div>

                {Object.keys(formData.variables).length > 0 && (
                  <div className="variables-table">
                    <div className="table-header">
                      <span>Name</span>
                      <span>Value</span>
                      <span>Actions</span>
                    </div>
                    {Object.entries(formData.variables).map(([key, value]) => (
                      <div key={key} className="table-row">
                        <span className="variable-name">{key}</span>
                        <span className="variable-value">{value}</span>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveVariable(key)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEnvironment ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentManager;