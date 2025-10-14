"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import locationIcon from "@/assets/images/location-icon.svg";
import downBlackArrowIcon from "@/assets/images/down-black-arrow-icon.svg";
import calendarIcon from "@/assets/images/calendar-icon.svg";
import plusIcon from "@/assets/images/plus-icon.svg";
import guestsIcon from "@/assets/images/guests-icon.svg";
// import minusRoundIcon from '@/assets/images/minus-round-icon.svg'
// import plusRoundIcon from '@/assets/images/plus-round-icon.svg'
import DatePicker from "../core/DatePicker/DatePicker";
import LocationPicker from "../core/LocationPicker/LocationPicker";
import GuestsPicker from "../core/GuestsPicker/GuestsPicker";
import Link from "next/link";
import { useSearchFiltersStore, Location, GuestCounts } from "../../store/searchFiltersStore";

const Banner = () => {
  const t = useTranslations("Banner");

  // Use the search filters store
  const {
    filters,
    setLocation,
    setCheckInDate,
    setCheckOutDate,
    setGuestCounts,
    setFreeCancellation,
  } = useSearchFiltersStore();

  // Local UI state
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [isGuestsDropdownOpen, setIsGuestsDropdownOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [freeCancellation, setFreeCancellationLocal] = useState(false);
  const [locationError, setLocationError] = useState('');
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleLocationDropdown = () => {
    setIsLocationDropdownOpen(!isLocationDropdownOpen);
  };

  const handleLocationSelect = (location: Location | null) => {
    setLocation(location);
    setIsLocationDropdownOpen(false);
    setLocationSearchQuery(''); // Clear search query when location is selected
    setLocationError(''); // Clear error when location is selected
  };

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationSearchQuery(e.target.value);
    if (e.target.value.trim() && !isLocationDropdownOpen) {
      setIsLocationDropdownOpen(true);
    }
  };

  const handleLocationInputFocus = () => {
    if (locationSearchQuery.trim()) {
      setIsLocationDropdownOpen(true);
    }
  };

  const handleClearLocation = () => {
    setLocation(null);
    setLocationSearchQuery('');
    setIsLocationDropdownOpen(false);
    setLocationError(''); // Clear error when location is cleared
  };

  const handleSearchClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!filters.location) {
      e.preventDefault(); // Prevent navigation
      setLocationError('Enter a destination to start searching.');
      return;
    }
    // Clear any existing error if location is selected
    setLocationError('');
  };

  const toggleGuestsDropdown = () => {
    setIsGuestsDropdownOpen(!isGuestsDropdownOpen);
  };

  const getGuestsDisplayText = () => {
    const total = filters.guestCounts.adults + filters.guestCounts.children + filters.guestCounts.pets;
    if (total === 0) return t("addGuests");
    return `${total} ${total > 1 ? t("guests") : t("guest")}`;
  };

  // Date picker functions
  const toggleDatePicker = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  const handleDateSelect = (startDate: Date | null, endDate: Date | null) => {
    setCheckInDate(startDate);
    setCheckOutDate(endDate);
    if (startDate && endDate) {
      // Auto-close when both dates are selected
      setTimeout(() => {
        setIsDatePickerOpen(false);
      }, 200);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    // Use a consistent format that doesn't depend on locale
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCheckInDisplayText = () => {
    return filters.checkInDate ? formatDate(filters.checkInDate) : t("addDate");
  };

  const getCheckOutDisplayText = () => {
    return filters.checkOutDate ? formatDate(filters.checkOutDate) : t("addDate");
  };



  return (
    <section className="home-banner-section">
      <div className="container">
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <div className="heading_section">
            <h1 className="section-title">{t("title")}</h1>
            <p className="section-description">{t("description")}</p>
          </div>
          <div className="banner-property-filter">
            <h3 className="property-filter-title">{t("exploreJourney")}</h3>
            <div className="choose-location-and-date d-grid">
              <div className="choose-location-items">
                <h4 className="choose-location-items-title">{t("location")}</h4>
                <div className="dropdown">
                  <div className="filter-dropdown w-100 d-flex align-items-center justify-content-between">
                    <div className="filter-dropdown-inner d-flex align-items-center flex-grow-1">
                      <Image
                        src={locationIcon}
                        width="20"
                        height="20"
                        alt="location icon"
                      />
                      <input
                        type="text"
                        className="location-input-field"
                        placeholder={filters.location ? filters.location.name : t("findLocation")}
                        value={locationSearchQuery}
                        onChange={handleLocationInputChange}
                        onFocus={handleLocationInputFocus}
                        onClick={toggleLocationDropdown}
                      />
                      {!filters.location && (
                        <Image
                          src={downBlackArrowIcon}
                          width="24"
                          height="24"
                          alt="down icon"
                          className="arrow-and-plus-icon"
                          onClick={toggleLocationDropdown}
                          style={{ cursor: 'pointer' }}
                        />
                      )}
                    </div>
                    <div className="location-actions d-flex align-items-center">
                      {filters.location && (
                        <button
                          type="button"
                          className="clear-location-btn"
                          onClick={handleClearLocation}
                          title="Clear location"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M18 6L6 18M6 6L18 18"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      )}
                      
                    </div>
                  </div>
                  <LocationPicker
                    isOpen={isLocationDropdownOpen}
                    onLocationSelect={handleLocationSelect}
                    selectedLocation={filters.location}
                    searchQuery={locationSearchQuery}
                    onSearchQueryChange={setLocationSearchQuery}
                  />
                </div>
                {locationError && (
                  <div className="location-error-message">
                    {locationError}
                  </div>
                )}
              </div>
              <div className="choose-location-items">
                <h4 className="choose-location-items-title">
                  {t("checkInDate")}
                </h4>
                <div className="dropdown" ref={datePickerRef}>
                  <button
                    className="filter-dropdown w-100 d-flex align-items-center justify-content-between"
                    onClick={toggleDatePicker}
                    type="button"
                  >
                    <div className="filter-dropdown-inner d-flex align-items-center">
                      <Image
                        src={calendarIcon}
                        width="20"
                        height="20"
                        alt="calendar icon"
                      />
                      {getCheckInDisplayText()}
                    </div>
                    <Image
                      src={plusIcon}
                      width="24"
                      height="24"
                      alt="plus icon"
                      className="arrow-and-plus-icon"
                    />
                  </button>
                  <DatePicker
                    isOpen={isDatePickerOpen}
                    onDateSelect={handleDateSelect}
                    selectedStartDate={filters.checkInDate}
                    selectedEndDate={filters.checkOutDate}
                    minDate={undefined}
                  />
                </div>
              </div>
              <div className="choose-location-items">
                <h4 className="choose-location-items-title">
                  {t("checkOutDate")}
                </h4>
                <button
                  className="filter-dropdown w-100 d-flex align-items-center justify-content-between"
                  onClick={toggleDatePicker}
                  type="button"
                >
                  <div className="filter-dropdown-inner d-flex align-items-center">
                    <Image
                      src={calendarIcon}
                      width="20"
                      height="20"
                      alt="calendar icon"
                    />
                    {getCheckOutDisplayText()}
                  </div>
                  <Image
                    src={plusIcon}
                    width="24"
                    height="24"
                    alt="plus icon"
                    className="arrow-and-plus-icon"
                  />
                </button>
              </div>
              <div className="choose-location-items">
                <h4 className="choose-location-items-title">
                  {t("guestsAndRooms")}
                </h4>
                <div className="dropdown">
                  <button
                    className="filter-dropdown w-100 d-flex align-items-center justify-content-between"
                    onClick={toggleGuestsDropdown}
                    type="button"
                  >
                    <div className="filter-dropdown-inner d-flex align-items-center">
                      <Image
                        src={guestsIcon}
                        width="20"
                        height="20"
                        alt="guests icon"
                      />
                      {getGuestsDisplayText()}
                    </div>
                    <Image
                      src={downBlackArrowIcon}
                      width="24"
                      height="24"
                      alt="down icon"
                      className="arrow-and-plus-icon"
                    />
                  </button>
                  <GuestsPicker
                    isOpen={isGuestsDropdownOpen}
                    onGuestCountChange={setGuestCounts}
                    guestCounts={filters.guestCounts}
                  />
                </div>
              </div>
            </div>
            <div className="banner-filter-action d-flex align-items-center justify-content-between">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="freeCancel"
                  checked={freeCancellation}
                  onChange={(e) => {
                    setFreeCancellationLocal(e.target.checked);
                    setFreeCancellation(e.target.checked);
                  }}
                />
                <label className="form-check-label" htmlFor="freeCancel">
                  {t("freeCancellation")}
                </label>
              </div>
              <Link
                href="/search-result"
                className="text-decoration-none banner-search-button"
                onClick={handleSearchClick}
              >
                <button 
                  className="btn banner-search-btn"
                >
                  {t("search")}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 12L4 12M20 12L15.0001 17M20 12L15 7"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
