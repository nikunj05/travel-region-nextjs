"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import testimonialsSliderUserImg1 from "@/assets/images/testimonials-slider-user-img1.png";
import testimonialsSliderUserImg2 from "@/assets/images/testimonials-slider-user-img2.png";
import testimonialsSliderUserImg3 from "@/assets/images/testimonials-slider-user-img3.png";
import "./ReviewSlider.scss";

const ReviewSlider = ({ slidesToShowDesktop = 3 }: { slidesToShowDesktop?: number }) => {
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
    slidesToShow: slidesToShowDesktop,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    infinite: true,
    autoplay: false,
    onInit: handleSliderUpdate,
    onReInit: handleSliderUpdate,
    afterChange: handleSliderUpdate,
    swipeToSlide: true,
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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      const slider = sliderRef.current;
      try {
        slider?.innerSlider?.onWindowResized?.();
      } catch {}
      handleSliderUpdate();
    });

    ro.observe(container);
    // Kick once on mount to ensure proper layout (e.g., when inside a modal)
    setTimeout(() => {
      const slider = sliderRef.current;
      try {
        slider?.innerSlider?.onWindowResized?.();
        slider?.slickGoTo?.(0, true);
      } catch {}
      handleSliderUpdate();
    }, 0);

    return () => {
      try {
        ro.disconnect();
      } catch {}
    };
  }, []);

  return (
    <div ref={containerRef}>
      <Slider ref={sliderRef} {...settings} className="review-slider">
        <div className="review-card">
          <div className="review-card-rating d-flex align-items-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.99577 1.04102C10.8702 1.04102 11.5589 1.70146 11.9986 2.59261L13.467 5.55365C13.5115 5.64529 13.6171 5.77433 13.7757 5.89238C13.9343 6.0103 14.0895 6.07536 14.1916 6.09252L16.8496 6.53779C17.8098 6.69913 18.6145 7.16976 18.8757 7.98927C19.1368 8.80809 18.7543 9.65902 18.0639 10.3507L18.0632 10.3514L15.9983 12.4334C15.9164 12.5159 15.8248 12.6714 15.7673 12.8739C15.7102 13.075 15.7051 13.2582 15.731 13.3766L15.7314 13.3783L16.3221 15.9538C16.5671 17.0258 16.486 18.0888 15.7299 18.6445C14.9713 19.2021 13.9346 18.955 12.9928 18.394L10.5012 16.9069C10.3965 16.8443 10.2168 16.7937 9.99994 16.7937C9.78463 16.7937 9.60116 16.8437 9.48972 16.9085L9.48815 16.9094L7.00143 18.3937C6.06073 18.9566 5.02531 19.1994 4.26661 18.6412C3.5111 18.0854 3.42581 17.0244 3.67162 15.9533L4.26227 13.3783L4.26263 13.3766C4.28853 13.2582 4.28346 13.075 4.22635 12.8739C4.16886 12.6714 4.07718 12.5159 3.99534 12.4334L1.9289 10.3499C1.2429 9.65821 0.861696 8.80802 1.12065 7.99039C1.38035 7.17039 2.18355 6.69918 3.1443 6.53773L5.80012 6.09284L5.80097 6.0927C5.89833 6.07581 6.05128 6.01148 6.20942 5.89325C6.36786 5.7748 6.47368 5.64548 6.51829 5.55365L6.52054 5.54907L7.98704 2.59183L7.98762 2.59066C8.43149 1.70025 9.12239 1.04102 9.99577 1.04102Z"
                fill="#FFDF20"
              />
            </svg>

            <span>4.9 Rating</span>
          </div>
          <div className="review-description-with-action">
            <p className="review-text">
              The staff at Prime Park Hotel truly ‘went the extra mile’,
              arranging for boxed breakfast for our early ferry trip, arranging
              transport for us, checking
            </p>
            <div className="review-description-show-more">
              <a href="#">See More</a>
            </div>
          </div>
          <div className="review-footer d-flex align-items-end justify-content-between">
            <div className="review-header-user d-flex align-items-center">
              <Image
                src={testimonialsSliderUserImg1}
                width={40}
                height={40}
                alt="Steven"
                className="review-avatar"
              />
              <div className="review-user-content">
                <h6 className="review-user-title">Steven</h6>
                <span className="review-user-state">United Arab Emirates</span>
              </div>
            </div>
            <div className="review-post-date">
              <span className="review-post-date-text">25 June 2025</span>
            </div>
          </div>
        </div>
        <div className="review-card">
          <div className="review-card-rating d-flex align-items-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.99577 1.04102C10.8702 1.04102 11.5589 1.70146 11.9986 2.59261L13.467 5.55365C13.5115 5.64529 13.6171 5.77433 13.7757 5.89238C13.9343 6.0103 14.0895 6.07536 14.1916 6.09252L16.8496 6.53779C17.8098 6.69913 18.6145 7.16976 18.8757 7.98927C19.1368 8.80809 18.7543 9.65902 18.0639 10.3507L18.0632 10.3514L15.9983 12.4334C15.9164 12.5159 15.8248 12.6714 15.7673 12.8739C15.7102 13.075 15.7051 13.2582 15.731 13.3766L15.7314 13.3783L16.3221 15.9538C16.5671 17.0258 16.486 18.0888 15.7299 18.6445C14.9713 19.2021 13.9346 18.955 12.9928 18.394L10.5012 16.9069C10.3965 16.8443 10.2168 16.7937 9.99994 16.7937C9.78463 16.7937 9.60116 16.8437 9.48972 16.9085L9.48815 16.9094L7.00143 18.3937C6.06073 18.9566 5.02531 19.1994 4.26661 18.6412C3.5111 18.0854 3.42581 17.0244 3.67162 15.9533L4.26227 13.3783L4.26263 13.3766C4.28853 13.2582 4.28346 13.075 4.22635 12.8739C4.16886 12.6714 4.07718 12.5159 3.99534 12.4334L1.9289 10.3499C1.2429 9.65821 0.861696 8.80802 1.12065 7.99039C1.38035 7.17039 2.18355 6.69918 3.1443 6.53773L5.80012 6.09284L5.80097 6.0927C5.89833 6.07581 6.05128 6.01148 6.20942 5.89325C6.36786 5.7748 6.47368 5.64548 6.51829 5.55365L6.52054 5.54907L7.98704 2.59183L7.98762 2.59066C8.43149 1.70025 9.12239 1.04102 9.99577 1.04102Z"
                fill="#FFDF20"
              />
            </svg>

            <span>4.9 Rating</span>
          </div>
          <div className="review-description-with-action">
            <p className="review-text">
              The staff at Prime Park Hotel truly ‘went the extra mile’,
              arranging for boxed breakfast for our early ferry trip, arranging
              transport for us, checking
            </p>
            <div className="review-description-show-more">
              <a href="#">See More</a>
            </div>
          </div>
          <div className="review-footer d-flex align-items-end justify-content-between">
            <div className="review-header-user d-flex align-items-center">
              <Image
                src={testimonialsSliderUserImg2}
                width={40}
                height={40}
                alt="Steven"
                className="review-avatar"
              />
              <div className="review-user-content">
                <h6 className="review-user-title">Steven</h6>
                <span className="review-user-state">United Arab Emirates</span>
              </div>
            </div>
            <div className="review-post-date">
              <span className="review-post-date-text">25 June 2025</span>
            </div>
          </div>
        </div>
        <div className="review-card">
          <div className="review-card-rating d-flex align-items-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.99577 1.04102C10.8702 1.04102 11.5589 1.70146 11.9986 2.59261L13.467 5.55365C13.5115 5.64529 13.6171 5.77433 13.7757 5.89238C13.9343 6.0103 14.0895 6.07536 14.1916 6.09252L16.8496 6.53779C17.8098 6.69913 18.6145 7.16976 18.8757 7.98927C19.1368 8.80809 18.7543 9.65902 18.0639 10.3507L18.0632 10.3514L15.9983 12.4334C15.9164 12.5159 15.8248 12.6714 15.7673 12.8739C15.7102 13.075 15.7051 13.2582 15.731 13.3766L15.7314 13.3783L16.3221 15.9538C16.5671 17.0258 16.486 18.0888 15.7299 18.6445C14.9713 19.2021 13.9346 18.955 12.9928 18.394L10.5012 16.9069C10.3965 16.8443 10.2168 16.7937 9.99994 16.7937C9.78463 16.7937 9.60116 16.8437 9.48972 16.9085L9.48815 16.9094L7.00143 18.3937C6.06073 18.9566 5.02531 19.1994 4.26661 18.6412C3.5111 18.0854 3.42581 17.0244 3.67162 15.9533L4.26227 13.3783L4.26263 13.3766C4.28853 13.2582 4.28346 13.075 4.22635 12.8739C4.16886 12.6714 4.07718 12.5159 3.99534 12.4334L1.9289 10.3499C1.2429 9.65821 0.861696 8.80802 1.12065 7.99039C1.38035 7.17039 2.18355 6.69918 3.1443 6.53773L5.80012 6.09284L5.80097 6.0927C5.89833 6.07581 6.05128 6.01148 6.20942 5.89325C6.36786 5.7748 6.47368 5.64548 6.51829 5.55365L6.52054 5.54907L7.98704 2.59183L7.98762 2.59066C8.43149 1.70025 9.12239 1.04102 9.99577 1.04102Z"
                fill="#FFDF20"
              />
            </svg>

            <span>4.9 Rating</span>
          </div>
          <div className="review-description-with-action">
            <p className="review-text">
              The staff at Prime Park Hotel truly ‘went the extra mile’,
              arranging for boxed breakfast for our early ferry trip, arranging
              transport for us, checking
            </p>
            <div className="review-description-show-more">
              <a href="#">See More</a>
            </div>
          </div>
          <div className="review-footer d-flex align-items-end justify-content-between">
            <div className="review-header-user d-flex align-items-center">
              <Image
                src={testimonialsSliderUserImg3}
                width={40}
                height={40}
                alt="Steven"
                className="review-avatar"
              />
              <div className="review-user-content">
                <h6 className="review-user-title">Steven</h6>
                <span className="review-user-state">United Arab Emirates</span>
              </div>
            </div>
            <div className="review-post-date">
              <span className="review-post-date-text">25 June 2025</span>
            </div>
          </div>
        </div>
        <div className="review-card">
          <div className="review-card-rating d-flex align-items-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.99577 1.04102C10.8702 1.04102 11.5589 1.70146 11.9986 2.59261L13.467 5.55365C13.5115 5.64529 13.6171 5.77433 13.7757 5.89238C13.9343 6.0103 14.0895 6.07536 14.1916 6.09252L16.8496 6.53779C17.8098 6.69913 18.6145 7.16976 18.8757 7.98927C19.1368 8.80809 18.7543 9.65902 18.0639 10.3507L18.0632 10.3514L15.9983 12.4334C15.9164 12.5159 15.8248 12.6714 15.7673 12.8739C15.7102 13.075 15.7051 13.2582 15.731 13.3766L15.7314 13.3783L16.3221 15.9538C16.5671 17.0258 16.486 18.0888 15.7299 18.6445C14.9713 19.2021 13.9346 18.955 12.9928 18.394L10.5012 16.9069C10.3965 16.8443 10.2168 16.7937 9.99994 16.7937C9.78463 16.7937 9.60116 16.8437 9.48972 16.9085L9.48815 16.9094L7.00143 18.3937C6.06073 18.9566 5.02531 19.1994 4.26661 18.6412C3.5111 18.0854 3.42581 17.0244 3.67162 15.9533L4.26227 13.3783L4.26263 13.3766C4.28853 13.2582 4.28346 13.075 4.22635 12.8739C4.16886 12.6714 4.07718 12.5159 3.99534 12.4334L1.9289 10.3499C1.2429 9.65821 0.861696 8.80802 1.12065 7.99039C1.38035 7.17039 2.18355 6.69918 3.1443 6.53773L5.80012 6.09284L5.80097 6.0927C5.89833 6.07581 6.05128 6.01148 6.20942 5.89325C6.36786 5.7748 6.47368 5.64548 6.51829 5.55365L6.52054 5.54907L7.98704 2.59183L7.98762 2.59066C8.43149 1.70025 9.12239 1.04102 9.99577 1.04102Z"
                fill="#FFDF20"
              />
            </svg>

            <span>4.9 Rating</span>
          </div>
          <div className="review-description-with-action">
            <p className="review-text">
              The staff at Prime Park Hotel truly ‘went the extra mile’,
              arranging for boxed breakfast for our early ferry trip, arranging
              transport for us, checking
            </p>
            <div className="review-description-show-more">
              <a href="#">See More</a>
            </div>
          </div>
          <div className="review-footer d-flex align-items-end justify-content-between">
            <div className="review-header-user d-flex align-items-center">
              <Image
                src={testimonialsSliderUserImg1}
                width={40}
                height={40}
                alt="Steven"
                className="review-avatar"
              />
              <div className="review-user-content">
                <h6 className="review-user-title">Steven</h6>
                <span className="review-user-state">United Arab Emirates</span>
              </div>
            </div>
            <div className="review-post-date">
              <span className="review-post-date-text">25 June 2025</span>
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
            onClick={() => sliderRef.current?.slickPrev()}
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
            onClick={() => sliderRef.current?.slickNext()}
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

export default ReviewSlider;
