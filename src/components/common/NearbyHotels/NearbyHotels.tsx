"use client";
import React, { useMemo, useRef } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NearHotelImage from "@/assets/images/nearby-hotel-img.jpg";
import starFillIcon from "@/assets/images/star-fill-icon.svg";
import { useRouter } from "next/navigation";
import { buildHotelbedsImageUrl } from "@/constants";
import { HotelItem } from "@/types/hotel";
import { FavoriteHotel, HotelImage } from "@/types/favorite";
import { useHotelSearchStore } from "@/store/hotelSearchStore";
import "./NearbyHotels.scss";

interface NearByHotelsProps {
  currentHotelCode?: number | string | null;
}

const getHotelId = (hotel: HotelItem | FavoriteHotel) =>
  "code" in hotel ? hotel.code : (hotel as HotelItem).id;

const getHotelCode = (hotel: HotelItem | FavoriteHotel) =>
  "code" in hotel ? hotel.code : undefined;

const getHotelName = (hotel: HotelItem | FavoriteHotel) => {
  if ("name" in hotel && typeof hotel.name === "string") {
    return hotel.name;
  }
  return (hotel as FavoriteHotel).name?.content || "Hotel";
};

const getStarRating = (hotel: HotelItem | FavoriteHotel) => {
  const categoryCode = (hotel as HotelItem).categoryCode || (hotel as FavoriteHotel).categoryCode;
  if (categoryCode) {
    const match = categoryCode.match(/^(\d+)/);
    if (match) {
      return Math.min(5, Math.max(1, parseInt(match[1], 10)));
    }
  }
  return 5;
};

const getOrderedHotelImages = (hotel: HotelItem | FavoriteHotel) => {
  const images = (hotel.images || []).filter((img) => !!img?.path);
  const getOrderValue = (img: HotelImage) => {
    if (typeof img.order === "number") return img.order;
    if (typeof img.visualOrder === "number") return img.visualOrder;
    return Number.MAX_SAFE_INTEGER;
  };

  const genImages = images
    .filter((img) => img.imageTypeCode === "GEN" || img.type?.code === "GEN")
    .sort((a, b) => getOrderValue(a) - getOrderValue(b));
  const otherImages = images
    .filter((img) => img.imageTypeCode !== "GEN" && img.type?.code !== "GEN")
    .sort((a, b) => getOrderValue(a) - getOrderValue(b));
  return [...genImages, ...otherImages];
};

const getMainImage = (hotel: HotelItem | FavoriteHotel) => {
  const ordered = getOrderedHotelImages(hotel);
  const mainPath = ordered[0]?.path;
  return mainPath ? buildHotelbedsImageUrl(mainPath) : null;
};

const getHotelCurrency = (hotel: HotelItem | FavoriteHotel) => {
  if ("currency" in hotel && hotel.currency) {
    return hotel.currency;
  }
  return "US$";
};

const getHotelMinRate = (hotel: HotelItem | FavoriteHotel) => {
  if ("minRate" in hotel && hotel.minRate) {
    return hotel.minRate;
  }
  return "";
};

const NearByHotels: React.FC<NearByHotelsProps> = ({ currentHotelCode }) => {
  const sliderRef = useRef<Slider>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const hotels = useHotelSearchStore((state) => state.hotels);

  const filteredHotels = useMemo<(HotelItem | FavoriteHotel)[]>(() => {
    if (!hotels || hotels.length === 0) return [];
    if (!currentHotelCode && currentHotelCode !== 0) {
      return hotels;
    }
    const currentCodeString = currentHotelCode?.toString();
    return hotels.filter((hotel) => getHotelCode(hotel)?.toString() !== currentCodeString);
  }, [hotels, currentHotelCode]);

  const hotelsToDisplay = useMemo<(HotelItem | FavoriteHotel)[]>(
    () => filteredHotels.slice(0, 6),
    [filteredHotels]
  );

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

  const slidesToShowCount = Math.min(3, hotelsToDisplay.length === 0 ? 3 : hotelsToDisplay.length);

  const settings = {
    slidesToShow: slidesToShowCount,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    infinite: hotelsToDisplay.length > slidesToShowCount,
    autoplay: false,
    onInit: handleSliderUpdate,
    onReInit: handleSliderUpdate,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: Math.min(2, hotelsToDisplay.length === 0 ? 2 : hotelsToDisplay.length),
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

  const placeholderCount = slidesToShowCount;
  const showPlaceholder = hotelsToDisplay.length === 0;

  return (
    <div ref={containerRef}>
      <Slider ref={sliderRef} {...settings} className="nearby-hotels-slider">
        {showPlaceholder
          ? Array.from({ length: placeholderCount }).map((_, index) => (
              <div key={`placeholder-${index}`} className="nearby-hotels-card">
                <div className="nearby-hotels-card-img">
                  <Image
                    src={NearHotelImage}
                    width={378}
                    height={203}
                    alt="Nearby hotel"
                  />
                </div>
                <div className="nearby-hotels-card-details">
                  <h3 className="hotel-room-name">Nearby Hotel</h3>
                  <div className="hotel-details-rating d-flex align-items-center">
                    <div className="hotel-details-rating-star d-flex align-items-center">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Image
                          key={starIndex}
                          src={starFillIcon}
                          width={12}
                          height={12}
                          alt="star"
                          className="hotel-rating-icon"
                        />
                      ))}
                    </div>
                    <span className="rating-value-wrapper d-flex align-items-center">
                      <span className="rating-value">5.0</span>
                    </span>
                  </div>
                  <div className="nearby-hotels-price-info">
                    <span className="total-price">
                      $0<span>/per night</span>
                    </span>
                    <div className="hotel-room-number">includes taxes & fees</div>
                  </div>

                  <div className="nearby-hotels-room-action">
                    <button className="button-primary room-booking-btn w-100" disabled>
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          : hotelsToDisplay.map((hotel) => {
              const hotelCode = getHotelCode(hotel);
              const mainImage = getMainImage(hotel) || NearHotelImage;
              const rating = getStarRating(hotel);
              const currency = getHotelCurrency(hotel);
              const minRate = getHotelMinRate(hotel);

              return (
                <div key={getHotelId(hotel)} className="nearby-hotels-card">
                  <div className="nearby-hotels-card-img">
                    <Image
                      src={mainImage}
                      width={378}
                      height={203}
                      alt={getHotelName(hotel)}
                    />
                  </div>
                  <div className="nearby-hotels-card-details">
                    <h3 className="hotel-room-name">{getHotelName(hotel)}</h3>
                    <div className="hotel-details-rating d-flex align-items-center">
                      <div className="hotel-details-rating-star d-flex align-items-center">
                        {Array.from({ length: rating }).map((_, starIndex) => (
                          <Image
                            key={starIndex}
                            src={starFillIcon}
                            width={12}
                            height={12}
                            alt="star"
                            className="hotel-rating-icon"
                          />
                        ))}
                      </div>
                      <span className="rating-value-wrapper d-flex align-items-center">
                        <span className="rating-value">{rating}</span>
                      </span>
                    </div>
                    <div className="nearby-hotels-price-info">
                      <span className="total-price">
                        {currency} {minRate}
                        {/* <span>/per night</span> */}
                      </span>
                      <div className="hotel-room-number">includes taxes & fees</div>
                    </div>

                    <div className="nearby-hotels-room-action">
                      <button
                        className="button-primary room-booking-btn w-100"
                        onClick={() => hotelCode && router.push(`/hotel-details/${hotelCode}`)}
                        disabled={!hotelCode}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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

export default NearByHotels;
