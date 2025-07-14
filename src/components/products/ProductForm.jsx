import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiUpload, FiX, FiPlus, FiMinus } from 'react-icons/fi';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import toast from 'react-hot-toast';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sku: '',
    categoryId: '',
    status: 'active',
    stock: '',
    features: [''],
    specifications: {},
    tags: '',
    image: null
  });

  const [categories, setCategories] = useState([]);
  const [specifications, setSpecifications] = useState([{ key: '', value: '' }]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProduct();
    }
  }, [id, isEditing]);

  const fetchCategories = async () => {
    try {
      // Mock data - replace with actual API call
      const mockCategories = [
        { id: '1', name: 'Software Development' },
        { id: '2', name: 'API Tools' },
        { id: '3', name: 'Testing Tools' },
        { id: '4', name: 'Documentation' }
      ];
      setCategories(mockCategories);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const fetchProduct = async () => {
    try {
      // Mock data - replace with actual API call
      const mockProduct = {
        id: '1',
        name: 'API Gateway Pro',
        description: 'Enterprise-grade API gateway solution',
        price: 299.99,
        sku: 'AGW-PRO-001',
        categoryId: '1',
        status: 'active',
        stock: 50,
        features: ['Rate limiting', 'Authentication', 'Load balancing'],
        specifications: {
          'Supported Protocols': 'HTTP, HTTPS, WebSocket',
          'Authentication': 'OAuth 2.0, JWT, API Keys'
        },
        tags: 'api, gateway, enterprise, security',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop'
      };
      
      setFormData({
        ...mockProduct,
        tags: mockProduct.tags || '',
        features: mockProduct.features || ['']
      });

      if (mockProduct.specifications) {
        setSpecifications(Object.entries(mockProduct.specifications).map(([key, value]) => ({ key, value })));
      }

      if (mockProduct.image) {
        setImagePreview(mockProduct.image);
      }
    } catch (error) {
      toast.error('Failed to fetch product');
      navigate('/products');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate SKU from name
    if (field === 'name' && !isEditing) {
      const sku = value
        .toUpperCase()
        .replace(/[^A-Z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 10) + '-001';
      setFormData(prev => ({ ...prev, sku }));
    }

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image file size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setSpecifications(newSpecs);
  };

  const addSpecification = () => {
    setSpecifications(prev => [...prev, { key: '', value: '' }]);
  };

  const removeSpecification = (index) => {
    setSpecifications(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
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
      // Build specifications object
      const specificationsObj = {};
      specifications.forEach(spec => {
        if (spec.key && spec.value) {
          specificationsObj[spec.key] = spec.value;
        }
      });

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        features: formData.features.filter(feature => feature.trim()),
        specifications: specificationsObj,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      if (isEditing) {
        // await productService.updateProduct(id, productData);
        toast.success('Product updated successfully');
      } else {
        // await productService.createProduct(productData);
        toast.success('Product created successfully');
      }

      navigate('/products');
    } catch (error) {
      toast.error(isEditing ? 'Failed to update product' : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form">
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <button 
              className="btn btn-ghost"
              onClick={() => navigate('/products')}
            >
              <FiArrowLeft />
              Back to Products
            </button>
            <div>
              <h1>{isEditing ? 'Edit Product' : 'Create Product'}</h1>
              <p>{isEditing ? 'Update product information' : 'Add a new product to your catalog'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="product-form-content">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="image-upload-section">
              <label>Product Image</label>
              <div className="image-upload">
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Product preview" />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={removeImage}
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <FiUpload />
                    <span>Upload Product Image</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="image-input"
                />
              </div>
              <small>Maximum file size: 5MB. Supported formats: JPG, PNG, GIF</small>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="productName">Product Name *</label>
                <input
                  id="productName"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="productSku">SKU *</label>
                <input
                  id="productSku"
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder="Product SKU"
                  className={errors.sku ? 'error' : ''}
                />
                {errors.sku && <span className="error-text">{errors.sku}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="productPrice">Price *</label>
                <input
                  id="productPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  className={errors.price ? 'error' : ''}
                />
                {errors.price && <span className="error-text">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="productStock">Stock Quantity *</label>
                <input
                  id="productStock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  placeholder="0"
                  className={errors.stock ? 'error' : ''}
                />
                {errors.stock && <span className="error-text">{errors.stock}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="productCategory">Category *</label>
                <select
                  id="productCategory"
                  value={formData.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  className={errors.categoryId ? 'error' : ''}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <span className="error-text">{errors.categoryId}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="productStatus">Status</label>
                <select
                  id="productStatus"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="productDescription">Description *</label>
              <textarea
                id="productDescription"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your product..."
                rows={4}
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="productTags">Tags</label>
              <input
                id="productTags"
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="api, gateway, enterprise (comma separated)"
              />
              <small>Separate tags with commas</small>
            </div>
          </div>

          <div className="form-section">
            <h3>Features</h3>
            <div className="features-list">
              {formData.features.map((feature, index) => (
                <div key={index} className="feature-input">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="Enter a feature"
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => removeFeature(index)}
                    disabled={formData.features.length === 1}
                  >
                    <FiMinus />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={addFeature}
              >
                <FiPlus />
                Add Feature
              </button>
            </div>
          </div>

          <div className="form-section">
            <h3>Specifications</h3>
            <div className="specifications-list">
              {specifications.map((spec, index) => (
                <div key={index} className="specification-input">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                    placeholder="Specification name"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                    placeholder="Specification value"
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => removeSpecification(index)}
                  >
                    <FiMinus />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={addSpecification}
              >
                <FiPlus />
                Add Specification
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/products')}
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
                  {isEditing ? 'Update Product' : 'Create Product'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;