"use client";
import React, { useState } from "react";
import Image from "next/image";
import "./BookingReview.scss";
import mainImage from "@/assets/images/hotel-details-img1.jpg";
import FreeBreackfast from "@/assets/images/breackfast-icon.svg";
import SelfParking from "@/assets/images/parking-icon.svg";
import PoolIcon from "@/assets/images/pool-icon.svg";
import ReviewStarFill from "@/assets/images/star-fill-icon.svg";
import BookingHotelInfoImage from "@/assets/images/booking-hotel-info-image.jpg";

const BookingReviewPage = () => {
  return (
    <main className="booking-review-page padding-top-100 section-space-b">
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
              <span className="mobile-progress-line d-md-none"></span>
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
              <span className="mobile-progress-line d-md-none"></span>
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
              <span className="mobile-progress-line d-md-none"></span>
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

        <div className="booking-review-details">
          <div className="review-booking-details-left">
            <div className="image-gallery-section">
              <div className="main-image">
                <Image
                  src={mainImage}
                  width={894}
                  height={242}
                  alt="Novotel Bangkok"
                  className="hotel-details-main-image"
                />
              </div>
              <div className="booking-hotel-details">
                <h2 className="booking-hotel-name">Novotel</h2>
                <div className="booking-hotel-rating">
                  <div className="rating-stars d-flex align-items-center">
                    <Image
                      src={ReviewStarFill}
                      alt="star icon"
                      width="16"
                      height="16"
                    />
                    <Image
                      src={ReviewStarFill}
                      alt="star icon"
                      width="16"
                      height="16"
                    />
                    <Image
                      src={ReviewStarFill}
                      alt="star icon"
                      width="16"
                      height="16"
                    />
                    <Image
                      src={ReviewStarFill}
                      alt="star icon"
                      width="16"
                      height="16"
                    />
                    <Image
                      src={ReviewStarFill}
                      alt="star icon"
                      width="16"
                      height="16"
                    />
                  </div>
                  <span className="rating-reviews d-flex align-items-center">
                    <span className="rating-score">4.5</span>(120 Reviews)
                  </span>
                </div>
                <div className="booking-hotel-location">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.001 1.04297C13.1894 1.04302 16.2316 2.92894 17.5049 5.90527C18.6881 8.67161 18.0488 11.0313 16.7148 13.0518C15.6084 14.7276 13.9888 16.2195 12.5322 17.5615C12.2736 17.7998 12.0199 18.0337 11.7754 18.2627C11.2962 18.7113 10.6596 18.959 10.001 18.959C9.34232 18.959 8.70575 18.7113 8.22656 18.2627L8.22559 18.2617C7.96677 18.0179 7.69759 17.7687 7.42285 17.5146C5.98196 16.1822 4.38411 14.7057 3.28906 13.0508C1.9535 11.0324 1.31232 8.67508 2.49707 5.90527C3.77033 2.9289 6.81251 1.04297 10.001 1.04297ZM10 5.83398C8.15905 5.83398 6.66602 7.32702 6.66602 9.16797C6.66619 11.0088 8.15916 12.501 10 12.501C11.8406 12.5007 13.3328 11.0086 13.333 9.16797C13.333 7.32717 11.8407 5.83422 10 5.83398Z"
                      fill="#6F8DC1"
                    />
                  </svg>

                  <span>
                    Soi 6 Rama I Road Pathumwan, Siam, Bangkok, Thailand 10330
                  </span>
                </div>
                <div className="booking-hotel-amenities">
                  <div className="amenity-tag d-flex align-items-center">
                    <Image
                      src={FreeBreackfast}
                      width={24}
                      height={24}
                      alt="Free continental breakfast"
                    />
                    <span className="amenity-tag-name">Breakfast</span>
                  </div>
                  <div className="amenity-tag d-flex align-items-center">
                    <Image
                      src={SelfParking}
                      width={24}
                      height={24}
                      alt="Free continental breakfast"
                    />
                    <span className="amenity-tag-name">Parking</span>
                  </div>
                  <div className="amenity-tag d-flex align-items-center">
                    <Image
                      src={PoolIcon}
                      width={24}
                      height={24}
                      alt="Free continental breakfast"
                    />
                    <span className="amenity-tag-name">Pool</span>
                  </div>
                </div>
                <div className="booking-box-action">
                  <a href="#" className="booking-edit-btn">
                    Change Hotel
                  </a>
                </div>
              </div>
            </div>
            <div className="booking-detail-box booking-stays-details">
              <h3 className="booking-details-sub-title">Stays Details</h3>
              <ul className="booking-listing-info">
                <li className="booking-listing-item d-flex align-items-center justify-content-between">
                  <div className="booking-list-left d-flex align-items-center">
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
                        stroke-width="1.5"
                      />
                      <path
                        d="M16 12L8 12M16 12C16 12.7002 14.0057 14.0085 13.5 14.5M16 12C16 11.2998 14.0057 9.99153 13.5 9.5"
                        stroke="#09090B"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    Check-in
                  </div>
                  <div className="booking-list-right d-flex align-items-center">
                    8 Aug 2025(from 2:00 PM)
                  </div>
                </li>
                <li className="booking-listing-item d-flex align-items-center justify-content-between">
                  <div className="booking-list-left d-flex align-items-center">
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
                        stroke-width="1.5"
                      />
                      <path
                        d="M8 12L16 12M8 12C8 11.2998 9.9943 9.99153 10.5 9.5M8 12C8 12.7002 9.9943 14.0085 10.5 14.5"
                        stroke="#09090B"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    Check-out
                  </div>
                  <div className="booking-list-right d-flex align-items-center">
                    18 Aug 2025(until 12:00 PM)
                  </div>
                </li>
                <li className="booking-listing-item d-flex align-items-center justify-content-between">
                  <div className="booking-list-left d-flex align-items-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 19V13C2 12.55 2.09167 12.1417 2.275 11.775C2.45833 11.4083 2.7 11.0833 3 10.8V8C3 7.16667 3.29167 6.45833 3.875 5.875C4.45833 5.29167 5.16667 5 6 5H10C10.3833 5 10.7417 5.071 11.075 5.213C11.4083 5.355 11.7167 5.55067 12 5.8C12.2833 5.55 12.5917 5.35433 12.925 5.213C13.2583 5.07167 13.6167 5.00067 14 5H18C18.8333 5 19.5417 5.29167 20.125 5.875C20.7083 6.45833 21 7.16667 21 8V10.8C21.3 11.0833 21.5417 11.4083 21.725 11.775C21.9083 12.1417 22 12.55 22 13V19H20V17H4V19H2ZM13 10H19V8C19 7.71667 18.904 7.47933 18.712 7.288C18.52 7.09667 18.2827 7.00067 18 7H14C13.7167 7 13.4793 7.096 13.288 7.288C13.0967 7.48 13.0007 7.71733 13 8V10ZM5 10H11V8C11 7.71667 10.904 7.47933 10.712 7.288C10.52 7.09667 10.2827 7.00067 10 7H6C5.71667 7 5.47933 7.096 5.288 7.288C5.09667 7.48 5.00067 7.71733 5 8V10ZM4 15H20V13C20 12.7167 19.904 12.4793 19.712 12.288C19.52 12.0967 19.2827 12.0007 19 12H5C4.71667 12 4.47933 12.096 4.288 12.288C4.09667 12.48 4.00067 12.7173 4 13V15Z"
                        fill="#09090B"
                      />
                    </svg>
                    Total Length of Stay
                  </div>
                  <div className="booking-list-right d-flex align-items-center">
                    10 Nights
                  </div>
                </li>
                <li className="booking-listing-item d-flex align-items-center justify-content-between">
                  <div className="booking-list-left d-flex align-items-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 20C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4"
                        stroke="#09090B"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M4 6.84771V17.1523C4 18.7454 4 19.542 4.4645 20.0976C4.92899 20.6531 5.71415 20.7956 7.28446 21.0806L10.2845 21.6251C12.4701 22.0217 13.563 22.2201 14.2815 21.6215C15 21.023 15 19.9142 15 17.6968V6.30325C15 4.08578 15 2.97704 14.2815 2.37849C13.563 1.77994 12.4701 1.97827 10.2845 2.37495L7.28446 2.91941C5.71415 3.2044 4.92899 3.34689 4.4645 3.90244C4 4.45799 4 5.25457 4 6.84771Z"
                        stroke="#09090B"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M11.5 11.9983V11.9883"
                        stroke="#09090B"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    Room Type
                  </div>
                  <div className="booking-list-right d-flex align-items-center">
                    Deluxe King Room
                  </div>
                </li>
              </ul>
              <div className="booking-inner-box">
                <h4 className="booking-inner-title">Free Amenities</h4>
                <div className="booking-inner-list d-flex align-items-center">
                  <Image
                    src={FreeBreackfast}
                    width={24}
                    height={24}
                    alt="Free continental breakfast"
                  />
                  Free continental breakfast
                </div>
                <div className="booking-inner-list d-flex align-items-center">
                  <Image
                    src={SelfParking}
                    width={24}
                    height={24}
                    alt="Free self parking"
                  />
                  Free self parking
                </div>
              </div>
              <div className="booking-box-action">
                <a href="#" className="booking-edit-btn">
                  Edit Dates
                </a>
              </div>
            </div>

            <div className="booking-detail-box booking-price-details ">
              <h3 className="booking-details-sub-title">Price Details</h3>
              <ul className="booking-listing-info">
                <li className="booking-listing-item d-flex align-items-center justify-content-between">
                  <div className="booking-list-left d-flex align-items-center">
                    10 night x 1 room x $40
                  </div>
                  <div className="booking-list-right d-flex align-items-center">
                    $400.00
                  </div>
                </li>
                <li className="booking-listing-item tax-fees d-flex align-items-center justify-content-between">
                  <div className="booking-list-left d-flex align-items-center">
                    Taxes & Fees
                  </div>
                  <div className="booking-list-right d-flex align-items-center">
                    $140.00
                  </div>
                </li>
                <div className="booking-review-separetor"></div>
                <li className="booking-listing-item d-flex align-items-center justify-content-between">
                  <div className="booking-list-left d-flex align-items-center">
                    Total
                  </div>
                  <div className="booking-list-right d-flex align-items-center">
                    $540.00
                  </div>
                </li>
                <li className="booking-listing-item discount d-flex align-items-center justify-content-between">
                  <div className="booking-list-left d-flex align-items-center">
                    Discount
                  </div>
                  <div className="booking-list-right d-flex align-items-center">
                    -$51
                  </div>
                </li>
                <div className="booking-review-separetor spacing-30"></div>
                <li className="booking-listing-item booking-sub-total d-flex align-items-center justify-content-between">
                  <div className="booking-list-left d-flex align-items-center">
                    Sub Total
                  </div>
                  <div className="booking-list-right d-flex align-items-center">
                    $489.00
                  </div>
                </li>
              </ul>
              <div className="booking-rates">Rates are quoted in USD($)</div>
              <div className="booking-price-increase d-flex align-items-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.66602 8.54102C1.32084 8.54102 1.04102 8.82084 1.04102 9.16602C1.04102 9.51119 1.32084 9.79102 1.66602 9.79102V9.16602V8.54102ZM18.3327 11.4577C18.6779 11.4577 18.9577 11.1779 18.9577 10.8327C18.9577 10.4875 18.6779 10.2077 18.3327 10.2077V10.8327V11.4577ZM1.66602 9.16602V9.79102H3.29597V9.16602V8.54102H1.66602V9.16602ZM6.6998 12.4993H6.0748V14.2364H6.6998H7.3248V12.4993H6.6998ZM9.95988 14.2364H10.5849V5.80387H9.95988H9.33488V14.2364H9.95988ZM13.3049 5.80387H12.6799V7.49935H13.3049H13.9299V5.80387H13.3049ZM16.7087 10.8327V11.4577H18.3327V10.8327V10.2077H16.7087V10.8327ZM13.3049 7.49935H12.6799C12.6799 9.69774 14.496 11.4577 16.7087 11.4577V10.8327V10.2077C15.1616 10.2077 13.9299 8.98285 13.9299 7.49935H13.3049ZM11.6324 4.16602V4.79102C12.2233 4.79102 12.6799 5.25675 12.6799 5.80387H13.3049H13.9299C13.9299 4.54187 12.8889 3.54102 11.6324 3.54102V4.16602ZM9.95988 5.80387H10.5849C10.5849 5.25675 11.0415 4.79102 11.6324 4.79102V4.16602V3.54102C10.3759 3.54102 9.33488 4.54187 9.33488 5.80387H9.95988ZM8.32984 15.8327V16.4577C9.56287 16.4577 10.5849 15.4754 10.5849 14.2364H9.95988H9.33488C9.33488 14.7606 8.89731 15.2077 8.32984 15.2077V15.8327ZM6.6998 14.2364H6.0748C6.0748 15.4754 7.09681 16.4577 8.32984 16.4577V15.8327V15.2077C7.76238 15.2077 7.3248 14.7606 7.3248 14.2364H6.6998ZM3.29597 9.16602V9.79102C4.84308 9.79102 6.0748 11.0158 6.0748 12.4993H6.6998H7.3248C7.3248 10.301 5.50864 8.54102 3.29597 8.54102V9.16602Z"
                    fill="#27272A"
                  />
                  <path
                    d="M16.666 12.4993C16.666 12.4993 18.3327 11.2719 18.3327 10.8327C18.3327 10.3935 16.666 9.16602 16.666 9.16602"
                    stroke="#27272A"
                    stroke-width="1.25"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                This Price may increase if you book later
              </div>
              <div className="booking-box-action">
                <a href="#" className="booking-edit-btn">
                  Use a coupon
                </a>
              </div>
            </div>

            <div className="booking-detail-box booking-cancel-cost">
              <h3 className="booking-details-sub-title">
                How much will it cost to cancel?
              </h3>
              <ul className="booking-listing-info">
                <li className="booking-listing-item d-flex align-items-center justify-content-between">
                  <div className="booking-list-left d-flex align-items-center">
                    10 night x 1 room x $40
                  </div>
                  <div className="booking-list-right d-flex align-items-center">
                    $400.00
                  </div>
                </li>
              </ul>
            </div>

            <div className="booking-detail-box booking-traveler-details">
              <h3 className="booking-details-sub-title">Traveler Details</h3>
              <div className="booking-details-form mandatory-field">
                <h3 className="booking-form-title">
                  Primary Guest <span className="text-red">(Mandatory)</span>
                </h3>
                <form action="" className="booking-form-content form-field ">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName " className="form-label">
                        First Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        placeholder="Your first name"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="lastName" className="form-label">
                        Last Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        placeholder="Your Last name"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName " className="form-label">
                        Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Your first email"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="lastName" className="form-label">
                        Country/ Region <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="Your country"
                        placeholder="Your country"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName " className="form-label">
                        Phone Number <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="PhoneNumberl"
                        placeholder="Your number"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group"></div>
                  </div>
                </form>
              </div>

              <div className="booking-details-form">
                <h3 className="booking-form-title">
                  Guest 2 <span> (Optional)</span>
                </h3>
                <form action="" className="booking-form-content form-field ">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName " className="form-label">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        placeholder="Your first name"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="lastName" className="form-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        placeholder="Your Last name"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName " className="form-label">
                        Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Your first email"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="lastName" className="form-label">
                        Country/ Region
                      </label>
                      <input
                        type="text"
                        id="Your country"
                        placeholder="Your country"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName " className="form-label">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        id="PhoneNumberl"
                        placeholder="Your number"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group"></div>
                  </div>
                </form>
              </div>

              <div className="booking-details-form">
                <h3 className="booking-form-title">
                  Guest 3 <span> (Optional)</span>
                </h3>
                <form action="" className="booking-form-content form-field ">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName " className="form-label">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        placeholder="Your first name"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="lastName" className="form-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        placeholder="Your Last name"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName " className="form-label">
                        Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Your first email"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="lastName" className="form-label">
                        Country/ Region
                      </label>
                      <input
                        type="text"
                        id="Your country"
                        placeholder="Your country"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName " className="form-label">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        id="PhoneNumberl"
                        placeholder="Your number"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group"></div>
                  </div>
                </form>
              </div>

              <div className="booking-details-form special-request-field">
                <h3 className="booking-form-title">Special Request</h3>
                <p className="booking-form-desc">
                  Please write your request in English or Arabic.
                </p>
                <form action="" className="booking-form-content form-field ">
                  <div className="form-row">
                    <div className="form-group d-flex">
                      <textarea
                        id="specialRequests"
                        rows={5}
                        placeholder="Enter any requests..."
                        className="form-input w-100 text-field"
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="review-booking-details-right">
            <div className="hotel-info-header">
              <div className="booking-hotel-info d-flex align-items-start">
                <div className="booking-hotel-image">
                  <Image
                    src={BookingHotelInfoImage}
                    width={44}
                    height={44}
                    alt="hotel image"
                    className="booking-hotel-img"
                  />
                </div>
                <div className="booking-hotel-content">
                  <h3 className="hotel-name">Novotel Bangkok</h3>
                  <span className="booking-guest-info">
                    2 Guests • 10 Nights
                  </span>
                </div>
              </div>

              <div className="booking-price-info">
                <div className="booking-price-item d-flex align-items-center">
                  <div className="booking-iocn-with-text d-flex align-items-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 12C2 8.46252 2 6.69377 3.0528 5.5129C3.22119 5.32403 3.40678 5.14935 3.60746 4.99087C4.86213 4 6.74142 4 10.5 4H13.5C17.2586 4 19.1379 4 20.3925 4.99087C20.5932 5.14935 20.7788 5.32403 20.9472 5.5129C22 6.69377 22 8.46252 22 12C22 15.5375 22 17.3062 20.9472 18.4871C20.7788 18.676 20.5932 18.8506 20.3925 19.0091C19.1379 20 17.2586 20 13.5 20H10.5C6.74142 20 4.86213 20 3.60746 19.0091C3.40678 18.8506 3.22119 18.676 3.0528 18.4871C2 17.3062 2 15.5375 2 12Z"
                        stroke="#09090B"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M14.551 12C14.551 13.3807 13.4317 14.5 12.051 14.5C10.6703 14.5 9.55099 13.3807 9.55099 12C9.55099 10.6193 10.6703 9.5 12.051 9.5C13.4317 9.5 14.551 10.6193 14.551 12Z"
                        stroke="#09090B"
                        stroke-width="1.5"
                      />
                      <path
                        d="M5 12L6 12"
                        stroke="#09090B"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M18 12L19 12"
                        stroke="#09090B"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                    </svg>
                    Hotel Fare
                  </div>
                  <div className="booking-pricing">$540</div>
                </div>
                <div className="booking-price-item d-flex align-items-center">
                  <div className="booking-iocn-with-text d-flex align-items-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="1.5"
                        cy="1.5"
                        r="1.5"
                        transform="matrix(1 0 0 -1 16 8)"
                        stroke="#09090B"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M2.77423 11.1439C1.77108 12.2643 1.7495 13.9546 2.67016 15.1437C4.49711 17.5033 6.49674 19.5029 8.85633 21.3298C10.0454 22.2505 11.7357 22.2289 12.8561 21.2258C15.8979 18.5022 18.6835 15.6559 21.3719 12.5279C21.6377 12.2187 21.8039 11.8397 21.8412 11.4336C22.0062 9.63798 22.3452 4.46467 20.9403 3.05974C19.5353 1.65481 14.362 1.99377 12.5664 2.15876C12.1603 2.19608 11.7813 2.36233 11.472 2.62811C8.34412 5.31646 5.49781 8.10211 2.77423 11.1439Z"
                        stroke="#09090B"
                        stroke-width="1.5"
                      />
                      <path
                        d="M7 14L10 17"
                        stroke="#09090B"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    Discount
                  </div>
                  <div className="booking-pricing discount">-$51</div>
                </div>
                <div className="booking-review-separetor"></div>
                <div className="booking-tital-price d-flex align-items-center justify-content-between">
                  <span>Total Price</span>
                  <span>$51</span>
                </div>
                <div className="booking-price-tax">
                  Included all taxes & fees
                </div>
              </div>
              <div className="check-availability-action">
                <button className="button-primary check-availability-btn">
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookingReviewPage;
