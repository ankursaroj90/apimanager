import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiTrash2, FiPackage, FiDollarSign, FiTag } from 'react-icons/fi';
import { productService } from '../../services/productService';
import { formatDate } from '../../utils/helpers';
import Loading from '../common/Loading';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      // Mock data - replace with actual API call
      const mockProduct = {
        id: '1',
        name: 'API Gateway Pro',
        description: 'Enterprise-grade API gateway solution with advanced features for managing, securing, and monitoring APIs at scale.',
        price: 299.99,
        sku: 'AGW-PRO-001',
        category: 'Software',
        categoryId: '1',
        status: 'active',
        stock: 50,
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'
        ],
        features: [
          'Rate limiting and throttling',
          'Authentication and authorization',
          'Request/response transformation',
          'Load balancing',
          'Real-time monitoring',
          'API versioning support'
        ],
        specifications: {
          'Supported Protocols': 'HTTP, HTTPS, WebSocket',
          'Authentication': 'OAuth 2.0, JWT, API Keys',
          'Rate Limiting': 'Yes',
          'Load Balancing': 'Round Robin, Weighted',
          'Monitoring': 'Real-time metrics',
          'Deployment': 'Cloud, On-premise'
        },
        tags: ['api', 'gateway', 'enterprise', 'security'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-02-20T14:30:00Z'
      };
      setProduct(mockProduct);
    } catch (error) {
      toast.error('Failed to fetch product details');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = () => {
    navigate(`/products/${id}/edit`);
  };

  const handleDeleteProduct = async () => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        // await productService.deleteProduct(id);
        toast.success('Product deleted successfully');
        navigate('/products');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: '#10b981',
      draft: '#f59e0b',
      discontinued: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: '#ef4444' };
    if (stock < 10) return { label: 'Low Stock', color: '#f59e0b' };
    return { label: 'In Stock', color: '#10b981' };
  };

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return (
      <div className="error-page">
        <h1>Product not found</h1>
        <p>The product you're looking for doesn't exist.</p>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>
          Back to Products
        </button>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="product-detail">
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
              <h1>{product.name}</h1>
              <p>Product Details</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={handleEditProduct}>
              <FiEdit />
              Edit Product
            </button>
            <button className="btn btn-danger" onClick={handleDeleteProduct}>
              <FiTrash2 />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="product-overview">
        <div className="product-gallery">
          <div className="main-image">
            <img src={product.image} alt={product.name} />
          </div>
          {product.gallery && product.gallery.length > 1 && (
            <div className="gallery-thumbnails">
              {product.gallery.map((image, index) => (
                <div key={index} className="thumbnail">
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <div className="product-header">
            <h2>{product.name}</h2>
            <div className="product-badges">
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(product.status) }}
              >
                {product.status}
              </span>
              <span 
                className="stock-badge"
                style={{ backgroundColor: stockStatus.color }}
              >
                {stockStatus.label}
              </span>
            </div>
          </div>

          <div className="product-pricing">
            <div className="price">
              <FiDollarSign />
              <span className="price-value">${product.price}</span>
            </div>
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">SKU:</span>
              <span className="meta-value">{product.sku}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Category:</span>
              <span className="meta-value">{product.category}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Stock:</span>
              <span className="meta-value">{product.stock} units</span>
            </div>
          </div>

          <div className="product-description">
            <p>{product.description}</p>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="product-tags">
              <FiTag />
              {product.tags.map(tag => (
                <span key={tag} className="product-tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="product-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'features' ? 'active' : ''}`}
          onClick={() => setActiveTab('features')}
        >
          Features
        </button>
        <button
          className={`tab ${activeTab === 'specifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('specifications')}
        >
          Specifications
        </button>
      </div>

      <div className="product-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="content-section">
              <h3>Product Overview</h3>
              <p>{product.description}</p>
              
              <div className="product-stats">
                <div className="stat-card">
                  <div className="stat-icon">
                    <FiPackage />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{product.stock}</div>
                    <div className="stat-label">Units in Stock</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FiDollarSign />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">${(product.price * product.stock).toLocaleString()}</div>
                    <div className="stat-label">Total Value</div>
                  </div>
                </div>
              </div>

              <div className="product-dates">
                <div className="date-item">
                  <span className="date-label">Created:</span>
                  <span className="date-value">{formatDate(product.createdAt)}</span>
                </div>
                <div className="date-item">
                  <span className="date-label">Last Updated:</span>
                  <span className="date-value">{formatDate(product.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="features-content">
            <h3>Key Features</h3>
            {product.features && product.features.length > 0 ? (
              <div className="features-list">
                {product.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <div className="feature-icon">✓</div>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No features listed for this product.</p>
            )}
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="specifications-content">
            <h3>Technical Specifications</h3>
            {product.specifications && Object.keys(product.specifications).length > 0 ? (
              <div className="specifications-table">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="spec-row">
                    <div className="spec-label">{key}</div>
                    <div className="spec-value">{value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No specifications available for this product.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;