"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
import NoImageFallback from "@/assets/images/no-image.jpg";
import ReviewStarFill from "@/assets/images/star-fill-icon.svg";
// import BreaFastIcon from "@/assets/images/breackfast-icon.svg";
// import ParkingIcon from "@/assets/images/parking-icon.svg";
// import PoolIcon from "@/assets/images/pool-icon.svg";
import FilterBtnIcon from "@/assets/images/filter-icon.svg";
import ClosePopupIcon from "@/assets/images/close-btn-icon.svg";
import { Heart, Camera } from "lucide-react";
import SearchResultGalleryModal from "../common/SearchResultGalleryModal/SearchResultGalleryModal";
import "./SearchResult.scss";
import {
  useSearchFiltersStore,
  Location,
  Room,
} from "@/store/searchFiltersStore";
import { useHotelSearchStore } from "@/store/hotelSearchStore";
import { HotelItem, AccommodationType, HotelRate, HotelAvailabilityRoom, Board } from "@/types/hotel";
import { hotelService } from "@/services/hotelService";
import { FavoriteHotel, HotelImage } from "@/types/favorite";
import { buildHotelbedsImageUrl } from "@/constants";
import HotelCardSkeleton from "../common/LoadingSkeleton/HotelCardSkeleton";
import { getTodayAtMidnight } from "@/lib/dateUtils";
import { buildHotelSlug } from "@/lib/hotelSlug";
import { buildCurrencySvgMarkup } from "@/constants";
import { useInactivity } from "@/hooks/useInactivity";
import SessionTimeoutModal from "../common/SessionTimeoutModal/SessionTimeoutModal";
import Pagination from "../common/Pagination/Pagination";

// Dynamic hotels will be sourced from useHotelSearchStore; no local interface needed here

// Helper function to map locale to API language code
const getLanguageCode = (currentLocale: string): string => {
  return currentLocale === "ar" ? "ara" : "eng";
};

