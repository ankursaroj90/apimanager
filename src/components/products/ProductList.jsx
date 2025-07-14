import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiPackage, FiDollarSign } from 'react-icons/fi';
import SearchBox from '../common/SearchBox';
import Pagination from '../common/Pagination';
import ProductCard from './ProductCard';
import { useSearch } from '../../hooks/useSearch';
import { usePagination } from '../../hooks/usePagination';
import { productService } from '../../services/productService';
import toast from 'react-hot-toast';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  const {
    searchTerm,
    filteredData: filteredProducts,
    handleSearchChange
  } = useSearch({
    data: products,
    searchFields: ['name', 'description', 'category', 'sku'],
    minSearchLength: 0
  });

  const {
    currentPage,
    totalPages,
    goToPage,
    getPageData
  } = usePagination({
    totalItems: filteredProducts.length,
    itemsPerPage: 12
  });

  const currentPageProducts = getPageData(filteredProducts);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockProducts = [
        {
          id: '1',
          name: 'API Gateway Pro',
          description: 'Enterprise-grade API gateway solution',
          price: 299.99,
          sku: 'AGW-PRO-001',
          category: 'Software',
          status: 'active',
          stock: 50,
          image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-02-20T14:30:00Z'
        },
        {
          id: '2',
          name: 'API Documentation Tool',
          description: 'Automated API documentation generator',
          price: 199.99,
          sku: 'ADT-STD-002',
          category: 'Software',
          status: 'active',
          stock: 75,
          image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop',
          createdAt: '2024-01-20T11:30:00Z',
          updatedAt: '2024-02-18T16:45:00Z'
        },
        {
          id: '3',
          name: 'API Testing Suite',
          description: 'Comprehensive API testing and monitoring',
          price: 399.99,
          sku: 'ATS-ENT-003',
          category: 'Software',
          status: 'draft',
          stock: 25,
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop',
          createdAt: '2024-02-01T09:15:00Z',
          updatedAt: '2024-02-15T12:20:00Z'
        }
      ];
      setProducts(mockProducts);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = () => {
    navigate('/products/new');
  };

  const handleViewProduct = (product) => {
    navigate(`/products/${product.id}`);
  };

  const handleEditProduct = (product) => {
    navigate(`/products/${product.id}/edit`);
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        // await productService.deleteProduct(product.id);
        setProducts(prev => prev.filter(p => p.id !== product.id));
        toast.success('Product deleted successfully');
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

  const getTotalValue = () => {
    return products.reduce((total, product) => total + (product.price * product.stock), 0);
  };

  return (
    <div className="product-list">
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Products</h1>
            <p>Manage your product catalog</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={handleCreateProduct}>
              <FiPlus />
              Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="product-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FiPackage />
          </div>
          <div className="stat-content">
            <div className="stat-value">{products.length}</div>
            <div className="stat-label">Total Products</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiDollarSign />
          </div>
          <div className="stat-content">
            <div className="stat-value">${getTotalValue().toLocaleString()}</div>
            <div className="stat-label">Total Value</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiPackage />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {products.filter(p => p.status === 'active').length}
            </div>
            <div className="stat-label">Active Products</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiPackage />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {products.reduce((total, product) => total + product.stock, 0)}
            </div>
            <div className="stat-label">Total Stock</div>
          </div>
        </div>
      </div>

      <div className="product-controls">
        <SearchBox
          placeholder="Search products..."
          value={searchTerm}
          onSearch={handleSearchChange}
          showFilters={true}
          filters={[
            {
              key: 'category',
              label: 'Category',
              type: 'select',
              options: [
                { value: 'Software', label: 'Software' },
                { value: 'Hardware', label: 'Hardware' },
                { value: 'Service', label: 'Service' }
              ]
            },
            {
              key: 'status',
              label: 'Status',
              type: 'select',
              options: [
                { value: 'active', label: 'Active' },
                { value: 'draft', label: 'Draft' },
                { value: 'discontinued', label: 'Discontinued' }
              ]
            }
          ]}
        />
      </div>

      <div className={`products-grid ${viewMode}`}>
        {currentPageProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onView={handleViewProduct}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-state">
          <FiPackage className="empty-icon" />
          <h3>No products found</h3>
          <p>
            {searchTerm
              ? 'No products match your search criteria'
              : 'Get started by adding your first product'
            }
          </p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={handleCreateProduct}>
              <FiPlus />
              Add Your First Product
            </button>
          )}
        </div>
      )}

      {filteredProducts.length > 12 && (
        <Pagination
          totalItems={filteredProducts.length}
          itemsPerPage={12}
          currentPage={currentPage}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
};

export default ProductList;