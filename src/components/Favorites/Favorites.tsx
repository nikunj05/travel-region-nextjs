"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import "./Favorites.scss";
import Image from "next/image";
import HotelBookingImg from "@/assets/images/room-information-image.jpg";
import StartIcon from "@/assets/images/star-fill-icon.svg";
import { useFavoriteStore } from "@/store/favoriteStore";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Pagination from "@/components/common/Pagination/Pagination";

export default function Favorites() {
  const t = useTranslations("Favorites");
  const { 
    favorites, 
    loading, 
    error,
    total,
    fetchFavorites, 
    removeFromFavorites,
    removing 
  } = useFavoriteStore();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch favorites on component mount with pagination
    fetchFavorites({ page: currentPage, limit: itemsPerPage });
  }, [currentPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    if (!total) return 1;
    return Math.max(1, Math.ceil(total / itemsPerPage));
  }, [total, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemove = async (hotelCode: number) => {
    await removeFromFavorites(hotelCode);
  };

  // Get the first image from hotel images array
  const getHotelImage = (hotel: typeof favorites[0]) => {
    if (hotel.images && hotel.images.length > 0) {
      // Check if the image path is a full URL or relative path
      const imagePath = hotel.images[0].path;
      return imagePath.startsWith('http') ? imagePath : HotelBookingImg;
    }
    return HotelBookingImg;
  };

  return (
    <div className="favorites-page">
      <div className="my-booking-title-with-filter">
        <h1 className="my-booking-title">{t("pageTitle")}</h1>
      </div>

      {loading ? (
        <div className="hotel-booking-card d-grid"> 
          {[...Array(itemsPerPage)].map((_, index) => (
            <div key={index} className="hotel-booking-card-item">
              <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
                <Skeleton height={222} borderRadius={18} />
                <div style={{ paddingTop: "12px" }}>
                  <Skeleton height={24} width="60%" style={{ marginBottom: "18px" }} />
                  <Skeleton height={30} width="40%" style={{ marginBottom: "18px" }} />
                  <Skeleton height={44} />
                </div>
              </SkeletonTheme>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : !favorites || favorites.length === 0 ? (
        <div className="empty-state">
          <p>{t("noFavoritesFound")}</p>
        </div>
      ) : (
        <>
          <div className="hotel-booking-card d-grid">
            {favorites.map((hotel) => (
              <div key={hotel.code} className="hotel-booking-card-item">
                <div className="hotel-booking-image">
                  <Image
                    src={getHotelImage(hotel)}
                    alt={hotel.name.content}
                    width={414}
                    height={222}
                    className="hotel-booking-img"
                  />
                </div>
                <div className="hotel-booking-info">
                  <div className="hotel-title-with-rating d-flex align-items-start justify-content-between">
                    <h2 className="hotel-title">{hotel.name.content}</h2>
                    <div className="hotel-review-rating d-flex align-items-center">
                      <Image
                        src={StartIcon}
                        alt="star icon"
                        width={20}
                        height={20}
                        className="ration-star-icon"
                      />
                      4.9 {t("rating")}
                    </div>
                  </div>
                  <div className="hotel-pricing d-flex">
                    $200 <span className="hotel-pricing-per">{t("perNight")}</span>
                  </div>
                </div>

                <div className="hotel-bookig-action d-flex align-items-center justify-content-between">
                  <button 
                    className="hotel-bookig-action-btn cancel-button"
                    onClick={() => handleRemove(hotel.code)}
                    disabled={removing}
                  >
                    {removing ? t("removing") : t("remove")}
                  </button>
                  <button className="hotel-bookig-action-btn button-primary">
                    {t("bookNow")}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {/* <div className="hotel-booking-card d-grid">
        <div className="hotel-booking-card-item">
          <div className="hotel-booking-image">
            <Image
              src={HotelBookingImg}
              alt="Hotel Booking"
              width={414}
              height={222}
              className="hotel-booking-img"
            />
          </div>
          <div className="hotel-booking-info">
            <div className="hotel-title-with-rating d-flex align-items-start justify-content-between">
              <h2 className="hotel-title">Sigheintu</h2>
              <div className="hotel-review-rating d-flex align-items-center">
                <Image
                  src={StartIcon}
                  alt="star icon"
                  width={20}
                  height={20}
                  className="ration-star-icon"
                />
                4.9 Rating
              </div>
            </div>
            <div className="hotel-pricing d-flex">
              $200 <span className="hotel-pricing-per">/night</span>
            </div>
          </div>

          <div className="hotel-bookig-action d-flex align-items-center justify-content-between">
            <button className="hotel-bookig-action-btn cancel-button">
              Remove
            </button>
            <button className="hotel-bookig-action-btn button-primary">
              Book now
            </button>
          </div>
        </div>
        <div className="hotel-booking-card-item">
          <div className="hotel-booking-image">
            <Image
              src={HotelBookingImg}
              alt="Hotel Booking"
              width={414}
              height={222}
              className="hotel-booking-img"
            />
            <button className="hotel-favorit-action">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="48" height="48" rx="14" fill="white" />
                <path
                  d="M16.1449 15.3552C19.1259 13.5266 21.8001 14.2554 23.4156 15.4686C23.6814 15.6682 23.8638 15.8048 23.9996 15.897C24.1354 15.8048 24.3178 15.6682 24.5836 15.4686C26.1991 14.2554 28.8734 13.5266 31.8543 15.3552C33.9156 16.6195 35.0754 19.2606 34.6684 22.2951C34.2595 25.3443 32.2859 28.7929 28.1063 31.8865C26.6549 32.9614 25.5897 33.7503 23.9996 33.7503C22.4095 33.7503 21.3443 32.9614 19.8929 31.8865C15.7133 28.7929 13.7398 25.3443 13.3308 22.2951C12.9238 19.2606 14.0837 16.6195 16.1449 15.3552Z"
                  fill="#FB2C36"
                />
              </svg>
            </button>
          </div>
          <div className="hotel-booking-info">
            <div className="hotel-title-with-rating d-flex align-items-start justify-content-between">
              <h2 className="hotel-title">Sigheintu</h2>
              <div className="hotel-review-rating d-flex align-items-center">
                <Image
                  src={StartIcon}
                  alt="star icon"
                  width={20}
                  height={20}
                  className="ration-star-icon"
                />
                4.9 Rating
              </div>
            </div>
            <div className="hotel-pricing d-flex">
              $200 <span className="hotel-pricing-per">/night</span>
            </div>
          </div>

          <div className="hotel-bookig-action d-flex align-items-center justify-content-between">
            <button className="hotel-bookig-action-btn cancel-button">
              Remove
            </button>
            <button className="hotel-bookig-action-btn button-primary">
              Book now
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
}
