import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiTag, FiFolder, FiFolderPlus } from 'react-icons/fi';
import SearchBox from '../common/SearchBox';
import Pagination from '../common/Pagination';
import { useSearch } from '../../hooks/useSearch';
import { usePagination } from '../../hooks/usePagination';
import { categoryService } from '../../services/categoryService';
import toast from 'react-hot-toast';

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');

  const {
    searchTerm,
    filteredData: filteredCategories,
    handleSearchChange
  } = useSearch({
    data: categories,
    searchFields: ['name', 'description', 'slug'],
    minSearchLength: 0
  });

  const {
    currentPage,
    totalPages,
    goToPage,
    getPageData
  } = usePagination({
    totalItems: filteredCategories.length,
    itemsPerPage: 12
  });

  const currentPageCategories = getPageData(filteredCategories);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockCategories = [
        {
          id: '1',
          name: 'Software Development',
          description: 'Software development tools and services',
          slug: 'software-development',
          parentId: null,
          status: 'active',
          productCount: 15,
          icon: '💻',
          color: '#3b82f6',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-02-20T14:30:00Z'
        },
        {
          id: '2',
          name: 'API Tools',
          description: 'Tools for API development and management',
          slug: 'api-tools',
          parentId: '1',
          status: 'active',
          productCount: 8,
          icon: '🔧',
          color: '#10b981',
          createdAt: '2024-01-20T11:30:00Z',
          updatedAt: '2024-02-18T16:45:00Z'
        },
        {
          id: '3',
          name: 'Testing Tools',
          description: 'API testing and monitoring solutions',
          slug: 'testing-tools',
          parentId: '1',
          status: 'active',
          productCount: 5,
          icon: '🧪',
          color: '#f59e0b',
          createdAt: '2024-02-01T09:15:00Z',
          updatedAt: '2024-02-15T12:20:00Z'
        },
        {
          id: '4',
          name: 'Documentation',
          description: 'API documentation and guides',
          slug: 'documentation',
          parentId: null,
          status: 'active',
          productCount: 12,
          icon: '📚',
          color: '#8b5cf6',
          createdAt: '2024-01-25T08:45:00Z',
          updatedAt: '2024-02-10T10:30:00Z'
        }
      ];
      setCategories(mockCategories);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    navigate('/categories/new');
  };

  const handleEditCategory = (category) => {
    navigate(`/categories/${category.id}/edit`);
  };

  const handleDeleteCategory = async (category) => {
    if (category.productCount > 0) {
      toast.error('Cannot delete category with existing products');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        // await categoryService.deleteCategory(category.id);
        setCategories(prev => prev.filter(c => c.id !== category.id));
        toast.success('Category deleted successfully');
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  const buildCategoryTree = (categories, parentId = null) => {
    return categories
      .filter(category => category.parentId === parentId)
      .map(category => ({
        ...category,
        children: buildCategoryTree(categories, category.id)
      }));
  };

  const categoryTree = buildCategoryTree(filteredCategories);

  const renderCategoryItem = (category, level = 0) => (
    <div key={category.id} className={`category-item level-${level}`}>
      <div className="category-content">
        <div className="category-info">
          <div className="category-icon" style={{ backgroundColor: category.color }}>
            {category.icon}
          </div>
          <div className="category-details">
            <h3 className="category-name">{category.name}</h3>
            <p className="category-description">{category.description}</p>
            <div className="category-meta">
              <span className="product-count">{category.productCount} products</span>
              <span className="category-slug">/{category.slug}</span>
            </div>
          </div>
        </div>
        
        <div className="category-actions">
          <button
            className="action-btn"
            onClick={() => handleEditCategory(category)}
            title="Edit category"
          >
            <FiEdit />
          </button>
          <button
            className="action-btn danger"
            onClick={() => handleDeleteCategory(category)}
            title="Delete category"
            disabled={category.productCount > 0}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
      
      {category.children && category.children.length > 0 && (
        <div className="category-children">
          {category.children.map(child => renderCategoryItem(child, level + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="category-list">
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Categories</h1>
            <p>Organize your products with categories</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={handleCreateCategory}>
              <FiPlus />
              Add Category
            </button>
          </div>
        </div>
      </div>

      <div className="category-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FiTag />
          </div>
          <div className="stat-content">
            <div className="stat-value">{categories.length}</div>
            <div className="stat-label">Total Categories</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiFolder />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {categories.filter(c => !c.parentId).length}
            </div>
            <div className="stat-label">Parent Categories</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiFolderPlus />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {categories.filter(c => c.parentId).length}
            </div>
            <div className="stat-label">Subcategories</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiTag />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
            </div>
            <div className="stat-label">Total Products</div>
          </div>
        </div>
      </div>

      <div className="category-controls">
        <SearchBox
          placeholder="Search categories..."
          value={searchTerm}
          onSearch={handleSearchChange}
        />
      </div>

      <div className="categories-tree">
        {categoryTree.length > 0 ? (
          categoryTree.map(category => renderCategoryItem(category))
        ) : (
          <div className="empty-state">
            <FiTag className="empty-icon" />
            <h3>No categories found</h3>
            <p>
              {searchTerm
                ? 'No categories match your search criteria'
                : 'Get started by creating your first category'
              }
            </p>
            {!searchTerm && (
              <button className="btn btn-primary" onClick={handleCreateCategory}>
                <FiPlus />
                Create Your First Category
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;