const SearchResult = () => {
  const locale = useLocale();
  const t = useTranslations("Banner");
  const tSearch = useTranslations("SearchResult");

  // Inactivity detection (20 minutes)
  const { isInactive } = useInactivity(20 * 60 * 1000);

  const { filters, setLocation, setCheckInDate, setCheckOutDate, setRooms } =
    useSearchFiltersStore();
  // console.log("fi  lters", filters);

  // Dynamic hotels from API (hotel search store)
  const {
    hotels: apiHotels = [],
    filters: hotelFilters,
    total: apiTotal,
    loading,
    zones,
    search: triggerSearch,
    updateFilters: updateHotelFilters,
  } = useHotelSearchStore();
  // console.log("apiHotels", apiHotels);

  // Local UI state
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [locationError, setLocationError] = useState("");
  const [checkInError, setCheckInError] = useState("");
  const [checkOutError, setCheckOutError] = useState("");
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestsPickerOpen, setIsGuestsPickerOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Recommended");
  const [hotelNameFilter, setHotelNameFilter] = useState("");
  // const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const [loadingHotelId, setLoadingHotelId] = useState<string | null>(null);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 40; // Number of hotels to load per page
  const [translatedNames, setTranslatedNames] = useState<Map<string, string>>(
    new Map()
  );
  const [translatedZones, setTranslatedZones] = useState<Map<string, string>>(
    new Map()
  );
  const [translatedFacilities, setTranslatedFacilities] = useState<Map<string, string>>(
    new Map()
  );
  const [translatedBoards, setTranslatedBoards] = useState<Map<string, string>>(
    new Map()
  );
  const [translatedPropertyTypes, setTranslatedPropertyTypes] = useState<Map<string, string>>(
    new Map()
  );

  // Gallery Modal State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedHotelForGallery, setSelectedHotelForGallery] = useState<HotelItem | FavoriteHotel | null>(null);
  const [galleryImages, setGalleryImages] = useState<HotelImage[]>([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);

  const handleGalleryOpen = async (hotel: HotelItem | FavoriteHotel) => {
    setSelectedHotelForGallery(hotel);
    setIsGalleryOpen(true);
    setGalleryImages([]); // Reset images
    setIsGalleryLoading(true);

    // Fetch and console log images
    try {
      const hotelCode = typeof hotel.code === 'number' ? hotel.code : (hotel as FavoriteHotel).code;
      const response = await hotelService.getHotelImages(hotelCode);
      // console.log("==> Hotel Images API Response:", response);
      if (response.status && response.data.images) {
        setGalleryImages(response.data.images);
      }
    } catch (error) {
      console.error("==> Failed to fetch hotel images:", error);
    } finally {
      setIsGalleryLoading(false);
    }
  };

  // Filter states
  const [selectedStarRatings, setSelectedStarRatings] = useState<number[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [activePriceSlider, setActivePriceSlider] = useState<
    "min" | "max" | null
  >(null);

  // Sort options for the dropdown
  const sortOptions = [
    { value: "Recommended", label: tSearch("sortRecommended") },
    { value: "Price: Low to High", label: tSearch("sortPriceLowToHigh") },
    { value: "Price: High to Low", label: tSearch("sortPriceHighToLow") },
    // { value: "Rating", label: tSearch('sortRating') },
  ];

  // Reset filter states when mobile modal opens
  const handleMobileFilterOpen = () => {
    setIsMobileFilterOpen(true);
    // Ensure all sections are open when modal opens
    setIsPriceRangeOpen(true);
    setIsStarRatingOpen(true);
    // setIsGuestRatingOpen(true);
    // setIsAmenitiesOpen(true);
    setIsPropertyTypeOpen(true);
    setIsZoneOpen(true);
    setIsRoomFacilitiesOpen(true);
    setIsHotelFacilitiesOpen(true);
    // setIsLocationTypeOpen(true);
  };

  // Filter sidebar dropdown states
  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(true);
  const [isStarRatingOpen, setIsStarRatingOpen] = useState(true);
  // const [isGuestRatingOpen, setIsGuestRatingOpen] = useState(true);
  // const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(true);
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(true);
  // const [isLocationTypeOpen, setIsLocationTypeOpen] = useState(true);
  const [accommodationTypes, setAccommodationTypes] = useState<
    AccommodationType[]
  >([]);
  const [selectedAccommodationCodes, setSelectedAccommodationCodes] = useState<
    string[]
  >([]);
  const [showAllAccommodationTypes, setShowAllAccommodationTypes] =
    useState<boolean>(false);

  // Zone filter states
  const [isZoneOpen, setIsZoneOpen] = useState(true);
  const [selectedZoneCodes, setSelectedZoneCodes] = useState<(number | string)[]>([]);
  const [showAllZones, setShowAllZones] = useState(false);

  // Facility property filter states
  const [isRoomFacilitiesOpen, setIsRoomFacilitiesOpen] = useState(true);
  const [selectedRoomFacilityCodes, setSelectedRoomFacilityCodes] = useState<number[]>([]);

  const [isHotelFacilitiesOpen, setIsHotelFacilitiesOpen] = useState(true);
  const [selectedHotelFacilityCodes, setSelectedHotelFacilityCodes] = useState<number[]>([]);

  // Boards filter state
  const [boards, setBoards] = useState<Board[]>([]);
  const [isBoardsOpen, setIsBoardsOpen] = useState(true);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [initialSearchDone, setInitialSearchDone] = useState(false);

  // Cancellation Policy filter state
  const [isCancellationPolicyOpen, setIsCancellationPolicyOpen] = useState(true);
  const [isRefundable, setIsRefundable] = useState(false);
  const [isNonRefundable, setIsNonRefundable] = useState(false);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});
  const [imageRetryIndexMap, setImageRetryIndexMap] = useState<Record<string, number>>({});

  const roomFacilitiesList = [
    { code: 10, name: "Bathroom" },
    { code: 20, name: "Shower" },
    { code: 305, name: "Hot tub" },
    { code: 326, name: "Private Pool" },
    { code: 410, name: "Hot tub" },
    { code: 55, name: "TV" },
    { code: 56, name: "Connecting rooms" },
  ];

  const hotelFacilitiesList = [
    { code: 100, name: "Internet access" },
    { code: 120, name: "Minibar" },
    { code: 200, name: "Restaurant" },
    { code: 295, name: "Wheelchair-accessible" },
    { code: 30, name: "24-hour reception" },
    { code: 306, name: "Outdoor swimming pool" },
    { code: 470, name: "Gym" },
    { code: 560, name: "Valet parking" },
    { code: 620, name: "Spa centre" },
  ];

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await hotelService.getBoards();
        // console.log("Boards Data:", response);
        if (response.status && response.data && response.data.board_types) {
          const fetchedBoards = response.data.board_types;
          const getBoardWeight = (name: string) => {
            const upper = name.toUpperCase();
            if (upper.includes("ROOM ONLY")) return 1;
            if (upper.includes("BED AND BREAKFAST")) return 2;
            if (upper.includes("HALF BOARD")) return 3;
            if (upper.includes("FULL BOARD")) return 4;
            return 5;
          };
          fetchedBoards.sort((a, b) => getBoardWeight(a.name) - getBoardWeight(b.name));
          setBoards(fetchedBoards);
        }
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };

    fetchBoards();
  }, []);

  const handleBoardToggle = (code: string) => {
    setSelectedBoards((prev) => {
      if (prev.includes(code)) {
        return prev.filter((c) => c !== code);
      } else {
        return [...prev, code];
      }
    });
  };

  // Trigger search when boards selection changes, BUT skip the initial mount check
  // because the initial search happens via the URL params in the store or main useEffect.
  // Actually, to support API filtering, we need to pass these extra params to fetchHotels.
  // The current fetchHotels in store primarily uses the store's filters.
  // We can either update the store filters or pass overrides.
  // The store's fetchHotels function builds payload from `filters`.
  // Let's modify the useEffect that calls fetchHotels to include boards if they are selected,
  // OR creates a new effect that calls fetchHotels when selectedBoards changes.

  // NOTE: The main `useEffect` at the top (which call fetchHotels) depends on `filters` from store.
  // If we want to add `boards` to the payload, we might need a way to pass it.
  // The store's `fetchHotels` uses the *store state* `filters`.
  // So we probably need to call a modified fetchHotels or pass extra args?
  // Looking at useHotelSearchStore.ts, fetchHotels takes no args, it uses internal state `filters`.
  // Wait, `filters` in `useHotelSearchStore` is passed to `getHotels` service.
  // We should probably add `boards` to the `filters` state in the store or just pass it as an argument.
  // But `fetchHotels` definition is `fetchHotels: (filters: HotelSearchFilters) => Promise<void>`.
  // And `HotelSearchFilters` is defined in `hotelSearchStore.ts`.
  // Let's check `hotelSearchStore.ts`. It imports `GetHotelsRequest`.
  // We need to update `HotelSearchFilters` to include `boards`.
  // However, I cannot easily change the store interface without seeing it fully.
  // A simpler way: The `fetchHotels` function takes `filters` as argument!
  // `fetchHotels: async (filters) => { ... }`
  // So inside `SearchResult`, we can call `fetchHotels({ ...filters, boards: selectedBoards.join(',') })`.

  // Trigger search when boards selection changes
  // We use `updateFilters` (which updates hotel store filters) 
  // and then `search` (aliased as triggerSearch) to refetch hotels.
  useEffect(() => {
    if (!initialSearchDone) {
      setInitialSearchDone(true);
      return;
    }

    const performSearchWithBoards = async () => {
      // Avoid triggering multiple searches if already loading
      if (loading) return;

      // Update the hotel search store filters with the selected boards
      updateHotelFilters({
        boards: selectedBoards.length > 0 ? selectedBoards.join(',') : null
      });

      // Trigger the search (it uses the store's filters state)
      await triggerSearch();
    };

    // Debounce the search trigger using a timeout
    const timeoutId = setTimeout(() => {
      performSearchWithBoards();
    }, 500);

    return () => clearTimeout(timeoutId);

  }, [selectedBoards, initialSearchDone]); // Removed loading, triggerSearch, and updateHotelFilters to prevent infinite loop.

  useEffect(() => {
    if (!initialSearchDone) {
      return;
    }

    const performSearchWithFeatured = async () => {
      // Avoid triggering multiple searches if already loading
      if (loading) return;

      // Update the hotel search store filters with the featured status
      updateHotelFilters({
        featured: isFeatured ? true : null
      });

      // Trigger the search
      await triggerSearch();
    };

    const timeoutId = setTimeout(() => {
      performSearchWithFeatured();
    }, 500);

    return () => clearTimeout(timeoutId);

  }, [isFeatured, initialSearchDone]);

  // Derived hotel lists
  const getHotelId = useCallback((hotel: HotelItem | FavoriteHotel) =>
    "code" in hotel ? hotel.code : (hotel as HotelItem).id, []);

  const getHotelName = useCallback((hotel: HotelItem | FavoriteHotel) => {
    const hotelId =
      "code" in hotel && hotel.code
        ? hotel.code.toString()
        : getHotelId(hotel).toString();

    // Handle both HotelItem (name: string) and FavoriteHotel (name: {content: string})
    let originalName: string;
    if ("name" in hotel && typeof hotel.name === "string") {
      originalName = hotel.name;
    } else if (
      "name" in hotel &&
      hotel.name &&
      typeof hotel.name === "object" &&
      "content" in hotel.name
    ) {
      originalName = (hotel.name as { content: string }).content || "Hotel";
    } else {
      originalName = (hotel as FavoriteHotel).name?.content || "Hotel";
    }

    // Return translated name if available
    if (locale === "ar" && translatedNames.has(hotelId)) {
      return translatedNames.get(hotelId)!;
    }

    return originalName;
  }, [locale, translatedNames, getHotelId]);

  const getHotelLocation = useCallback((hotel: HotelItem | FavoriteHotel) =>
    (hotel as FavoriteHotel).address?.content ||
    (hotel as FavoriteHotel).city?.content ||
    "Location", []);

  const getHotelCode = useCallback((hotel: HotelItem | FavoriteHotel) =>
    "code" in hotel ? hotel.code : undefined, []);

  // Helper function to extract star rating from categoryCode
  const getStarRating = useCallback((hotel: HotelItem | FavoriteHotel): number => {
    if ("categoryCode" in hotel && hotel.categoryCode) {
      // Extract number from categoryCode (e.g., "4EST" -> 4)
      const match = hotel.categoryCode.match(/^(\d+)/);
      return match ? parseInt(match[1], 10) : 5; // Default to 5 stars if no match
    }
    return 5; // Default fallback
  }, []);

  const getHotelRateValue = useCallback((
    hotel: HotelItem | FavoriteHotel
  ) => {
    if ("minRate" in hotel || "maxRate" in hotel) {
      const item = hotel as HotelItem;
      // console.log("hotel ===>", hotel)
      // Parse rate string to number, handling empty strings and invalid values
      const parseRate = (rate: string | undefined): number | null => {
        if (!rate || rate.trim() === "") return null;
        const parsed = parseFloat(String(rate));
        return isNaN(parsed) ? null : parsed;
      };

      // Always use minRate for sorting since that's what's displayed in the UI
      // Both "Low to High" and "High to Low" should sort by minRate
      const minRate = parseRate(item.minRate);

      // Return minRate if available, otherwise fallback to maxRate, or 0 as last resort
      if (minRate !== null) {
        return minRate;
      }

      // Fallback to maxRate if minRate is not available
      const maxRate = parseRate(item.maxRate);
      return maxRate !== null ? maxRate : 0;
    }
    return 0;
  }, []);

  // Handler for clearing all filters
  const handleClearFilters = useCallback(() => {
    setSelectedStarRatings([]);
    setMinPrice(0);
    setMaxPrice(20000);
    setSelectedAccommodationCodes([]);
    setSelectedZoneCodes([]);
    setSelectedRoomFacilityCodes([]);
    setSelectedHotelFacilityCodes([]);
    setHotelNameFilter("");
    setSelectedBoards([]);
    setIsRefundable(false);
    setIsNonRefundable(false);
    setIsFeatured(false);

    // Sync with store to ensure persistence is also cleared
    updateHotelFilters({
      starRating: null,
      minPrice: null,
      maxPrice: null,
      accommodations: null,
      boards: null,
      featured: null,
    });
  }, [updateHotelFilters]);

  const handleSearchClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!filters.location) {
      e.preventDefault();
      setLocationError(t("validation.locationRequired"));
      return;
    }

    // Clear previous UI filters when starting a new search
    handleClearFilters();

    setLocationError("");

    // Validate that location has coordinates OR a valid code
    const coords = filters.location?.coordinates;
    const hasCoordinates = coords && coords.lat != null && coords.lng != null;
    const hasDestinationCode = !!filters.location?.destination_code;
    const hasHotelCode = !!filters.location?.hotel_code;

    if (!hasCoordinates && !hasDestinationCode && !hasHotelCode) {
      e.preventDefault();
      setLocationError("Please select a valid location with coordinates");
      // console.error("Location missing coordinates and codes:", filters.location);
      return;
    }

    const isCheckInMissing = !filters.checkInDate;
    const isCheckOutMissing = !filters.checkOutDate;

    // Additional date validation - ensure check-in is today or later
    const today = getTodayAtMidnight();

    if (filters.checkInDate && filters.checkInDate < today) {
      setCheckInError(t("validation.checkInDateInvalid"));
      return;
    }

    setCheckInError(
      isCheckInMissing ? t("validation.checkInDateRequired") : ""
    );
    setCheckOutError(
      isCheckOutMissing ? t("validation.checkOutDateRequired") : ""
    );

    if (isCheckInMissing || isCheckOutMissing) {
      return;
    }

    // Wire dynamic filters to hotel search store and call API
    try {
      const latitude = hasCoordinates ? coords!.lat : null;
      const longitude = hasCoordinates ? coords!.lng : null;
      const destinationCode = filters.location?.destination_code || null;
      const hotelCode = filters.location?.hotel_code || null;

      // console.log("Search parameters:", {
      //   latitude,
      //   longitude,
      //   destinationCode,
      //   hotelCode,
      //   location: filters.location.name,
      // });

      // Push current UI filters into the hotel search store
      useHotelSearchStore
        .getState()
        .setDates(filters.checkInDate, filters.checkOutDate);
      useHotelSearchStore
        .getState()
        .setRooms(filters.rooms || [{ adults: 2, children: 1 }]);
      // Set language based on current locale: 'en' -> 'eng', 'ar' -> 'ara'
      useHotelSearchStore.getState().setLanguage(getLanguageCode(locale));
      useHotelSearchStore.getState().setCoordinates(latitude, longitude);
      useHotelSearchStore.getState().setCodes(destinationCode, hotelCode);
      useHotelSearchStore.getState().setCoordinates(latitude, longitude);

      // Execute search and log the raw response data held in the store
      useHotelSearchStore
        .getState()
        .search()
        .then(() => {
          const { hotels, currency, error } = useHotelSearchStore.getState();
          if (error) {
            console.error("Hotels API error:", error);
          } else {
            const hotelCount = Array.isArray(hotels) ? hotels.length : 0;
            console.log("Hotels API result:", { hotelCount, currency });
          }
        })
        .catch((err) => {
          console.error("Search promise error:", err);
        });
    } catch (err) {
      console.error("Failed to trigger hotels search:", err);
    }
  }, [filters, locale, t, handleClearFilters]);

  const sortedHotels = useMemo(() => {
    // Deduplicate rates for all rooms in all hotels before filtering
    let sortable = apiHotels.map(hotel => {
      // Rates are primarily present in HotelItem from availability search
      if ('rooms' in hotel && Array.isArray(hotel.rooms) && 'minRate' in hotel) {
        const hotelItem = hotel as HotelItem;
        return {
          ...hotelItem,
          rooms: hotelItem.rooms.map((room: HotelAvailabilityRoom) => ({
            ...room,
            rates: (room.rates || []).reduce((acc: HotelRate[], rate: HotelRate) => {
              const isDuplicate = acc.some((r) => r.rateKey === rate.rateKey);
              if (!isDuplicate) { acc.push(rate); }
              return acc;
            }, [])
          }))
        };
      }
      return hotel;
    });

    // 1) Apply client-side filters (star rating, price range, property type)
    sortable = sortable.filter((hotel) => {
      // Hotel Name filter
      if (hotelNameFilter.trim()) {
        const name = getHotelName(hotel).toLowerCase();
        if (!name.includes(hotelNameFilter.toLowerCase().trim())) {
          return false;
        }
      }

      // Star rating filter (multi-select match)
      if (selectedStarRatings.length > 0) {
        if (!selectedStarRatings.includes(getStarRating(hotel))) {
          return false;
        }
      }

      // Price range filter (based on minRate / displayed rate)
      const rate = getHotelRateValue(hotel);
      if (rate < minPrice) {
        return false;
      }
      if (maxPrice < 20000 && rate > maxPrice) {
        return false;
      }

      // Property type filter (accommodation codes) – applied when we have codes selected
      if (selectedAccommodationCodes.length > 0) {
        const accommodationCode =
          "accommodationTypeCode" in hotel
            ? (hotel as FavoriteHotel).accommodationTypeCode
            : null;
        // console.log("selectedAccommodationCodes", selectedAccommodationCodes, accommodationCode);

        if (
          !accommodationCode ||
          !selectedAccommodationCodes.includes(accommodationCode)
        ) {
          return false;
        }
      }

      // Zone filter
      if (selectedZoneCodes.length > 0) {
        const hotelZoneCode =
          "zoneCode" in hotel ? (hotel as HotelItem).zoneCode : null;
        // console.log("hotelZoneCode", hotelZoneCode, selectedZoneCodes);
        if (!hotelZoneCode || !selectedZoneCodes.some(code => String(code) === String(hotelZoneCode))) {
          return false;
        }
      }

      // Room Facility filter
      if (selectedRoomFacilityCodes.length > 0) {
        const hotelFacilities = "facilities" in hotel ? (hotel as HotelItem).facilities || [] : [];
        // console.log("hotelFacilities", hotelFacilities, selectedRoomFacilityCodes);
        // Check if hotel matches all selected room facilities
        const hasAllSelectedResponse = selectedRoomFacilityCodes.every((code) => {
          return hotelFacilities.some(f => f.facilityCode === code);
          // return hotelFacilities.some(f => f.facilityCode === code);
        });
        if (!hasAllSelectedResponse) return false;
      }

      // Hotel Facility filter
      if (selectedHotelFacilityCodes.length > 0) {
        const hotelFacilities = "facilities" in hotel ? (hotel as HotelItem).facilities || [] : [];
        // console.log("hotelFacilities", hotelFacilities, selectedRoomFacilityCodes);

        const hasAllSelectedHotel = selectedHotelFacilityCodes.every((code) => {
          return hotelFacilities.some(f => f.facilityCode === code);
        });
        if (!hasAllSelectedHotel) return false;
      }

      // Cancellation Policy filter
      if (isRefundable || isNonRefundable) {
        // If both are unchecked, show all (handled by if condition above, actually no, if both unchecked we skip this block).
        // If one or both checked, we need to filter.

        // Helper to check if a single rate is non-refundable based on user logic
        const isRateNonRefundable = (rate: HotelRate) => {
          // console.log("rate", rate);
          return rate.rateClass === "NRF" || !rate.cancellationPolicies || rate.cancellationPolicies.length === 0;
        };

        const rooms: HotelAvailabilityRoom[] = "minRate" in hotel ? (hotel as HotelItem).rooms || [] : [];

        let hasRefundableRate = false;
        let hasNonRefundableRate = false;

        if (rooms.length > 0) {
          // Check all rates in all rooms
          for (const room of rooms) {
            if (room.rates && room.rates.length > 0) {
              for (const rate of room.rates) {
                // console.log(`Hotel ${hotel.name} - Rate class: ${rate.rateClass}, Policies: ${rate.cancellationPolicies?.length}`, rate);
                if (isRateNonRefundable(rate)) {
                  hasNonRefundableRate = true;
                } else {
                  hasRefundableRate = true;
                }
              }
            }
          }
        } else {
          // Fallback if no rooms loaded
          hasNonRefundableRate = true;
        }

        // Logic:
        // If only Refundable checked: Show if hasRefundableRate is true.
        // If only Non-refundable checked: Show if hasNonRefundableRate is true.
        // If Both checked: Show if hasRefundableRate OR hasNonRefundableRate (which effectively means show all that have rates).

        if (isRefundable && !isNonRefundable) {
          if (!hasRefundableRate) return false;
        } else if (!isRefundable && isNonRefundable) {
          if (!hasNonRefundableRate) return false;
        } else if (isRefundable && isNonRefundable) {
          if (!hasRefundableRate && !hasNonRefundableRate) return false;
        }
      }

      return true;
    });

    // Filter logic for specific hotel (lodging or hotel)
    if (
      (filters.location?.types?.includes("lodging") ||
        filters.location?.types?.includes("hotel")) &&
      filters.location.name
    ) {
      const targetName = filters.location.name.toLowerCase();
      // console.log("targetName", targetName);
      const filtered = sortable.filter((hotel) => {
        const hotelName = getHotelName(hotel).toLowerCase();
        // console.log("hotelName", hotelName);
        // 1. Direct inclusion (fastest)
        if (hotelName.includes(targetName) || targetName.includes(hotelName)) {
          return true;
        }

        // 2. Word token matching
        const cleanString = (str: string) =>
          str
            .replace(/[^\w\s]/g, "")
            .split(/\s+/)
            .filter((w) => w.length > 0);

        const tWords = cleanString(targetName);
        const hWords = cleanString(hotelName);

        if (tWords.length === 0 || hWords.length === 0) return false;

        // Check if all significant target words appear in hotel name
        const allTargetInHotel = tWords.every((tw) => hotelName.includes(tw));
        if (allTargetInHotel) return true;

        // Check if all significant hotel words appear in target name (handle "Sheraton" vs "Sheraton Hotel")
        const allHotelInTarget = hWords.every((hw) => targetName.includes(hw));
        if (allHotelInTarget) return true;

        return false;
      });

      // If we found matches for the specific hotel, show only those.
      // Otherwise, show all results (standard behavior if specific hotel not found in API list).
      if (filtered.length > 0) {
        sortable = filtered;
      }
    }

    // 2) Apply client-side sorting
    // console.log("Applying sort:", sortBy);
    switch (sortBy) {
      case "Price: Low to High":
        return [...sortable].sort((a, b) => {
          const rateA = getHotelRateValue(a);
          const rateB = getHotelRateValue(b);
          return rateA - rateB;
        });
      case "Price: High to Low":
        return [...sortable].sort((a, b) => {
          // Use minRate for both directions since that's what's displayed in UI
          const rateA = getHotelRateValue(a);
          const rateB = getHotelRateValue(b);
          // Ensure proper descending sort
          if (rateA === rateB) return 0;
          return rateB - rateA;
        });
      default: // Recommended
        return sortable;
    }
  }, [
    apiHotels,
    sortBy,
    filters.location,
    selectedStarRatings,
    minPrice,
    maxPrice,
    selectedAccommodationCodes,
    hotelNameFilter,
    selectedZoneCodes,
    selectedRoomFacilityCodes,
    selectedHotelFacilityCodes,
    isRefundable,
    isNonRefundable,
    getHotelName,
    getHotelRateValue,
    getStarRating,
  ]);

  // Hotels to display (paginated)
  const visibleHotels = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedHotels.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedHotels, currentPage]);
  // console.log("visibleHotels", visibleHotels);
  const totalPages = Math.ceil(sortedHotels.length / ITEMS_PER_PAGE);

  // Refs for click outside detection
  const locationPickerRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const guestsPickerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Reset page when sort criteria or hotels list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, sortedHotels.length, filters]);

  // Translate various names (Hotels, Zones, Facilities, Boards) using Google Translate when locale is Arabic
  useEffect(() => {
    if (locale !== "ar") {
      return;
    }

    const translateItems = async <T,>(
      items: T[],
      getId: (item: T) => string,
      getName: (item: T) => string,
      translatedMap: Map<string, string>,
      setTranslatedMap: React.Dispatch<React.SetStateAction<Map<string, string>>>
    ) => {
      const translations = new Map<string, string>();

      const translatePromises = items.map(async (item) => {
        const id = getId(item);
        const originalName = getName(item);

        // Skip if already translated
        if (translatedMap.has(id)) {
          return;
        }

        // Only translate English text
        const isEnglish =
          originalName &&
          !originalName.match(/[\u0600-\u06FF]/) &&
          originalName.match(/[a-zA-Z]/);

        if (isEnglish) {
          try {
            // Use Google Translate API
            const response = await fetch(
              `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(
                originalName
              )}`
            );

            if (response.ok) {
              const data = await response.json();
              if (data && data[0] && data[0][0] && data[0][0][0]) {
                const translated = data[0][0][0];
                if (translated !== originalName) {
                  translations.set(id, translated);
                }
              }
            }
          } catch (error) {
            console.warn(`Translation failed for "${originalName}":`, error);
          }
        }
      });

      await Promise.all(translatePromises);

      if (translations.size > 0) {
        setTranslatedMap((prev) => {
          const updated = new Map(prev);
          translations.forEach((value, key) => {
            updated.set(key, value);
          });
          return updated;
        });
      }
    };

    // Translate Hotels
    if (sortedHotels.length > 0) {
      translateItems(
        sortedHotels,
        (hotel) =>
          "code" in hotel && hotel.code
            ? hotel.code.toString()
            : getHotelId(hotel).toString(),
        (hotel) => getHotelName(hotel),
        translatedNames,
        setTranslatedNames
      );
    }

    // Translate Zones
    if (zones.length > 0) {
      translateItems(
        zones,
        (zone) => zone.code.toString(),
        (zone) => zone.name,
        translatedZones,
        setTranslatedZones
      );
    }

    // Translate Hotel Facilities
    translateItems(
      hotelFacilitiesList,
      (f) => `hotel-${f.code}`,
      (f) => f.name,
      translatedFacilities,
      setTranslatedFacilities
    );

    // Translate Room Facilities
    translateItems(
      roomFacilitiesList,
      (f) => `room-${f.code}`,
      (f) => f.name,
      translatedFacilities,
      setTranslatedFacilities
    );

    // Translate Boards
    if (boards.length > 0) {
      translateItems(
        boards,
        (b) => b.code,
        (b) => b.name,
        translatedBoards,
        setTranslatedBoards
      );
    }

    // Translate Property Types
    if (accommodationTypes.length > 0) {
      translateItems(
        accommodationTypes,
        (item) => item.code,
        (item) => item.typeMultiDescription?.content || item.typeDescription,
        translatedPropertyTypes,
        setTranslatedPropertyTypes
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    locale,
    sortedHotels.length,
    zones.length,
    boards.length,
    accommodationTypes.length,
  ]);

  // Sync local filter state with store on mount
  useEffect(() => {
    const storeFilters = useHotelSearchStore.getState().filters;
    // Sync star rating (wrapped in array for multi-select UI)
    setSelectedStarRatings(storeFilters.starRating ? [storeFilters.starRating] : []);
    // Sync price range (use defaults if null)
    setMinPrice(storeFilters.minPrice ?? 0);
    setMaxPrice(storeFilters.maxPrice ?? 20000);
    // Sync accommodation codes
    const codes = (storeFilters.accommodations || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setSelectedAccommodationCodes(codes);
    setIsFeatured(storeFilters.featured || false);
  }, []);

  // Load accommodation types on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await hotelService.getAccommodationTypes();
        const list = res?.data?.accommodation_types || [];
        // Filter to show only: Hotel, Hostel, Apartment, Villa, Resort
        const allowedCodes = ["H", "S", "A", "V", "W"]; // H=Hotel, S=Hostel, A=Apartment, V=Villa, W=Resort
        const filteredList = list.filter((item: AccommodationType) =>
          allowedCodes.includes(item.code)
        );
        const orderedCodes = ["H", "W", "S", "A", "V"];
        filteredList.sort((a: AccommodationType, b: AccommodationType) => orderedCodes.indexOf(a.code) - orderedCodes.indexOf(b.code));
        setAccommodationTypes(filteredList);
      } catch (e) {
        console.error("Failed to load accommodation types", e);
      }
    })();
  }, []);

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
      handleSearchClick({
        preventDefault: () => { },
      } as React.MouseEvent<HTMLButtonElement>);
    }
  }, [filters.location, apiHotels, handleSearchClick]); // Removed loading to prevent loop; rely on apiHotels empty check.

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

    // console.log("Locale effect triggered:", {
    //   locale,
    //   currentStoreLanguage,
    //   newLanguageCode,
    //   hasValidSearchCriteria,
    //   loading,
    // });

    // Only re-search if:
    // 1. We have valid search criteria
    // 2. The language has changed
    // 3. We're not already loading
    if (
      hasValidSearchCriteria &&
      currentStoreLanguage !== newLanguageCode &&
      !loading
    ) {
      // console.log(
      //   "Language changed - re-triggering search with language:",
      //   newLanguageCode
      // );

      // Update the language in the hotel search store
      useHotelSearchStore.getState().setLanguage(newLanguageCode);

      // Re-trigger the search with the new language
      useHotelSearchStore
        .getState()
        .search()
        .then(() => {
          const { hotels, currency, error } = useHotelSearchStore.getState();
          if (error) {
            console.error("Hotels API error after locale change:", error);
          } else {
            const hotelCount = Array.isArray(hotels) ? hotels.length : 0;
            console.log("Hotels reloaded with new language:", {
              count: hotelCount,
              currency,
            });
          }
        })
        .catch((err) => {
          console.error("Locale search promise error:", err);
        });
    }
  }, [locale]); // Removed loading to prevent infinite loop when search state changes.

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
    // console.log("genImages", genImages);
    // console.log("otherImages", otherImages);
    // Return prioritized list (GEN first, then others)
    return [...genImages, ...otherImages];
  };

  const getMainAndThumbImages = (hotel: HotelItem | FavoriteHotel) => {
    const sorted = getOrderedHotelImages(hotel);
    // console.log("sorted", sorted);
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
      setLocationSearchQuery(""); // Clear only when location is null
    }
    setLocationError("");
  };

  const handleDateSelect = (startDate: Date | null, endDate: Date | null) => {
    setCheckInDate(startDate);
    setCheckOutDate(endDate);
    if (startDate) {
      setCheckInError("");
    }
    if (endDate) {
      setCheckOutError("");
    }
    if (startDate && endDate) {
      setTimeout(() => setIsDatePickerOpen(false), 200);
    }
  };

  const handleRoomsChange = (rooms: Room[]) => {
    setRooms(rooms);
    // Don't auto-close guests picker, let user manually close or click outside
  };

  const handleClearLocation = () => {
    setLocation(null);
    setLocationSearchQuery("");
    setIsLocationPickerOpen(false);
    setLocationError("");
  };

  const handleLocationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  const formatDate = (date: Date | null) => {
    if (!date) return "Add Date";
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
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

    const guestsText = `${totalGuests} ${totalGuests > 1 ? t("guests") : t("guest")
      }`;
    const roomsText = `${rooms.length} ${rooms.length > 1 ? t("rooms") : t("room")
      }`;

    return `${guestsText} • ${roomsText}`;
  };

  // const handleReadMoreClick = (e: React.MouseEvent<HTMLAnchorElement>, hotelId: string) => {
  //   e.preventDefault();
  //   setExpandedDescriptions(prev => {
  //     const newSet = new Set(prev);
  //     if (newSet.has(hotelId)) {
  //       newSet.delete(hotelId);
  //     } else {
  //       newSet.add(hotelId);
  //     }
  //     return newSet;
  //   });
  // };

  const handleViewDetailsClick = (
    hotelCode: string | number | undefined,
    hotelName: string | undefined
  ) => {
    if (!hotelCode) return;

    const hotelId = hotelCode.toString();
    setLoadingHotelId(hotelId);
    const hotelSlug = buildHotelSlug(hotelName, hotelId);
    try {
      // Open hotel details page in a new tab
      const url = `/${locale}/hotel-details/${hotelSlug}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      // Reset loading state after a short delay to show the loading effect
      setTimeout(() => {
        setLoadingHotelId(null);
      }, 500);
    }
  };

  // Handler for star rating checkbox changes
  const handleStarRatingChange = (star: number) => {
    setSelectedStarRatings((prev) => {
      const exists = prev.includes(star);
      return exists ? prev.filter((s) => s !== star) : [...prev, star];
    });
  };

  // Handler for price range changes
  const handlePriceRangeChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  // Toggle accommodation selection (store sync happens in effect below)
  const handleAccommodationToggle = (code: string) => {
    setSelectedAccommodationCodes((prev) => {
      const exists = prev.includes(code);
      return exists ? prev.filter((c) => c !== code) : [...prev, code];
    });
  };

  // Keep selected accommodation codes in local state only (client-side filtering)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [selectedAccommodationCodes]);

  const handleZoneToggle = (code: number | string) => {
    setSelectedZoneCodes((prev) => {
      const exists = prev.some(c => String(c) === String(code));
      return exists
        ? prev.filter((c) => String(c) !== String(code))
        : [...prev, code];
    });
  };

  const handleRoomFacilityToggle = (code: number) => {
    setSelectedRoomFacilityCodes((prev) => {
      const exists = prev.includes(code);
      return exists ? prev.filter((c) => c !== code) : [...prev, code];
    });
  };

  const handleHotelFacilityToggle = (code: number) => {
    setSelectedHotelFacilityCodes((prev) => {
      const exists = prev.includes(code);
      return exists ? prev.filter((c) => c !== code) : [...prev, code];
    });
  };


  // Price slider handlers
  const handleMinPriceSliderChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value);
    const clamped = Math.min(value, maxPrice - 100);
    setMinPrice(clamped);
  };

  const handleMaxPriceSliderChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value);
    const clamped = Math.max(value, minPrice + 100);
    setMaxPrice(clamped);
  };

  const handlePriceSliderMouseUp = () => {
    // No API call here – filters are applied client-side only
    if (minPrice > 0 || maxPrice < 20000) {
      handlePriceRangeChange(minPrice, maxPrice);
    }
  };

  // Reusable renderer for all filter sections (used in sidebar and mobile modal)
  const renderFilters = (isMobile = false) => (
    <>
      {/* <div className={`filter-mapview-btn ${isMobile ? "d-none" : ""}`}>
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
          {tSearch("mapView")}
        </button>
      </div> */}
      <div className={`filter-header ${isMobile ? "d-none" : ""}`}>
        <h3>{tSearch("filterBy")}</h3>
        <button className="clear-filters" onClick={handleClearFilters}>
          {tSearch("clear")}
        </button>
      </div>

      <div className="filter-section">
        <div className="filter-title" style={{ cursor: "default" }}>
          {tSearch("hotelName")}
        </div>
        <div style={{ marginTop: "15px" }}>
          <input
            type="text"
            placeholder={tSearch("searchHotel")}
            value={hotelNameFilter}
            onChange={(e) => setHotelNameFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            <span className="checkmark"></span>
            <span style={{ fontWeight: "500", color: "#09090b" }}>{tSearch("featured")}</span>
          </label>
        </div>
      </div>

      <div className="filter-section">
        <div
          className="filter-title"
          onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}
        >
          {tSearch("priceRange")}
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
              {/* For RTL: max price on left, min price on right */}
              {locale === "ar" ? (
                <>
                  <div>
                    <span
                      className="currency-icon"
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{
                        __html: buildCurrencySvgMarkup("#27272a"),
                      }}
                      style={{ display: "inline-flex" }}
                    />{" "}
                    <span>{maxPrice}</span>
                  </div>
                  <div>
                    <span
                      className="currency-icon"
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{
                        __html: buildCurrencySvgMarkup("#27272a"),
                      }}
                      style={{ display: "inline-flex" }}
                    />{" "}
                    <span>{minPrice}</span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span
                      className="currency-icon"
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{
                        __html: buildCurrencySvgMarkup("#27272a"),
                      }}
                      style={{ display: "inline-flex" }}
                    />{" "}
                    <span>{minPrice}</span>
                  </div>
                  <div>
                    <span
                      className="currency-icon"
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{
                        __html: buildCurrencySvgMarkup("#27272a"),
                      }}
                      style={{ display: "inline-flex" }}
                    />{" "}
                    <span>{maxPrice}</span>
                  </div>
                </>
              )}
            </div>
            <div
              className={`price-slider-container ${locale === "ar" ? "rtl-slider" : ""
                }`}
              style={{
                position: "relative",
                height: "40px",
                marginTop: "10px",
                width: "100%",
              }}
            >
              <div
                className="slider-track"
                style={{
                  position: "absolute",
                  height: "6px",
                  background: "#F3F4F6",
                  width: "100%",
                  top: "50%",
                  transform: "translateY(-50%)",
                  borderRadius: "10px",
                  left: 0,
                  pointerEvents: "none",
                }}
              >
                <div
                  className="slider-range"
                  style={{
                    position: "absolute",
                    height: "100%",
                    background: "#3E5B96",
                    ...(locale === "ar"
                      ? {
                        // RTL: calculate from right side
                        right: `${(minPrice / 20000) * 100}%`,
                        left: "auto",
                        width: `${((maxPrice - minPrice) / 20000) * 100}%`,
                      }
                      : {
                        // LTR: calculate from left side
                        left: `${(minPrice / 20000) * 100}%`,
                        width: `${((maxPrice - minPrice) / 20000) * 100}%`,
                      }),
                    borderRadius: "10px",
                  }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="20000"
                step="50"
                value={minPrice}
                onChange={handleMinPriceSliderChange}
                onMouseDown={() => setActivePriceSlider("min")}
                onMouseUp={() => {
                  setActivePriceSlider(null);
                  handlePriceSliderMouseUp();
                }}
                onTouchStart={() => setActivePriceSlider("min")}
                onTouchEnd={() => {
                  setActivePriceSlider(null);
                  handlePriceSliderMouseUp();
                }}
                style={{
                  position: "absolute",
                  width: "100%",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "all",
                  zIndex: activePriceSlider === "min" ? 5 : 1,
                  direction: locale === "ar" ? "rtl" : "ltr",
                }}
                className="price-range-input price-range-input-min"
              />
              <input
                type="range"
                min="0"
                max="20000"
                step="50"
                value={maxPrice}
                onChange={handleMaxPriceSliderChange}
                onMouseDown={() => setActivePriceSlider("max")}
                onMouseUp={() => {
                  setActivePriceSlider(null);
                  handlePriceSliderMouseUp();
                }}
                onTouchStart={() => setActivePriceSlider("max")}
                onTouchEnd={() => {
                  setActivePriceSlider(null);
                  handlePriceSliderMouseUp();
                }}
                style={{
                  position: "absolute",
                  width: "100%",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "all",
                  zIndex: activePriceSlider === "max" ? 5 : 1,
                  direction: locale === "ar" ? "rtl" : "ltr",
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
          {tSearch("starRating")}
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
                  type="checkbox"
                  name="star-rating-filter"
                  checked={selectedStarRatings.includes(stars)}
                  onChange={() => handleStarRatingChange(stars)}
                />
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

      {/* <div className="filter-section">
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
      </div> */}
      {/* 
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
      </div> */}

      <div className="filter-section">
        <div
          className="filter-title"
          onClick={() => setIsPropertyTypeOpen(!isPropertyTypeOpen)}
        >
          {tSearch("propertyType")}
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
            {(showAllAccommodationTypes
              ? accommodationTypes
              : accommodationTypes.slice(0, 5)
            ).map((item) => (
              <label key={item.code} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedAccommodationCodes.includes(item.code)}
                  onChange={() => handleAccommodationToggle(item.code)}
                />
                <span className="checkmark"></span>
                {(() => {
                  if (item.code === "H") return tSearch("hotel");
                  if (item.code === "W") return tSearch("resort");
                  if (item.code === "A") return tSearch("apartment");
                  if (item.code === "V") return tSearch("villa");
                  if (item.code === "S") return tSearch("hostel");
                  return translatedPropertyTypes.get(item.code) ||
                    item.typeMultiDescription?.content ||
                    item.typeDescription;
                })()}
              </label>
            ))}
            {accommodationTypes.length > 5 && (
              <div style={{ marginTop: "8px" }}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAllAccommodationTypes(!showAllAccommodationTypes);
                  }}
                  style={{ color: "#3E5B96", textDecoration: "none" }}
                >
                  {showAllAccommodationTypes
                    ? tSearch("showLess") || "View less"
                    : tSearch("showMore") || "View more"}
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {zones.length > 0 && (
        <div className="filter-section">
          <div
            className="filter-title"
            onClick={() => setIsZoneOpen(!isZoneOpen)}
          >
            {tSearch("zone") || "Zone"}
            <Image
              src={downBlackArrowIcon}
              width="20"
              height="20"
              alt="down arrow"
              className={`dropdown-arrow ${isZoneOpen ? "open" : ""}`}
            />
          </div>
          {isZoneOpen && (
            <div className="filter-options">
              {(showAllZones ? zones : zones.slice(0, 5)).map((zone) => (
                <label key={zone.code} className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedZoneCodes.some(c => String(c) === String(zone.code))}
                    onChange={() => handleZoneToggle(zone.code)}
                  />
                  <span className="checkmark"></span>
                  {translatedZones.get(zone.code.toString()) || zone.name}
                </label>
              ))}
              {zones.length > 5 && (
                <div style={{ marginTop: "8px" }}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAllZones(!showAllZones);
                    }}
                    style={{ color: "#3E5B96", textDecoration: "none" }}
                  >
                    {showAllZones
                      ? tSearch("showLess") || "View less"
                      : tSearch("showMore") || "View more"}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="filter-section">
        <div
          className="filter-title"
          onClick={() => setIsHotelFacilitiesOpen(!isHotelFacilitiesOpen)}
        >
          {tSearch("hotelFacilities") || "Hotel Facilities"}
          <Image
            src={downBlackArrowIcon}
            width="20"
            height="20"
            alt="down arrow"
            className={`dropdown-arrow ${isHotelFacilitiesOpen ? "open" : ""}`}
          />
        </div>
        {isHotelFacilitiesOpen && (
          <div className="filter-options">
            {hotelFacilitiesList.map((facility) => (
              <label key={`hotel-${facility.code}`} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedHotelFacilityCodes.includes(facility.code)}
                  onChange={() => handleHotelFacilityToggle(facility.code)}
                />
                <span className="checkmark"></span>
                {translatedFacilities.get(`hotel-${facility.code}`) || facility.name}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filter-section">
        <div
          className="filter-title"
          onClick={() => setIsRoomFacilitiesOpen(!isRoomFacilitiesOpen)}
        >
          {tSearch("roomFacilities") || "Room Facilities"}
          <Image
            src={downBlackArrowIcon}
            width="20"
            height="20"
            alt="down arrow"
            className={`dropdown-arrow ${isRoomFacilitiesOpen ? "open" : ""}`}
          />
        </div>
        {isRoomFacilitiesOpen && (
          <div className="filter-options">
            {roomFacilitiesList.map((facility) => (
              <label key={`room-${facility.code}`} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedRoomFacilityCodes.includes(facility.code)}
                  onChange={() => handleRoomFacilityToggle(facility.code)}
                />
                <span className="checkmark"></span>
                {translatedFacilities.get(`room-${facility.code}`) || facility.name}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filter-section">
        <div
          className="filter-title"
          onClick={() => setIsBoardsOpen(!isBoardsOpen)}
        >
          {tSearch("boardType") || "Board Type"}
          <Image
            src={downBlackArrowIcon}
            width="20"
            height="20"
            alt="down arrow"
            className={`dropdown-arrow ${isBoardsOpen ? "open" : ""}`}
          />
        </div>
        {isBoardsOpen && (
          <div className="filter-options">
            {boards.map((board) => (
              <label key={board.code} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedBoards.includes(board.code)}
                  onChange={() => handleBoardToggle(board.code)}
                />
                <span className="checkmark"></span>
                {(() => {
                  const bName = board.name.toUpperCase();
                  if (bName.includes("ROOM ONLY")) return tSearch("roomOnly");
                  if (bName.includes("BED AND BREAKFAST")) return tSearch("bedAndBreakfast");
                  if (bName.includes("HALF BOARD")) return tSearch("halfBoard");
                  if (bName.includes("FULL BOARD")) return tSearch("fullBoard");
                  return translatedBoards.get(board.code) || board.name;
                })()}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filter-section">
        <div
          className="filter-title"
          onClick={() => setIsCancellationPolicyOpen(!isCancellationPolicyOpen)}
        >
          {tSearch("cancellationPolicy") || "Cancellation Policy"}
          <Image
            src={downBlackArrowIcon}
            width="20"
            height="20"
            alt="down arrow"
            className={`dropdown-arrow ${isCancellationPolicyOpen ? "open" : ""}`}
          />
        </div>
        {isCancellationPolicyOpen && (
          <div className="filter-options">
            <label className="filter-option">
              <input
                type="checkbox"
                checked={isRefundable}
                onChange={() => setIsRefundable(!isRefundable)}
              />
              <span className="checkmark"></span>
              {tSearch("refundable") || "Refundable"}
            </label>
            <label className="filter-option">
              <input
                type="checkbox"
                checked={isNonRefundable}
                onChange={() => setIsNonRefundable(!isNonRefundable)}
              />
              <span className="checkmark"></span>
              {tSearch("nonRefundable") || "Non-refundable"}
            </label>
          </div>
        )}
      </div>

      {/* <div className="filter-section">
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
      </div> */}
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
                  <label>{t("location")}</label>
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
                        placeholder={
                          filters.location
                            ? filters.location.name
                            : t("findLocation")
                        }
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
                      {/* {!filters.location && (
                        <Image
                          src={downBlackArrowIcon}
                          width="24"
                          height="24"
                          alt="down icon"
                          className="arrow-and-plus-icon"
                          onClick={toggleLocationPicker}
                          style={{ cursor: "pointer" }}
                        />
                      )} */}
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
                  <label>{t("checkInDate")}</label>
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
                  {checkInError && (
                    <div className="location-error-message">{checkInError}</div>
                  )}
                  <DatePicker
                    isOpen={isDatePickerOpen}
                    onDateSelect={handleDateSelect}
                    selectedStartDate={filters.checkInDate}
                    selectedEndDate={filters.checkOutDate}
                  />
                </div>

                <div className="search-field">
                  <label>{t("checkOutDate")}</label>
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
                  {checkOutError && (
                    <div className="location-error-message">
                      {checkOutError}
                    </div>
                  )}
                </div>

                <div className="search-field" ref={guestsPickerRef}>
                  <label>{t("guestsAndRooms")}</label>
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
                        {getGuestsDisplayText()}
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
                    onRoomsChange={handleRoomsChange}
                    rooms={filters.rooms || [{ adults: 2, children: 1 }]}
                  />
                </div>

                <button
                  className={`search-button ${loading ? "loading" : ""}`}
                  onClick={handleSearchClick}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="button-spinner"></div>
                  ) : (
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
                  )}
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
                        <>
                          <div className="skeleton-line info-skeleton"></div>
                          <div className="skeleton-line info-skeleton"></div>
                        </>
                      ) : (
                        <>
                          {tSearch("showingHotels", {
                            count: visibleHotels.length,
                            total: apiTotal ?? apiHotels.length,
                            location: filters.location
                              ? filters.location.name
                              : "Selected Location",
                          })}
                          {hotelFilters.checkIn && hotelFilters.checkOut && (
                            <span>
                              {" "}
                              ({formatDate(hotelFilters.checkIn)} -{" "}
                              {formatDate(hotelFilters.checkOut)})
                            </span>
                          )}
                          {getGuestsDisplayText() && (
                            <span>, {getGuestsDisplayText()}</span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="search-header-right">
                    {loading ? (
                      <>
                        <div className="mobile-filter-skeleton d-lg-none">
                          <div className="skeleton-line filter-skeleton-box"></div>
                        </div>
                        <div className="sort-by-skeleton">
                          <div className="skeleton-line sort-skeleton-box"></div>
                        </div>
                      </>
                    ) : (
                      <>
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
                              {tSearch("filter")}
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
                            label={tSearch("sortBy")}
                            className="sort-dropdown"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <>
                  <div className="hotel-results">
                    {loading ? (
                      // Show loading skeletons
                      [...Array(6)].map((_, index) => (
                        <HotelCardSkeleton key={`skeleton-${index}`} />
                      ))
                    ) : sortedHotels.length > 0 ? (
                      // Show actual hotel results
                      visibleHotels.map(
                        (hotel: HotelItem | FavoriteHotel, index: number) => {
                          return (
                            <div key={getHotelId(hotel)} className="hotel-card">
                              <div className="hotel-images">
                                {(() => {
                                  const hotelId = String(getHotelId(hotel));
                                  const hotelImages = getOrderedHotelImages(hotel);
                                  const currentRetryIndex = imageRetryIndexMap[hotelId] || 0;
                                  const hasFailedAll = imageErrorMap[hotelId];
                                  const currentImage = hotelImages[currentRetryIndex];

                                  return (
                                    <>
                                      <div className="main-image">
                                        <Image
                                          src={
                                            hasFailedAll || !currentImage
                                              ? (NoImageFallback as unknown as string)
                                              : buildHotelbedsImageUrl(currentImage.path)
                                          }
                                          onError={() => {
                                            if (hotelImages.length > currentRetryIndex + 1) {
                                              // Try the next image in the sequence
                                              setImageRetryIndexMap((prev) => ({
                                                ...prev,
                                                [hotelId]: currentRetryIndex + 1,
                                              }));
                                            } else {
                                              // We've exhausted all images, show fallback
                                              setImageErrorMap((prev) => ({
                                                ...prev,
                                                [hotelId]: true,
                                              }));
                                            }
                                          }}
                                          alt={getHotelName(hotel) || "Hotel"}
                                          width={276}
                                          height={146}
                                          className="property-main-img"
                                        />
                                        <div className="image-overlay" onClick={() => handleGalleryOpen(hotel)}>
                                          <div className="more-photos-wrapper">
                                            <Camera size={24} />
                                            <span>{tSearch("morePhotos")}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                              <div className="hotel-info-with-action-card d-flex">
                                <div className="hotel-info">
                                  {hotel.show_tag && (
                                    <div className="featured-tag d-flex d-lg-none">
                                      <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <circle
                                          cx="7"
                                          cy="7"
                                          r="2"
                                          fill="currentColor"
                                        />
                                      </svg>
                                      {tSearch("featured")}
                                    </div>
                                  )}
                                  <p className="hotel-name">
                                    {getHotelName(hotel)}
                                  </p>
                                  <div className="hotel-rating">
                                    <div className="rating-stars d-flex align-items-center">
                                      {Array.from(
                                        { length: getStarRating(hotel) },
                                        (_, index) => (
                                          <Image
                                            key={`${getHotelId(
                                              hotel
                                            )}-star-${index}`}
                                            src={ReviewStarFill}
                                            alt="star icon"
                                            width="16"
                                            height="16"
                                          />
                                        )
                                      )}
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

                                  {/* <div className="hotel-amenities">
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
                                </div> */}

                                  {/* <p className="hotel-description">
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
                                </p> */}
                                </div>
                                <div className="property-card-action">
                                  {hotel.show_tag && (
                                    <div className="featured-tag d-none d-lg-flex">
                                      <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <circle
                                          cx="7"
                                          cy="7"
                                          r="2"
                                          fill="currentColor"
                                        />
                                      </svg>
                                      {tSearch("featured")}
                                    </div>
                                  )}
                                  <div className="hotel-footer">
                                    <div className="hotel-price">
                                      <span className="price-amount">
                                        <span
                                          className="currency-icon"
                                          aria-hidden="true"
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              buildCurrencySvgMarkup("#09090b"),
                                          }}
                                          style={{ display: "inline-flex" }}
                                        />{" "}
                                        {("maxRate" in hotel &&
                                          (hotel as HotelItem).minRate) ||
                                          179}
                                      </span>
                                      <span className="price-label">{tSearch("totalWithTaxes")}</span>
                                      {/* <span className="price-period">{tSearch('perNight')}</span> */}
                                    </div>
                                    <button
                                      className="view-details-button button-primary w-100"
                                      onClick={() =>
                                        handleViewDetailsClick(
                                          getHotelCode(hotel),
                                          getHotelName(hotel)
                                        )
                                      }
                                      disabled={
                                        loadingHotelId ===
                                        getHotelCode(hotel)?.toString()
                                      }
                                    >
                                      {loadingHotelId ===
                                        getHotelCode(hotel)?.toString() ? (
                                        <>
                                          <div className="view-details-spinner"></div>
                                          {tSearch("loading")}
                                        </>
                                      ) : (
                                        tSearch("viewDetails")
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )
                    ) : (
                      <div className="no-hotels-found">
                        <h2>{tSearch("noHotelsFound")}</h2>
                        <p>{tSearch("noHotelsFoundDesc")}</p>
                      </div>
                    )}
                  </div>

                  {sortedHotels.length > ITEMS_PER_PAGE && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onChange={setCurrentPage}
                    />
                  )}
                </>
              </div>
            </div>
          </div>
        </div>

        {/* Inactivity Modal */}
        <SessionTimeoutModal isOpen={isInactive} />

        {/* Mobile Filter Modal */}
        {isMobileFilterOpen && (
          <div className="mobile-filter-modal" role="dialog" aria-modal="true">
            <div
              className="mobile-filter-backdrop"
              onClick={() => setIsMobileFilterOpen(false)}
            ></div>
            <div className="mobile-filter-panel">
              <div className="mobile-filter-header">
                <h3>{tSearch("filter")}</h3>
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
                <button
                  className="reset-btn button-primary"
                  onClick={handleClearFilters}
                >
                  {tSearch("reset")}
                </button>
                <button
                  className="apply-btn button-primary"
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  {tSearch("showHotels")}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Gallery Modal */}
        {selectedHotelForGallery && (
          <SearchResultGalleryModal
            isOpen={isGalleryOpen}
            onClose={() => setIsGalleryOpen(false)}
            hotelName={getHotelName(selectedHotelForGallery)}
            hotelImages={galleryImages.length > 0 ? galleryImages : selectedHotelForGallery.images}
            isLoading={isGalleryLoading}
          />
        )}
      </div>
    </main>
  );
};

export default SearchResult;
