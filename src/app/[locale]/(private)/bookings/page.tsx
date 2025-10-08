"use client";

import ProfileLayout from "@/components/ProfileLayout/ProfileLayout";
import "./Bookings.scss";
import Image from "next/image";
import HotelBookingImg from "@/assets/images/room-information-image.jpg";
import StartIcon from "@/assets/images/star-fill-icon.svg";

export default function BookingsPage() {
  return (
    <ProfileLayout>
      <div className="my-booking-page">
        <div className="my-booking-title-with-filter">
          <h1 className="my-booking-title">My Bookings</h1>
          <button className="my-booking-filter-btn d-flex align-items-center  ">
            <span className="my-booking-filter-text d-flex align-items-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.834 3.33203L2.50065 3.33203"
                  stroke="#141B34"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.16797 15.832L2.5013 15.832"
                  stroke="#141B34"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M17.5 15.832L14.1667 15.832"
                  stroke="#141B34"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M17.5 9.58203L9.16667 9.58203"
                  stroke="#141B34"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M17.5 3.33203L15.8333 3.33203"
                  stroke="#141B34"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.16797 9.58203L2.5013 9.58203"
                  stroke="#141B34"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.084 1.66797C12.4723 1.66797 12.6664 1.66797 12.8196 1.7314C13.0237 1.81598 13.186 1.97821 13.2706 2.1824C13.334 2.33554 13.334 2.52968 13.334 2.91797L13.334 3.7513C13.334 4.13959 13.334 4.33373 13.2706 4.48687C13.186 4.69106 13.0237 4.85329 12.8196 4.93787C12.6664 5.0013 12.4723 5.0013 12.084 5.0013C11.6957 5.0013 11.5016 5.0013 11.3484 4.93787C11.1442 4.85329 10.982 4.69106 10.8974 4.48687C10.834 4.33373 10.834 4.13959 10.834 3.7513L10.834 2.91797C10.834 2.52968 10.834 2.33554 10.8974 2.1824C10.982 1.97821 11.1442 1.81598 11.3484 1.7314C11.5016 1.66797 11.6957 1.66797 12.084 1.66797Z"
                  stroke="#141B34"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10.418 14.168C10.8063 14.168 11.0004 14.168 11.1535 14.2314C11.3577 14.316 11.52 14.4782 11.6045 14.6824C11.668 14.8355 11.668 15.0297 11.668 15.418L11.668 16.2513C11.668 16.6396 11.668 16.8337 11.6045 16.9869C11.52 17.1911 11.3577 17.3533 11.1535 17.4379C11.0004 17.5013 10.8063 17.5013 10.418 17.5013C10.0297 17.5013 9.83554 17.5013 9.6824 17.4379C9.47821 17.3533 9.31598 17.1911 9.2314 16.9869C9.16797 16.8337 9.16797 16.6396 9.16797 16.2513L9.16797 15.418C9.16797 15.0297 9.16797 14.8355 9.2314 14.6824C9.31598 14.4782 9.47821 14.316 9.6824 14.2314C9.83554 14.168 10.0297 14.168 10.418 14.168Z"
                  stroke="#141B34"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.91797 7.91797C8.30625 7.91797 8.5004 7.91797 8.65354 7.9814C8.85773 8.06598 9.01996 8.22821 9.10454 8.4324C9.16797 8.58554 9.16797 8.77968 9.16797 9.16797L9.16797 10.0013C9.16797 10.3896 9.16797 10.5837 9.10453 10.7369C9.01996 10.9411 8.85773 11.1033 8.65354 11.1879C8.5004 11.2513 8.30625 11.2513 7.91797 11.2513C7.52968 11.2513 7.33554 11.2513 7.1824 11.1879C6.97821 11.1033 6.81598 10.9411 6.7314 10.7369C6.66797 10.5837 6.66797 10.3896 6.66797 10.0013L6.66797 9.16797C6.66797 8.77968 6.66797 8.58554 6.7314 8.4324C6.81598 8.22821 6.97821 8.06598 7.1824 7.9814C7.33554 7.91797 7.52968 7.91797 7.91797 7.91797Z"
                  stroke="#141B34"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Filter
            </span>
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.5 7.50004L10.5 12.5L15.5 7.5"
                stroke="#09090B"
                stroke-width="1.25"
                stroke-miterlimit="16"
              />
            </svg>
          </button>
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
                <h2 className="hotel-title">Hotel Carlton</h2>
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
              <div className="hotel-location d-flex align-items-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.3481 17.8071C10.9867 18.1455 10.5037 18.3346 10.0009 18.3346C9.49821 18.3346 9.01515 18.1455 8.65374 17.8071C5.34418 14.6896 0.908969 11.2071 3.07189 6.15102C4.24136 3.41727 7.04862 1.66797 10.0009 1.66797C12.9532 1.66797 15.7605 3.41727 16.93 6.15102C19.0902 11.2007 14.6658 14.7004 11.3481 17.8071Z"
                    stroke="#71717B"
                    stroke-width="1.25"
                  />
                  <path
                    d="M12.9173 9.16667C12.9173 10.7775 11.6115 12.0833 10.0007 12.0833C8.38982 12.0833 7.08398 10.7775 7.08398 9.16667C7.08398 7.55584 8.38982 6.25 10.0007 6.25C11.6115 6.25 12.9173 7.55584 12.9173 9.16667Z"
                    stroke="#71717B"
                    stroke-width="1.25"
                  />
                </svg>
                Switzerland
              </div>
              <div className="date-guest-number d-flex align-items-center justify-content-between">
                <div className="text-with-icon d-flex align-items-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 1.66797V3.33464M5 1.66797V3.33464"
                      stroke="#71717B"
                      stroke-width="1.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.99756 10.8359H10.005M9.99756 14.1693H10.005M13.3272 10.8359H13.3346M6.66797 10.8359H6.67545M6.66797 14.1693H6.67545"
                      stroke="#71717B"
                      stroke-width="1.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M2.91797 6.66797H17.0846"
                      stroke="#71717B"
                      stroke-width="1.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M2.08398 10.2027C2.08398 6.57161 2.08398 4.75607 3.12742 3.62803C4.17085 2.5 5.85023 2.5 9.20898 2.5H10.7923C14.1511 2.5 15.8305 2.5 16.8739 3.62803C17.9173 4.75607 17.9173 6.57161 17.9173 10.2027V10.6306C17.9173 14.2617 17.9173 16.0773 16.8739 17.2053C15.8305 18.3333 14.1511 18.3333 10.7923 18.3333H9.20898C5.85023 18.3333 4.17085 18.3333 3.12742 17.2053C2.08398 16.0773 2.08398 14.2617 2.08398 10.6306V10.2027Z"
                      stroke="#71717B"
                      stroke-width="1.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M2.5 6.66797H17.5"
                      stroke="#71717B"
                      stroke-width="1.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  12 -15 Aug 2025
                </div>
                <div className="text-with-icon d-flex align-items-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 18.3346H17.5C17.5 14.6527 14.1421 11.668 10 11.668C5.85786 11.668 2.5 14.6527 2.5 18.3346Z"
                      stroke="#71717B"
                      stroke-width="1.25"
                    />
                    <path
                      d="M13.75 5.41797C13.75 7.48904 12.0711 9.16797 10 9.16797C7.92893 9.16797 6.25 7.48904 6.25 5.41797C6.25 3.3469 7.92893 1.66797 10 1.66797C12.0711 1.66797 13.75 3.3469 13.75 5.41797Z"
                      stroke="#71717B"
                      stroke-width="1.25"
                    />
                  </svg>
                  2 Guests
                </div>
              </div>
            </div>
            <div className="hotel-bookig-action d-flex align-items-center justify-content-between">
              <button className="hotel-bookig-action-btn cancel-button">
                Cancel
              </button>
              <button className="hotel-bookig-action-btn button-primary">
                Modify
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
            </div>
            <div className="hotel-booking-info">
              <div className="hotel-title-with-rating d-flex align-items-start justify-content-between">
                <h2 className="hotel-title">Hotel Carlton</h2>
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
              <div className="hotel-location d-flex align-items-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.3481 17.8071C10.9867 18.1455 10.5037 18.3346 10.0009 18.3346C9.49821 18.3346 9.01515 18.1455 8.65374 17.8071C5.34418 14.6896 0.908969 11.2071 3.07189 6.15102C4.24136 3.41727 7.04862 1.66797 10.0009 1.66797C12.9532 1.66797 15.7605 3.41727 16.93 6.15102C19.0902 11.2007 14.6658 14.7004 11.3481 17.8071Z"
                    stroke="#71717B"
                    stroke-width="1.25"
                  />
                  <path
                    d="M12.9173 9.16667C12.9173 10.7775 11.6115 12.0833 10.0007 12.0833C8.38982 12.0833 7.08398 10.7775 7.08398 9.16667C7.08398 7.55584 8.38982 6.25 10.0007 6.25C11.6115 6.25 12.9173 7.55584 12.9173 9.16667Z"
                    stroke="#71717B"
                    stroke-width="1.25"
                  />
                </svg>
                Switzerland
              </div>
              <div className="date-guest-number d-flex align-items-center justify-content-between">
                <div className="text-with-icon d-flex align-items-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 1.66797V3.33464M5 1.66797V3.33464"
                      stroke="#71717B"
                      stroke-width="1.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.99756 10.8359H10.005M9.99756 14.1693H10.005M13.3272 10.8359H13.3346M6.66797 10.8359H6.67545M6.66797 14.1693H6.67545"
                      stroke="#71717B"
                      stroke-width="1.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M2.91797 6.66797H17.0846"
                      stroke="#71717B"
                      stroke-width="1.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M2.08398 10.2027C2.08398 6.57161 2.08398 4.75607 3.12742 3.62803C4.17085 2.5 5.85023 2.5 9.20898 2.5H10.7923C14.1511 2.5 15.8305 2.5 16.8739 3.62803C17.9173 4.75607 17.9173 6.57161 17.9173 10.2027V10.6306C17.9173 14.2617 17.9173 16.0773 16.8739 17.2053C15.8305 18.3333 14.1511 18.3333 10.7923 18.3333H9.20898C5.85023 18.3333 4.17085 18.3333 3.12742 17.2053C2.08398 16.0773 2.08398 14.2617 2.08398 10.6306V10.2027Z"
                      stroke="#71717B"
                      stroke-width="1.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M2.5 6.66797H17.5"
                      stroke="#71717B"
                      stroke-width="1.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  12 -15 Aug 2025
                </div>
                <div className="text-with-icon d-flex align-items-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 18.3346H17.5C17.5 14.6527 14.1421 11.668 10 11.668C5.85786 11.668 2.5 14.6527 2.5 18.3346Z"
                      stroke="#71717B"
                      stroke-width="1.25"
                    />
                    <path
                      d="M13.75 5.41797C13.75 7.48904 12.0711 9.16797 10 9.16797C7.92893 9.16797 6.25 7.48904 6.25 5.41797C6.25 3.3469 7.92893 1.66797 10 1.66797C12.0711 1.66797 13.75 3.3469 13.75 5.41797Z"
                      stroke="#71717B"
                      stroke-width="1.25"
                    />
                  </svg>
                  2 Guests
                </div>
              </div>
            </div>
            <div className="hotel-bookig-action d-flex align-items-center justify-content-between">
              <button className="hotel-bookig-action-btn cancel-button">
                Cancel
              </button>
              <button className="hotel-bookig-action-btn button-primary">
                Modify
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
}
