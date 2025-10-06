'use client'
import React, { useRef } from 'react'
import Image from 'next/image'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import testimonialsSliderUserImg1 from '@/assets/images/testimonials-slider-user-img1.png'
import testimonialsSliderUserImg2 from '@/assets/images/testimonials-slider-user-img2.png'
import testimonialsSliderUserImg3 from '@/assets/images/testimonials-slider-user-img3.png'

const Travelers = () => {
  const sliderRef = useRef<Slider>(null)
  const dotsRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSliderUpdate = () => {
    setTimeout(() => {
      if (containerRef.current && dotsRef.current) {
        const dotsElement = containerRef.current.querySelector('.slick-dots')
        if (dotsElement) {
          dotsRef.current.innerHTML = ''
          dotsRef.current.appendChild(dotsElement)
        }
      }
    }, 0)
  }

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
  }

  return (
    <section className="testimonials-section section-space-tb">
      <div className="container" ref={containerRef}>
        <div className="heading_section">
          <h1 className="section-title">Travelers Love Us</h1>
          <p className="section-description mx-width-790">
            Discover real stories from travelers who trusted us with their bookings — and turned their trips into
            unforgettable experiences.
          </p>
        </div>
        <Slider ref={sliderRef} {...settings} className="testimonial-slider">
          <div className="testimonial-card pink">
            <div className="testimonial-header d-flex align-items-center justify-content-between">
              <div className="testimonial-header-user d-flex align-items-center">
                <Image src={testimonialsSliderUserImg1} width={48} height={48} alt="Adam Smith"
                  className="testimonial-avatar" />
                <div className="testimonial-user-content">
                  <h6 className="testimonial-user-title">Adam Smith</h6>
                  <span className="testimonial-user-state">Dubai, UAE</span>
                </div>
              </div>
              <div className="testimonial-card-rating d-flex align-items-center">
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.6637 1.04102C11.5381 1.04102 12.2269 1.70146 12.6666 2.59261L14.135 5.55365C14.1795 5.64529 14.285 5.77433 14.4437 5.89238C14.6022 6.0103 14.7575 6.07536 14.8596 6.09252L17.5176 6.53779C18.4777 6.69913 19.2825 7.16976 19.5437 7.98927C19.8048 8.80809 19.4223 9.65902 18.7319 10.3507L18.7312 10.3514L16.6663 12.4334C16.5844 12.5159 16.4927 12.6714 16.4352 12.8739C16.3781 13.075 16.3731 13.2582 16.399 13.3766L16.3993 13.3783L16.9901 15.9538C17.2351 17.0258 17.1539 18.0888 16.3979 18.6445C15.6393 19.2021 14.6026 18.955 13.6608 18.394L11.1691 16.9069C11.0645 16.8443 10.8848 16.7937 10.6679 16.7937C10.4526 16.7937 10.2691 16.8437 10.1577 16.9085L10.1561 16.9094L7.66939 18.3937C6.7287 18.9566 5.69328 19.1994 4.93458 18.6412C4.17907 18.0854 4.09378 17.0244 4.33958 15.9533L4.93024 13.3783L4.9306 13.3766C4.9565 13.2582 4.95143 13.075 4.89432 12.8739C4.83683 12.6714 4.74515 12.5159 4.66331 12.4334L2.59687 10.3499C1.91086 9.65821 1.52966 8.80802 1.78862 7.99039C2.04832 7.17039 2.85152 6.69918 3.81227 6.53773L6.46809 6.09284L6.46894 6.0927C6.5663 6.07581 6.71924 6.01148 6.87739 5.89325C7.03583 5.7748 7.14165 5.64548 7.18626 5.55365L7.1885 5.54907L8.65501 2.59183L8.65559 2.59066C9.09946 1.70025 9.79035 1.04102 10.6637 1.04102Z"
                    fill="#FDC700" />
                </svg>
                <span>4.9 Rating</span>
              </div>
            </div>
            <p className="testimonial-text">
              As someone who travels frequently for both business and leisure, I’ve used a lot of booking platforms — but
              this one stands out. The search results were clear, and the filters helped me narrow things down quickly. I
              booked a beachfront villa in the Maldives within minutes, and the instant confirmation gave me peace of
              mind. Even the follow-up emails were organized and helpful. It’s now my go-to site every time I plan a
              trip.&rdquo;
            </p>
            <div className="testimonial-footer">
              <p className="testimonial-hotel-name mb-2">
                <i>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_40000027_4794)">
                      <path d="M1.33398 14.667H14.6673" stroke="#09090B" strokeLinecap="round" />
                      <path
                        d="M12.0007 6H9.33398C7.67932 6 7.33398 6.34533 7.33398 8V14.6667H14.0007V8C14.0007 6.34533 13.6553 6 12.0007 6Z"
                        stroke="#09090B" strokeLinejoin="round" />
                      <path
                        d="M10 14.6663H2V3.33301C2 1.67834 2.34533 1.33301 4 1.33301H8C9.65467 1.33301 10 1.67834 10 3.33301V5.99967"
                        stroke="#09090B" strokeLinejoin="round" />
                      <path d="M2 4H4M2 6.66667H4M2 9.33333H4" stroke="#09090B" strokeLinecap="round" />
                      <path d="M10 8.66699H11.3333M10 10.667H11.3333" stroke="#09090B" strokeLinecap="round" />
                      <path d="M10.668 14.667L10.668 12.667" stroke="#09090B" strokeLinecap="round"
                        strokeLinejoin="round" />
                    </g>
                    <defs>
                      <clipPath id="clip0_40000027_4794">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </i> <strong>Hotel:</strong> Six Senses Laamu
              </p>
              <p className="testimonial-hotel-name">
                <i>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.6673 11.667H1.33398" stroke="#27272A" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      d="M14.6673 14V10.6667C14.6673 9.40959 14.6673 8.78105 14.2768 8.39052C13.8863 8 13.2577 8 12.0007 8H4.00065C2.74357 8 2.11503 8 1.72451 8.39052C1.33398 8.78105 1.33398 9.40959 1.33398 10.6667V14"
                      stroke="#27272A" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      d="M7.33333 8V6.8089C7.33333 6.55515 7.29519 6.47027 7.09983 6.37025C6.69297 6.16194 6.1991 6 5.66667 6C5.13423 6 4.64037 6.16194 4.2335 6.37025C4.03814 6.47027 4 6.55515 4 6.8089L4 8"
                      stroke="#27272A" strokeLinecap="round" />
                    <path
                      d="M12.0013 8V6.8089C12.0013 6.55515 11.9632 6.47027 11.7678 6.37025C11.3609 6.16194 10.8671 6 10.3346 6C9.8022 6 9.30834 6.16194 8.90147 6.37025C8.70611 6.47027 8.66797 6.55515 8.66797 6.8089L8.66797 8"
                      stroke="#27272A" strokeLinecap="round" />
                    <path
                      d="M14 8V4.90705C14 4.44595 14 4.2154 13.8719 3.99768C13.7438 3.77996 13.5613 3.66727 13.1963 3.44189C11.7246 2.53319 9.93289 2 8 2C6.06711 2 4.27543 2.53319 2.80372 3.44189C2.43869 3.66727 2.25618 3.77996 2.12809 3.99768C2 4.2154 2 4.44595 2 4.90705V8"
                      stroke="#27272A" strokeLinecap="round" />
                  </svg>
                </i>
                <strong>Stayed:</strong> Jan 2025
              </p>
            </div>
          </div>
          <div className="testimonial-card blue">
            <div className="testimonial-header d-flex align-items-center justify-content-between">
              <div className="testimonial-header-user d-flex align-items-center">
                <Image src={testimonialsSliderUserImg2} width={48} height={48} alt="Naila A."
                  className="testimonial-avatar" />
                <div className="testimonial-user-content">
                  <h6 className="testimonial-user-title">Naila A.</h6>
                  <span className="testimonial-user-state">Berlin, Germany</span>
                </div>
              </div>
              <div className="testimonial-card-rating d-flex align-items-center">
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.6637 1.04102C11.5381 1.04102 12.2269 1.70146 12.6666 2.59261L14.135 5.55365C14.1795 5.64529 14.285 5.77433 14.4437 5.89238C14.6022 6.0103 14.7575 6.07536 14.8596 6.09252L17.5176 6.53779C18.4777 6.69913 19.2825 7.16976 19.5437 7.98927C19.8048 8.80809 19.4223 9.65902 18.7319 10.3507L18.7312 10.3514L16.6663 12.4334C16.5844 12.5159 16.4927 12.6714 16.4352 12.8739C16.3781 13.075 16.3731 13.2582 16.399 13.3766L16.3993 13.3783L16.9901 15.9538C17.2351 17.0258 17.1539 18.0888 16.3979 18.6445C15.6393 19.2021 14.6026 18.955 13.6608 18.394L11.1691 16.9069C11.0645 16.8443 10.8848 16.7937 10.6679 16.7937C10.4526 16.7937 10.2691 16.8437 10.1577 16.9085L10.1561 16.9094L7.66939 18.3937C6.7287 18.9566 5.69328 19.1994 4.93458 18.6412C4.17907 18.0854 4.09378 17.0244 4.33958 15.9533L4.93024 13.3783L4.9306 13.3766C4.9565 13.2582 4.95143 13.075 4.89432 12.8739C4.83683 12.6714 4.74515 12.5159 4.66331 12.4334L2.59687 10.3499C1.91086 9.65821 1.52966 8.80802 1.78862 7.99039C2.04832 7.17039 2.85152 6.69918 3.81227 6.53773L6.46809 6.09284L6.46894 6.0927C6.5663 6.07581 6.71924 6.01148 6.87739 5.89325C7.03583 5.7748 7.14165 5.64548 7.18626 5.55365L7.1885 5.54907L8.65501 2.59183L8.65559 2.59066C9.09946 1.70025 9.79035 1.04102 10.6637 1.04102Z"
                    fill="#FDC700" />
                </svg>
                <span>4.8 Rating</span>
              </div>
            </div>
            <p className="testimonial-text">
              I don’t usually write reviews, but this site deserves it. I was planning a last-minute solo getaway, and I
              was honestly
              expecting compromises. But the deals section helped me find a luxurious stay at an unbeatable price. I
              booked, paid, and
              received confirmation in under 10 minutes. When I arrived, everything was arranged perfectly. It felt like a
              premium
              experience even though I was traveling on a tight budget. Highly recommended!
            </p>
            <div className="testimonial-footer">
              <p className="testimonial-hotel-name mb-2">
                <i>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_40000027_4794)">
                      <path d="M1.33398 14.667H14.6673" stroke="#09090B" strokeLinecap="round" />
                      <path
                        d="M12.0007 6H9.33398C7.67932 6 7.33398 6.34533 7.33398 8V14.6667H14.0007V8C14.0007 6.34533 13.6553 6 12.0007 6Z"
                        stroke="#09090B" strokeLinejoin="round" />
                      <path
                        d="M10 14.6663H2V3.33301C2 1.67834 2.34533 1.33301 4 1.33301H8C9.65467 1.33301 10 1.67834 10 3.33301V5.99967"
                        stroke="#09090B" strokeLinejoin="round" />
                      <path d="M2 4H4M2 6.66667H4M2 9.33333H4" stroke="#09090B" strokeLinecap="round" />
                      <path d="M10 8.66699H11.3333M10 10.667H11.3333" stroke="#09090B" strokeLinecap="round" />
                      <path d="M10.668 14.667L10.668 12.667" stroke="#09090B" strokeLinecap="round"
                        strokeLinejoin="round" />
                    </g>
                    <defs>
                      <clipPath id="clip0_40000027_4794">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </i> <strong>Hotel:</strong> Six Senses Laamu
              </p>
              <p className="testimonial-hotel-name">
                <i>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.6673 11.667H1.33398" stroke="#27272A" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      d="M14.6673 14V10.6667C14.6673 9.40959 14.6673 8.78105 14.2768 8.39052C13.8863 8 13.2577 8 12.0007 8H4.00065C2.74357 8 2.11503 8 1.72451 8.39052C1.33398 8.78105 1.33398 9.40959 1.33398 10.6667V14"
                      stroke="#27272A" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      d="M7.33333 8V6.8089C7.33333 6.55515 7.29519 6.47027 7.09983 6.37025C6.69297 6.16194 6.1991 6 5.66667 6C5.13423 6 4.64037 6.16194 4.2335 6.37025C4.03814 6.47027 4 6.55515 4 6.8089L4 8"
                      stroke="#27272A" strokeLinecap="round" />
                    <path
                      d="M12.0013 8V6.8089C12.0013 6.55515 11.9632 6.47027 11.7678 6.37025C11.3609 6.16194 10.8671 6 10.3346 6C9.8022 6 9.30834 6.16194 8.90147 6.37025C8.70611 6.47027 8.66797 6.55515 8.66797 6.8089L8.66797 8"
                      stroke="#27272A" strokeLinecap="round" />
                    <path
                      d="M14 8V4.90705C14 4.44595 14 4.2154 13.8719 3.99768C13.7438 3.77996 13.5613 3.66727 13.1963 3.44189C11.7246 2.53319 9.93289 2 8 2C6.06711 2 4.27543 2.53319 2.80372 3.44189C2.43869 3.66727 2.25618 3.77996 2.12809 3.99768C2 4.2154 2 4.44595 2 4.90705V8"
                      stroke="#27272A" strokeLinecap="round" />
                  </svg>
                </i>
                <strong>Stayed:</strong> Jan 2025
              </p>
            </div>
          </div>
          <div className="testimonial-card yellow">
            <div className="testimonial-header d-flex align-items-center justify-content-between">
              <div className="testimonial-header-user d-flex align-items-center">
                <Image src={testimonialsSliderUserImg3} width={48} height={48} alt="Jonathan T"
                  className="testimonial-avatar" />
                <div className="testimonial-user-content">
                  <h6 className="testimonial-user-title">Jonathan T</h6>
                  <span className="testimonial-user-state">Zurich, Norway</span>
                </div>
              </div>
              <div className="testimonial-card-rating d-flex align-items-center">
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.6637 1.04102C11.5381 1.04102 12.2269 1.70146 12.6666 2.59261L14.135 5.55365C14.1795 5.64529 14.285 5.77433 14.4437 5.89238C14.6022 6.0103 14.7575 6.07536 14.8596 6.09252L17.5176 6.53779C18.4777 6.69913 19.2825 7.16976 19.5437 7.98927C19.8048 8.80809 19.4223 9.65902 18.7319 10.3507L18.7312 10.3514L16.6663 12.4334C16.5844 12.5159 16.4927 12.6714 16.4352 12.8739C16.3781 13.075 16.3731 13.2582 16.399 13.3766L16.3993 13.3783L16.9901 15.9538C17.2351 17.0258 17.1539 18.0888 16.3979 18.6445C15.6393 19.2021 14.6026 18.955 13.6608 18.394L11.1691 16.9069C11.0645 16.8443 10.8848 16.7937 10.6679 16.7937C10.4526 16.7937 10.2691 16.8437 10.1577 16.9085L10.1561 16.9094L7.66939 18.3937C6.7287 18.9566 5.69328 19.1994 4.93458 18.6412C4.17907 18.0854 4.09378 17.0244 4.33958 15.9533L4.93024 13.3783L4.9306 13.3766C4.9565 13.2582 4.95143 13.075 4.89432 12.8739C4.83683 12.6714 4.74515 12.5159 4.66331 12.4334L2.59687 10.3499C1.91086 9.65821 1.52966 8.80802 1.78862 7.99039C2.04832 7.17039 2.85152 6.69918 3.81227 6.53773L6.46809 6.09284L6.46894 6.0927C6.5663 6.07581 6.71924 6.01148 6.87739 5.89325C7.03583 5.7748 7.14165 5.64548 7.18626 5.55365L7.1885 5.54907L8.65501 2.59183L8.65559 2.59066C9.09946 1.70025 9.79035 1.04102 10.6637 1.04102Z"
                    fill="#FDC700" />
                </svg>
                <span>4.5 Rating</span>
              </div>
            </div>
            <p className="testimonial-text">
              Planning our honeymoon felt overwhelming until I found this platform. The site made it super easy to compare
              resorts,
              check reviews, and finalize our stay without back-and-forth confirmations. We ended up choosing a beautiful
              resort in
              the Maldives, and everything went exactly as promised. No hidden fees, no confusing steps — just a smooth,
              well-designed
              experience from start to finish. Honestly, this made our special trip even more special.
            </p>
            <div className="testimonial-footer">
              <p className="testimonial-hotel-name mb-2">
                <i>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_40000027_4794)">
                      <path d="M1.33398 14.667H14.6673" stroke="#09090B" strokeLinecap="round" />
                      <path
                        d="M12.0007 6H9.33398C7.67932 6 7.33398 6.34533 7.33398 8V14.6667H14.0007V8C14.0007 6.34533 13.6553 6 12.0007 6Z"
                        stroke="#09090B" strokeLinejoin="round" />
                      <path
                        d="M10 14.6663H2V3.33301C2 1.67834 2.34533 1.33301 4 1.33301H8C9.65467 1.33301 10 1.67834 10 3.33301V5.99967"
                        stroke="#09090B" strokeLinejoin="round" />
                      <path d="M2 4H4M2 6.66667H4M2 9.33333H4" stroke="#09090B" strokeLinecap="round" />
                      <path d="M10 8.66699H11.3333M10 10.667H11.3333" stroke="#09090B" strokeLinecap="round" />
                      <path d="M10.668 14.667L10.668 12.667" stroke="#09090B" strokeLinecap="round"
                        strokeLinejoin="round" />
                    </g>
                    <defs>
                      <clipPath id="clip0_40000027_4794">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </i> <strong>Hotel:</strong> Six Senses Laamu
              </p>
              <p className="testimonial-hotel-name">
                <i>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.6673 11.667H1.33398" stroke="#27272A" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      d="M14.6673 14V10.6667C14.6673 9.40959 14.6673 8.78105 14.2768 8.39052C13.8863 8 13.2577 8 12.0007 8H4.00065C2.74357 8 2.11503 8 1.72451 8.39052C1.33398 8.78105 1.33398 9.40959 1.33398 10.6667V14"
                      stroke="#27272A" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      d="M7.33333 8V6.8089C7.33333 6.55515 7.29519 6.47027 7.09983 6.37025C6.69297 6.16194 6.1991 6 5.66667 6C5.13423 6 4.64037 6.16194 4.2335 6.37025C4.03814 6.47027 4 6.55515 4 6.8089L4 8"
                      stroke="#27272A" strokeLinecap="round" />
                    <path
                      d="M12.0013 8V6.8089C12.0013 6.55515 11.9632 6.47027 11.7678 6.37025C11.3609 6.16194 10.8671 6 10.3346 6C9.8022 6 9.30834 6.16194 8.90147 6.37025C8.70611 6.47027 8.66797 6.55515 8.66797 6.8089L8.66797 8"
                      stroke="#27272A" strokeLinecap="round" />
                    <path
                      d="M14 8V4.90705C14 4.44595 14 4.2154 13.8719 3.99768C13.7438 3.77996 13.5613 3.66727 13.1963 3.44189C11.7246 2.53319 9.93289 2 8 2C6.06711 2 4.27543 2.53319 2.80372 3.44189C2.43869 3.66727 2.25618 3.77996 2.12809 3.99768C2 4.2154 2 4.44595 2 4.90705V8"
                      stroke="#27272A" strokeLinecap="round" />
                  </svg>
                </i>
                <strong>Stayed:</strong> Jan 2025
              </p>
            </div>
          </div>
          <div className="testimonial-card pink">
            <div className="testimonial-header d-flex align-items-center justify-content-between">
              <div className="testimonial-header-user d-flex align-items-center">
                <Image src={testimonialsSliderUserImg1} width={48} height={48} alt="Adam Smith"
                  className="testimonial-avatar" />
                <div className="testimonial-user-content">
                  <h6 className="testimonial-user-title">Adam Smith</h6>
                  <span className="testimonial-user-state">Dubai, UAE</span>
                </div>
              </div>
              <div className="testimonial-card-rating d-flex align-items-center">
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.6637 1.04102C11.5381 1.04102 12.2269 1.70146 12.6666 2.59261L14.135 5.55365C14.1795 5.64529 14.285 5.77433 14.4437 5.89238C14.6022 6.0103 14.7575 6.07536 14.8596 6.09252L17.5176 6.53779C18.4777 6.69913 19.2825 7.16976 19.5437 7.98927C19.8048 8.80809 19.4223 9.65902 18.7319 10.3507L18.7312 10.3514L16.6663 12.4334C16.5844 12.5159 16.4927 12.6714 16.4352 12.8739C16.3781 13.075 16.3731 13.2582 16.399 13.3766L16.3993 13.3783L16.9901 15.9538C17.2351 17.0258 17.1539 18.0888 16.3979 18.6445C15.6393 19.2021 14.6026 18.955 13.6608 18.394L11.1691 16.9069C11.0645 16.8443 10.8848 16.7937 10.6679 16.7937C10.4526 16.7937 10.2691 16.8437 10.1577 16.9085L10.1561 16.9094L7.66939 18.3937C6.7287 18.9566 5.69328 19.1994 4.93458 18.6412C4.17907 18.0854 4.09378 17.0244 4.33958 15.9533L4.93024 13.3783L4.9306 13.3766C4.9565 13.2582 4.95143 13.075 4.89432 12.8739C4.83683 12.6714 4.74515 12.5159 4.66331 12.4334L2.59687 10.3499C1.91086 9.65821 1.52966 8.80802 1.78862 7.99039C2.04832 7.17039 2.85152 6.69918 3.81227 6.53773L6.46809 6.09284L6.46894 6.0927C6.5663 6.07581 6.71924 6.01148 6.87739 5.89325C7.03583 5.7748 7.14165 5.64548 7.18626 5.55365L7.1885 5.54907L8.65501 2.59183L8.65559 2.59066C9.09946 1.70025 9.79035 1.04102 10.6637 1.04102Z"
                    fill="#FDC700" />
                </svg>
                <span>4.9 Rating</span>
              </div>
            </div>
            <p className="testimonial-text">
              As someone who travels frequently for both business and leisure, I’ve used a lot of booking platforms — but
              this one stands out. The search results were clear, and the filters helped me narrow things down quickly. I
              booked a beachfront villa in the Maldives within minutes, and the instant confirmation gave me peace of
              mind. Even the follow-up emails were organized and helpful. It’s now my go-to site every time I plan a
              trip.&rdquo;
            </p>
            <div className="testimonial-footer">
              <p className="testimonial-hotel-name mb-2">
                <i>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_40000027_4794)">
                      <path d="M1.33398 14.667H14.6673" stroke="#09090B" strokeLinecap="round" />
                      <path
                        d="M12.0007 6H9.33398C7.67932 6 7.33398 6.34533 7.33398 8V14.6667H14.0007V8C14.0007 6.34533 13.6553 6 12.0007 6Z"
                        stroke="#09090B" strokeLinejoin="round" />
                      <path
                        d="M10 14.6663H2V3.33301C2 1.67834 2.34533 1.33301 4 1.33301H8C9.65467 1.33301 10 1.67834 10 3.33301V5.99967"
                        stroke="#09090B" strokeLinejoin="round" />
                      <path d="M2 4H4M2 6.66667H4M2 9.33333H4" stroke="#09090B" strokeLinecap="round" />
                      <path d="M10 8.66699H11.3333M10 10.667H11.3333" stroke="#09090B" strokeLinecap="round" />
                      <path d="M10.668 14.667L10.668 12.667" stroke="#09090B" strokeLinecap="round"
                        strokeLinejoin="round" />
                    </g>
                    <defs>
                      <clipPath id="clip0_40000027_4794">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </i> <strong>Hotel:</strong> Six Senses Laamu
              </p>
              <p className="testimonial-hotel-name">
                <i>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.6673 11.667H1.33398" stroke="#27272A" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      d="M14.6673 14V10.6667C14.6673 9.40959 14.6673 8.78105 14.2768 8.39052C13.8863 8 13.2577 8 12.0007 8H4.00065C2.74357 8 2.11503 8 1.72451 8.39052C1.33398 8.78105 1.33398 9.40959 1.33398 10.6667V14"
                      stroke="#27272A" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      d="M7.33333 8V6.8089C7.33333 6.55515 7.29519 6.47027 7.09983 6.37025C6.69297 6.16194 6.1991 6 5.66667 6C5.13423 6 4.64037 6.16194 4.2335 6.37025C4.03814 6.47027 4 6.55515 4 6.8089L4 8"
                      stroke="#27272A" strokeLinecap="round" />
                    <path
                      d="M12.0013 8V6.8089C12.0013 6.55515 11.9632 6.47027 11.7678 6.37025C11.3609 6.16194 10.8671 6 10.3346 6C9.8022 6 9.30834 6.16194 8.90147 6.37025C8.70611 6.47027 8.66797 6.55515 8.66797 6.8089L8.66797 8"
                      stroke="#27272A" strokeLinecap="round" />
                    <path
                      d="M14 8V4.90705C14 4.44595 14 4.2154 13.8719 3.99768C13.7438 3.77996 13.5613 3.66727 13.1963 3.44189C11.7246 2.53319 9.93289 2 8 2C6.06711 2 4.27543 2.53319 2.80372 3.44189C2.43869 3.66727 2.25618 3.77996 2.12809 3.99768C2 4.2154 2 4.44595 2 4.90705V8"
                      stroke="#27272A" strokeLinecap="round" />
                  </svg>
                </i>
                <strong>Stayed:</strong> Jan 2025
              </p>
            </div>
          </div>
          <div className="testimonial-card blue">
            <div className="testimonial-header d-flex align-items-center justify-content-between">
              <div className="testimonial-header-user d-flex align-items-center">
                <Image src={testimonialsSliderUserImg2} width={48} height={48} alt="Naila A."
                  className="testimonial-avatar" />
                <div className="testimonial-user-content">
                  <h6 className="testimonial-user-title">Naila A.</h6>
                  <span className="testimonial-user-state">Berlin, Germany</span>
                </div>
              </div>
              <div className="testimonial-card-rating d-flex align-items-center">
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.6637 1.04102C11.5381 1.04102 12.2269 1.70146 12.6666 2.59261L14.135 5.55365C14.1795 5.64529 14.285 5.77433 14.4437 5.89238C14.6022 6.0103 14.7575 6.07536 14.8596 6.09252L17.5176 6.53779C18.4777 6.69913 19.2825 7.16976 19.5437 7.98927C19.8048 8.80809 19.4223 9.65902 18.7319 10.3507L18.7312 10.3514L16.6663 12.4334C16.5844 12.5159 16.4927 12.6714 16.4352 12.8739C16.3781 13.075 16.3731 13.2582 16.399 13.3766L16.3993 13.3783L16.9901 15.9538C17.2351 17.0258 17.1539 18.0888 16.3979 18.6445C15.6393 19.2021 14.6026 18.955 13.6608 18.394L11.1691 16.9069C11.0645 16.8443 10.8848 16.7937 10.6679 16.7937C10.4526 16.7937 10.2691 16.8437 10.1577 16.9085L10.1561 16.9094L7.66939 18.3937C6.7287 18.9566 5.69328 19.1994 4.93458 18.6412C4.17907 18.0854 4.09378 17.0244 4.33958 15.9533L4.93024 13.3783L4.9306 13.3766C4.9565 13.2582 4.95143 13.075 4.89432 12.8739C4.83683 12.6714 4.74515 12.5159 4.66331 12.4334L2.59687 10.3499C1.91086 9.65821 1.52966 8.80802 1.78862 7.99039C2.04832 7.17039 2.85152 6.69918 3.81227 6.53773L6.46809 6.09284L6.46894 6.0927C6.5663 6.07581 6.71924 6.01148 6.87739 5.89325C7.03583 5.7748 7.14165 5.64548 7.18626 5.55365L7.1885 5.54907L8.65501 2.59183L8.65559 2.59066C9.09946 1.70025 9.79035 1.04102 10.6637 1.04102Z"
                    fill="#FDC700" />
                </svg>
                <span>4.8 Rating</span>
              </div>
            </div>
            <p className="testimonial-text">
              I don’t usually write reviews, but this site deserves it. I was planning a last-minute solo getaway, and I
              was honestly
              expecting compromises. But the deals section helped me find a luxurious stay at an unbeatable price. I
              booked, paid, and
              received confirmation in under 10 minutes. When I arrived, everything was arranged perfectly. It felt like a
              premium
              experience even though I was traveling on a tight budget. Highly recommended!
            </p>
            <div className="testimonial-footer">
              <p className="testimonial-hotel-name mb-2">
                <i>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_40000027_4794)">
                      <path d="M1.33398 14.667H14.6673" stroke="#09090B" strokeLinecap="round" />
                      <path
                        d="M12.0007 6H9.33398C7.67932 6 7.33398 6.34533 7.33398 8V14.6667H14.0007V8C14.0007 6.34533 13.6553 6 12.0007 6Z"
                        stroke="#09090B" strokeLinejoin="round" />
                      <path
                        d="M10 14.6663H2V3.33301C2 1.67834 2.34533 1.33301 4 1.33301H8C9.65467 1.33301 10 1.67834 10 3.33301V5.99967"
                        stroke="#09090B" strokeLinejoin="round" />
                      <path d="M2 4H4M2 6.66667H4M2 9.33333H4" stroke="#09090B" strokeLinecap="round" />
                      <path d="M10 8.66699H11.3333M10 10.667H11.3333" stroke="#09090B" strokeLinecap="round" />
                      <path d="M10.668 14.667L10.668 12.667" stroke="#09090B" strokeLinecap="round"
                        strokeLinejoin="round" />
                    </g>
                    <defs>
                      <clipPath id="clip0_40000027_4794">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </i> <strong>Hotel:</strong> Six Senses Laamu
              </p>
              <p className="testimonial-hotel-name">
                <i>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.6673 11.667H1.33398" stroke="#27272A" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      d="M14.6673 14V10.6667C14.6673 9.40959 14.6673 8.78105 14.2768 8.39052C13.8863 8 13.2577 8 12.0007 8H4.00065C2.74357 8 2.11503 8 1.72451 8.39052C1.33398 8.78105 1.33398 9.40959 1.33398 10.6667V14"
                      stroke="#27272A" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      d="M7.33333 8V6.8089C7.33333 6.55515 7.29519 6.47027 7.09983 6.37025C6.69297 6.16194 6.1991 6 5.66667 6C5.13423 6 4.64037 6.16194 4.2335 6.37025C4.03814 6.47027 4 6.55515 4 6.8089L4 8"
                      stroke="#27272A" strokeLinecap="round" />
                    <path
                      d="M12.0013 8V6.8089C12.0013 6.55515 11.9632 6.47027 11.7678 6.37025C11.3609 6.16194 10.8671 6 10.3346 6C9.8022 6 9.30834 6.16194 8.90147 6.37025C8.70611 6.47027 8.66797 6.55515 8.66797 6.8089L8.66797 8"
                      stroke="#27272A" strokeLinecap="round" />
                    <path
                      d="M14 8V4.90705C14 4.44595 14 4.2154 13.8719 3.99768C13.7438 3.77996 13.5613 3.66727 13.1963 3.44189C11.7246 2.53319 9.93289 2 8 2C6.06711 2 4.27543 2.53319 2.80372 3.44189C2.43869 3.66727 2.25618 3.77996 2.12809 3.99768C2 4.2154 2 4.44595 2 4.90705V8"
                      stroke="#27272A" strokeLinecap="round" />
                  </svg>
                </i>
                <strong>Stayed:</strong> Jan 2025
              </p>
            </div>
          </div>
          <div className="testimonial-card yellow">
            <div className="testimonial-header d-flex align-items-center justify-content-between">
              <div className="testimonial-header-user d-flex align-items-center">
                <Image src={testimonialsSliderUserImg3} width={48} height={48} alt="Jonathan T"
                  className="testimonial-avatar" />
                <div className="testimonial-user-content">
                  <h6 className="testimonial-user-title">Jonathan T</h6>
                  <span className="testimonial-user-state">Zurich, Norway</span>
                </div>
              </div>
              <div className="testimonial-card-rating d-flex align-items-center">
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.6637 1.04102C11.5381 1.04102 12.2269 1.70146 12.6666 2.59261L14.135 5.55365C14.1795 5.64529 14.285 5.77433 14.4437 5.89238C14.6022 6.0103 14.7575 6.07536 14.8596 6.09252L17.5176 6.53779C18.4777 6.69913 19.2825 7.16976 19.5437 7.98927C19.8048 8.80809 19.4223 9.65902 18.7319 10.3507L18.7312 10.3514L16.6663 12.4334C16.5844 12.5159 16.4927 12.6714 16.4352 12.8739C16.3781 13.075 16.3731 13.2582 16.399 13.3766L16.3993 13.3783L16.9901 15.9538C17.2351 17.0258 17.1539 18.0888 16.3979 18.6445C15.6393 19.2021 14.6026 18.955 13.6608 18.394L11.1691 16.9069C11.0645 16.8443 10.8848 16.7937 10.6679 16.7937C10.4526 16.7937 10.2691 16.8437 10.1577 16.9085L10.1561 16.9094L7.66939 18.3937C6.7287 18.9566 5.69328 19.1994 4.93458 18.6412C4.17907 18.0854 4.09378 17.0244 4.33958 15.9533L4.93024 13.3783L4.9306 13.3766C4.9565 13.2582 4.95143 13.075 4.89432 12.8739C4.83683 12.6714 4.74515 12.5159 4.66331 12.4334L2.59687 10.3499C1.91086 9.65821 1.52966 8.80802 1.78862 7.99039C2.04832 7.17039 2.85152 6.69918 3.81227 6.53773L6.46809 6.09284L6.46894 6.0927C6.5663 6.07581 6.71924 6.01148 6.87739 5.89325C7.03583 5.7748 7.14165 5.64548 7.18626 5.55365L7.1885 5.54907L8.65501 2.59183L8.65559 2.59066C9.09946 1.70025 9.79035 1.04102 10.6637 1.04102Z"
                    fill="#FDC700" />
                </svg>
                <span>4.5 Rating</span>
              </div>
            </div>
            <p className="testimonial-text">
              Planning our honeymoon felt overwhelming until I found this platform. The site made it super easy to compare
              resorts,
              check reviews, and finalize our stay without back-and-forth confirmations. We ended up choosing a beautiful
              resort in
              the Maldives, and everything went exactly as promised. No hidden fees, no confusing steps — just a smooth,
              well-designed
              experience from start to finish. Honestly, this made our special trip even more special.
            </p>
            <div className="testimonial-footer">
              <p className="testimonial-hotel-name mb-2">
                <i>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_40000027_4794)">
                      <path d="M1.33398 14.667H14.6673" stroke="#09090B" strokeLinecap="round" />
                      <path
                        d="M12.0007 6H9.33398C7.67932 6 7.33398 6.34533 7.33398 8V14.6667H14.0007V8C14.0007 6.34533 13.6553 6 12.0007 6Z"
                        stroke="#09090B" strokeLinejoin="round" />
                      <path
                        d="M10 14.6663H2V3.33301C2 1.67834 2.34533 1.33301 4 1.33301H8C9.65467 1.33301 10 1.67834 10 3.33301V5.99967"
                        stroke="#09090B" strokeLinejoin="round" />
                      <path d="M2 4H4M2 6.66667H4M2 9.33333H4" stroke="#09090B" strokeLinecap="round" />
                      <path d="M10 8.66699H11.3333M10 10.667H11.3333" stroke="#09090B" strokeLinecap="round" />
                      <path d="M10.668 14.667L10.668 12.667" stroke="#09090B" strokeLinecap="round"
                        strokeLinejoin="round" />
                    </g>
                    <defs>
                      <clipPath id="clip0_40000027_4794">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </i> <strong>Hotel:</strong> Six Senses Laamu
              </p>
              <p className="testimonial-hotel-name">
                <i>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.6673 11.667H1.33398" stroke="#27272A" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      d="M14.6673 14V10.6667C14.6673 9.40959 14.6673 8.78105 14.2768 8.39052C13.8863 8 13.2577 8 12.0007 8H4.00065C2.74357 8 2.11503 8 1.72451 8.39052C1.33398 8.78105 1.33398 9.40959 1.33398 10.6667V14"
                      stroke="#27272A" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      d="M7.33333 8V6.8089C7.33333 6.55515 7.29519 6.47027 7.09983 6.37025C6.69297 6.16194 6.1991 6 5.66667 6C5.13423 6 4.64037 6.16194 4.2335 6.37025C4.03814 6.47027 4 6.55515 4 6.8089L4 8"
                      stroke="#27272A" strokeLinecap="round" />
                    <path
                      d="M12.0013 8V6.8089C12.0013 6.55515 11.9632 6.47027 11.7678 6.37025C11.3609 6.16194 10.8671 6 10.3346 6C9.8022 6 9.30834 6.16194 8.90147 6.37025C8.70611 6.47027 8.66797 6.55515 8.66797 6.8089L8.66797 8"
                      stroke="#27272A" strokeLinecap="round" />
                    <path
                      d="M14 8V4.90705C14 4.44595 14 4.2154 13.8719 3.99768C13.7438 3.77996 13.5613 3.66727 13.1963 3.44189C11.7246 2.53319 9.93289 2 8 2C6.06711 2 4.27543 2.53319 2.80372 3.44189C2.43869 3.66727 2.25618 3.77996 2.12809 3.99768C2 4.2154 2 4.44595 2 4.90705V8"
                      stroke="#27272A" strokeLinecap="round" />
                  </svg>
                </i>
                <strong>Stayed:</strong> Jan 2025
              </p>
            </div>
          </div>
        </Slider>
        <div className="testimonial-actions">
          <div className="testimonial-dots" ref={dotsRef}></div>
          <div className="testimonial-arrows">
            <button type="button" className="slick-prev" onClick={() => sliderRef.current?.slickPrev()}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12L20 12M4 12L8.99996 17M4 12L9 7" stroke="#1B2236" strokeWidth="1.5" />
              </svg>
            </button>
            <button type="button" className="slick-next" onClick={() => sliderRef.current?.slickNext()}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 12L4 12M20 12L15.0001 17M20 12L15 7" stroke="#1B2236" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Travelers
