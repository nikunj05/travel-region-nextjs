import React from 'react';
import './HotelCardSkeleton.scss';

const HotelCardSkeleton = () => {
  return (
    <div className="hotel-card-skeleton">
      <div className="hotel-images-skeleton">
        <div className="main-image-skeleton"></div>
      </div>
      <div className="hotel-info-with-action-card">
        <div className="hotel-info-skeleton">
          <div className="skeleton-line hotel-name-skeleton"></div>
          <div className="skeleton-line hotel-rating-skeleton"></div>
          <div className="hotel-amenities-skeleton">
            <div className="skeleton-line amenity-skeleton"></div>
            <div className="skeleton-line amenity-skeleton"></div>
          </div>
          <div className="hotel-amenities-skeleton">
            <div className="skeleton-line amenity-skeleton"></div>
            <div className="skeleton-line amenity-skeleton"></div>
          </div>
        </div>
        <div className="property-card-action-skeleton">
          <div className="hotel-price-skeleton">
            <div className="skeleton-line price-amount-skeleton"></div>
          </div>
          <div className="skeleton-line view-details-button-skeleton"></div>
        </div>
      </div>
    </div>
  );
};

export default HotelCardSkeleton;
