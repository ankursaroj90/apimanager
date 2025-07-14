import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiCopy, FiPackage } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import SearchBox from '../common/SearchBox';
import ComponentEditor from './ComponentEditor';
import ComponentCard from './ComponentCard';
import { useSearch } from '../../hooks/useSearch';
import toast from 'react-hot-toast';

const ComponentsLibrary = () => {
  const { apiId } = useParams();
  const { components, addComponent, updateComponent, deleteComponent, currentApi } = useApp();
  const [showEditor, setShowEditor] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);

  const apiComponents = components.filter(comp => comp.apiId === apiId);

  const {
    searchTerm,
    filteredData: filteredComponents,
    handleSearchChange
  } = useSearch({
    data: apiComponents,
    searchFields: ['name', 'description', 'type'],
    minSearchLength: 0
  });

  const handleCreateComponent = () => {
    setEditingComponent(null);
    setShowEditor(true);
  };

  const handleEditComponent = (component) => {
    setEditingComponent(component);
    setShowEditor(true);
  };

  const handleDeleteComponent = (component) => {
    if (window.confirm(`Are you sure you want to delete "${component.name}"?`)) {
      deleteComponent(component.id);
      toast.success('Component deleted successfully');
    }
  };

  const handleSaveComponent = (componentData) => {
    if (editingComponent) {
      updateComponent({ ...editingComponent, ...componentData });
      toast.success('Component updated successfully');
    } else {
      addComponent({ ...componentData, apiId });
      toast.success('Component created successfully');
    }
    setShowEditor(false);
    setEditingComponent(null);
  };

  const handleCloneComponent = (component) => {
    const clonedComponent = {
      ...component,
      id: Date.now().toString(),
      name: `${component.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    addComponent(clonedComponent);
    toast.success('Component cloned successfully');
  };

  const componentTypes = [
    { value: 'schemas', label: 'Schemas' },
    { value: 'responses', label: 'Responses' },
    { value: 'parameters', label: 'Parameters' },
    { value: 'examples', label: 'Examples' },
    { value: 'requestBodies', label: 'Request Bodies' },
    { value: 'headers', label: 'Headers' },
    { value: 'securitySchemes', label: 'Security Schemes' }
  ];

  return (
    <div className="components-library">
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Components Library</h1>
            <p>{currentApi ? `${currentApi.name} API` : 'Reusable API Components'}</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={handleCreateComponent}>
              <FiPlus />
              Add Component
            </button>
          </div>
        </div>
      </div>

      <div className="components-controls">
        <SearchBox
          placeholder="Search components..."
          value={searchTerm}
          onSearch={handleSearchChange}
          showFilters={true}
          filters={[
            {
              key: 'type',
              label: 'Type',
              type: 'select',
              options: componentTypes
            }
          ]}
        />
      </div>

      <div className="components-stats">
        {componentTypes.map(type => {
          const count = filteredComponents.filter(comp => comp.type === type.value).length;
          return (
            <div key={type.value} className="stat-card">
              <div className="stat-icon">
                <FiPackage />
              </div>
              <div className="stat-content">
                <div className="stat-value">{count}</div>
                <div className="stat-label">{type.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="components-grid">
        {filteredComponents.map(component => (
          <ComponentCard
            key={component.id}
            component={component}
            onEdit={handleEditComponent}
            onDelete={handleDeleteComponent}
            onClone={handleCloneComponent}
          />
        ))}
      </div>

      {filteredComponents.length === 0 && (
        <div className="empty-state">
          <FiPackage className="empty-icon" />
          <h3>No components found</h3>
          <p>
            {searchTerm
              ? 'No components match your search criteria'
              : 'Create reusable components to improve your API design'
            }
          </p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={handleCreateComponent}>
              <FiPlus />
              Create Your First Component
            </button>
          )}
        </div>
      )}

      {showEditor && (
        <div className="modal-overlay">
          <div className="modal large">
            <ComponentEditor
              component={editingComponent}
              onSave={handleSaveComponent}
              onCancel={() => {
                setShowEditor(false);
                setEditingComponent(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentsLibrary;