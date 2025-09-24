"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "@/i18/navigation";
import Image from "next/image";
import LocationPicker from "../core/LocationPicker/LocationPicker";
import DatePicker from "../core/DatePicker/DatePicker";
import GuestsPicker from "../core/GuestsPicker/GuestsPicker";
import { Select } from "../core/Select";
import locationIcon from "@/assets/images/location-icon.svg";
import downBlackArrowIcon from "@/assets/images/down-black-arrow-icon.svg";
import calendarIcon from "@/assets/images/calendar-icon.svg";
import plusIcon from "@/assets/images/plus-icon.svg";
import guestsIcon from "@/assets/images/guests-icon.svg";
import StarFill from "@/assets/images/star-fill-icon.svg";
import mainImage1 from "@/assets/images/property-image.jpg";
import thumbnailImages1 from "@/assets/images/property-thumb-img1.jpg";
import thumbnailImages2 from "@/assets/images/property-thumb-img2.jpg";
import thumbnailImages3 from "@/assets/images/property-thumb-img3.jpg";
import thumbnailImages4 from "@/assets/images/property-thumb-img4.jpg";
import ReviewStarFill from "@/assets/images/star-fill-icon.svg";
import BreaFastIcon from "@/assets/images/breackfast-icon.svg";
import ParkingIcon from "@/assets/images/parking-icon.svg";
import PoolIcon from "@/assets/images/pool-icon.svg";
import FilterBtnIcon from "@/assets/images/filter-icon.svg";
import ClosePopupIcon from "@/assets/images/close-btn-icon.svg";
import "./SearchResult.scss";

interface Location {
  id: string;
  name: string;
  country: string;
}

interface GuestCounts {
  adults: number;
  children: number;
  pets: number;
}

interface Hotel {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  location: string;
  amenities: string[];
  description: string;
  price: number;
  currency: string;
  mainImage: any;
  thumbnailImages: any[];
  ame: { name: string; icon: string }[];
}

