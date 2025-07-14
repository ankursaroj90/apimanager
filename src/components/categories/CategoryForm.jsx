import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiTag } from 'react-icons/fi';
import { categoryService } from '../../services/categoryService';
import toast from 'react-hot-toast';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    parentId: '',
    status: 'active',
    icon: '📁',
    color: '#3b82f6'
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchCategory();
    }
  }, [id, isEditing]);

  const fetchCategories = async () => {
    try {
      // Mock data - replace with actual API call
      const mockCategories = [
        { id: '1', name: 'Software Development', parentId: null },
        { id: '2', name: 'API Tools', parentId: '1' },
        { id: '3', name: 'Testing Tools', parentId: '1' },
        { id: '4', name: 'Documentation', parentId: null }
      ];
      setCategories(mockCategories.filter(cat => cat.id !== id));
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const fetchCategory = async () => {
    try {
      // Mock data - replace with actual API call
      const mockCategory = {
        id: '1',
        name: 'Software Development',
        description: 'Software development tools and services',
        slug: 'software-development',
        parentId: null,
        status: 'active',
        icon: '💻',
        color: '#3b82f6'
      };
      setFormData(mockCategory);
    } catch (error) {
      toast.error('Failed to fetch category');
      navigate('/categories');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (formData.parentId === id) {
      newErrors.parentId = 'Category cannot be its own parent';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const categoryData = {
        ...formData,
        slug: formData.slug.trim(),
        parentId: formData.parentId || null
      };

      if (isEditing) {
        // await categoryService.updateCategory(id, categoryData);
        toast.success('Category updated successfully');
      } else {
        // await categoryService.createCategory(categoryData);
        toast.success('Category created successfully');
      }

      navigate('/categories');
    } catch (error) {
      toast.error(isEditing ? 'Failed to update category' : 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const iconOptions = [
    '📁', '💻', '🔧', '🧪', '📚', '⚙️', '🎯', '📊', 
    '🚀', '💡', '🔒', '📱', '🌐', '💾', '📈', '🎨'
  ];

  const colorOptions = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#06b6d4', '#ec4899', '#6b7280'
  ];

  return (
    <div className="category-form">
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <button 
              className="btn btn-ghost"
              onClick={() => navigate('/categories')}
            >
              <FiArrowLeft />
              Back to Categories
            </button>
            <div>
              <h1>{isEditing ? 'Edit Category' : 'Create Category'}</h1>
              <p>{isEditing ? 'Update category information' : 'Add a new category'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="category-form-content">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="categoryName">Category Name *</label>
                <input
                  id="categoryName"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter category name"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="categorySlug">Slug *</label>
                <input
                  id="categorySlug"
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="category-slug"
                  className={errors.slug ? 'error' : ''}
                />
                {errors.slug && <span className="error-text">{errors.slug}</span>}
                <small>URL-friendly version of the name</small>
              </div>

              <div className="form-group">
                <label htmlFor="parentCategory">Parent Category</label>
                <select
                  id="parentCategory"
                  value={formData.parentId}
                  onChange={(e) => handleInputChange('parentId', e.target.value)}
                  className={errors.parentId ? 'error' : ''}
                >
                  <option value="">None (Root Category)</option>
                  {categories
                    .filter(cat => !cat.parentId)
                    .map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
                {errors.parentId && <span className="error-text">{errors.parentId}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="categoryStatus">Status</label>
                <select
                  id="categoryStatus"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="categoryDescription">Description</label>
              <textarea
                id="categoryDescription"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe this category..."
                rows={4}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Visual Settings</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Icon</label>
                <div className="icon-picker">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                      onClick={() => handleInputChange('icon', icon)}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Color</label>
                <div className="color-picker">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`color-option ${formData.color === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleInputChange('color', color)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="category-preview">
              <h4>Preview</h4>
              <div className="preview-item">
                <div className="preview-icon" style={{ backgroundColor: formData.color }}>
                  {formData.icon}
                </div>
                <div className="preview-text">
                  <div className="preview-name">{formData.name || 'Category Name'}</div>
                  <div className="preview-description">
                    {formData.description || 'Category description'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/categories')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <FiSave />
                  {isEditing ? 'Update Category' : 'Create Category'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;