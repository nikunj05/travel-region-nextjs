import React from 'react';
import './BannerSkeleton.scss';

const BannerSkeleton = () => {
  return (
    <div className="banner-skeleton">
      <div className="container">
        <div className="banner-content">
          <div className="heading_section">
            <div className="skeleton-line title-skeleton"></div>
            <div className="skeleton-line subtitle-skeleton"></div>
            <div className="list-items-skeleton">
              <div className="skeleton-line list-item"></div>
              <div className="skeleton-line list-item"></div>
              <div className="skeleton-line list-item"></div>
            </div>
          </div>
          <div className="banner-filter-skeleton">
             <div className="filter-items-grid">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="filter-item-placeholder">
                    <div className="skeleton-line icon-placeholder"></div>
                    <div className="text-placeholders">
                      <div className="skeleton-line line-sm"></div>
                      <div className="skeleton-line line-md"></div>
                    </div>
                  </div>
                ))}
             </div>
             <div className="filter-footer">
                <div className="skeleton-line search-button-placeholder"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSkeleton;
