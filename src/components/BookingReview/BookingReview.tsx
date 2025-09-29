"use client";
import React, { useState } from "react";
import Image from "next/image";
import "./BookingReview.scss";

import mainImage from "@/assets/images/hotel-details-img1.jpg";
import thumbnailImages1 from "@/assets/images/hotel-details-img2.jpg";
import thumbnailImages2 from "@/assets/images/hotel-details-img3.jpg";
import thumbnailImages3 from "@/assets/images/hotel-details-img4.jpg";
import thumbnailImages4 from "@/assets/images/hotel-details-img5.jpg";
import starFillIcon from "@/assets/images/star-fill-icon.svg";
import mapImage from "@/assets/images/map-image.jpg";
import BreadcrumbArrow from "@/assets/images/breadcrumb-arrow-icon.svg";
import LocationMapIcon from "@/assets/images/location-distance-icon.svg";
import LocationAddressIcon from "@/assets/images/map-icon.svg";
import FilterComponents from "../FilterComponents/FilterComponents";
import HotelImgPrevIcon from "@/assets/images/slider-prev-arrow-icon.svg";
import HotelImgNextIcon from "@/assets/images/slider-next-arrow-icon.svg";
import HotelDetailsCardImage from "@/assets/images/hotel-card-image.jpg";
import FreeBreackfast from "@/assets/images/breackfast-icon.svg";
import SelfParking from "@/assets/images/parking-icon.svg";
import ReviewSlider from "../common/ReviewSlider/ReviewSlider";
import NearByHotels from "../common/NearbyHotels/NearbyHotels";
import FaqSection from "../common/FaqSection/FaqSection";
import RoomInfoImage from "@/assets/images/room-information-image.jpg";
import ClosePopupIcon from "@/assets/images/close-btn-icon.svg";
import ImageModal from "../common/ImageModal/ImageModal";

const BookingReviewPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleOpenModal = (roomId: number) => {
    setSelectedRoom(roomId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
    setIsModalOpen(false);
  };

  const handleOpenImageModal = () => {
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
  };

  const handleTabClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    tab: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(tab);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="hotel-details-page booking-review-page padding-top-100 section-space-b">
      <div className="container">
        <div className="progress-steps">
          <div className="step completed">
            <span className="step-circle">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="16" cy="16" r="16" fill="#3E5B96" />
                <path
                  d="M10.166 16.834L13.4993 20.1673L21.8327 11.834"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span className="step-label">Hotel Selection</span>
          </div>

          <div className="step-line"></div>

          <div className="step active">
            <span className="step-circle">
              <svg
                width="33"
                height="32"
                viewBox="0 0 33 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="16.5"
                  cy="16"
                  r="15"
                  stroke="#3E5B96"
                  stroke-width="2"
                />
                <circle cx="16.5" cy="16" r="5" fill="#3E5B96" />
              </svg>
            </span>
            <span className="step-label">Your Details</span>
          </div>

          <div className="step-line"></div>

          <div className="step">
            <span className="step-circle">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="16"
                  cy="16"
                  r="15"
                  stroke="#A2B4D7"
                  stroke-width="2"
                />
              </svg>
            </span>
            <span className="step-label">Finish Booking</span>
          </div>
        </div>

        <div className="review-booking-heading">
          <h1 className="review-booking-title">Review Your Booking</h1>
          <p className="review-booking-desc">
            Please check your details before proceeding to payment.
          </p>
        </div>

        {/* <div className="booking-review-details">
          <div className="review-booking-details-left">
          
            <div className="image-gallery-section">
              <div className="main-image">
                <Image
                  src={mainImage}
                  width={892}
                  height={260}
                  alt="Novotel Bangkok"
                  className="hotel-details-main-image"
                />
              </div>
              <div className="thumbnail-images">
                <div className="thambnail-image-item">
                  <Image src={thumbnailImages1} alt="Thumbnail 1" />
                </div>
                <div className="thambnail-image-item">
                  <Image src={thumbnailImages2} alt="Thumbnail 2" />
                </div>
                <div className="thambnail-image-item">
                  <Image src={thumbnailImages3} alt="Thumbnail 3" />
                </div>
                <div className="thambnail-image-item">
                  <Image src={thumbnailImages4} alt="Thumbnail 4" />
                  <a
                    href="#"
                    className="show-all-photos"
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenImageModal();
                    }}
                  >
                    Show all 34 photos
                  </a>
                </div>
              </div>
            </div>

            <div className="tabbing-conetnt">
              
              <div className="tabbing-tabs-container">
                <div className="hotel-tabs">
                  <a
                    href="#overview"
                    onClick={(e) => handleTabClick(e, "overview")}
                  >
                    Overview
                  </a>
                  <a
                    href="#amenities"
                    onClick={(e) => handleTabClick(e, "amenities")}
                  >
                    Amenities
                  </a>
                  <a href="#rooms" onClick={(e) => handleTabClick(e, "rooms")}>
                    Rooms
                  </a>
                  <a
                    href="#reviews"
                    onClick={(e) => handleTabClick(e, "reviews")}
                  >
                    Reviews
                  </a>
                  <a href="#map" onClick={(e) => handleTabClick(e, "map")}>
                    Map
                  </a>
                </div>
              </div>

             
              <section id="overview" className="hotel-tab-section">
                <h2 className="tabbing-sub-title">Description</h2>
                <p className="hotel-description">
                  Novotel Bangkok On Siam Square Hotel is located in Bangkok.
                  This hotel is located in 4 km from the city center. Take a
                  walk and explore the neighborhood area of the hotel. Places
                  nearby: Siam Paragon Mall, MBK Center and National Stadium.
                  Spend an evening in a nice atmosphere of the bar. Stop by the
                  restaurant. If can’t live without coffee, drop by the cafe.
                  Free Wi-Fi is available on the territory. If...{" "}
                  <a href="#">Read More</a>
                </p>
              </section>
              <section className="hotel-tab-section important-tab-content">
                <h2 className="tabbing-sub-title">Important</h2>
                <div className="important-info">
                  <div className="important-item">
                    <div className="important-icon d-flex align-items-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="#09090B"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M16 12L8 12M16 12C16 12.7002 14.0057 14.0085 13.5 14.5M16 12C16 11.2998 14.0057 9.99153 13.5 9.5"
                          stroke="#09090B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Check-in
                    </div>
                    <p className="important-text">2:00 PM</p>
                  </div>
                  <div className="important-item">
                    <div className="important-icon d-flex align-items-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="#09090B"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M8 12L16 12M8 12C8 11.2998 9.9943 9.99153 10.5 9.5M8 12C8 12.7002 9.9943 14.0085 10.5 14.5"
                          stroke="#09090B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Check-out
                    </div>
                    <p className="important-text">11:00 AM</p>
                  </div>
                  <div className="important-item">
                    <div className="important-icon d-flex align-items-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                          stroke="#09090B"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M12.2422 17V12C12.2422 11.5286 12.2422 11.2929 12.0957 11.1464C11.9493 11 11.7136 11 11.2422 11"
                          stroke="#09090B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11.992 8H12.001"
                          stroke="#09090B"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Additional Facts
                    </div>
                    <p className="important-text">
                      Reception Open Until 12:00 PM
                    </p>
                  </div>
                </div>
              </section>
             
              <section
                id="amenities"
                className="hotel-tab-section amenities-tab-content"
              >
                <h2 className="tabbing-sub-title">Hotel Room & Facilities</h2>
                <div className="amenities-info d-grid">
                  <div className="amenities-item d-flex align-items-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22 21H21C19.5486 21 18.278 20.1411 18 19C17.722 20.1411 16.4514 21 15 21C13.5486 21 12.278 20.1411 12 19C11.722 20.1411 10.4514 21 9 21C7.54863 21 6.27796 20.1411 6 19C5.72204 20.1411 4.45137 21 3 21H2"
                        stroke="#2B7FFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19 3L18.7351 3.0883C17.4151 3.52832 16.755 3.74832 16.3775 4.2721C16 4.79587 16 5.49159 16 6.88304V17"
                        stroke="#2B7FFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11 3L10.7351 3.0883C9.41505 3.52832 8.75503 3.74832 8.37752 4.2721C8 4.79587 8 5.49159 8 6.88304V17"
                        stroke="#2B7FFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 7H16M8 11H16M8 15H16"
                        stroke="#2B7FFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Pool
                  </div>
                  <div className="amenities-item d-flex align-items-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 14C2 10.2288 2 8.34315 3.17157 7.17157C4.34315 6 6.22876 6 10 6H14C17.7712 6 19.6569 6 20.8284 7.17157C22 8.34315 22 10.2288 22 14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14Z"
                        stroke="#2B7FFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9 3L12 6L16 2"
                        stroke="#2B7FFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    TV
                  </div>
                  <div className="amenities-item d-flex align-items-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 12V17M3 17H5C6.41421 17 7.12132 17 7.56066 17.4393C8 17.8787 8 18.5858 8 20V21M3 17V21"
                        stroke="#2B7FFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 7L9.31672 4.08345C10.6334 3.36115 11.2918 3 12 3C12.7082 3 13.3666 3.36115 14.6833 4.08345L20 7"
                        stroke="#2B7FFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18 6V10M6 6V10"
                        stroke="#2B7FFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 12V17M21 17H19C17.5858 17 16.8787 17 16.4393 17.4393C16 17.8787 16 18.5858 16 20V21M21 17V21"
                        stroke="#2B7FFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 14H12M12 14H17M12 14V21M12 21H11M12 21H13"
                        stroke="#2B7FFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Restaurant
                  </div>
                  <div className="amenities-item d-flex align-items-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 18.5H12.0118"
                        stroke="#2B7FFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.25 15.5C10.25 13.5 13.75 13.5 15.75 15.5"
                        stroke="#2B7FFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.5 12.5C14.7324 9.16667 9.5 9.16667 5.5 12.5"
                        stroke="#2B7FFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 9.5C8.31579 4.16669 15.6842 4.16668 22 9.49989"
                        stroke="#2B7FFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Wi-Fi
                  </div>
                  <div className="amenities-item d-flex align-items-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.487 4.0402C11.1888 4.15565 11.8267 4.51665 12.287 5.05881C12.7472 5.60096 13 6.28901 13 7.0002V9.0002H7V7.0002C7 5.9612 7.528 5.0452 8.33 4.5072C8.04198 4.25074 7.68596 4.08303 7.30482 4.02425C6.92368 3.96547 6.53367 4.01814 6.18178 4.17592C5.82988 4.33369 5.5311 4.58983 5.32143 4.9135C5.11176 5.23717 5.00013 5.61455 5 6.0002V12.0002H21C21.2652 12.0002 21.5196 12.1056 21.7071 12.2931C21.8946 12.4806 22 12.735 22 13.0002C22 13.2654 21.8946 13.5198 21.7071 13.7073C21.5196 13.8948 21.2652 14.0002 21 14.0002V15.0002C21.0004 16.2413 20.616 17.4521 19.8996 18.4656C19.1832 19.4791 18.1702 20.2455 17 20.6592V21.0002C17 21.2654 16.8946 21.5198 16.7071 21.7073C16.5196 21.8948 16.2652 22.0002 16 22.0002C15.7348 22.0002 15.4804 21.8948 15.2929 21.7073C15.1054 21.5198 15 21.2654 15 21.0002H9C9 21.2654 8.89464 21.5198 8.70711 21.7073C8.51957 21.8948 8.26522 22.0002 8 22.0002C7.73478 22.0002 7.48043 21.8948 7.29289 21.7073C7.10536 21.5198 7 21.2654 7 21.0002V20.6592C5.82985 20.2455 4.81679 19.4791 4.1004 18.4656C3.38401 17.4521 2.99956 16.2413 3 15.0002V14.0002C2.73478 14.0002 2.48043 13.8948 2.29289 13.7073C2.10536 13.5198 2 13.2654 2 13.0002C2 12.735 2.10536 12.4806 2.29289 12.2931C2.48043 12.1056 2.73478 12.0002 3 12.0002V6.0002C2.99996 5.11568 3.29309 4.2561 3.83355 3.55591C4.37401 2.85571 5.13131 2.35441 5.98699 2.1304C6.84267 1.9064 7.74846 1.97233 8.56269 2.31788C9.37691 2.66344 10.0536 3.26912 10.487 4.0402ZM19 14.0002H5V15.0002C5 16.0611 5.42143 17.0785 6.17157 17.8286C6.92172 18.5788 7.93913 19.0002 9 19.0002H15C16.0609 19.0002 17.0783 18.5788 17.8284 17.8286C18.5786 17.0785 19 16.0611 19 15.0002V14.0002ZM10 6.0002C9.73478 6.0002 9.48043 6.10556 9.29289 6.29309C9.10536 6.48063 9 6.73498 9 7.0002H11C11 6.73498 10.8946 6.48063 10.7071 6.29309C10.5196 6.10556 10.2652 6.0002 10 6.0002Z"
                        fill="#2B7FFF"
                      />
                    </svg>
                    Bathtub
                  </div>
                  <div className="amenities-item d-flex align-items-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.47095 17.263L12 20.9742C11.6197 21.3637 11.255 21.7646 10.7178 21.9214C10.4486 22 10.1597 22 9.58202 22H6.64577C5.12431 22 3.69593 21.514 3.15891 19.9348C2.65447 18.4514 3.35188 15.9891 5.23816 16C5.93452 16.0041 6.44666 16.4237 7.47095 17.263Z"
                        stroke="#2B7FFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 21L16.5 10"
                        stroke="#2B7FFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17.6201 3.42328L16.1328 9.00041C16.0552 9.29151 16.1929 9.59708 16.4623 9.73182C16.7637 9.8825 17.1303 9.77151 17.2975 9.47896L20.1612 4.46745C20.5949 3.70849 20.2258 2.7425 19.3965 2.46608C18.6392 2.21363 17.8258 2.65192 17.6201 3.42328Z"
                        stroke="#2B7FFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Golf Course
                  </div>
                  <div className="amenities-item d-flex align-items-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_620_27212)">
                        <path
                          d="M8.25 7.75C8.25 8.74456 8.64509 9.69839 9.34835 10.4017C10.0516 11.1049 11.0054 11.5 12 11.5C12.9946 11.5 13.9484 11.1049 14.6517 10.4017C15.3549 9.69839 15.75 8.74456 15.75 7.75C15.75 6.75544 15.3549 5.80161 14.6517 5.09835C13.9484 4.39509 12.9946 4 12 4C11.0054 4 10.0516 4.39509 9.34835 5.09835C8.64509 5.80161 8.25 6.75544 8.25 7.75Z"
                          fill="#2B7FFF"
                        />
                        <path
                          d="M6.44963 11.5004C6.71485 11.5004 6.9692 11.395 7.15674 11.2075C7.34427 11.0199 7.44963 10.7656 7.44963 10.5004V6.50035C7.44963 5.30688 7.92373 4.16229 8.76765 3.31837C9.61156 2.47446 10.7562 2.00035 11.9496 2.00035C13.1431 2.00035 14.2877 2.47446 15.1316 3.31837C15.9755 4.16229 16.4496 5.30688 16.4496 6.50035V10.5004C16.4495 10.636 16.4769 10.7702 16.5302 10.8949C16.5836 11.0197 16.6618 11.1322 16.76 11.2257C16.8582 11.3193 16.9744 11.3919 17.1016 11.4391C17.2287 11.4863 17.3642 11.5071 17.4996 11.5004C18.21 11.4918 18.8942 11.2315 19.4306 10.7657C19.967 10.2999 20.3206 9.65887 20.4287 8.95674C20.5367 8.25461 20.392 7.53694 20.0205 6.93146C19.6489 6.32599 19.0745 5.87202 18.3996 5.65035C18.1948 4.08595 17.428 2.64944 16.2421 1.60872C15.0563 0.568008 13.5324 -0.00585938 11.9546 -0.00585938C10.3769 -0.00585937 8.85297 0.568008 7.66712 1.60872C6.48128 2.64944 5.71444 4.08595 5.50963 5.65035C4.83543 5.87168 4.2615 6.32482 3.88981 6.92928C3.51812 7.53374 3.37272 8.25039 3.47945 8.95192C3.58617 9.65345 3.93812 10.2944 4.47276 10.761C5.00739 11.2276 5.69011 11.4895 6.39963 11.5004H6.44963ZM5.74963 17.2504C5.74963 17.513 5.81429 17.7731 5.93993 18.0157C6.06557 18.2584 6.24972 18.4789 6.48186 18.6646C6.71401 18.8503 6.98961 18.9976 7.29292 19.0981C7.59623 19.1986 7.92132 19.2504 8.24963 19.2504C8.57793 19.2504 8.90302 19.1986 9.20634 19.0981C9.50965 18.9976 9.78525 18.8503 10.0174 18.6646C10.2495 18.4789 10.4337 18.2584 10.5593 18.0157C10.685 17.7731 10.7496 17.513 10.7496 17.2504C10.7496 16.9877 10.685 16.7276 10.5593 16.485C10.4337 16.2423 10.2495 16.0219 10.0174 15.8361C9.78525 15.6504 9.50965 15.5031 9.20634 15.4026C8.90302 15.3021 8.57793 15.2504 8.24963 15.2504C7.92132 15.2504 7.59623 15.3021 7.29292 15.4026C6.98961 15.5031 6.71401 15.6504 6.48186 15.8361C6.24972 16.0219 6.06557 16.2423 5.93993 16.485C5.81429 16.7276 5.74963 16.9877 5.74963 17.2504ZM13.2496 17.2504C13.2496 17.7808 13.513 18.2895 13.9819 18.6646C14.4507 19.0396 15.0866 19.2504 15.7496 19.2504C16.4127 19.2504 17.0486 19.0396 17.5174 18.6646C17.9862 18.2895 18.2496 17.7808 18.2496 17.2504C18.2496 16.7199 17.9862 16.2112 17.5174 15.8361C17.0486 15.4611 16.4127 15.2504 15.7496 15.2504C15.0866 15.2504 14.4507 15.4611 13.9819 15.8361C13.513 16.2112 13.2496 16.7199 13.2496 17.2504Z"
                          fill="#2B7FFF"
                        />
                        <path
                          d="M23.85 20.55L20.53 13.69C20.3731 13.3357 20.1166 13.0346 19.7917 12.8233C19.4668 12.6121 19.0876 12.4997 18.7 12.5H5.16003C4.7725 12.4997 4.39325 12.6121 4.06837 12.8233C3.74349 13.0346 3.48698 13.3357 3.33003 13.69L0.0900324 20.84C0.0296571 20.9646 -0.00114204 21.1015 3.23676e-05 21.24V22.24C2.48609e-05 22.7051 0.18408 23.1512 0.511984 23.481C0.839888 23.8108 1.28499 23.9974 1.75003 24H22.23C22.696 24 23.1432 23.8163 23.4746 23.4887C23.806 23.161 23.9948 22.716 24 22.25V21.25C24.0251 21.0067 23.9726 20.7617 23.85 20.55ZM5.09003 14.65C5.10955 14.6053 5.14173 14.5673 5.18259 14.5406C5.22346 14.5139 5.27124 14.4998 5.32003 14.5H18.54C18.5888 14.4998 18.6366 14.5139 18.6775 14.5406C18.7183 14.5673 18.7505 14.6053 18.77 14.65L21.15 19.9C21.1666 19.9378 21.1751 19.9787 21.1751 20.02C21.1751 20.0613 21.1666 20.1021 21.15 20.14C21.1263 20.1737 21.0948 20.2012 21.0583 20.2203C21.0218 20.2395 20.9813 20.2496 20.94 20.25H2.94003C2.89866 20.2505 2.85782 20.2407 2.82116 20.2215C2.78451 20.2023 2.7532 20.1743 2.73003 20.14C2.71075 20.1029 2.70068 20.0618 2.70068 20.02C2.70068 19.9782 2.71075 19.9371 2.73003 19.9L5.09003 14.65Z"
                          fill="#2B7FFF"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_620_27212">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    Nightclub
                  </div>
                  <div className="amenities-item d-flex align-items-center">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.3611 1.25H2.13889C1.90314 1.25 1.67705 1.34365 1.51035 1.51035C1.34365 1.67705 1.25 1.90314 1.25 2.13889V20.3611C1.25 20.5969 1.34365 20.823 1.51035 20.9897C1.67705 21.1564 1.90314 21.25 2.13889 21.25H20.3611C20.5969 21.25 20.823 21.1564 20.9897 20.9897C21.1564 20.823 21.25 20.5969 21.25 20.3611V2.13889C21.25 1.90314 21.1564 1.67705 20.9897 1.51035C20.823 1.34365 20.5969 1.25 20.3611 1.25Z"
                        stroke="#2B7FFF"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.58398 21.25V9.91667C4.58398 9.73986 4.65422 9.57029 4.77925 9.44526C4.90427 9.32024 5.07384 9.25 5.25065 9.25H14.584C14.7608 9.25 14.9304 9.32024 15.0554 9.44526C15.1804 9.57029 15.2507 9.73986 15.2507 9.91667V21.25M9.91732 9.25V21.25"
                        stroke="#2B7FFF"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.2493 13.2507C18.1609 13.2507 18.0762 13.2155 18.0136 13.153C17.9511 13.0905 17.916 13.0057 17.916 12.9173C17.916 12.8289 17.9511 12.7441 18.0136 12.6816C18.0762 12.6191 18.1609 12.584 18.2493 12.584M18.2493 13.2507C18.3378 13.2507 18.4225 13.2155 18.4851 13.153C18.5476 13.0905 18.5827 13.0057 18.5827 12.9173C18.5827 12.8289 18.5476 12.7441 18.4851 12.6816C18.4225 12.6191 18.3378 12.584 18.2493 12.584M18.2493 16.584C18.1609 16.584 18.0762 16.5489 18.0136 16.4864C17.9511 16.4238 17.916 16.3391 17.916 16.2507C17.916 16.1622 17.9511 16.0775 18.0136 16.0149C18.0762 15.9524 18.1609 15.9173 18.2493 15.9173M18.2493 16.584C18.3378 16.584 18.4225 16.5489 18.4851 16.4864C18.5476 16.4238 18.5827 16.3391 18.5827 16.2507C18.5827 16.1622 18.5476 16.0775 18.4851 16.0149C18.4225 15.9524 18.3378 15.9173 18.2493 15.9173"
                        stroke="#2B7FFF"
                        strokeWidth="1.33333"
                      />
                      <path
                        d="M7.25 5.91602H12.5833"
                        stroke="#2B7FFF"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Elevator
                  </div>
                </div>
              </section>
            </div>
          </div>
          <div className="review-booking-details-right">
            <div className="hotel-info-header">
              <h2 className="hotel-name">Novotel Bangkok</h2>
              <div className="hotel-details-rating d-flex align-items-center">
                <div className="hotel-details-rating-star d-flex align-items-center">
                  <Image
                    src={starFillIcon}
                    width={16}
                    height={16}
                    alt="star"
                    className="hotel-rating-icon"
                  />
                  <Image
                    src={starFillIcon}
                    width={16}
                    height={16}
                    alt="star"
                    className="hotel-rating-icon"
                  />
                  <Image
                    src={starFillIcon}
                    width={16}
                    height={16}
                    alt="star"
                    className="hotel-rating-icon"
                  />
                  <Image
                    src={starFillIcon}
                    width={16}
                    height={16}
                    alt="star"
                    className="hotel-rating-icon"
                  />
                  <Image
                    src={starFillIcon}
                    width={16}
                    height={16}
                    alt="star"
                    className="hotel-rating-icon"
                  />
                </div>
                <span className="rating-value-wrapper d-flex align-items-center">
                  <span className="rating-value">4.5</span> (120 Reviews)
                </span>
              </div>
              <div className="distance d-flex align-items-center">
                <Image
                  src={LocationMapIcon}
                  width={20}
                  height={20}
                  alt="location ,ap icon"
                  className="hotel-rating-icon"
                />
                2.4km away from city center
              </div>
              <div className="location-address d-flex align-items-start">
                <Image
                  src={LocationAddressIcon}
                  width={20}
                  height={20}
                  alt="location"
                  className="hotel-address-icon"
                />
                Soi 6 Rama I Road Pathumwan, Siam, Bangkok, Thailand 10330
              </div>

              <div className="hotel-price-info">
                <div className="price">
                  Price: Starts from <span>$500</span>/night
                </div>
                <div className="check-availability-action">
                  <button className="button-primary check-availability-btn">
                    Check Availability
                  </button>
                </div>
              </div>
              <div className="free-cancellation-section d-flex align-items-center">
                <span>Free Cancellation</span>
                <span>No Repay</span>
              </div>
              <div className="share-like-section d-flex align-items-center">
                <button className="share-btn favarite-btn">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z"
                      stroke="#FB2C36"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Favorite
                </button>
                <button className="share-btn">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 7C18.7745 7.16058 19.3588 7.42859 19.8284 7.87589C21 8.99181 21 10.7879 21 14.38C21 17.9721 21 19.7681 19.8284 20.8841C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8841C3 19.7681 3 17.9721 3 14.38C3 10.7879 3 8.99181 4.17157 7.87589C4.64118 7.42859 5.2255 7.16058 6 7"
                      stroke="#2B7FFF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12.0253 2.00052L12 14M12.0253 2.00052C11.8627 1.99379 11.6991 2.05191 11.5533 2.17492C10.6469 2.94006 9 4.92886 9 4.92886M12.0253 2.00052C12.1711 2.00657 12.3162 2.06476 12.4468 2.17508C13.3531 2.94037 15 4.92886 15 4.92886"
                      stroke="#2B7FFF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </main>
  );
};

export default BookingReviewPage;
