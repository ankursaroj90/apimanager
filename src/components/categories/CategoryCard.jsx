import React from 'react';
import { FiEdit, FiTrash2, FiTag, FiPackage } from 'react-icons/fi';

const CategoryCard = ({ category, onEdit, onDelete, level = 0 }) => {
  return (
    <div className={`category-card level-${level}`}>
      <div className="category-header">
        <div className="category-visual">
          <div className="category-icon" style={{ backgroundColor: category.color }}>
            {category.icon}
          </div>
          <div className="category-info">
            <h3 className="category-name">{category.name}</h3>
            <p className="category-description">{category.description}</p>
          </div>
        </div>
        
        <div className="category-actions">
          <button
            className="action-btn"
            onClick={() => onEdit(category)}
            title="Edit category"
          >
            <FiEdit />
          </button>
          <button
            className="action-btn danger"
            onClick={() => onDelete(category)}
            title="Delete category"
            disabled={category.productCount > 0}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      <div className="category-stats">
        <div className="stat-item">
          <FiPackage />
          <span>{category.productCount} products</span>
        </div>
        <div className="stat-item">
          <FiTag />
          <span>/{category.slug}</span>
        </div>
      </div>

      <div className="category-status">
        <span className={`status-badge ${category.status}`}>
          {category.status}
        </span>
      </div>
    </div>
  );
};

export default CategoryCard;