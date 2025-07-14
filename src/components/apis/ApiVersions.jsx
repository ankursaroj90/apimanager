import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiDownload, FiCopy, FiGitBranch } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import apiService from '../../services/apiService';

const ApiVersions = () => {
  const { apiId } = useParams();
  const { currentApi } = useApp();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    version: '',
    description: '',
    changelog: ''
  });

  //form to edit the version
  const [editVersion, setEditVersion] = useState(null);

  const [versions, setVersions] = useState([]);

  // Fetch versions for API
  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const data = await apiService.getApiVersions(apiId);
        setVersions(data);
      } catch (error) {
        toast.error(error.message || 'Failed to fetch API versions');
      }
    };
    fetchVersions();
  }, [apiId]);

  // Handle create version
  const handleCreateVersion = async (e) => {
    e.preventDefault();
  
    // if editing, call update API
    if (editVersion) {
      try {
        const updated = await apiService.updateApiVersion(editVersion.apiId, editVersion.id, {
          ...editVersion,
          version: formData.version,
          description: formData.description,
          changelog: formData.changelog
        });
        setVersions(prev => prev.map(v => v.id === updated.id ? updated : v));
        toast.success('Version updated successfully');
      } catch (err) {
        toast.error(err.message || 'Failed to update version');
      }
    } else {
      // handle creation as usual
      const newVersion = {
        id: Date.now().toString(),
        apiId,
        version: formData.version,
        description: formData.description,
        changelog: formData.changelog,
        isActive: false,
        createdAt: new Date(),
        downloads: 0
      };
      try {
        const saved = await apiService.createApiVersion(apiId, newVersion);
        setVersions(prev => [...prev, saved]);
        toast.success('Version created successfully');
      } catch (err) {
        toast.error(err.message || 'Failed to create version');
      }
    }
    setShowCreateForm(false);
    setFormData({ version: '', description: '', changelog: '' });
    setEditVersion(null); // reset editing
  };


  // Handle delete version
  const handleDeleteVersion = (version) => {
    if (version.isActive) {
      toast.error('Cannot delete the active version');
      return;
    }
    if (window.confirm(`Are you sure you want to delete version ${version.version}?`)) {
      // Call API to delete and update local state
      apiService.deleteApiVersion(apiId, version.id).then(() => {
        setVersions(prev => prev.filter(v => v.id !== version.id));
        toast.success('Version deleted successfully');
      }).catch(err => {
        toast.error(err.message || 'Failed to delete version');
      });
    }
  };

  //handle edit version
  const handleEditVersion = (version) => {
    setFormData({
      version: version.version,
      description: version.description,
      changelog: version.changelog
    });
    setEditVersion(version); // track the version being edited
    setShowCreateForm(true);
  };

  const handleSetActive = async (version) => {
    try {
      // 1. Send API request to update this version as active
      await apiService.updateApiVersion(version.apiId, version.id, { ...version, isActive: true });
      // 2. Update local state: set this version active, others not
      setVersions(prev => prev.map(v => ({
        ...v,
        isActive: v.id === version.id
      })));
      toast.success(`Version ${version.name} is now active`);
    } catch (err) {
      toast.error(err.message || 'Failed to set active version');
    }
  };

  const handleDownload = (version) => {
    toast.success(`Downloading version ${version.version}`);
  };

  const getVersionBadge = (version) => {
    if (version.isActive) return 'active';
    if (version.version.includes('beta')) return 'beta';
    if (version.version.includes('alpha')) return 'alpha';
    return 'stable';
  };

  return (
    <div className="api-versions">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1>API Versions</h1>
            <p>{currentApi ? `${currentApi.name} API` : 'API Versions'}</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
              <FiPlus /> Create Version
            </button>
          </div>
        </div>
      </div>

      {/* Version List */}
      <div className="versions-list">
        {versions.map(version => (
          <div key={version.id} className={`version-card ${version.isActive ? 'active' : ''}`}>
            <div className="version-header">
              <div className="version-info">
                <div className="version-title">
                  <h3>v{version.version}</h3>
                  <span className={`version-badge ${getVersionBadge(version)}`}>
                    {version.isActive ? 'Active' :
                     version.version.includes('beta') ? 'Beta' :
                     version.version.includes('alpha') ? 'Alpha' : 'Stable'}
                  </span>
                </div>
                <p className="version-description">{version.description}</p>
              </div>
              {/* Actions */}
              <div className="version-actions">
                {!version.isActive && (
                  <button
                    className="action-btn"
                    onClick={() => handleSetActive(version)}
                    title="Set as active version"
                  >
                    <FiGitBranch />
                  </button>
                )}
                <button
                  className="action-btn"
                  onClick={() => handleDownload(version)}
                  title="Download version"
                >
                  <FiDownload />
                </button>
                <button 
                  className="action-btn"
                  onClick={() => handleEditVersion(version)}
                  title="Edit version">
                  <FiEdit />
                </button>
                <button
                  className="action-btn danger"
                  onClick={() => handleDeleteVersion(version)}
                  title="Delete version"
                  disabled={version.isActive}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
            {/* Details */}
            <div className="version-content">
              <div className="changelog">
                <h4>Changelog</h4>
                <p>{version.changelog}</p>
              </div>
              <div className="version-metadata">
                <div className="metadata-grid">
                  <div className="metadata-item">
                    <span className="metadata-label">Created:</span>
                    <span className="metadata-value">{formatDate(version.createdAt)}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Downloads:</span>
                    <span className="metadata-value">{version.downloads.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Version Modal */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Create New Version</h2>
              <button className="modal-close" onClick={() => setShowCreateForm(false)}>×</button>
            </div>
            <form onSubmit={handleCreateVersion} className="modal-content">
              <div className="form-group">
                <label htmlFor="version">Version Number *</label>
                <input
                  id="version"
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                  placeholder="1.0.0"
                  required
                />
                <small>Follow semantic versioning (major.minor.patch)</small>
              </div>
              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <input
                  id="description"
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this version"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="changelog">Changelog</label>
                <textarea
                  id="changelog"
                  value={formData.changelog}
                  onChange={(e) => setFormData(prev => ({ ...prev, changelog: e.target.value }))}
                  placeholder="Detailed list of changes..."
                  rows={4}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Version
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiVersions;