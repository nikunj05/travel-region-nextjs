"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "@/i18/navigation";
import { useLocale, useTranslations } from "next-intl";
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
import { useSearchFiltersStore, Location, GuestCounts } from "@/store/searchFiltersStore";
import { useHotelSearchStore } from "@/store/hotelSearchStore";
import { HotelItem } from "@/types/hotel";
import { FavoriteHotel, HotelImage } from "@/types/favorite";
import { buildHotelbedsImageUrl } from "@/constants";
import HotelCardSkeleton from "../common/LoadingSkeleton/HotelCardSkeleton";
import { getTodayAtMidnight } from "@/lib/dateUtils";
import Pagination from "../common/Pagination/Pagination";

// Dynamic hotels will be sourced from useHotelSearchStore; no local interface needed here

  const SearchResult = () => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Banner');
  const tSearch = useTranslations('SearchResult');
  
  // Helper function to map locale to API language code
  const getLanguageCode = (currentLocale: string): string => {
    return currentLocale === 'ar' ? 'ara' : 'eng';
  };

  const { 
    filters, 
    setLocation, 
    setCheckInDate, 
    setCheckOutDate, 
    setGuestCounts 
  } = useSearchFiltersStore();
console.log("filters", filters);

  // Dynamic hotels from API (hotel search store)
  const { hotels: apiHotels = [], filters: hotelFilters, total: apiTotal, loading } = useHotelSearchStore();
  console.log("apiHotels", apiHotels);

  // Local UI state
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [locationError, setLocationError] = useState('');
  const [checkInError, setCheckInError] = useState('');
  const [checkOutError, setCheckOutError] = useState('');
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestsPickerOpen, setIsGuestsPickerOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Recommended");
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const [loadingHotelId, setLoadingHotelId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10; // Number of hotels per page
  
  // Filter states
  const [selectedStarRating, setSelectedStarRating] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000);

  // Sort options for the dropdown
  const sortOptions = [
    { value: "Recommended", label: tSearch('sortRecommended') },
    { value: "Price: Low to High", label: tSearch('sortPriceLowToHigh') },
    { value: "Price: High to Low", label: tSearch('sortPriceHighToLow') },
    { value: "Rating", label: tSearch('sortRating') },
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
  const resultsRef = useRef<HTMLDivElement>(null);

  // Reset to first page when sort criteria changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  // Scroll to top when page changes
  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

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

  // Ref to track if initial search has been triggered to prevent continuous calls
  const hasTriggeredInitialSearch = useRef(false);

  useEffect(() => {
    // Only trigger search once if we have location but no hotels and haven't searched yet
    if (
      filters.location && 
      !loading && 
      apiHotels.length === 0 && 
      !hasTriggeredInitialSearch.current
    ) {
      hasTriggeredInitialSearch.current = true;
      handleSearchClick({ preventDefault: () => {} } as React.MouseEvent<HTMLButtonElement>);
    }
  }, [filters.location, apiHotels, loading]);

  // Re-trigger search when locale changes (if we have valid search criteria)
  useEffect(() => {
    // Check if we have all required search parameters and the store has search data
    const storeFilters = useHotelSearchStore.getState().filters;
    const hasValidSearchCriteria = 
      storeFilters.checkIn && 
      storeFilters.checkOut && 
      storeFilters.latitude !== null && 
      storeFilters.longitude !== null;

    // Get current language code from store
    const currentStoreLanguage = storeFilters.language;
    const newLanguageCode = getLanguageCode(locale);

    console.log('Locale effect triggered:', {
      locale,
      currentStoreLanguage,
      newLanguageCode,
      hasValidSearchCriteria,
      loading
    });

    // Only re-search if:
    // 1. We have valid search criteria
    // 2. The language has changed
    // 3. We're not already loading
    if (hasValidSearchCriteria && currentStoreLanguage !== newLanguageCode && !loading) {
      console.log('Language changed - re-triggering search with language:', newLanguageCode);
      
      // Update the language in the hotel search store
      useHotelSearchStore.getState().setLanguage(newLanguageCode);
      
      // Re-trigger the search with the new language
      useHotelSearchStore.getState().search().then(() => {
        const { hotels, currency, error } = useHotelSearchStore.getState();
        if (error) {
          console.error('Hotels API error after locale change:', error);
        } else {
          const hotelCount = Array.isArray(hotels) ? hotels.length : 0;
          console.log('Hotels reloaded with new language:', { count: hotelCount, currency });
        }
      }).catch((err) => {
        console.error('Locale search promise error:', err);
      });
    }
  }, [locale, loading]);

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

  const getHotelId = (hotel: HotelItem | FavoriteHotel) => ('code' in hotel ? hotel.code : (hotel as HotelItem).id);
  const getHotelName = (hotel: HotelItem | FavoriteHotel) => (
    'name' in hotel && typeof hotel.name === 'string' ? hotel.name : (hotel as FavoriteHotel).name?.content
  ) || 'Hotel';
  const getHotelLocation = (hotel: HotelItem | FavoriteHotel) => (
    (hotel as FavoriteHotel).address?.content || (hotel as FavoriteHotel).city?.content || 'Location'
  );
  const getHotelCode = (hotel: HotelItem | FavoriteHotel) => ('code' in hotel ? hotel.code : undefined);

  // Helper function to extract star rating from categoryCode
  const getStarRating = (hotel: HotelItem | FavoriteHotel): number => {
    if ('categoryCode' in hotel && hotel.categoryCode) {
      // Extract number from categoryCode (e.g., "4EST" -> 4)
      const match = hotel.categoryCode.match(/^(\d+)/);
      return match ? parseInt(match[1], 10) : 5; // Default to 5 stars if no match
    }
    return 5; // Default fallback
  };

  const getOrderedHotelImages = (hotel: HotelItem | FavoriteHotel) => {
    const images = (hotel.images || []).filter((img) => !!img?.path);
    // Prioritize GEN images first; within each group, sort by 'order' then 'visualOrder'
    const getOrderValue = (img: HotelImage) => {
      if (typeof img.order === "number") return img.order;
      if (typeof img.visualOrder === "number") return img.visualOrder;
      return Number.MAX_SAFE_INTEGER;
    };
    const genImages = images
      .filter((img) => img.imageTypeCode === "GEN")
      .sort((a, b) => getOrderValue(a) - getOrderValue(b));
    const otherImages = images
      .filter((img) => img.imageTypeCode !== "GEN")
      .sort((a, b) => getOrderValue(a) - getOrderValue(b));
    // Return prioritized list (GEN first, then others)
    return [...genImages, ...otherImages];
  };

  const getMainAndThumbImages = (hotel: HotelItem | FavoriteHotel) => {
    const sorted = getOrderedHotelImages(hotel);
    if (sorted.length === 0) {
      return {
        main: null,
        thumbs: [] as string[],
      };
    }
    // Take up to 5 images total; GEN are already prioritized in getOrderedHotelImages
    const topFive = sorted.slice(0, 5);
    const mainPath = topFive[0]?.path;
    const thumbPaths = topFive.slice(1).map((img) => img.path);
    return {
      main: mainPath ? buildHotelbedsImageUrl(mainPath) : null,
      thumbs: thumbPaths.map(buildHotelbedsImageUrl),
    };
  };

  const handleLocationSelect = (location: Location | null) => {
    setLocation(location);
    setIsLocationPickerOpen(false);
    // Keep the location name in the input for editing
    if (location) {
      setLocationSearchQuery(location.name);
    } else {
      setLocationSearchQuery(''); // Clear only when location is null
    }
    setLocationError('');
  };

  const handleDateSelect = (startDate: Date | null, endDate: Date | null) => {
    setCheckInDate(startDate);
    setCheckOutDate(endDate);
    if(startDate) {
      setCheckInError('');
    }
    if(endDate) {
      setCheckOutError('');
    }
    if (startDate && endDate) {
      setTimeout(() => setIsDatePickerOpen(false), 200);
    }
  };

  const handleGuestCountChange = (counts: GuestCounts) => {
    setGuestCounts(counts);
    // Don't auto-close guests picker, let user manually close or click outside
  };

  const handleClearLocation = () => {
    setLocation(null);
    setLocationSearchQuery('');
    setIsLocationPickerOpen(false);
    setLocationError('');
  };

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationSearchQuery(e.target.value);
    if (e.target.value.trim() && !isLocationPickerOpen) {
      // Close other dropdowns when opening location picker via input
      setIsDatePickerOpen(false);
      setIsGuestsPickerOpen(false);
      setIsLocationPickerOpen(true);
    }
  };

  const handleLocationInputFocus = () => {
    if (locationSearchQuery.trim()) {
      // Close other dropdowns when opening location picker via focus
      setIsDatePickerOpen(false);
      setIsGuestsPickerOpen(false);
      setIsLocationPickerOpen(true);
    }
  };

  // Toggle functions with mutual exclusion
  const toggleLocationPicker = () => {
    // Close other dropdowns when opening location picker
    if (!isLocationPickerOpen) {
      setIsDatePickerOpen(false);
      setIsGuestsPickerOpen(false);
    }
    setIsLocationPickerOpen(!isLocationPickerOpen);
  };

  const toggleDatePicker = () => {
    // Close other dropdowns when opening date picker
    if (!isDatePickerOpen) {
      setIsLocationPickerOpen(false);
      setIsGuestsPickerOpen(false);
    }
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  const toggleGuestsPicker = () => {
    // Close other dropdowns when opening guests picker
    if (!isGuestsPickerOpen) {
      setIsLocationPickerOpen(false);
      setIsDatePickerOpen(false);
    }
    setIsGuestsPickerOpen(!isGuestsPickerOpen);
  };

  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!filters.location) {
      e.preventDefault();
      setLocationError('Enter a destination to start searching.');
      return;
    }
    setLocationError('');

    const isCheckInMissing = !filters.checkInDate;
    const isCheckOutMissing = !filters.checkOutDate;

    // Additional date validation - ensure check-in is today or later
    const today = getTodayAtMidnight();
    
    if (filters.checkInDate && filters.checkInDate < today) {
      setCheckInError('Check-in date must be today or later.');
      return;
    }

    setCheckInError(isCheckInMissing ? 'Select a check-in date.' : '');
    setCheckOutError(isCheckOutMissing ? 'Select a check-out date.' : '');

    if (isCheckInMissing || isCheckOutMissing) {
      return;
    }
    
    // Wire dynamic filters to hotel search store and call API
    try {
      const coords = filters.location?.coordinates;
      const latitude = coords?.lat ?? null;
      const longitude = coords?.lng ?? null;

      // Push current UI filters into the hotel search store
      useHotelSearchStore.getState().setDates(filters.checkInDate, filters.checkOutDate);
      useHotelSearchStore.getState().setGuests(
        filters.guestCounts.adults,
        filters.guestCounts.children,
        1 // rooms (fallback to 1 for now)
      );
      // Set language based on current locale: 'en' -> 'eng', 'ar' -> 'ara'
      useHotelSearchStore.getState().setLanguage(getLanguageCode(locale));
      useHotelSearchStore.getState().setCoordinates(latitude, longitude);

      // Execute search and log the raw response data held in the store
      useHotelSearchStore.getState().search().then(() => {
        const { hotels, currency, error } = useHotelSearchStore.getState();
        if (error) {
          console.error('Hotels API error:', error);
        } else {
          const hotelCount = Array.isArray(hotels) ? hotels.length : 0;
          console.log('Hotels API result:', { hotelCount, currency });
        }
      }).catch((err) => {
        console.error('Search promise error:', err);
      });
    } catch (err) {
      console.error('Failed to trigger hotels search:', err);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Add Date";
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
  };

  const getTotalGuests = () => {
    return filters.guestCounts.adults + filters.guestCounts.children + filters.guestCounts.pets;
  };

  const handleReadMoreClick = (e: React.MouseEvent<HTMLAnchorElement>, hotelId: string) => {
    e.preventDefault();
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(hotelId)) {
        newSet.delete(hotelId);
      } else {
        newSet.add(hotelId);
      }
      return newSet;
    });
  };

  const handleViewDetailsClick = async (hotelCode: string | number | undefined) => {
    if (!hotelCode) return;
    
    const hotelId = hotelCode.toString();
    setLoadingHotelId(hotelId);
    
    try {
      // Navigate to hotel details page
      await router.push(`/hotel-details/${hotelCode}`);
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      // Reset loading state after a short delay to show the loading effect
      setTimeout(() => {
        setLoadingHotelId(null);
      }, 500);
    }
  };

  // Handler for star rating radio button changes
  const handleStarRatingChange = (star: number) => {
    // If clicking the same star, unselect it
    const newRating = selectedStarRating === star ? null : star;
    
    setSelectedStarRating(newRating);
    
    // Update store and trigger search
    useHotelSearchStore.getState().setStarRating(newRating);
    
    // Only search if we have valid criteria
    const storeFilters = useHotelSearchStore.getState().filters;
    if (storeFilters.checkIn && storeFilters.checkOut && storeFilters.latitude !== null && storeFilters.longitude !== null) {
      useHotelSearchStore.getState().search();
    }
  };

  // Handler for price range changes
  const handlePriceRangeChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    
    // Update store and trigger search
    useHotelSearchStore.getState().setPriceRange(min, max);
    
    // Only search if we have valid criteria
    const storeFilters = useHotelSearchStore.getState().filters;
    if (storeFilters.checkIn && storeFilters.checkOut && storeFilters.latitude !== null && storeFilters.longitude !== null) {
      useHotelSearchStore.getState().search();
    }
  };

  // Handler for clearing all filters
  const handleClearFilters = () => {
    setSelectedStarRating(null);
    setMinPrice(0);
    setMaxPrice(5000);
    
    // Reset filters in store
    useHotelSearchStore.getState().setStarRating(null);
    useHotelSearchStore.getState().setPriceRange(null, null);
    
    // Re-search with cleared filters
    const storeFilters = useHotelSearchStore.getState().filters;
    if (storeFilters.checkIn && storeFilters.checkOut && storeFilters.latitude !== null && storeFilters.longitude !== null) {
      useHotelSearchStore.getState().search();
    }
  };

  // Price slider handlers
  const handleMinPriceSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value <= maxPrice - 100) {
      setMinPrice(value);
    }
  };

  const handleMaxPriceSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= minPrice + 100) {
      setMaxPrice(value);
    }
  };

  const handlePriceSliderMouseUp = () => {
    // Trigger search when slider is released
    if (minPrice > 0 || maxPrice < 5000) {
      handlePriceRangeChange(minPrice, maxPrice);
    } else {
      // If both are at default, clear the filter
      useHotelSearchStore.getState().setPriceRange(null, null);
      const storeFilters = useHotelSearchStore.getState().filters;
      if (storeFilters.checkIn && storeFilters.checkOut && storeFilters.latitude !== null && storeFilters.longitude !== null) {
        useHotelSearchStore.getState().search();
      }
    }
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
          {tSearch('mapView')}
        </button>
      </div>
      <div className={`filter-header ${isMobile ? "d-none" : ""}`}>
        <h3>{tSearch('filterBy')}</h3>
        <button className="clear-filters" onClick={handleClearFilters}>{tSearch('clear')}</button>
      </div>

      <div className="filter-section">
        <div
          className="filter-title"
          onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}
        >
          {tSearch('priceRange')}
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
              <span>${minPrice}</span>
              <span>${maxPrice}</span>
            </div>
            <div className="price-slider-container" style={{ position: 'relative', height: '40px', marginTop: '10px', width: '100%' }}>
              <div 
                className="slider-track"
                style={{
                  position: 'absolute',
                  height: '6px',
                  background: '#F3F4F6',
                  width: '100%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  borderRadius: '10px',
                  left: 0,
                  pointerEvents: 'none',
                }}
              >
                <div 
                  className="slider-range"
                  style={{
                    position: 'absolute',
                    height: '100%',
                    background: '#3E5B96',
                    left: `${(minPrice / 5000) * 100}%`,
                    width: `${((maxPrice - minPrice) / 5000) * 100}%`,
                    borderRadius: '10px',
                  }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={minPrice}
                onChange={handleMinPriceSliderChange}
                onMouseUp={handlePriceSliderMouseUp}
                onTouchEnd={handlePriceSliderMouseUp}
                style={{
                  position: 'absolute',
                  width: '100%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'all',
                  zIndex: minPrice > (maxPrice - 500) ? 5 : 3,
                }}
                className="price-range-input price-range-input-min"
              />
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={maxPrice}
                onChange={handleMaxPriceSliderChange}
                onMouseUp={handlePriceSliderMouseUp}
                onTouchEnd={handlePriceSliderMouseUp}
                style={{
                  position: 'absolute',
                  width: '100%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'all',
                  zIndex: 4,
                }}
                className="price-range-input price-range-input-max"
              />
            </div>
          </div>
        )}
      </div>

      <div className="filter-section">
        <div
          className="filter-title"
          onClick={() => setIsStarRatingOpen(!isStarRatingOpen)}
        >
          {tSearch('starRating')}
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
                <input 
                  type="radio" 
                  name="star-rating-filter"
                  checked={selectedStarRating === stars}
                  onChange={() => handleStarRatingChange(stars)}
                />
                <span className="radio-mark"></span>
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
          {tSearch('guestRating')}
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
              {tSearch('excellent')}
            </label>
            <label className="filter-option">
              <input type="radio" name="guest-rating" />
              <span className="radio-mark"></span>
              {tSearch('veryGood')}
            </label>
            <label className="filter-option">
              <input type="radio" name="guest-rating" />
              <span className="radio-mark"></span>
              {tSearch('good')}
            </label>
          </div>
        )}
      </div>

      <div className="filter-section">
        <div
          className="filter-title"
          onClick={() => setIsAmenitiesOpen(!isAmenitiesOpen)}
        >
          {tSearch('amenities')}
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
            {["wifi", "parking", "petFriendly", "breakfast"].map(
              (amenity) => (
                <label key={amenity} className="filter-option">
                  <input type="checkbox" defaultChecked={amenity === "wifi"} />
                  <span className="checkmark"></span>
                  {tSearch(amenity)}
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
          {tSearch('propertyType')}
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
            {["hotel", "resort", "apartment", "villa"].map((type) => (
              <label key={type} className="filter-option">
                <input
                  type="radio"
                  name="property-type"
                  defaultChecked={type === "hotel"}
                />
                <span className="radio-mark"></span>
                {tSearch(type)}
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
          {tSearch('locationType')}
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
              {tSearch('nearBeach')}
            </label>
            <label className="filter-option">
              <input type="checkbox" />
              <span className="checkmark"></span>
              {tSearch('cityCenter')}
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
                  <label>{t('location')}</label>
                  <div className="search-input-wrapper">
                    <div className="search-input-inner">
                      <Image
                        src={locationIcon}
                        width="20"
                        height="20"
                        alt="location icon"
                      />
                      <input
                        type="text"
                        className="location-input-field"
                        placeholder={filters.location ? filters.location.name : t('findLocation')}
                        value={locationSearchQuery}
                        onChange={handleLocationInputChange}
                        onFocus={handleLocationInputFocus}
                        onClick={toggleLocationPicker}
                      />
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
                      {!filters.location && (
                        <Image
                          src={downBlackArrowIcon}
                          width="24"
                          height="24"
                          alt="down icon"
                          className="arrow-and-plus-icon"
                          onClick={toggleLocationPicker}
                          style={{ cursor: 'pointer' }}
                        />
                      )}
                    </div>
                  </div>
                  {locationError && (
                    <div className="location-error-message">
                      {locationError}
                    </div>
                  )}
                  <LocationPicker
                    isOpen={isLocationPickerOpen}
                    onLocationSelect={handleLocationSelect}
                    selectedLocation={filters.location}
                    searchQuery={locationSearchQuery}
                    onSearchQueryChange={setLocationSearchQuery}
                  />
                </div>

                <div className="search-field" ref={datePickerRef}>
                  <label>{t('checkInDate')}</label>
                  <div
                    className="search-input-wrapper"
                    onClick={toggleDatePicker}
                  >
                    <div className="search-input-inner">
                      <Image
                        src={calendarIcon}
                        width="20"
                        height="20"
                        alt="calendar icon"
                      />
                      <span className="search-input-text">
                        {formatDate(filters.checkInDate)}
                      </span>
                    </div>
                    <Image
                      src={plusIcon}
                      width="24"
                      height="24"
                      alt="plus icon"
                    />
                  </div>
                  {checkInError && <div className="location-error-message">{checkInError}</div>}
                  <DatePicker
                    isOpen={isDatePickerOpen}
                    onDateSelect={handleDateSelect}
                    selectedStartDate={filters.checkInDate}
                    selectedEndDate={filters.checkOutDate}
                  />
                </div>

                <div className="search-field">
                  <label>{t('checkOutDate')}</label>
                  <div
                    className="search-input-wrapper"
                    onClick={toggleDatePicker}
                  >
                    <div className="search-input-inner">
                      <Image
                        src={calendarIcon}
                        width="20"
                        height="20"
                        alt="calendar icon"
                      />
                      <span className="search-input-text">
                        {formatDate(filters.checkOutDate)}
                      </span>
                    </div>
                  </div>
                  {checkOutError && <div className="location-error-message">{checkOutError}</div>}
                </div>

                <div className="search-field" ref={guestsPickerRef}>
                  <label>{t('guestsAndRooms')}</label>
                  <div
                    className="search-input-wrapper"
                    onClick={toggleGuestsPicker}
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
                          ? `${getTotalGuests()} ${t('guests')}`
                          : t('addGuests')}
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
                    guestCounts={filters.guestCounts}
                  />
                </div>

                <button className="search-button" onClick={handleSearchClick}>
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
        <div className="main-content" ref={resultsRef}>
          <div className="container">
            <div className="search-content">
              {/* Left Filter Sidebar */}
              <div className="filter-sidebar">{renderFilters(false)}</div>

              {/* Right Side Results */}
              <div className="result-right-side">
                <div className="search-header">
                  <div className="search-header-left">
                    <div className="search-results-info">
                      {loading ? (
                        <span>{tSearch('searchingHotels')}</span>
                      ) : (
                        <>
                          {tSearch('showingHotels', { count: apiHotels.length, total: apiTotal ?? apiHotels.length, location: filters.location ? filters.location.name : 'Selected Location' })}
                          {hotelFilters.checkIn && hotelFilters.checkOut && (
                            <span> ({formatDate(hotelFilters.checkIn)} - {formatDate(hotelFilters.checkOut)})</span>
                          )}
                          {getTotalGuests() > 0 && (
                            <span>, {getTotalGuests()} {tSearch('guests')}</span>
                          )}
                        </>
                      )}
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
                          {tSearch('filter')}
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
                        label={tSearch('sortBy')}
                        className="sort-dropdown"
                      />
                    </div>
                  </div>
                </div>

                {(() => {
                  const sortedHotels = useMemo(() => {
                    const sortable = [...apiHotels];
                    switch (sortBy) {
                      case 'Price: Low to High':
                        return sortable.sort((a, b) => {
                          const rateA = 'minRate' in a ? parseFloat(String((a as HotelItem).minRate)) || 0 : 0;
                          const rateB = 'minRate' in b ? parseFloat(String((b as HotelItem).minRate)) || 0 : 0;
                          return rateA - rateB;
                        });
                      case 'Price: High to Low':
                        return sortable.sort((a, b) => {
                          const rateA = 'maxRate' in a ? parseFloat(String((a as HotelItem).maxRate)) || 0 : 0;
                          const rateB = 'maxRate' in b ? parseFloat(String((b as HotelItem).maxRate)) || 0 : 0;
                          return rateB - rateA;
                        });
                      case 'Rating':
                        return sortable.sort((a, b) => getStarRating(b) - getStarRating(a));
                      default: // Recommended
                        return sortable;
                    }
                  }, [apiHotels, sortBy]);

                  const totalPages = Math.ceil(sortedHotels.length / ITEMS_PER_PAGE);
                  const paginatedHotels = sortedHotels.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

                  return (
                    <>
                      <div className="hotel-results">
                        {loading ? (
                          // Show loading skeletons
                          [...Array(6)].map((_, index) => (
                            <HotelCardSkeleton key={`skeleton-${index}`} />
                          ))
                        ) : apiHotels.length > 0 ? (
                          // Show actual hotel results
                          paginatedHotels.map((hotel: HotelItem | FavoriteHotel) => (
                          <div key={getHotelId(hotel)} className="hotel-card">
                            <div className="hotel-images">
                              {(() => {
                                const images = getMainAndThumbImages(hotel);
                                return (
                                  <>
                                    <div className="main-image">
                                      <Image
                                        src={images.main || (mainImage1 as unknown as string)}
                                        alt={getHotelName(hotel) || 'Hotel'}
                                        width={276}
                                        height={146}
                                        className="property-main-img"
                                      />
                                    </div>
                                    <div className="thumbnail-images">
                                      {(images.thumbs.length > 0
                                        ? images.thumbs
                                        : [thumbnailImages1, thumbnailImages2, thumbnailImages3, thumbnailImages4] as unknown as string[]
                                      ).slice(0, 4).map((imgSrc, index) => (
                                        <div key={`${getHotelId(hotel)}-thumb-${index}`} className="thumbnail-image">
                                          <Image
                                            width={66}
                                            height={52}
                                            src={imgSrc}
                                            alt={`${getHotelName(hotel)} ${index + 1}`}
                                            className="property-thumb-img"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                            <div className="hotel-info-with-action-card d-flex">
                              <div className="hotel-info">
                                <p className="hotel-name">
                                  {getHotelName(hotel)}
                                </p>
                                <div className="hotel-rating">
                                  <div className="rating-stars d-flex align-items-center">
                                    {Array.from({ length: getStarRating(hotel) }, (_, index) => (
                                      <Image
                                        key={`${getHotelId(hotel)}-star-${index}`}
                                        src={ReviewStarFill}
                                        alt="star icon"
                                        width="16"
                                        height="16"
                                      />
                                    ))}
                                  </div>
                                  <span className="rating-reviews d-flex align-items-center">
                                    <span className="rating-score">
                                      {getStarRating(hotel)}
                                    </span>
                                    {/* ({120} {tSearch('reviews')}) */}
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

                                  <span>{getHotelLocation(hotel)}</span>
                                </div>

                                <div className="hotel-amenities">
                                  {[
                                    { name: 'Breakfast', icon: BreaFastIcon },
                                    { name: 'Parking', icon: ParkingIcon },
                                    { name: 'Pool', icon: PoolIcon },
                                  ].map((amenity, index) => (
                                    <div key={`${getHotelId(hotel)}-amenity-${index}`} className="amenity-tag d-flex align-items-center">
                                      <Image src={amenity.icon} width="16" height="16" alt={amenity.name} />
                                      <span className="amenity-tag-name">{amenity.name}</span>
                                    </div>
                                  ))}
                                </div>

                                <p className="hotel-description">
                                  {(() => {
                                    const hotelId = getHotelId(hotel).toString();
                                    const description = ('description' in hotel && (hotel as FavoriteHotel).description?.content) || 'Contemporary design meets comfort. Rooftop pool with panoramic city views.';
                                    const isExpanded = expandedDescriptions.has(hotelId);
                                    const truncatedDescription = description.length > 100 ? description.substring(0, 100) + '...' : description;
                                    
                                    return (
                                      <>
                                        {isExpanded ? description : truncatedDescription}
                                        {description.length > 100 && (
                                          <a 
                                            href="#" 
                                            onClick={(e) => handleReadMoreClick(e, hotelId)}
                                            style={{ marginLeft: '8px', color: '#3E5B96', textDecoration: 'underline' }}
                                          >
                                            {isExpanded ? tSearch('readLess') : tSearch('readMore')}
                                          </a>
                                        )}
                                      </>
                                    );
                                  })()}
                                </p>
                              </div>
                              <div className="property-card-action">
                                <div className="hotel-footer">
                                  <div className="hotel-price">
                                    <span className="price-amount">
                                      <span className="property-currency">
                                        {('currency' in hotel && (hotel as HotelItem).currency) || 'US$'} {""}
                                      </span>
                                      {('maxRate' in hotel && (hotel as HotelItem).maxRate) || 179}
                                    </span>
                                    <span className="price-period">{tSearch('perNight')}</span>
                                  </div>
                                  <button 
                                    className="view-details-button button-primary w-100" 
                                    onClick={() => handleViewDetailsClick(getHotelCode(hotel))}
                                    disabled={loadingHotelId === getHotelCode(hotel)?.toString()}
                                  >
                                    {loadingHotelId === getHotelCode(hotel)?.toString() ? (
                                      <>
                                        <div className="view-details-spinner"></div>
                                        {tSearch('loading')}
                                      </>
                                    ) : (
                                      tSearch('viewDetails')
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                        ) : (
                          <div className="no-hotels-found">
                            <h2>{tSearch('noHotelsFound')}</h2>
                            <p>{tSearch('noHotelsFoundDesc')}</p>
                          </div>
                        )}
                      </div>
                      {totalPages > 1 && (
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onChange={(page) => setCurrentPage(page)}
                        />
                      )}
                    </>
                  );
                })()}
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
                <h3>{tSearch('filter')}</h3>
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
                <button className="reset-btn button-primary" onClick={handleClearFilters}>{tSearch('reset')}</button>
                <button
                  className="apply-btn button-primary"
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  {tSearch('showHotels')}
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
