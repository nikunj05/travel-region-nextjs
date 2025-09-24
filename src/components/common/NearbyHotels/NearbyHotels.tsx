"use client";
import React, { useRef } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import testimonialsSliderUserImg1 from "@/assets/images/testimonials-slider-user-img1.png";
import testimonialsSliderUserImg2 from "@/assets/images/testimonials-slider-user-img2.png";
import testimonialsSliderUserImg3 from "@/assets/images/testimonials-slider-user-img3.png";
import NearHotelImage from "@/assets/images/nearby-hotel-img.jpg";
import starFillIcon from "@/assets/images/star-fill-icon.svg";
import "./NearbyHotels.scss";

const NearByHotels = () => {
  const sliderRef = useRef<Slider>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderUpdate = () => {
    setTimeout(() => {
      if (containerRef.current && dotsRef.current) {
        const dotsElement = containerRef.current.querySelector(".slick-dots");
        if (dotsElement) {
          dotsRef.current.innerHTML = "";
          dotsRef.current.appendChild(dotsElement);
        }
      }
    }, 0);
  };

  const settings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    infinite: true,
    autoplay: false,
    onInit: handleSliderUpdate,
    onReInit: handleSliderUpdate,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div ref={containerRef}>
      <Slider ref={sliderRef} {...settings} className="nearby-hotels-slider">
        <div className="nearby-hotels-card">
          <div className="nearby-hotels-card-img">
            <Image
              src={NearHotelImage}
              width={378}
              height={203}
              alt="Shangri-La Bangkok"
            />
          </div>
          <div className="nearby-hotels-card-details">
            <h3 className="hotel-room-name">Shangri-La Bangkok</h3>
            <div className="hotel-details-rating d-flex align-items-center">
              <div className="hotel-details-rating-star d-flex align-items-center">
                <Image
                  src={starFillIcon}
                  width={12}
                  height={12}
                  alt="star"
                  className="hotel-rating-icon"
                />
                <Image
                  src={starFillIcon}
                  width={12}
                  height={12}
                  alt="star"
                  className="hotel-rating-icon"
                />
                <Image
                  src={starFillIcon}
                  width={12}
                  height={12}
                  alt="star"
                  className="hotel-rating-icon"
                />
                <Image
                  src={starFillIcon}
                  width={12}
                  height={12}
                  alt="star"
                  className="hotel-rating-icon"
                />
                <Image
                  src={starFillIcon}
                  width={12}
                  height={12}
                  alt="star"
                  className="hotel-rating-icon"
                />
              </div>
              <span className="rating-value-wrapper d-flex align-items-center">
                <span className="rating-value">4.5</span> (120 Reviews)
              </span>
            </div>
            <div className="nearby-hotels-price-info">
              <span className="total-price">
                $34<span>/per night</span>
              </span>
              <div className="hotel-room-number">includes taxes & fees</div>
            </div>

            <div className="nearby-hotels-room-action">
              <button className="button-primary room-booking-btn w-100">
                Book Now
              </button>
            </div>
          </div>
        </div>
        <div className="nearby-hotels-card">
          <div className="nearby-hotels-card-img">
            <Image
              src={NearHotelImage}
              width={378}
              height={203}
              alt="Shangri-La Bangkok"
            />
          </div>
          <div className="nearby-hotels-card-details">
            <h3 className="hotel-room-name">Shangri-La Bangkok</h3>
            <div className="hotel-details-rating d-flex align-items-center">
              <div className="hotel-details-rating-star d-flex align-items-center">
                <Image
                  src={starFillIcon}
                  width={12}
                  height={12}
                  alt="star"
                  className="hotel-rating-icon"
                />
                <Image
                  src={starFillIcon}
                  width={12}
                  height={12}
                  alt="star"
                  className="hotel-rating-icon"
                />
                <Image
                  src={starFillIcon}
                  width={12}
                  height={12}
                  alt="star"
                  className="hotel-rating-icon"
                />
                <Image
                  src={starFillIcon}
                  width={12}
                  height={12}
                  alt="star"
                  className="hotel-rating-icon"
                />
                <Image
                  src={starFillIcon}
                  width={12}
                  height={12}
                  alt="star"
                  className="hotel-rating-icon"
                />
              </div>
              <span className="rating-value-wrapper d-flex align-items-center">
                <span className="rating-value">4.5</span> (120 Reviews)
              </span>
            </div>
            <div className="nearby-hotels-price-info">
              <span className="total-price">
                $34<span>/per night</span>
              </span>
              <div className="hotel-room-number">includes taxes & fees</div>
            </div>

            <div className="nearby-hotels-room-action">
              <button className="button-primary room-booking-btn w-100">
                Book Now
              </button>
            </div>
          </div>
        </div>
        <div className="nearby-hotels-card">
          <div className="nearby-hotels-card-img">
            <Image
              src={NearHotelImage}
              width={378}
              height={203}
              alt="Shangri-La Bangkok"
            />
          </div>
          <div className="nearby-hotels-card-details">
            <h3 className="hotel-room-name">Shangri-La Bangkok</h3>
            <div className="hotel-details-rating d-flex align-items-center">
              <div className="hotel-details-rating-star d-flex align-items-center">
                <Image
                  src={starFillIcon}
                  width={12}
                  height={12}
                  alt="star"
                  className="hotel-rating-icon"
                />
                <Image
                  src={starFillIcon}
                  width={12}
                  height={12}
                  alt="star"
                  className="hotel-rating-icon"
                />
                <Image
                  src={starFillIcon}
                  width={12}
                  height={12}
                  alt="star"
                  className="hotel-rating-icon"
                />
                <Image
                  src={starFillIcon}
                  width={12}
                  height={12}
                  alt="star"
                  className="hotel-rating-icon"
                />
                <Image
                  src={starFillIcon}
                  width={12}
                  height={12}
                  alt="star"
                  className="hotel-rating-icon"
                />
              </div>
              <span className="rating-value-wrapper d-flex align-items-center">
                <span className="rating-value">4.5</span> (120 Reviews)
              </span>
            </div>
            <div className="nearby-hotels-price-info">
              <span className="total-price">
                $34<span>/per night</span>
              </span>
              <div className="hotel-room-number">includes taxes & fees</div>
            </div>

            <div className="nearby-hotels-room-action">
              <button className="button-primary room-booking-btn w-100">
                Book Now
              </button>
            </div>
          </div>
        </div>
        <div className="nearby-hotels-card">
          <div className="nearby-hotels-card-img">
            <Image
              src={NearHotelImage}
              width={378}
              height={203}
              alt="Shangri-La Bangkok"
            />
          </div>
          <div className="nearby-hotels-card-details">
            <h3 className="hotel-room-name">Shangri-La Bangkok</h3>
            <div className="hotel-details-rating d-flex align-items-center">
              <div className="hotel-details-rating-star d-flex align-items-center">
                <Image
                  src={starFillIcon}
                  width={12}
                  height={12}
                  alt="star"
                  className="hotel-rating-icon"
                />
                <Image
                  src={starFillIcon}
                  width={12}
                  height={12}
                  alt="star"
                  className="hotel-rating-icon"
                />
                <Image
                  src={starFillIcon}
                  width={12}
                  height={12}
                  alt="star"
                  className="hotel-rating-icon"
                />
                <Image
                  src={starFillIcon}
                  width={12}
                  height={12}
                  alt="star"
                  className="hotel-rating-icon"
                />
                <Image
                  src={starFillIcon}
                  width={12}
                  height={12}
                  alt="star"
                  className="hotel-rating-icon"
                />
              </div>
              <span className="rating-value-wrapper d-flex align-items-center">
                <span className="rating-value">4.5</span> (120 Reviews)
              </span>
            </div>
            <div className="nearby-hotels-price-info">
              <span className="total-price">
                $34<span>/per night</span>
              </span>
              <div className="hotel-room-number">includes taxes & fees</div>
            </div>

            <div className="nearby-hotels-room-action">
              <button className="button-primary room-booking-btn w-100">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </Slider>
      <div className="testimonial-actions">
        <div className="testimonial-dots" ref={dotsRef}></div>
        <div className="testimonial-arrows">
          <button
            type="button"
            className="slick-prev"
            onClick={() => (sliderRef.current as any)?.slickPrev()}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 12L20 12M4 12L8.99996 17M4 12L9 7"
                stroke="#1B2236"
                strokeWidth="1.5"
              />
            </svg>
          </button>
          <button
            type="button"
            className="slick-next"
            onClick={() => (sliderRef.current as any)?.slickNext()}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 12L4 12M20 12L15.0001 17M20 12L15 7"
                stroke="#1B2236"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NearByHotels;