const SearchResult = () => {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>({
    id: "1",
    name: "Bangkok",
    country: "Thailand",
  });
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    new Date(2024, 7, 8)
  ); // Aug 08
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
    new Date(2024, 7, 18)
  ); // Aug 18
  const [guestCounts, setGuestCounts] = useState<GuestCounts>({
    adults: 3,
    children: 0,
    pets: 0,
  });
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestsPickerOpen, setIsGuestsPickerOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Recommended");

  // Sort options for the dropdown
  const sortOptions = [
    { value: "Recommended", label: "Recommended" },
    { value: "Price: Low to High", label: "Price: Low to High" },
    { value: "Price: High to Low", label: "Price: High to Low" },
    { value: "Rating", label: "Rating" },
  ];

  // Reset filter states when mobile modal opens
  const handleMobileFilterOpen = () => {
    setIsMobileFilterOpen(true);
    // Ensure all sections are open when modal opens
    setIsPriceRangeOpen(true);
    setIsStarRatingOpen(true);
    setIsGuestRatingOpen(true);
    setIsAmenitiesOpen(true);
    setIsPropertyTypeOpen(true);
    setIsLocationTypeOpen(true);
  };

  // Filter sidebar dropdown states
  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(true);
  const [isStarRatingOpen, setIsStarRatingOpen] = useState(true);
  const [isGuestRatingOpen, setIsGuestRatingOpen] = useState(true);
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(true);
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(true);
  const [isLocationTypeOpen, setIsLocationTypeOpen] = useState(true);

  // Refs for click outside detection
  const locationPickerRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const guestsPickerRef = useRef<HTMLDivElement>(null);

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationPickerRef.current &&
        !locationPickerRef.current.contains(event.target as Node)
      ) {
        setIsLocationPickerOpen(false);
      }
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false);
      }
      if (
        guestsPickerRef.current &&
        !guestsPickerRef.current.contains(event.target as Node)
      ) {
        setIsGuestsPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Lock body scroll when mobile filter modal is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileFilterOpen]);

  // Static hotel data
  const hotels: Hotel[] = [
    {
      id: "1",
      name: "lebua",
      rating: 4.5,
      reviewCount: 120,
      location: "123 Sukhumvit Road, Bangkok, Thailand",
      ame: [
        { name: "Breakfast", icon: BreaFastIcon },
        { name: "Parking", icon: ParkingIcon },
        { name: "Pool", icon: PoolIcon },
      ],
      amenities: ["Breakfast", "Parking", "Pool"],
      description:
        "Unbeatable location at the heart of the city. Steps from the SkyTrain, top shopping malls, and exciting activities.",
      price: 266,
      currency: "US$",
      mainImage: mainImage1,
      thumbnailImages: [
        thumbnailImages1,
        thumbnailImages2,
        thumbnailImages3,
        thumbnailImages4,
      ],
    },
    {
      id: "2",
      name: "Novtel",
      rating: 4.5,
      reviewCount: 120,
      location: "456 Silom Road, Bangkok, Thailand",
      ame: [
        { name: "Breakfast", icon: BreaFastIcon },
        { name: "Parking", icon: ParkingIcon },
        { name: "Pool", icon: PoolIcon },
      ],
      amenities: ["Breakfast", "Parking", "Pool"],
      description:
        "Modern luxury with stunning city views. Perfect for business and leisure travelers.",
      price: 500,
      currency: "US$",
      mainImage: mainImage1,
      thumbnailImages: [
        thumbnailImages1,
        thumbnailImages2,
        thumbnailImages3,
        thumbnailImages4,
      ],
    },
    {
      id: "3",
      name: "X GO INN The Grand Palace",
      rating: 4.5,
      reviewCount: 120,
      location: "789 Grand Palace Road, Bangkok, Thailand",
      ame: [
        { name: "Breakfast", icon: BreaFastIcon },
        { name: "Parking", icon: ParkingIcon },
        { name: "Pool", icon: PoolIcon },
      ],
      amenities: ["Breakfast", "Parking", "Pool"],
      description:
        "Budget-friendly accommodation near historic landmarks. Clean and comfortable rooms.",
      price: 24,
      currency: "US$",
      mainImage: mainImage1,
      thumbnailImages: [
        thumbnailImages1,
        thumbnailImages2,
        thumbnailImages3,
        thumbnailImages4,
      ],
    },
    {
      id: "4",
      name: "INNSIDE by Meliá",
      rating: 4.5,
      reviewCount: 120,
      location: "321 Riverside Road, Bangkok, Thailand",
      ame: [
        { name: "Breakfast", icon: BreaFastIcon },
        { name: "Parking", icon: ParkingIcon },
        { name: "Pool", icon: PoolIcon },
      ],
      amenities: ["Breakfast", "Parking", "Pool"],
      description:
        "Contemporary design meets comfort. Rooftop pool with panoramic city views.",
      price: 300,
      currency: "US$",
      mainImage: mainImage1,
      thumbnailImages: [
        thumbnailImages1,
        thumbnailImages2,
        thumbnailImages3,
        thumbnailImages4,
      ],
    },
    {
      id: "5",
      name: "GM Serviced Apartment",
      rating: 4.5,
      reviewCount: 120,
      location: "654 Business District, Bangkok, Thailand",
      ame: [
        { name: "Breakfast", icon: BreaFastIcon },
        { name: "Parking", icon: ParkingIcon },
        { name: "Pool", icon: PoolIcon },
      ],
      amenities: ["Breakfast", "Parking", "Pool"],
      description:
        "Spacious apartments with full kitchen facilities. Ideal for extended stays.",
      price: 200,
      currency: "US$",
      mainImage: mainImage1,
      thumbnailImages: [
        thumbnailImages1,
        thumbnailImages2,
        thumbnailImages3,
        thumbnailImages4,
      ],
    },
  ];

  const handleLocationSelect = (location: Location | null) => {
    setSelectedLocation(location);
    setIsLocationPickerOpen(false);
  };

  const handleDateSelect = (startDate: Date | null, endDate: Date | null) => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
    // Auto-close when both dates are selected
    if (startDate && endDate) {
      setTimeout(() => {
        setIsDatePickerOpen(false);
      }, 200);
    }
  };

  const handleGuestCountChange = (counts: GuestCounts) => {
    setGuestCounts(counts);
    // Don't auto-close guests picker, let user manually close or click outside
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Add Date";
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
  };

  const getTotalGuests = () => {
    return guestCounts.adults + guestCounts.children + guestCounts.pets;
  };

  // Reusable renderer for all filter sections (used in sidebar and mobile modal)
  const renderFilters = (isMobile = false) => (
    <>
      <div className={`filter-mapview-btn ${isMobile ? "d-none" : ""}`}>
        <button className="map-view-button button-primary w-100">
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.75345 4.19584L4.52558 4.90813C3.53739 5.48137 3.04329 5.768 2.77164 6.24483C2.5 6.72165 2.5 7.30233 2.5 8.46368V16.6283C2.5 18.1542 2.5 18.9172 2.84226 19.3418C3.07001 19.6244 3.38916 19.8143 3.742 19.8773C4.27226 19.9719 4.92148 19.5953 6.21987 18.8421C7.10156 18.3306 7.95011 17.7994 9.00487 17.9435C9.48466 18.009 9.94231 18.2366 10.8576 18.6917L14.6715 20.588C15.4964 20.9982 15.504 21 16.4214 21H18.5C20.3856 21 21.3284 21 21.9142 20.4013C22.5 19.8026 22.5 18.8389 22.5 16.9117V10.1715C22.5 8.24423 22.5 7.2806 21.9142 6.68188C21.3284 6.08316 20.3856 6.08316 18.5 6.08316H16.4214C15.504 6.08316 15.4964 6.08139 14.6715 5.6712L11.3399 4.01463C9.94884 3.32297 9.25332 2.97714 8.51238 3.00117C7.77143 3.02521 7.09877 3.41542 5.75345 4.19584Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 3L8.5 17.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.5 6.5L15.5 20.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Map View
        </button>
      </div>
      <div className={`filter-header ${isMobile ? "d-none" : ""}`}>
        <h3>Filter by</h3>
        <button className="clear-filters">Clear</button>
      </div>

      <div className="filter-section">
        <div
          className="filter-title"
          onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}
        >
          Price Range
          <Image
            src={downBlackArrowIcon}
            width="20"
            height="20"
            alt="down arrow"
            className={`dropdown-arrow ${isPriceRangeOpen ? "open" : ""}`}
          />
        </div>
        {isPriceRangeOpen && (
          <div className="price-range">
            <div className="pricing-range-slider d-flex align-items-center justify-content-between">
              <span>$500</span>
              <span>$1500</span>
            </div>
            <div className="price-slider">
              <div className="slider-track"></div>
              <div className="slider-thumb"></div>
            </div>
          </div>
        )}
      </div>

      <div className="filter-section">
        <div
          className="filter-title"
          onClick={() => setIsStarRatingOpen(!isStarRatingOpen)}
        >
          Star Rating
          <Image
            src={downBlackArrowIcon}
            width="20"
            height="20"
            alt="down arrow"
            className={`dropdown-arrow ${isStarRatingOpen ? "open" : ""}`}
          />
        </div>
        {isStarRatingOpen && (
          <div className="filter-options">
            {[5, 4, 3, 2, 1].map((stars) => (
              <label key={stars} className="filter-option">
                <input type="checkbox" defaultChecked={stars === 5} />
                <span className="checkmark"></span>
                <span className="stars">
                  {stars}
                  <span>
                    <Image
                      src={StarFill}
                      width="16"
                      height="16"
                      alt="star icon"
                    />
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filter-section">
        <div
          className="filter-title"
          onClick={() => setIsGuestRatingOpen(!isGuestRatingOpen)}
        >
          Guest Rating
          <Image
            src={downBlackArrowIcon}
            width="20"
            height="20"
            alt="down arrow"
            className={`dropdown-arrow ${isGuestRatingOpen ? "open" : ""}`}
          />
        </div>
        {isGuestRatingOpen && (
          <div className="filter-options">
            <label className="filter-option">
              <input type="radio" name="guest-rating" defaultChecked />
              <span className="radio-mark"></span>
              Excellent
            </label>
            <label className="filter-option">
              <input type="radio" name="guest-rating" />
              <span className="radio-mark"></span>
              Very Good
            </label>
            <label className="filter-option">
              <input type="radio" name="guest-rating" />
              <span className="radio-mark"></span>
              Good
            </label>
          </div>
        )}
      </div>

      <div className="filter-section">
        <div
          className="filter-title"
          onClick={() => setIsAmenitiesOpen(!isAmenitiesOpen)}
        >
          Amenities
          <Image
            src={downBlackArrowIcon}
            width="20"
            height="20"
            alt="down arrow"
            className={`dropdown-arrow ${isAmenitiesOpen ? "open" : ""}`}
          />
        </div>
        {isAmenitiesOpen && (
          <div className="filter-options">
            {["Wi-Fi", "Parking", "Pet Friendly", "Breakfast"].map(
              (amenity) => (
                <label key={amenity} className="filter-option">
                  <input type="checkbox" defaultChecked={amenity === "Wi-Fi"} />
                  <span className="checkmark"></span>
                  {amenity}
                </label>
              )
            )}
          </div>
        )}
      </div>

      <div className="filter-section">
        <div
          className="filter-title"
          onClick={() => setIsPropertyTypeOpen(!isPropertyTypeOpen)}
        >
          Property Type
          <Image
            src={downBlackArrowIcon}
            width="20"
            height="20"
            alt="down arrow"
            className={`dropdown-arrow ${isPropertyTypeOpen ? "open" : ""}`}
          />
        </div>
        {isPropertyTypeOpen && (
          <div className="filter-options">
            {["Hotel", "Resort", "Apartment", "Villa"].map((type) => (
              <label key={type} className="filter-option">
                <input
                  type="radio"
                  name="property-type"
                  defaultChecked={type === "Hotel"}
                />
                <span className="radio-mark"></span>
                {type}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filter-section">
        <div
          className="filter-title"
          onClick={() => setIsLocationTypeOpen(!isLocationTypeOpen)}
        >
          Location Type
          <Image
            src={downBlackArrowIcon}
            width="20"
            height="20"
            alt="down arrow"
            className={`dropdown-arrow ${isLocationTypeOpen ? "open" : ""}`}
          />
        </div>
        {isLocationTypeOpen && (
          <div className="filter-options">
            <label className="filter-option">
              <input type="checkbox" defaultChecked />
              <span className="checkmark"></span>
              Near Beach
            </label>
            <label className="filter-option">
              <input type="checkbox" />
              <span className="checkmark"></span>
              City Center
            </label>
          </div>
        )}
      </div>
    </>
  );

  return (
    <main className="padding-top-100">
      <div className="search-result-page section-space-b">
        {/* Search Section */}
        <div className="search-bar-main">
          <div className="container">
            <div className="search-bar">
              <div className="search-bar-container">
                <div className="search-field" ref={locationPickerRef}>
                  <label>Location</label>
                  <div
                    className="search-input-wrapper"
                    onClick={() =>
                      setIsLocationPickerOpen(!isLocationPickerOpen)
                    }
                  >
                    <div className="search-input-inner">
                      <Image
                        src={locationIcon}
                        width="20"
                        height="20"
                        alt="location icon"
                      />
                      <span className="search-input-text">
                        {selectedLocation
                          ? selectedLocation.name
                          : "Find Location"}
                      </span>
                    </div>
                    <Image
                      src={downBlackArrowIcon}
                      width="24"
                      height="24"
                      alt="down arrow"
                    />
                  </div>
                  <LocationPicker
                    isOpen={isLocationPickerOpen}
                    onLocationSelect={handleLocationSelect}
                    selectedLocation={selectedLocation}
                  />
                </div>

                <div className="search-field" ref={datePickerRef}>
                  <label>Check-in Date</label>
                  <div
                    className="search-input-wrapper"
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  >
                    <div className="search-input-inner">
                      <Image
                        src={calendarIcon}
                        width="20"
                        height="20"
                        alt="calendar icon"
                      />
                      <span className="search-input-text">
                        {formatDate(selectedStartDate)}
                      </span>
                    </div>
                    <Image
                      src={plusIcon}
                      width="24"
                      height="24"
                      alt="plus icon"
                    />
                  </div>
                  <DatePicker
                    isOpen={isDatePickerOpen}
                    onDateSelect={handleDateSelect}
                    selectedStartDate={selectedStartDate}
                    selectedEndDate={selectedEndDate}
                  />
                </div>

                <div className="search-field">
                  <label>Check-out Date</label>
                  <div
                    className="search-input-wrapper"
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  >
                    <div className="search-input-inner">
                      <Image
                        src={calendarIcon}
                        width="20"
                        height="20"
                        alt="calendar icon"
                      />
                      <span className="search-input-text">
                        {formatDate(selectedEndDate)}
                      </span>
                    </div>
                    <Image
                      src={plusIcon}
                      width="24"
                      height="24"
                      alt="plus icon"
                    />
                  </div>
                </div>

                <div className="search-field" ref={guestsPickerRef}>
                  <label>Guests and Rooms</label>
                  <div
                    className="search-input-wrapper"
                    onClick={() => setIsGuestsPickerOpen(!isGuestsPickerOpen)}
                  >
                    <div className="search-input-inner">
                      <Image
                        src={guestsIcon}
                        width="20"
                        height="20"
                        alt="guests icon"
                      />
                      <span className="search-input-text">
                        {getTotalGuests() > 0
                          ? `${getTotalGuests()} Guests`
                          : "Add Guests"}
                      </span>
                    </div>
                    <Image
                      src={downBlackArrowIcon}
                      width="24"
                      height="24"
                      alt="down arrow"
                    />
                  </div>
                  <GuestsPicker
                    isOpen={isGuestsPickerOpen}
                    onGuestCountChange={handleGuestCountChange}
                    guestCounts={guestCounts}
                  />
                </div>

                <button className="search-button">
                  <svg
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.5 17.5586L22 22.0586"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20 11.0586C20 6.08803 15.9706 2.05859 11 2.05859C6.02944 2.05859 2 6.08803 2 11.0586C2 16.0292 6.02944 20.0586 11 20.0586C15.9706 20.0586 20 16.0292 20 11.0586Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="container">
            <div className="search-content">
              {/* Left Filter Sidebar */}
              <div className="filter-sidebar">{renderFilters(false)}</div>

              {/* Right Side Results */}
              <div className="result-right-side">
                <div className="search-header">
                  <div className="search-header-left">
                    <div className="search-results-info">
                      Showing 45 hotels in Bangkok (Aug 08 - Aug 18, 3 Guests)
                    </div>
                  </div>
                  <div className="search-header-right">
                    <div className="mobile-filter-button d-lg-none ">
                      <button
                        className="filter-button button-primary "
                        onClick={handleMobileFilterOpen}
                      >
                        <span className="filter-icon-with-text">
                          <Image
                            src={FilterBtnIcon}
                            alt="filter icon"
                            width={20}
                            height={20}
                            className="sort-filter-icon"
                          />
                          Filter
                        </span>
                        <Image
                          src={downBlackArrowIcon}
                          alt="arrow icon"
                          width={20}
                          height={20}
                          className="sort-filter-icon"
                        />
                      </button>
                    </div>
                    <div className="sort-by-select-option">
                      <Select
                        options={sortOptions}
                        value={sortBy}
                        onChange={setSortBy}
                        label="Sort by"
                        className="sort-dropdown"
                      />
                    </div>
                  </div>
                </div>
                <div className="hotel-results">
                  {hotels.map((hotel) => (
                    <div key={hotel.id} className="hotel-card">
                      <div className="hotel-images">
                        <div className="main-image">
                          <Image
                            src={hotel.mainImage}
                            alt={hotel.name}
                            width={276}
                            height={146}
                            className="property-main-img"
                          />
                        </div>
                        <div className="thumbnail-images">
                          {hotel.thumbnailImages.map((img, index) => (
                            <div key={`${hotel.id}-thumb-${index}`} className="thumbnail-image">
                              <Image
                                width={66}
                                height={52}
                                src={img}
                                alt={`${hotel.name} ${index + 1}`}
                                className="property-thumb-img"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="hotel-info-with-action-card d-flex">
                        <div className="hotel-info">
                          <a href="#" className="hotel-name">
                            {hotel.name}
                          </a>
                          <div className="hotel-rating">
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
                              <span className="rating-score">
                                {hotel.rating}
                              </span>
                              ({hotel.reviewCount} Reviews)
                            </span>
                          </div>

                          <div className="hotel-location">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.00098 0.833984C10.5517 0.833984 12.9853 2.34261 14.0039 4.72363C14.9507 6.93686 14.4393 8.82495 13.3721 10.4414C12.4869 11.7821 11.1916 12.9762 10.0264 14.0498C9.81947 14.2404 9.61655 14.4271 9.4209 14.6104C9.03755 14.9693 8.5279 15.167 8.00098 15.167C7.47407 15.167 6.96439 14.9693 6.58105 14.6104L6.58008 14.6094C6.37306 14.4144 6.15823 14.2149 5.93848 14.0117C4.78578 12.9458 3.50787 11.7643 2.63184 10.4404C1.56334 8.82562 1.05008 6.93961 1.99805 4.72363C3.01668 2.34261 5.45026 0.834004 8.00098 0.833984ZM8 4.66699C6.52724 4.66699 5.33301 5.86123 5.33301 7.33398C5.3331 8.80667 6.52729 10.001 8 10.001C9.47271 10.001 10.6669 8.80667 10.667 7.33398C10.667 5.86123 9.47276 4.66699 8 4.66699Z"
                                fill="#6F8DC1"
                              />
                            </svg>

                            <span>{hotel.location}</span>
                          </div>

                          <div className="hotel-amenities">
                            {hotel.ame.map((amenity, index) => (
                              <div key={`${hotel.id}-amenity-${index}`} className="amenity-tag d-flex align-items-center">
                                <Image
                                  src={amenity.icon}
                                  width="16"
                                  height="16"
                                  alt={amenity.name}
                                />
                                <span className="amenity-tag-name">
                                  {amenity.name}
                                </span>
                              </div>
                            ))}
                          </div>

                          <p className="hotel-description">
                            {hotel.description}
                          </p>
                        </div>
                        <div className="property-card-action">
                          <div className="hotel-footer">
                            <div className="hotel-price">
                              <span className="price-amount">
                                <span className="property-currency">
                                  {hotel.currency} {""}
                                </span>
                                {hotel.price}
                              </span>
                              <span className="price-period">Per night</span>
                            </div>
                            <button className="view-details-button button-primary w-100" onClick={() => router.push('/hotel-details')} >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pagination">
                  <button className="pagination-arrow">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 6L9 12L15 18"
                        stroke="#09090B"
                      strokeWidth="1.5"
                      strokeMiterlimit="16"
                      />
                    </svg>
                  </button>

                  <button className="pagination-page active">1</button>
                  <button className="pagination-page">2</button>
                  <button className="pagination-page">3</button>
                  <button className="pagination-page">4</button>
                  <button className="pagination-page">5</button>

                  <button className="pagination-arrow">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.00005 6L15 12L9 18"
                        stroke="#09090B"
                      strokeWidth="1.5"
                      strokeMiterlimit="16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {isMobileFilterOpen && (
          <div className="mobile-filter-modal" role="dialog" aria-modal="true">
            <div
              className="mobile-filter-backdrop"
              onClick={() => setIsMobileFilterOpen(false)}
            ></div>
            <div className="mobile-filter-panel">
              <div className="mobile-filter-header">
                <h3>Filter</h3>
                <button
                  className="close-btn"
                  aria-label="Close filters"
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  <Image
                    src={ClosePopupIcon}
                    width="24"
                    height="24"
                    alt="close icon"
                  />
                </button>
              </div>
              <div className="mobile-filter-body">{renderFilters(true)}</div>
              <div className="mobile-filter-footer">
                <button className="reset-btn button-primary">Reset</button>
                <button
                  className="apply-btn button-primary"
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  Show hotels
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default SearchResult;
