import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Loading = ({ type = 'spinner', count = 1, height = 20 }) => {
  if (type === 'skeleton') {
    return <Skeleton count={count} height={height} />;
  }

  if (type === 'card') {
    return (
      <div className="loading-card">
        <Skeleton height={40} className="mb-2" />
        <Skeleton count={3} className="mb-1" />
        <Skeleton width="60%" />
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="loading-table">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="loading-row">
            <Skeleton height={50} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="loading-container">
      <div className="spinner" />
      <span className="loading-text">Loading...</span>
    </div>
  );
};

export default Loading;