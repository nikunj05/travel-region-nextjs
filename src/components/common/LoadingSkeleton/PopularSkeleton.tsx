import React from 'react';
import './PopularSkeleton.scss';

const PopularSkeleton = () => {
  return (
    <div className="popular-skeleton">
      <div className="destination-card d-flex card-first-row">
        <div className="destination-card-items big-card">
          <div className="skeleton-line image-skeleton"></div>
          <div className="skeleton-line tag-skeleton"></div>
          <div className="destination-card-inner-content">
            <div className="skeleton-line status-skeleton"></div>
            <div className="skeleton-line price-skeleton"></div>
          </div>
        </div>
        <div className="destination-card-items small-card">
          <div className="skeleton-line image-skeleton"></div>
          <div className="skeleton-line tag-skeleton"></div>
          <div className="destination-card-inner-content">
            <div className="skeleton-line status-skeleton"></div>
            <div className="skeleton-line price-skeleton"></div>
          </div>
        </div>
      </div>
      <div className="destination-card d-flex">
        <div className="destination-card-items small-card">
          <div className="skeleton-line image-skeleton"></div>
          <div className="skeleton-line tag-skeleton"></div>
          <div className="destination-card-inner-content">
            <div className="skeleton-line status-skeleton"></div>
            <div className="skeleton-line price-skeleton"></div>
          </div>
        </div>
        <div className="destination-card-items big-card">
          <div className="skeleton-line image-skeleton"></div>
          <div className="skeleton-line tag-skeleton"></div>
          <div className="destination-card-inner-content">
            <div className="skeleton-line status-skeleton"></div>
            <div className="skeleton-line price-skeleton"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularSkeleton;
