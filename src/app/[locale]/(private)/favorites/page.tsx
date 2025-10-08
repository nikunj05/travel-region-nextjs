"use client";

import ProfileLayout from "@/components/ProfileLayout/ProfileLayout";
import "./Favorites.scss";
import Image from "next/image";
import HotelBookingImg from "@/assets/images/room-information-image.jpg";
import StartIcon from "@/assets/images/star-fill-icon.svg";

export default function FavoritesPage() {
  return (
    <ProfileLayout>
      <div className="favorites-page">
        <div className="my-booking-title-with-filter">
          <h1 className="my-booking-title">Favorites</h1>
        </div>
        <div className="hotel-booking-card d-grid">
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
        </div>
      </div>
    </ProfileLayout>
  );
}
