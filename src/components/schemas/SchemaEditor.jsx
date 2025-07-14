import React, { useState, useEffect } from 'react';
import { FiSave, FiEye, FiCopy, FiCode } from 'react-icons/fi';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';

const SchemaEditor = ({ schema, onSave, onCancel }) => {
  const [jsonSchema, setJsonSchema] = useState('');
  const [activeTab, setActiveTab] = useState('editor');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (schema) {
      setJsonSchema(JSON.stringify(schema, null, 2));
    }
  }, [schema]);

  const handleSave = () => {
    try {
      const parsedSchema = JSON.parse(jsonSchema);
      onSave(parsedSchema);
      toast.success('Schema saved successfully');
    } catch (error) {
      setErrors({ json: 'Invalid JSON format' });
      toast.error('Invalid JSON format');
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonSchema);
      setJsonSchema(JSON.stringify(parsed, null, 2));
      setErrors({});
    } catch (error) {
      toast.error('Cannot format invalid JSON');
    }
  };

  const handleValidate = () => {
    try {
      JSON.parse(jsonSchema);
      setErrors({});
      toast.success('Schema is valid JSON');
    } catch (error) {
      setErrors({ json: error.message });
      toast.error('Schema validation failed');
    }
  };

  return (
    <div className="schema-editor">
      <div className="editor-header">
        <div className="editor-tabs">
          <button
            className={`tab ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            <FiCode />
            JSON Editor
          </button>
          <button
            className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <FiEye />
            Preview
          </button>
        </div>
        
        <div className="editor-actions">
          <button className="btn btn-sm btn-secondary" onClick={handleFormat}>
            Format
          </button>
          <button className="btn btn-sm btn-secondary" onClick={handleValidate}>
            Validate
          </button>
          <button className="btn btn-sm btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-sm btn-primary" onClick={handleSave}>
            <FiSave />
            Save
          </button>
        </div>
      </div>

      <div className="editor-content">
        {activeTab === 'editor' && (
          <div className="json-editor">
            <Editor
              height="500px"
              defaultLanguage="json"
              value={jsonSchema}
              onChange={setJsonSchema}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                lineNumbers: 'on',
                folding: true,
                bracketMatching: 'always',
                autoIndent: 'full'
              }}
            />
            {errors.json && (
              <div className="error-message">
                {errors.json}
              </div>
            )}
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="schema-preview">
            <div className="preview-content">
              <h4>Schema Preview</h4>
              <pre className="schema-display">
                {jsonSchema}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemaEditor;