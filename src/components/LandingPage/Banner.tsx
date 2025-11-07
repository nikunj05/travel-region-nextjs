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
import { useRouter } from "next/navigation";
import {
  useSearchFiltersStore,
  Location,
} from "../../store/searchFiltersStore";
import { useHotelSearchStore } from "@/store/hotelSearchStore";
import { getTodayAtMidnight } from "@/lib/dateUtils";
import { useSettingsStore } from "@/store/settingsStore";

const Banner = () => {
  const t = useTranslations("Banner");
  const router = useRouter();

  // App settings store (hydrated from server) for dynamic hero content
  const setting = useSettingsStore((s) => s.setting);
  console.log('setting from store', setting);

  // Use the search filters store
  const {
    filters,
    setLocation,
    setCheckInDate,
    setCheckOutDate,
    setRooms,
    setFreeCancellation,
  } = useSearchFiltersStore();

  // Local UI state
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [isGuestsDropdownOpen, setIsGuestsDropdownOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [freeCancellation, setFreeCancellationLocal] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [checkInError, setCheckInError] = useState("");
  const [checkOutError, setCheckOutError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const guestsPickerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is outside date picker
      if (datePickerRef.current && !datePickerRef.current.contains(target)) {
        setIsDatePickerOpen(false);
      }

      // Check if click is outside guests picker
      if (guestsPickerRef.current && !guestsPickerRef.current.contains(target)) {
        setIsGuestsDropdownOpen(false);
      }

      // Close location dropdown when clicking outside
      const isClickInsideLocationDropdown = document.querySelector(".dropdown")?.contains(target);
      if (!isClickInsideLocationDropdown) {
        setIsLocationDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Dynamic hero content with fallbacks
  const heroImage = setting?.home_hero_image && setting.home_hero_image.trim()
    ? setting.home_hero_image
    : null;
  const heroTitle = (setting?.home_title && setting.home_title.trim()) ;
  const heroSubtitle = (setting?.home_subtitle && setting.home_subtitle.trim()) ;

  const toggleLocationDropdown = () => {
    // Close other dropdowns when opening location dropdown
    if (!isLocationDropdownOpen) {
      setIsDatePickerOpen(false);
      setIsGuestsDropdownOpen(false);
    }
    setIsLocationDropdownOpen(!isLocationDropdownOpen);
  };

  const handleLocationSelect = (location: Location | null) => {
    setLocation(location);
    setIsLocationDropdownOpen(false);
    // Keep the location name in the input for editing
    if (location) {
      setLocationSearchQuery(location.name);
    } else {
      setLocationSearchQuery(""); // Clear only when location is null
    }
    setLocationError(""); // Clear error when location is selected
  };

  const handleLocationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocationSearchQuery(e.target.value);
    if (e.target.value.trim() && !isLocationDropdownOpen) {
      // Close other dropdowns when opening location dropdown via input
      setIsDatePickerOpen(false);
      setIsGuestsDropdownOpen(false);
      setIsLocationDropdownOpen(true);
    }
  };

  const handleLocationInputFocus = () => {
    if (locationSearchQuery.trim()) {
      // Close other dropdowns when opening location dropdown via focus
      setIsDatePickerOpen(false);
      setIsGuestsDropdownOpen(false);
      setIsLocationDropdownOpen(true);
    }
  };

  const handleClearLocation = () => {
    setLocation(null);
    setLocationSearchQuery("");
    setIsLocationDropdownOpen(false);
    setLocationError(""); // Clear error when location is cleared
  };

  const handleSearchClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!filters.location) {
      e.preventDefault(); // Prevent navigation
      setLocationError(t("validation.locationRequired"));
      return;
    }

    // Clear any existing error if location is selected
    setLocationError("");

    // Validate dates before searching
    const isCheckInMissing = !filters.checkInDate;
    const isCheckOutMissing = !filters.checkOutDate;

    // Additional date validation - ensure check-in is today or later
    const today = getTodayAtMidnight();
    
    if (filters.checkInDate && filters.checkInDate < today) {
      e.preventDefault();
      setCheckInError(t("validation.checkInDateInvalid"));
      return;
    }

    setCheckInError(isCheckInMissing ? t("validation.checkInDateRequired") : "");
    setCheckOutError(isCheckOutMissing ? t("validation.checkOutDateRequired") : "");

    if (isCheckInMissing || isCheckOutMissing) {
      e.preventDefault();
      return;
    }
    
    // Prevent default navigation to set store state before navigating
    e.preventDefault();

    // Set loading state
    // setIsSearching(true); // This will be handled by the search result page

    try {
      const coords = filters.location?.coordinates;
      const latitude = coords?.lat ?? null;
      const longitude = coords?.lng ?? null;

      // Push current UI filters into the hotel search store
      useHotelSearchStore
        .getState()
        .setDates(filters.checkInDate, filters.checkOutDate);
      useHotelSearchStore.getState().setRooms(filters.rooms || [{ adults: 2, children: 1 }]);
      useHotelSearchStore.getState().setLanguage("eng"); // Default to English initially
      useHotelSearchStore.getState().setCoordinates(latitude, longitude);

      // Don't execute search here; just navigate
      // await useHotelSearchStore.getState().search();

      // Navigate to search result page (client-side to preserve state)
      router.push("/search-result");
    } catch (err) {
      console.error("Failed to set search store state:", err);
      // Still navigate even if there's an error setting state
      router.push("/search-result");
    } 
    // finally {
      // Reset loading state
      // setIsSearching(false);
    // }
  };

  const toggleGuestsDropdown = () => {
    // Close other dropdowns when opening guests dropdown
    if (!isGuestsDropdownOpen) {
      setIsLocationDropdownOpen(false);
      setIsDatePickerOpen(false);
    }
    setIsGuestsDropdownOpen(!isGuestsDropdownOpen);
  };

  const getGuestsDisplayText = () => {
    // Safety check for rooms array
    const rooms = filters.rooms || [{ adults: 0, children: 0 }];
    
    const totalAdults = rooms.reduce(
      (acc, room) => acc + (room?.adults || 0),
      0
    );
    const totalChildren = rooms.reduce(
      (acc, room) => acc + (room?.children || 0),
      0
    );
    const totalGuests = totalAdults + totalChildren;

    if (totalGuests === 0) return t("addGuests");
    
    const guestsText = `${totalGuests} ${
      totalGuests > 1 ? t("guests") : t("guest")
    }`;
    const roomsText = `${rooms.length} ${
      rooms.length > 1 ? t("rooms") : t("room")
    }`;

    return `${guestsText} • ${roomsText}`;
  };

  // Date picker functions
  const toggleDatePicker = () => {
    // Close other dropdowns when opening date picker
    if (!isDatePickerOpen) {
      setIsLocationDropdownOpen(false);
      setIsGuestsDropdownOpen(false);
    }
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  const handleDateSelect = (startDate: Date | null, endDate: Date | null) => {
    setCheckInDate(startDate);
    setCheckOutDate(endDate);
    setCheckInError(startDate ? "" : checkInError);
    setCheckOutError(endDate ? "" : checkOutError);
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
    return filters.checkOutDate
      ? formatDate(filters.checkOutDate)
      : t("addDate");
  };

  return (
    <section
      className="home-banner-section"
      style={
        heroImage
          ? {
              backgroundImage: `url(${heroImage})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }
          : undefined
      }
    >
      <div className="container">
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <div className="heading_section">
            <h1 className="section-title">{heroTitle }</h1>
            <p className="section-description">{heroSubtitle }</p>
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
                        placeholder={
                          filters.location
                            ? filters.location.name
                            : t("findLocation")
                        }
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
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </div>
                    {filters.location && (
                      <div className="location-actions d-flex align-items-center">
                        <button
                          type="button"
                          className="clear-location-btn p-0 border-0"
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
                      </div>
                    )}
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
                  <div className="location-error-message">{locationError}</div>
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
                {checkInError && (
                  <div className="location-error-message">{checkInError}</div>
                )}
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
                {checkOutError && (
                  <div className="location-error-message">{checkOutError}</div>
                )}
              </div>
              <div className="choose-location-items">
                <h4 className="choose-location-items-title">
                  {t("guestsAndRooms")}
                </h4>
                <div className="dropdown" ref={guestsPickerRef}>
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
                    onRoomsChange={setRooms}
                    rooms={filters.rooms || [{ adults: 2, children: 1 }]}
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
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <div className="search-spinner"></div>
                      {t("searching") || "Searching..."}
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
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
