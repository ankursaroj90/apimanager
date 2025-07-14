import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiTrash2, FiTag, FiPackage } from 'react-icons/fi';
import { categoryService } from '../../services/categoryService';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryDetails();
  }, [id]);

  const fetchCategoryDetails = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockCategory = {
        id: '1',
        name: 'Software Development',
        description: 'Software development tools and services for modern applications',
        slug: 'software-development',
        parentId: null,
        status: 'active',
        productCount: 15,
        icon: '💻',
        color: '#3b82f6',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-02-20T14:30:00Z'
      };

      const mockProducts = [
        {
          id: '1',
          name: 'API Gateway Pro',
          price: 299.99,
          status: 'active'
        },
        {
          id: '2',
          name: 'API Documentation Tool',
          price: 199.99,
          status: 'active'
        }
      ];

      const mockSubcategories = [
        {
          id: '2',
          name: 'API Tools',
          productCount: 8,
          icon: '🔧',
          color: '#10b981'
        },
        {
          id: '3',
          name: 'Testing Tools',
          productCount: 5,
          icon: '🧪',
          color: '#f59e0b'
        }
      ];

      setCategory(mockCategory);
      setProducts(mockProducts);
      setSubcategories(mockSubcategories);
    } catch (error) {
      toast.error('Failed to fetch category details');
      navigate('/categories');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = () => {
    navigate(`/categories/${id}/edit`);
  };

  const handleDeleteCategory = async () => {
    if (category.productCount > 0) {
      toast.error('Cannot delete category with existing products');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        // await categoryService.deleteCategory(id);
        toast.success('Category deleted successfully');
        navigate('/categories');
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <span>Loading category details...</span>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="error-page">
        <h1>Category not found</h1>
        <p>The category you're looking for doesn't exist.</p>
        <button className="btn btn-primary" onClick={() => navigate('/categories')}>
          Back to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="category-detail">
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
              <h1>{category.name}</h1>
              <p>Category Details</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={handleEditCategory}>
              <FiEdit />
              Edit
            </button>
            <button 
              className="btn btn-danger" 
              onClick={handleDeleteCategory}
              disabled={category.productCount > 0}
            >
              <FiTrash2 />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="category-overview">
        <div className="overview-card">
          <div className="category-visual">
            <div className="category-icon" style={{ backgroundColor: category.color }}>
              {category.icon}
            </div>
            <div className="category-info">
              <h2>{category.name}</h2>
              <p className="category-description">{category.description}</p>
              <div className="category-meta">
                <span className="category-slug">/{category.slug}</span>
                <span className={`status-badge ${category.status}`}>
                  {category.status}
                </span>
              </div>
            </div>
          </div>

          <div className="category-stats">
            <div className="stat-item">
              <FiPackage className="stat-icon" />
              <div className="stat-content">
                <div className="stat-value">{category.productCount}</div>
                <div className="stat-label">Products</div>
              </div>
            </div>
            <div className="stat-item">
              <FiTag className="stat-icon" />
              <div className="stat-content">
                <div className="stat-value">{subcategories.length}</div>
                <div className="stat-label">Subcategories</div>
              </div>
            </div>
          </div>
        </div>

        <div className="details-card">
          <h3>Category Information</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Created:</span>
              <span className="detail-value">{formatDate(category.createdAt)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Last Updated:</span>
              <span className="detail-value">{formatDate(category.updatedAt)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className={`status-badge ${category.status}`}>
                {category.status}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Slug:</span>
              <span className="detail-value">/{category.slug}</span>
            </div>
          </div>
        </div>
      </div>

      {subcategories.length > 0 && (
        <div className="subcategories-section">
          <h3>Subcategories</h3>
          <div className="subcategories-grid">
            {subcategories.map(subcategory => (
              <div key={subcategory.id} className="subcategory-card">
                <div className="subcategory-icon" style={{ backgroundColor: subcategory.color }}>
                  {subcategory.icon}
                </div>
                <div className="subcategory-info">
                  <h4>{subcategory.name}</h4>
                  <span className="product-count">{subcategory.productCount} products</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="products-section">
        <h3>Products in this Category</h3>
        {products.length > 0 ? (
          <div className="products-list">
            {products.map(product => (
              <div key={product.id} className="product-item">
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <span className="product-price">${product.price}</span>
                </div>
                <span className={`status-badge ${product.status}`}>
                  {product.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-products">
            <FiPackage className="empty-icon" />
            <p>No products in this category yet</p>
            <button className="btn btn-primary">
              Add Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;