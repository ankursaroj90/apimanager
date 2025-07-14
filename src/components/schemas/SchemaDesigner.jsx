import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiEye, FiPlus, FiMinus, FiCopy } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import schemaService from '../../services/schemaService';

const SchemaDesigner = () => {
  const { apiId, schemaId } = useParams();
  const navigate = useNavigate();
  const { schemas, addSchema, updateSchema } = useApp();

  const [schema, setSchema] = useState({
    id: '',
    apiId: apiId,
    name: '',
    type: 'object',
    description: '',
    properties: {},
    required: [],
    example: {},
  });

  const [properties, setProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('designer');
  const [jsonSchema, setJsonSchema] = useState('');
  const [exampleSchema, setExampleSchema] = useState(JSON.stringify(schema.example, null, 2));
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (schemaId && schemaId !== 'new') {
      const existingSchema = schemas.find(s => s.id === schemaId);
      if (existingSchema) {
        setSchema(existingSchema);
        setExampleSchema(existingSchema.example != null ? JSON.stringify(existingSchema.example, null, 2) : {});
        setProperties(Object.entries(existingSchema.properties || {}).map(([key, prop]) => ({
          id: uuidv4(),
          name: key,
          ...prop
        })));
        setJsonSchema(JSON.stringify(existingSchema, null, 2));
      }
    } else {
      const newSchema = {
        ...schema,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setSchema(newSchema);
      setJsonSchema(JSON.stringify(newSchema, null, 2));
    }
  }, [schemaId, schemas]);

  const handleInputChange = (field, value) => {
    setSchema(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString()
    }));
    setIsDirty(true);
  };

  const handlePropertyChange = (id, field, value) => {
    setProperties(prev => prev.map(prop => 
      prop.id === id ? { ...prop, [field]: value } : prop
    ));
    setIsDirty(true);
  };

  const addProperty = () => {
    const newProperty = {
      id: uuidv4(),
      name: '',
      type: 'string',
      description: '',
      required: false
    };
    setProperties(prev => [...prev, newProperty]);
  };

  const removeProperty = (id) => {
    setProperties(prev => prev.filter(prop => prop.id !== id));
    setIsDirty(true);
  };

  const handleSaveExampleSchema = (value) => {
    setExampleSchema(value); // update editor display
    try {
      const parsedSchema = JSON.parse(value);
      // update main schema's example
      setSchema(prev => ({
        ...prev,
        example: parsedSchema,
      }));
      // clear errors
      setErrors(prev => ({ ...prev, json: null }));
      
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        json: 'Invalid JSON format.',
      }));
    }
  };

  const handleJsonSchemaChange = (value) => {
    setJsonSchema(value);
    try {
      const parsedSchema = JSON.parse(value);
      setSchema(parsedSchema);
      
      // Update properties array
      if (parsedSchema.properties) {
        setProperties(Object.entries(parsedSchema.properties).map(([key, prop]) => ({
          id: uuidv4(),
          name: key,
          ...prop
        })));
      }
      
      setErrors(prev => ({ ...prev, json: null }));
      setIsDirty(true);
    } catch (error) {
      setErrors(prev => ({ ...prev, json: 'Invalid JSON format' }));
    }
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      const newErrors = {};
      if (!schema.name.trim()) newErrors.name = 'Schema name is required';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Build properties object from properties array
      const propertiesObj = {};
      const requiredFields = [];

      properties.forEach(prop => {
        if (prop.name) {
          const { id, name, required, ...propData } = prop;
          propertiesObj[name] = propData;
          propertiesObj[name].required= prop.required || false;
          if (required) {
            requiredFields.push(name);
          }
        }
      });



      const updatedSchema = {
        ...schema,
        properties: propertiesObj,
        required: requiredFields,
        example: schema.example,
      };

      if (schemaId && schemaId !== 'new') {
        updateSchema(updatedSchema);
        // Update existing schema in db
        try {
          await schemaService.updateSchema(apiId, schemaId, updatedSchema);
        } catch (error) {
          console.error('Error updating schema:', error);
          toast.error('Failed to update schema');
          return;
        }
        toast.success('Schema updated successfully');
      } else {
        addSchema(updatedSchema);

        // Create new schema to db
        try {
          await schemaService.createSchema(apiId, updatedSchema);
        } catch (error) {
          console.error('Error creating schema:', error);
          toast.error('Failed to create schema');
          return;
        }
        toast.success('Schema created successfully');
        navigate(`/apis/${apiId}/schemas/${updatedSchema.id}`);
      }

      setIsDirty(false);
      setErrors({});
    } catch (error) {
      toast.error('Failed to save schema');
      console.error('Save error:', error);
    }
  };

  const generateExample = () => {
    const example = {};
    properties.forEach(prop => {
      if (prop.name) {
        switch (prop.type) {
          case 'string':
            example[prop.name] = prop.example || 'string';
            break;
          case 'integer':
            example[prop.name] = prop.example || 0;
            break;
          case 'number':
            example[prop.name] = prop.example || 0.0;
            break;
          case 'boolean':
            example[prop.name] = prop.example || false;
            break;
          case 'array':
            example[prop.name] = prop.example || [];
            break;
          case 'object':
            example[prop.name] = prop.example || {};
            break;
          default:
            example[prop.name] = null;
        }
      }
    });
    
    handleInputChange('example', example);
    setActiveTab('preview');
  };

  return (
    <div className="schema-designer">
      <div className="designer-header">
        <div className="header-content">
          <div className="header-left">
            <h1>{schemaId === 'new' ? 'Create Schema' : 'Edit Schema'}</h1>
            {schema.name && <p>{schema.name}</p>}
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={generateExample}>
              <FiCopy />
              Generate Example
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
          className={`tab ${activeTab === 'designer' ? 'active' : ''}`}
          onClick={() => setActiveTab('designer')}
        >
          Designer
        </button>
        <button
          className={`tab ${activeTab === 'example' ? 'active' : ''}`}
          onClick={() => setActiveTab('example')}
        >
          Example Schema
        </button>
        <button
          className={`tab ${activeTab === 'json' ? 'active' : ''}`}
          onClick={() => setActiveTab('json')}
        >
          JSON Schema
        </button>
        {/* <button
          className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button> */}
      </div>

      <div className="designer-content">
        {activeTab === 'designer' && (
          <div className="schema-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="schemaName">Schema Name *</label>
                <input
                  id="schemaName"
                  type="text"
                  value={schema.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="User, Product, Order..."
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="schemaType">Type</label>
                <select
                  id="schemaType"
                  value={schema.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                >
                  <option value="object">Object</option>
                  <option value="array">Array</option>
                  <option value="string">String</option>
                  <option value="integer">Integer</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="schemaDescription">Description</label>
              <textarea
                id="schemaDescription"
                value={schema.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe this schema..."
                rows={3}
              />
            </div>

            {schema.type === 'object' && (
              <div className="properties-section">
                <div className="section-header">
                  <h3>Properties</h3>
                  <button className="btn btn-secondary" onClick={addProperty}>
                    <FiPlus />
                    Add Property
                  </button>
                </div>

                {properties.length === 0 ? (
                  <div className="empty-state">
                    <p>No properties defined</p>
                    <button className="btn btn-primary" onClick={addProperty}>
                      <FiPlus />
                      Add Your First Property
                    </button>
                  </div>
                ) : (
                  <div className="properties-list">
                    {properties.map(property => (
                      <div key={property.id} className="property-item">
                        <div className="property-grid">
                          <div className="form-group">
                            <label>Name</label>
                            <input
                              type="text"
                              value={property.name}
                              onChange={(e) => handlePropertyChange(property.id, 'name', e.target.value)}
                              placeholder="Property name"
                            />
                          </div>

                          <div className="form-group">
                            <label>Type</label>
                            <select
                              value={property.type}
                              onChange={(e) => handlePropertyChange(property.id, 'type', e.target.value)}
                            >
                              <option value="string">String</option>
                              <option value="integer">Integer</option>
                              <option value="number">Number</option>
                              <option value="boolean">Boolean</option>
                              <option value="array">Array</option>
                              <option value="object">Object</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label>Format</label>
                            <select
                              value={property.format || ''}
                              onChange={(e) => handlePropertyChange(property.id, 'format', e.target.value)}
                            >
                              <option value="">None</option>
                              <option value="date">Date</option>
                              <option value="date-time">Date-Time</option>
                              <option value="email">Email</option>
                              <option value="uri">URI</option>
                              <option value="uuid">UUID</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label>
                              <input
                                type="checkbox"
                                checked={property.required || false}
                                onChange={(e) => handlePropertyChange(property.id, 'required', e.target.checked)}
                              />
                              Required
                            </label>
                          </div>

                          <div className="form-group">
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => removeProperty(property.id)}
                            >
                              <FiMinus />
                            </button>
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Description</label>
                          <input
                            type="text"
                            value={property.description || ''}
                            onChange={(e) => handlePropertyChange(property.id, 'description', e.target.value)}
                            placeholder="Property description"
                          />
                        </div>

                        <div className="property-constraints">
                          {property.type === 'string' && (
                            <>
                              <div className="form-group">
                                <label>Min Length</label>
                                <input
                                  type="number"
                                  value={property.minLength || ''}
                                  onChange={(e) => handlePropertyChange(property.id, 'minLength', parseInt(e.target.value))}
                                />
                              </div>
                              <div className="form-group">
                                <label>Max Length</label>
                                <input
                                  type="number"
                                  value={property.maxLength || ''}
                                  onChange={(e) => handlePropertyChange(property.id, 'maxLength', parseInt(e.target.value))}
                                />
                              </div>
                            </>
                          )}

                          {(property.type === 'integer' || property.type === 'number') && (
                            <>
                              <div className="form-group">
                                <label>Minimum</label>
                                <input
                                  type="number"
                                  value={property.minimum || ''}
                                  onChange={(e) => handlePropertyChange(property.id, 'minimum', parseFloat(e.target.value))}
                                />
                              </div>
                              <div className="form-group">
                                <label>Maximum</label>
                                <input
                                  type="number"
                                  value={property.maximum || ''}
                                  onChange={(e) => handlePropertyChange(property.id, 'maximum', parseFloat(e.target.value))}
                                />
                              </div>
                            </>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Example</label>
                          <input
                            type="text"
                            value={property.example || ''}
                            onChange={(e) => handlePropertyChange(property.id, 'example', e.target.value)}
                            placeholder="Example value"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'example' && (
          <div className="json-editor">
            <div className="editor-toolbar">
              <span className="editor-label">Example Schema</span>
            </div>
            
            <Editor
              height="500px"
              defaultLanguage="json"
              value={exampleSchema}
              onChange={handleSaveExampleSchema}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                wordWrap: 'on',
                automaticLayout: true
              }}
            />
            
            {errors.json && (
              <div className="error-message">
                {errors.json}
              </div>
            )}
          </div>
        )}

        {activeTab === 'json' && (
          <div className="json-editor">
            <div className="editor-toolbar">
              <span className="editor-label">JSON Schema</span>
            </div>
            
            <Editor
              height="500px"
              defaultLanguage="json"
              value={jsonSchema}
              onChange={handleJsonSchemaChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                wordWrap: 'on',
                automaticLayout: true
              }}
            />
            
            {errors.json && (
              <div className="error-message">
                {errors.json}
              </div>
            )}
          </div>
        )}

        {/* {activeTab === 'preview' && (
          <div className="schema-preview">
            <div className="preview-sections">
              <div className="preview-section">
                <h3>Schema Definition</h3>
                <Editor
                  height="300px"
                  defaultLanguage="json"
                  value={JSON.stringify({
                    type: schema.type,
                    properties: schema.properties,
                    required: schema.required,
                    description: schema.description
                  }, null, 2)}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14
                  }}
                />
              </div>

              {schema.example && (
                <div className="preview-section">
                  <h3>Example</h3>
                  <Editor
                    height="300px"
                    defaultLanguage="json"
                    value={JSON.stringify(schema.example, null, 2)}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 14
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default SchemaDesigner;