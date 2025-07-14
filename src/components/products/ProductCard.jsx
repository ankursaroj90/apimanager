import React from 'react';
import { FiEye, FiEdit, FiTrash2, FiPackage, FiDollarSign } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';

const ProductCard = ({ product, onView, onEdit, onDelete }) => {
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

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="product-card">
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="image-placeholder">
            <FiPackage />
          </div>
        )}
        <div className="product-actions">
          <button
            className="action-btn"
            onClick={() => onView(product)}
            title="View product"
          >
            <FiEye />
          </button>
          <button
            className="action-btn"
            onClick={() => onEdit(product)}
            title="Edit product"
          >
            <FiEdit />
          </button>
          <button
            className="action-btn danger"
            onClick={() => onDelete(product)}
            title="Delete product"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      <div className="product-content">
        <div className="product-header">
          <h3 className="product-name">{product.name}</h3>
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

        <p className="product-description">{product.description}</p>

        <div className="product-details">
          <div className="detail-row">
            <span className="detail-label">SKU:</span>
            <span className="detail-value">{product.sku}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Category:</span>
            <span className="detail-value">{product.category}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Stock:</span>
            <span className="detail-value">{product.stock} units</span>
          </div>
        </div>

        <div className="product-price">
          <FiDollarSign />
          <span className="price-value">${product.price}</span>
        </div>
      </div>

      <div className="product-footer">
        <div className="product-dates">
          <span className="date-label">Updated:</span>
          <span className="date-value">{formatDate(product.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;