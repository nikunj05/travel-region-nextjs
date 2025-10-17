import React from 'react';
import './HotelCardSkeleton.scss';

const HotelCardSkeleton = () => {
  return (
    <div className="hotel-card-skeleton">
      <div className="hotel-images-skeleton">
        <div className="main-image-skeleton">
          <div className="skeleton-shimmer"></div>
        </div>
        <div className="thumbnail-images-skeleton">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="thumbnail-image-skeleton">
              <div className="skeleton-shimmer"></div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="hotel-info-skeleton">
        <div className="hotel-name-skeleton">
          <div className="skeleton-shimmer"></div>
        </div>
        
        <div className="hotel-rating-skeleton">
          <div className="rating-stars-skeleton">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="star-skeleton">
                <div className="skeleton-shimmer"></div>
              </div>
            ))}
          </div>
          <div className="rating-reviews-skeleton">
            <div className="skeleton-shimmer"></div>
          </div>
        </div>

        <div className="hotel-location-skeleton">
          <div className="location-icon-skeleton">
            <div className="skeleton-shimmer"></div>
          </div>
          <div className="location-text-skeleton">
            <div className="skeleton-shimmer"></div>
          </div>
        </div>

        <div className="hotel-amenities-skeleton">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="amenity-skeleton">
              <div className="amenity-icon-skeleton">
                <div className="skeleton-shimmer"></div>
              </div>
              <div className="amenity-text-skeleton">
                <div className="skeleton-shimmer"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="hotel-description-skeleton">
          <div className="description-line-skeleton">
            <div className="skeleton-shimmer"></div>
          </div>
          <div className="description-line-skeleton short">
            <div className="skeleton-shimmer"></div>
          </div>
        </div>
      </div>

      <div className="property-card-action-skeleton">
        <div className="hotel-price-skeleton">
          <div className="price-amount-skeleton">
            <div className="skeleton-shimmer"></div>
          </div>
          <div className="price-period-skeleton">
            <div className="skeleton-shimmer"></div>
          </div>
        </div>
        <div className="view-details-button-skeleton">
          <div className="skeleton-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default HotelCardSkeleton;
