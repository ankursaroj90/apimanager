import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCopy, FiDownload, FiEye, FiCode } from 'react-icons/fi';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import { useApp } from '../../context/AppContext';

const SchemaViewer = () => {

  const { schemas} = useApp();
  const { apiId, schemaId } = useParams();

  const schema = schemas.find(s => s.apiId === apiId && s.id === schemaId) || {};

  const [activeTab, setActiveTab] = useState('visual');

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    toast.success('Schema copied to clipboard');
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(schema, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${schema.name || 'schema'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderPropertyType = (property) => {
    let typeDisplay = property.type;
    if (property.format) {
      typeDisplay += ` (${property.format})`;
    }
    if (property.enum) {
      typeDisplay += ` [enum]`;
    }
    return typeDisplay;
  };

  return (
    <div className="schema-viewer">
      <div className="viewer-header">
        <div className="schema-info">
          <h2>{schema.name}</h2>
          {schema.description && (
            <p className="schema-description">{schema.description}</p>
          )}
        </div>
        
        <div className="viewer-actions">
          <button className="btn btn-secondary" onClick={handleCopy}>
            <FiCopy />
            Copy
          </button>
          <button className="btn btn-secondary" onClick={handleDownload}>
            <FiDownload />
            Download
          </button>
        </div>
      </div>

      <div className="viewer-tabs">
        <button
          className={`tab ${activeTab === 'visual' ? 'active' : ''}`}
          onClick={() => setActiveTab('visual')}
        >
          <FiEye />
          Visual
        </button>
        <button
          className={`tab ${activeTab === 'json' ? 'active' : ''}`}
          onClick={() => setActiveTab('json')}
        >
          <FiCode />
          JSON
        </button>
      </div>

      <div className="viewer-content">
        {activeTab === 'visual' && (
          <div className="visual-schema">
            <div className="schema-metadata">
              <div className="metadata-grid">
                <div className="metadata-item">
                  <span className="label">Type:</span>
                  <span className="value">{schema.type}</span>
                </div>
                {schema.required && schema.required.length > 0 && (
                  <div className="metadata-item">
                    <span className="label">Required Fields:</span>
                    <span className="value">{schema.required.length}</span>
                  </div>
                )}
              </div>
            </div>

            {schema.properties && (
              <div className="properties-table">
                <h4>Field Details</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Required</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(schema.properties).map(([key, property]) => (
                      <tr key={key}>
                        <td className="property-name">{key}</td>
                        <td className="property-type">
                          <span className="type-badge">
                            {renderPropertyType(property)}
                          </span>
                        </td>
                        <td className="property-required">
                          {schema.required?.includes(key) ? (
                            <span className="required-badge">Yes</span>
                          ) : (
                            <span className="optional-badge">No</span>
                          )}
                        </td>
                        <td className="property-description">
                          {property.description || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {schema.example && (
              <div className="schema-example">
                <h4>Example</h4>
                <Editor
                  height="200px"
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
        )}

        {activeTab === 'json' && (
          <div className="json-schema">
            <Editor
              height="500px"
              defaultLanguage="json"
              value={JSON.stringify(schema, null, 2)}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemaViewer;