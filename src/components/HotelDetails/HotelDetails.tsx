"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useContext,
} from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import "./HotelDetails.scss";
import { useHotelDetailsStore } from "@/store/hotelDetailsStore";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { buildHotelbedsImageUrl } from "@/constants";
import starFillIcon from "@/assets/images/star-fill-icon.svg";
import mapImage from "@/assets/images/map-image.jpg";
// import BreadcrumbArrow from "@/assets/images/breadcrumb-arrow-icon.svg";
// import LocationMapIcon from "@/assets/images/location-distance-icon.svg";
import LocationAddressIcon from "@/assets/images/map-icon.svg";
import FilterComponents from "../FilterComponents/FilterComponents";
import HotelImgPrevIcon from "@/assets/images/slider-prev-arrow-icon.svg";
import HotelImgNextIcon from "@/assets/images/slider-next-arrow-icon.svg";
import HotelDetailsCardImage from "@/assets/images/no-image.jpg";
// import ReviewSlider from "../common/ReviewSlider/ReviewSlider";
import NearByHotels from "../common/NearbyHotels/NearbyHotels";
import FaqSection from "../common/FaqSection/FaqSection";
import RoomInfoImage from "@/assets/images/room-information-image.jpg";
import ClosePopupIcon from "@/assets/images/close-btn-icon.svg";
import ImageModal from "../common/ImageModal/ImageModal";
import LoginModal from "../common/LoginModal/LoginModal";
import { AuthContext } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import AmenityIcon from "../common/AmenityIcon/AmenityIcon";
import { HotelImage } from "@/types/favorite";
import {
  HotelRate,
  HotelRateCancellationPolicy,
  HotelRoom,
  HotelAvailabilityRoom,
  HotelRateOffer,
  HotelRateTaxes,
} from "@/types/hotel";
import HotelLocationMap from "../common/HotelLocationMap/HotelLocationMap";
import { useHotelSearchStore } from "@/store/hotelSearchStore";
import { useSearchFiltersStore } from "@/store/searchFiltersStore";
import { toast } from "react-toastify";
import { useFavoriteStore } from "@/store/favoriteStore";
import { buildCurrencySvgMarkup } from "@/constants";
import { useBookingStore, SelectedRoom } from "@/store/bookingStore";
import { useInactivity } from "@/hooks/useInactivity";
import SessionTimeoutModal from "../common/SessionTimeoutModal/SessionTimeoutModal";

interface HotelDetailsProps {
  hotelId: string;
}

interface ProcessedRoomImage {
  path: string;
  fullUrl: string;
  type: string;
  typeDescription: string;
  order: number;
  visualOrder: number;
  characteristicCode: string;
  roomType: string;
}

interface ProcessedRoomFacility {
  code: number;
  groupCode: number;
  description: string;
  hasLogic: boolean;
  hasFee: boolean;
  number: number | null;
  isYesOrNo: boolean;
  voucher: boolean;
}

interface ProcessedRoomStayFacility {
  code: number;
  groupCode: number;
  description: string;
  number: number | null;
}

interface ProcessedRoomStay {
  type: string;
  order: string;
  description: string;
  facilities: ProcessedRoomStayFacility[];
}

interface ProcessedRoom {
  roomCode: string;
  name: string;
  description: string;
  type: string;
  typeDescription: string;
  characteristic: string;
  characteristicDescription: string;
  isParentRoom: boolean;
  PMSRoomCode: string;
  capacity: {
    minPax: number;
    maxPax: number;
    minAdults: number;
    maxAdults: number;
    maxChildren: number;
  };
  images: ProcessedRoomImage[];
  imageCount: number;
  mainImage: string | null;
  facilities: ProcessedRoomFacility[];
  facilityCount: number;
  roomStays: ProcessedRoomStay[];
  rates: ProcessedRate[];
  rateCount: number;
}

interface ProcessedRate {
  rateKey: string;
  rateClass: string;
  rateType: string;
  net: number;
  sellingRate: number;
  hotelSellingRate: number;
  boardCode: string;
  boardName: string;
  cancellationPolicies: HotelRateCancellationPolicy[];
  adults: number;
  children: number;
  rooms: number;
  allotment: number;
  commissionAmount: string;
  commission_percentage: string;
  convertedRate: string;
  currency: string;
  originalNet: string;
  offers: HotelRateOffer[];
  packaging: boolean;
  paymentType: string;
  rateCommentsId: string;
  taxes: HotelRateTaxes;
  taxesRate: string;
}

const HotelDetails = ({ hotelId }: HotelDetailsProps) => {
  const t = useTranslations("HotelDetails");
  const locale = useLocale();
  const { isInactive } = useInactivity(20 * 60 * 1000);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<ProcessedRoom | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "favorite" | "booking" | null
  >(null);
  const [isPriceDetailsModalOpen, setIsPriceDetailsModalOpen] = useState(false);
  const [selectedRateForPriceDetails, setSelectedRateForPriceDetails] =
    useState<{
      rate: ProcessedRate;
      roomName: string;
      count?: number;
    } | null>(null);
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showAllAmenities] = useState(false);
  const [processedRooms, setProcessedRooms] = useState<ProcessedRoom[]>([]);
  const [selectedRoomCounts, setSelectedRoomCounts] = useState<{
    [key: string]: number;
  }>({});
  const [selectedRoomRates, setSelectedRoomRates] = useState<{
    [key: string]: string;
  }>({});
  const [openRoomTypeAccordion, setOpenRoomTypeAccordion] = useState<
    string | null
  >(null);
  // Active room count - only updated when Check Availability is clicked
  const [activeRoomCount, setActiveRoomCount] = useState<number>(1);
  const [translatedRoomNames, setTranslatedRoomNames] = useState<
    Map<string, string>
  >(new Map());
  const [translatedHotelName, setTranslatedHotelName] = useState<string | null>(
    null
  );
  const { hotel: hotelData, loading, fetchHotel } = useHotelDetailsStore();
  const { favorites, addFavorite, removeFavorite, fetchFavorites } =
    useFavoriteStore();
  const { setBookingData, clearTravelerDetails } = useBookingStore();

  console.log("hotelData", hotelData);
  console.log("processedRooms", processedRooms);
  const router = useRouter();
  const pathname = usePathname();
  const [currentMainImageIndex, setCurrentMainImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  const sliderRefs = useRef<(Slider | null)[]>([]);
  const mainImageSliderRef = useRef<Slider>(null);
  const modalSliderRef = useRef<Slider>(null);
  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;
  const hasRequestedNearbySearch = useRef(false);
  const hasInitializedRoomCount = useRef(false);

  // Helper functions for hotel images
  const getOrderedHotelImages = useCallback(() => {
    if (!hotelData?.images) return [];
    const images = hotelData.images.filter((img) => !!img?.path);
    // Prioritize GEN images first; within each group, sort by 'order' then 'visualOrder'
    const getOrderValue = (img: HotelImage) => {
      if (typeof img.order === "number") return img.order;
      if (typeof img.visualOrder === "number") return img.visualOrder;
      return Number.MAX_SAFE_INTEGER;
    };
    const genImages = images
      .filter((img) => img.type?.code === "GEN")
      .sort((a, b) => getOrderValue(a) - getOrderValue(b));
    const otherImages = images
      .filter((img) => img.type?.code !== "GEN")
      .sort((a, b) => getOrderValue(a) - getOrderValue(b));
    // Return prioritized list (GEN first, then others)
    return [...genImages, ...otherImages];
  }, [hotelData?.images]);

  const sortedImages = useMemo(
    () => getOrderedHotelImages(),
    [getOrderedHotelImages]
  );

  const handleMainImagePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    mainImageSliderRef.current?.slickPrev();
  };

  const handleMainImageNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    mainImageSliderRef.current?.slickNext();
  };

  const authContext = useContext(AuthContext);

  const isFavorited = useMemo(
    () => favorites.some((fav) => String(fav.code) === String(hotelId)),
    [favorites, hotelId]
  );

  useEffect(() => {
    if (authContext?.isAuthenticated) {
      fetchFavorites();
    }
  }, [authContext?.isAuthenticated, fetchFavorites]);

  const nearbyHotelsCount = useHotelSearchStore((state) => state.hotels.length);
  const nearbyHotelsLoading = useHotelSearchStore((state) => state.loading);

  const searchFilters = useSearchFiltersStore((state) => state.filters);

  // Get the room count from filters
  const roomCountFromFilters = searchFilters.rooms?.length || 1;

  // Initialize active room count from search filters only once on mount/hydration
  // This ensures it updates when store hydrates from localStorage (e.g., in new tabs)
  // After initialization, it only updates when "Check Availability" is clicked
  useEffect(() => {
    // Initialize if we haven't initialized yet OR if we're still at default (1) but filters have a different value
    // This handles cases where initialization might have been missed due to timing
    if (roomCountFromFilters > 0) {
      setActiveRoomCount((prev) => {
        // If we haven't initialized yet, always initialize
        if (!hasInitializedRoomCount.current) {
          hasInitializedRoomCount.current = true;
          return roomCountFromFilters;
        }
        // If we're still at default (1) but filters have a different value, update
        // This handles the case where initialization was missed
        if (prev === 1 && roomCountFromFilters !== 1) {
          hasInitializedRoomCount.current = true;
          return roomCountFromFilters;
        }
        // Otherwise, keep the current value (don't update when filters change after initialization)
        return prev;
      });
    }
  }, [roomCountFromFilters]); // Watch for hydration, but only initialize once

  // Use activeRoomCount instead of directly reading from searchFilters
  const totalRoomCount = activeRoomCount;

  // Calculate total selected rooms across all cards
  const totalSelectedRooms = useMemo(() => {
    return Object.values(selectedRoomCounts).reduce(
      (sum, count) => sum + count,
      0
    );
  }, [selectedRoomCounts]);

  // Get available options for a specific room rate (based on search filters and allotment)
  const getAvailableRoomOptionsForRate = useCallback(
    (roomCode: string, rateKey: string, allotment: number) => {
      const key = `${roomCode}_${rateKey}`;
      const currentSelection = selectedRoomCounts[key] || 0;
      const remainingSlots =
        totalRoomCount - totalSelectedRooms + currentSelection;
      // Consider both total room count limit and allotment limit
      // Allotment represents how many rooms of this specific rate are available
      // The maximum selectable is the minimum of:
      // 1. Remaining slots from total room count
      // 2. Allotment (total available for this rate)
      const maxFromTotal = Math.min(remainingSlots, totalRoomCount);
      const maxFromAllotment = allotment; // Total allotment for this rate
      return Math.min(maxFromTotal, maxFromAllotment);
    },
    [selectedRoomCounts, totalSelectedRooms, totalRoomCount]
  );

  // Check if a room rate dropdown should be disabled
  const isRoomRateDisabled = useCallback(
    (roomCode: string, rateKey: string, allotment: number) => {
      const key = `${roomCode}_${rateKey}`;
      const currentSelection = selectedRoomCounts[key] || 0;
      // If this rate already has a selection, don't disable it (user can still adjust)
      if (currentSelection > 0) {
        return false;
      }
      // Disable if:
      // 1. Total selected rooms equals or exceeds the search limit, OR
      // 2. Allotment is 0 or less (no rooms available for this rate)
      return totalSelectedRooms >= totalRoomCount || allotment <= 0;
    },
    [selectedRoomCounts, totalSelectedRooms, totalRoomCount]
  );

  // Handler for room count selection
  // const handleRoomCountChange = (roomCode: string, count: number) => {
  //   setSelectedRoomCounts((prev) => ({
  //     ...prev,
  //     [roomCode]: count,
  //   }));
  // };

  // Handler for room rate selection with count (auto-select on dropdown change)
  const handleRoomRateCountChange = (
    roomCode: string,
    rateKey: string,
    count: number
  ) => {
    const key = `${roomCode}_${rateKey}`;

    if (count === 0) {
      // Remove the selection if count is 0
      const newRates = { ...selectedRoomRates };
      const newCounts = { ...selectedRoomCounts };
      delete newRates[key];
      delete newCounts[key];
      setSelectedRoomRates(newRates);
      setSelectedRoomCounts(newCounts);
    } else {
      // Auto-select when count > 0
      setSelectedRoomRates((prev) => ({
        ...prev,
        [key]: rateKey,
      }));
      setSelectedRoomCounts((prev) => ({
        ...prev,
        [key]: count,
      }));
    }
  };

  // Calculate booking summary
  const bookingSummary = useMemo(() => {
    let totalPrice = 0;
    let currency = "SAR";

    if (!searchFilters.checkInDate || !searchFilters.checkOutDate) {
      return {
        totalRooms: totalSelectedRooms,
        totalPrice: 0,
        subtotal: 0,
        currency: "SAR",
      };
    }

    // const checkIn = new Date(searchFilters.checkInDate);
    // const checkOut = new Date(searchFilters.checkOutDate);
    // const nights = Math.ceil(
    //   (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    // );

    // Track processed keys to avoid duplicate rates
    // Use roomCode_rateKey combination to match selectedRoomCounts key format
    const processedKeys = new Set<string>();

    processedRooms.forEach((room) => {
      room.rates.forEach((rate) => {
        const key = `${room.roomCode}_${rate.rateKey}`;

        // Only process if this key hasn't been processed yet (avoid duplicates)
        if (!processedKeys.has(key)) {
          processedKeys.add(key);
          const roomCount = selectedRoomCounts[key] || 0;

          if (roomCount > 0) {
            const rateNet = Number(rate.net) || 0;
            // Calculate total price based on rate * nights * roomCount
            //totalPrice += rateNet * nights * roomCount;
            totalPrice += rateNet * roomCount;
            currency = rate.currency || "SAR";
          }
        }
      });
    });

    const subtotal = totalPrice;

    // Use totalSelectedRooms instead of recalculating to ensure consistency
    return {
      totalRooms: totalSelectedRooms,
      totalPrice,
      subtotal,
      currency,
    };
  }, [
    processedRooms,
    selectedRoomCounts,
    totalSelectedRooms,
    searchFilters.checkInDate,
    searchFilters.checkOutDate,
  ]);

  // Helper function to map locale to API language code
  const getLanguageCode = (currentLocale: string): string => {
    return currentLocale === "ar" ? "ARA" : "ENG";
  };

  const getSearchLanguageCode = (currentLocale: string): string => {
    return currentLocale === "ar" ? "ara" : "eng";
  };

  const handleCheckAvailability = () => {
    if (hotelId) {
      // Update active room count from current search filters
      const currentRoomCount = searchFilters.rooms?.length || 1;
      setActiveRoomCount(currentRoomCount);

      // Reset selected room counts when availability is checked with new filters
      setSelectedRoomCounts({});
      setSelectedRoomRates({});

      const languageCode = getLanguageCode(locale);
      fetchHotel({ hotelId, language: languageCode });
    }
  };

  const handleShareClick = useCallback(async () => {
    if (typeof window === "undefined") {
      return;
    }

    const shareUrl = window.location.href;

    if (!shareUrl) {
      return;
    }

    try {
      if (window.navigator?.clipboard?.writeText) {
        await window.navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        textarea.style.position = "fixed";
        textarea.style.top = "0";
        textarea.style.left = "0";
        textarea.style.width = "1px";
        textarea.style.height = "1px";
        textarea.style.padding = "0";
        textarea.style.border = "none";
        textarea.style.outline = "none";
        textarea.style.boxShadow = "none";
        textarea.style.background = "transparent";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      toast.success(t("shareLinkCopied"));
    } catch (error) {
      console.error("Failed to copy share link", error);
      toast.error(t("shareLinkCopyFailed"));
    }
  }, [t]);

  // Fetch hotel details on mount and when locale changes
  useEffect(() => {
    if (hotelId) {
      const languageCode = getLanguageCode(locale);
      fetchHotel({ hotelId, language: languageCode });
    }
  }, [hotelId, locale, fetchHotel]);

  // Handle active tab on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["overview", "amenities", "rooms", "map"];
      const scrollPosition = window.scrollY + 220; // Offset for header trigger

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveTab(section);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ensure nearby hotels data is available for the details page
  useEffect(() => {
    if (hasRequestedNearbySearch.current) {
      return;
    }

    if (nearbyHotelsLoading) {
      return;
    }

    const searchStore = useHotelSearchStore.getState();
    const hasExistingResults = nearbyHotelsCount > 0;
    if (hasExistingResults) {
      return;
    }

    const { checkIn, checkOut, latitude, longitude } = searchStore.filters;
    const hasStoredCriteria =
      !!checkIn && !!checkOut && latitude !== null && longitude !== null;

    const executeSearch = () => {
      hasRequestedNearbySearch.current = true;
      searchStore.search().catch((error) => {
        console.error("Failed to fetch nearby hotels:", error);
        hasRequestedNearbySearch.current = false;
      });
    };

    const searchLanguage = getSearchLanguageCode(locale);

    if (hasStoredCriteria) {
      searchStore.setLanguage(searchLanguage);
      executeSearch();
      return;
    }

    const coordinates = searchFilters.location?.coordinates;
    if (
      coordinates &&
      searchFilters.checkInDate &&
      searchFilters.checkOutDate
    ) {
      searchStore.setDates(
        searchFilters.checkInDate,
        searchFilters.checkOutDate
      );
      searchStore.setRooms(
        searchFilters.rooms && searchFilters.rooms.length > 0
          ? searchFilters.rooms
          : [{ adults: 2, children: 1 }]
      );
      searchStore.setLanguage(searchLanguage);
      searchStore.setCoordinates(coordinates.lat, coordinates.lng);
      executeSearch();
    }
  }, [nearbyHotelsCount, nearbyHotelsLoading, searchFilters, locale]);

  // Process and combine rooms with images and facilities
  useEffect(() => {
    if (hotelData && hotelData.rooms) {
      const roomsWithDetails = hotelData.rooms.map((room) => {
        // Filter images for this specific room by matching roomCode exactly
        const roomImages = (hotelData.images || [])
          .filter((img) => img.roomCode === room.roomCode && img.path)
          .map((img) => ({
            path: img.path,
            fullUrl: buildHotelbedsImageUrl(img.path),
            type: img.type?.code || "Unknown",
            typeDescription: img.type?.description?.content || "",
            order: img.order || img.visualOrder || 0,
            visualOrder: img.visualOrder || 0,
            characteristicCode: img.characteristicCode || "",
            roomType: img.roomType || "",
          }))
          .sort((a, b) => {
            // Sort by order first, then by visualOrder
            const orderDiff = a.order - b.order;
            return orderDiff !== 0 ? orderDiff : a.visualOrder - b.visualOrder;
          });

        // Extract room facilities with full details
        const facilities = (room.roomFacilities || []).map((facility) => ({
          code: facility.facilityCode,
          groupCode: facility.facilityGroupCode,
          description: facility.description?.content || "",
          hasLogic: facility.indLogic || false,
          hasFee: facility.indFee || false,
          number: facility.number || null,
          isYesOrNo: facility.indYesOrNo || false,
          voucher: facility.voucher || false,
        }));

        // Extract room stays info with facilities
        const roomStays = (room.roomStays || []).map((stay) => ({
          type: stay.stayType,
          order: stay.order,
          description: stay.description || "",
          facilities: (stay.roomStayFacilities || []).map((f) => ({
            code: f.facilityCode,
            groupCode: f.facilityGroupCode,
            description: f.description?.content || "",
            number: f.number || null,
          })),
        }));

        // Extract rates information if available (rates may come from availability API)
        type RoomWithOptionalRates = HotelRoom & Partial<HotelAvailabilityRoom>;
        const ratesSource: HotelRate[] =
          (room as RoomWithOptionalRates).rates || [];
        const rates: ProcessedRate[] = ratesSource.map((rate) => {
          const taxes: HotelRateTaxes = rate.taxes
            ? {
              allIncluded: rate.taxes.allIncluded ?? false,
              taxes: Array.isArray(rate.taxes.taxes) ? rate.taxes.taxes : [],
            }
            : { allIncluded: false, taxes: [] };

          return {
            rateKey: rate.rateKey || "",
            rateClass: rate.rateClass || "",
            rateType: rate.rateType || "",
            net: Number(rate.net) || 0,
            sellingRate: rate.sellingRate ?? 0,
            hotelSellingRate: rate.hotelSellingRate ?? 0,
            boardCode: rate.boardCode || "",
            boardName: rate.boardName || "",
            cancellationPolicies: rate.cancellationPolicies || [],
            adults: rate.adults || 0,
            children: rate.children || 0,
            rooms: rate.rooms || 1,
            allotment: rate.allotment || 0,
            commissionAmount: rate.commissionAmount || "0",
            commission_percentage: rate.commission_percentage || "0",
            convertedRate: rate.convertedRate || "0",
            currency: rate.currency || "SAR",
            originalNet: rate.originalNet || "0",
            offers: rate.offers || [],
            packaging: rate.packaging ?? false,
            paymentType: rate.paymentType || "",
            rateCommentsId: rate.rateCommentsId || "",
            taxes,
            taxesRate: rate.taxesRate || "0",
          };
        });

        return {
          // Basic room information
          roomCode: room.roomCode,
          name: (room as RoomWithOptionalRates).name || room.description || "",
          description: room.description || "",

          // Room type details
          type: room.type?.code || "",
          typeDescription: room.type?.description?.content || "",

          // Room characteristic details
          characteristic: room.characteristic?.code || "",
          characteristicDescription:
            room.characteristic?.description?.content || "",

          // Room metadata
          isParentRoom: room.isParentRoom || false,
          PMSRoomCode: room.PMSRoomCode || "",

          // Capacity information
          capacity: {
            minPax: room.minPax || 1,
            maxPax: room.maxPax || 1,
            minAdults: room.minAdults || 1,
            maxAdults: room.maxAdults || 1,
            maxChildren: room.maxChildren || 0,
          },

          // Images associated with this room
          images: roomImages,
          imageCount: roomImages.length,
          mainImage: roomImages.length > 0 ? roomImages[0].fullUrl : null,

          // Facilities associated with this room
          facilities: facilities,
          facilityCount: facilities.length,

          // Room stays information
          roomStays: roomStays,

          // Rates information
          rates: rates,
          rateCount: rates.length,
        };
      });

      // Filter out rooms that don't have any rates
      const roomsWithRates = roomsWithDetails.filter(
        (room) => room.rates.length > 0
      );

      // Store processed rooms in state
      setProcessedRooms(roomsWithRates);
    }
  }, [hotelData]);
  const handleOpenModal = (room: ProcessedRoom) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  const handleOpenImageModal = () => {
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
  };

  const handleReadMoreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  // Price details modal handlers
  const handleOpenPriceDetailsModal = (
    rate: ProcessedRate,
    roomName: string,
    count: number = 1
  ) => {
    setSelectedRateForPriceDetails({ rate, roomName, count });
    setIsPriceDetailsModalOpen(true);
  };

  const handleClosePriceDetailsModal = () => {
    setIsPriceDetailsModalOpen(false);
    setSelectedRateForPriceDetails(null);
  };

  // Helper: format dates in a consistent Gregorian "Mon DD" style (same as search results)
  const formatShortGregorianDate = (date: Date | null) => {
    if (!date) return "Add Date";
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
  };

  // Calculate daily prices based on total (backend already includes total stay price)
  const calculateDailyPrices = useCallback(() => {
    if (
      !searchFilters.checkInDate ||
      !searchFilters.checkOutDate ||
      !selectedRateForPriceDetails
    ) {
      return { dates: [], nights: 0, averagePrice: 0, totalPrice: 0 };
    }

    const checkIn = new Date(searchFilters.checkInDate);
    const checkOut = new Date(searchFilters.checkOutDate);
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    // rate.net already includes total price for entire stay, multiply by room count only
    const roomCount = selectedRateForPriceDetails.count || 1;
    const totalPrice =
      Number(selectedRateForPriceDetails.rate.net ?? 0) * roomCount;
    const pricePerNight = totalPrice / nights;

    const dates = [];
    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(checkIn);
      currentDate.setDate(checkIn.getDate() + i);
      dates.push({
        date: currentDate,
        price: pricePerNight,
        // Use manual Gregorian formatter to avoid Arabic locale switching to Islamic calendar
        formattedDate: formatShortGregorianDate(currentDate),
      });
    }

    return { dates, nights, averagePrice: pricePerNight, totalPrice };
  }, [
    searchFilters.checkInDate,
    searchFilters.checkOutDate,
    selectedRateForPriceDetails,
  ]);

  // Helper functions for hotel images

  const handleTabClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    tab: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(tab);
    if (element) {
      const headerOffset = 140;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveTab(tab);
    }
  };
  console.log("hotel total amenities", hotelData?.facilities);

  const amenities =
    hotelData?.facilities?.filter(
      (f) =>
        f.indYesOrNo !== false
    )
      ?.sort((a, b) => {
        const aPaid = a.indFee === true ? 1 : 0;
        const bPaid = b.indFee === true ? 1 : 0;
        return aPaid - bPaid;
      }) || [];
  console.log("amenities", amenities);
  // const displayedAmenities = showAllAmenities
  //   ? amenities
  //   : amenities.filter((f) => !f.indFee).slice(0, 8);

  const FACILITY_GROUP_TITLES: Record<number, string> = {
    10: t("sections.facilityGroups.10"),
    20: t("sections.facilityGroups.20"),
    30: t("sections.facilityGroups.30"),
    40: t("sections.facilityGroups.40"),
    50: t("sections.facilityGroups.50"),
    60: t("sections.facilityGroups.60"),
    70: t("sections.facilityGroups.70"),
    71: t("sections.facilityGroups.71"),
    72: t("sections.facilityGroups.72"),
    73: t("sections.facilityGroups.73"),
    74: t("sections.facilityGroups.74"),
    80: t("sections.facilityGroups.80"),
    85: t("sections.facilityGroups.85"),
    90: t("sections.facilityGroups.90"),
    91: t("sections.facilityGroups.91"),
    120: t("sections.facilityGroups.120"),
    130: t("sections.facilityGroups.130"),
    190: t("sections.facilityGroups.190"),
  };

  const groupedAmenities = amenities.reduce((acc, amenity) => {
    const code = amenity.facilityGroupCode;
    if (!acc[code]) acc[code] = [];
    acc[code].push(amenity);
    return acc;
  }, {} as Record<number, typeof amenities>);

  const sortedGroupCodes = Object.keys(groupedAmenities)
    .map(Number)
    .sort((a, b) => {
      const order = [
        60, 70, 80, 10, 20, 50, 130, 120, 40, 190, 71, 72, 73, 74, 85, 90, 30, 91,
      ];
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a - b;
    });
  const selectedRoomFacilities =
    selectedRoom?.facilities.filter((facility) => facility.description) || [];

  const selectedRoomBedDescription = selectedRoom
    ? selectedRoom.roomStays
      .flatMap((stay) => stay.facilities)
      .map((facility) => facility.description)
      .find((description) => description) ||
    selectedRoom.characteristicDescription ||
    null
    : null;

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        numberingSystem: "latn", // Force Western numerals (0-9) instead of Arabic-Indic numerals
      }),
    [locale]
  );

  const formatCancellationDate = useCallback(
    (dateString: string) => {
      // Split to get just the date part (YYYY-MM-DD) to avoid timezone shifts
      const datePart = dateString.includes("T")
        ? dateString.split("T")[0]
        : dateString;
      const [year, month, day] = datePart.split("-").map(Number);

      // Create date locally using the components
      // Note: month is 0-indexed in Date constructor
      const date = new Date(year, month - 1, day);

      if (Number.isNaN(date.getTime())) {
        return null;
      }
      return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
      }).format(date);
    },
    [] // Removed locale dependency
  );

  const findPrimaryRate = useCallback(
    (room: ProcessedRoom | null | undefined) => {
      if (!room || !room.rates || room.rates.length === 0) {
        return null;
      }

      const preferredRate =
        room.rates.find(
          (rate) =>
            rate.boardCode?.toUpperCase() === "RO" &&
            rate.boardName?.toUpperCase() === "ROOM ONLY"
        ) || room.rates[0];

      const net = Number(preferredRate.net ?? 0);
      const cancellationPolicy = preferredRate.cancellationPolicies?.[0];
      const policyAmountRaw = cancellationPolicy?.amount;
      const parsedPolicyAmount =
        policyAmountRaw !== undefined && policyAmountRaw !== null
          ? Number(policyAmountRaw)
          : null;
      const policyAmount =
        parsedPolicyAmount !== null && Number.isFinite(parsedPolicyAmount)
          ? parsedPolicyAmount
          : null;
      const refundDate = cancellationPolicy?.from
        ? formatCancellationDate(cancellationPolicy.from)
        : null;
      const isFullyRefundable =
        policyAmount !== null && Math.abs(policyAmount - net) < 0.01;

      return {
        rate: preferredRate,
        net,
        formattedPrice: priceFormatter.format(net),
        cancellationPolicy,
        refundDate,
        policyAmount,
        policyAmountFormatted:
          policyAmount !== null ? priceFormatter.format(policyAmount) : null,
        isFullyRefundable,
      };
    },
    [priceFormatter, formatCancellationDate]
  );

  // Helper function to get the display rate for a room (always shows primary rate)
  const getDisplayRate = useCallback(
    (room: ProcessedRoom | null | undefined) => {
      // Just return the primary rate for display on the main card
      return findPrimaryRate(room);
    },
    [findPrimaryRate]
  );

  // Helper function to process all cancellation policies for any specific rate
  const getRateCancellationDetails = useCallback(
    (rate: ProcessedRate) => {
      const net = Number(rate.net ?? 0);
      const cancellationPolicies = rate.cancellationPolicies || [];

      // Process all policies and sort by date (earliest first)
      const processedPolicies = cancellationPolicies
        .map((policy) => {
          const policyAmountRaw = policy?.amount;
          const parsedPolicyAmount =
            policyAmountRaw !== undefined && policyAmountRaw !== null
              ? Number(policyAmountRaw)
              : null;
          const policyAmount =
            parsedPolicyAmount !== null && Number.isFinite(parsedPolicyAmount)
              ? parsedPolicyAmount
              : null;
          const refundDate = policy?.from
            ? formatCancellationDate(policy.from)
            : null;
          const isFullyRefundable =
            policyAmount !== null && Math.abs(policyAmount - net) < 0.01;
          const dateValue = policy?.from ? new Date(policy.from).getTime() : 0;

          return {
            policy,
            refundDate,
            policyAmount,
            policyAmountFormatted:
              policyAmount !== null
                ? priceFormatter.format(policyAmount)
                : null,
            isFullyRefundable,
            dateValue,
          };
        })
        .sort((a, b) => a.dateValue - b.dateValue); // Sort by date, earliest first

      // Use the first policy for backward compatibility (most lenient/earliest)
      const firstPolicy = processedPolicies[0] || null;
      const cancellationPolicy = firstPolicy?.policy || null;
      const policyAmount = firstPolicy?.policyAmount || null;
      const refundDate = firstPolicy?.refundDate || null;
      const isFullyRefundable = firstPolicy?.isFullyRefundable || false;

      // Calculate cancellation fee percentage
      const cancellationFeePercentage =
        policyAmount !== null && net > 0
          ? Math.round(((net - policyAmount) / net) * 100)
          : null;

      return {
        net,
        cancellationPolicy,
        refundDate,
        policyAmount,
        policyAmountFormatted:
          policyAmount !== null ? priceFormatter.format(policyAmount) : null,
        isFullyRefundable,
        cancellationFeePercentage,
        allPolicies: processedPolicies, // Include all processed policies
      };
    },
    [priceFormatter, formatCancellationDate]
  );

  // Helper function to get translated room name
  const getRoomDisplayName = useCallback(
    (room: ProcessedRoom): string => {
      const originalName =
        room.name || room.description || t("placeholders.roomName");

      // Return translated name if available
      if (locale === "ar" && translatedRoomNames.has(room.roomCode)) {
        return translatedRoomNames.get(room.roomCode)!;
      }

      return originalName;
    },
    [locale, translatedRoomNames, t]
  );

  // Translate room names using Google Translate when locale is Arabic
  useEffect(() => {
    if (locale !== "ar" || processedRooms.length === 0) {
      return;
    }

    const translateRooms = async () => {
      const translations = new Map<string, string>();

      const translatePromises = processedRooms.map(async (room) => {
        const originalName =
          room.name || room.description || t("placeholders.roomName");

        // Skip if already translated
        if (translatedRoomNames.has(room.roomCode)) {
          return;
        }

        // Only translate English text
        const isEnglish =
          originalName &&
          !originalName.match(/[\u0600-\u06FF]/) &&
          originalName.match(/[a-zA-Z]/);

        if (isEnglish && originalName !== t("placeholders.roomName")) {
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
                  translations.set(room.roomCode, translated);
                }
              }
            }
          } catch (error) {
            console.warn(
              `Translation failed for room "${originalName}":`,
              error
            );
          }
        }
      });

      await Promise.all(translatePromises);

      if (translations.size > 0) {
        setTranslatedRoomNames((prev) => {
          const updated = new Map(prev);
          translations.forEach((value, key) => {
            updated.set(key, value);
          });
          return new Map(updated);
        });
      }
    };

    translateRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, processedRooms.length]);

  // Translate hotel name using Google Translate when locale is Arabic
  useEffect(() => {
    // Reset translation when hotel changes
    setTranslatedHotelName(null);

    if (locale !== "ar" || !hotelData?.name?.content) {
      return;
    }

    const originalName = hotelData.name.content;

    // Only translate English text
    const isEnglish =
      originalName &&
      !originalName.match(/[\u0600-\u06FF]/) &&
      originalName.match(/[a-zA-Z]/);

    if (isEnglish && originalName !== t("placeholders.hotelName")) {
      const translateHotel = async () => {
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
                setTranslatedHotelName(translated);
              }
            }
          }
        } catch (error) {
          console.warn(
            `Translation failed for hotel "${originalName}":`,
            error
          );
        }
      };

      translateHotel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, hotelId, hotelData?.name?.content]);

  // Helper function to extract star rating from category code
  const getStarRating = (): number => {
    if (hotelData?.category?.code) {
      // Extract number from category code (e.g., "3EST" -> 3)
      const match = hotelData.category.code.match(/^(\d+)/);
      return match ? parseInt(match[1], 10) : 5; // Default to 5 stars if no match
    }
    return 5; // Default fallback
  };

  const selectedRoomRateDetails = findPrimaryRate(selectedRoom);
  const descriptionContent =
    hotelData?.description?.content || t("description.fallback");
  const hotelName =
    translatedHotelName ||
    hotelData?.name?.content ||
    t("placeholders.hotelName");
  const hotelAddress =
    hotelData?.address?.content || t("placeholders.hotelAddress");
  const starRating = getStarRating();
  const descriptionPreviewLength = 300;
  const truncatedDescription =
    descriptionContent.length > descriptionPreviewLength
      ? `${descriptionContent.substring(0, descriptionPreviewLength)}...`
      : descriptionContent;
  const checkInTime = "2:00 PM";
  const checkOutTime = "11:00 AM";
  const receptionCloseTime = "12:00 PM";
  const selectedRoomDisplayName =
    selectedRoom?.name ||
    selectedRoom?.description ||
    t("placeholders.roomName");
  const selectedRoomSleepsLabel = t("labels.sleeps", {
    count:
      selectedRoom?.capacity?.maxAdults ??
      selectedRoom?.capacity?.maxPax ??
      "-",
  });
  const selectedRoomRefundStatus = selectedRoomRateDetails
    ? selectedRoomRateDetails.isFullyRefundable
      ? t("refund.fullyRefundable")
      : t("refund.notFullyRefundable")
    : t("placeholders.refundPolicyUnavailable");
  const selectedRoomRefundDateLabel = selectedRoomRateDetails?.refundDate
    ? t("refund.beforeDate", {
      date: selectedRoomRateDetails.refundDate,
    })
    : t("placeholders.refundDateUnavailable");
  const hotelLatitude = hotelData?.coordinates?.latitude;
  const hotelLongitude = hotelData?.coordinates?.longitude;
  // console.log("hotelLatitude", hotelLatitude);
  // console.log("hotelLongitude", hotelLongitude);
  const hasValidCoordinates =
    typeof hotelLatitude === "number" &&
    Number.isFinite(hotelLatitude) &&
    typeof hotelLongitude === "number" &&
    Number.isFinite(hotelLongitude);
  const canRenderInteractiveMap =
    hasValidCoordinates && Boolean(mapboxAccessToken);
  // console.log("canRenderInteractiveMap", canRenderInteractiveMap);
  const handleFavoriteClick = () => {
    if (authContext?.isAuthenticated) {
      if (isFavorited) {
        removeFavorite(hotelId);
        toast.success(t("toast.removedFromFavorites"));
      } else {
        addFavorite(hotelId);
        toast.success(t("toast.addedToFavorites"));
      }
    } else {
      setPendingAction("favorite");
      setIsLoginModalOpen(true);
    }
  };

  // Helper to prepare and store booking data in the booking store
  const prepareBookingData = () => {
    const selectedRoomsData: SelectedRoom[] = [];

    processedRooms.forEach((room) => {
      room.rates.forEach((rate) => {
        const key = `${room.roomCode}_${rate.rateKey}`;
        const roomCount = selectedRoomCounts[key] || 0;

        if (roomCount > 0) {
          const pricePerRoom = Number(rate.net || 0);
          const totalPrice = pricePerRoom * roomCount;

          selectedRoomsData.push({
            roomCode: room.roomCode,
            roomName: room.name || room.description || "",
            rateKey: rate.rateKey || "",
            boardCode: rate.boardCode || "",
            boardName: rate.boardName || "",
            count: roomCount,
            pricePerRoom: pricePerRoom,
            totalPrice: totalPrice,
            currency: rate.currency || "SAR",
            cancellationPolicies: rate.cancellationPolicies || [],
            adults: rate.adults || 0,
            children: rate.children || 0,
          });
        }
      });
    });

    const totalAmount = selectedRoomsData.reduce(
      (sum, room) => sum + room.totalPrice,
      0
    );
    const currency = selectedRoomsData[0]?.currency || "SAR";

    // Clear previous traveler details from local storage
    clearTravelerDetails();

    // Save booking data to store
    setBookingData({
      hotelId: hotelId,
      hotelName: hotelData?.name?.content || "",
      selectedRooms: selectedRoomsData,
      totalAmount: totalAmount,
      currency: currency,
      timestamp: Date.now(),
    });
  };

  const handleBookNowClick = () => {
    // Validate that at least one room is selected
    const hasSelectedRooms = Object.values(selectedRoomCounts).some(
      (count) => count > 0
    );

    console.log("handleBookNowClick");

    // If user is not authenticated
    if (!authContext?.isAuthenticated) {
      // First ensure a room is selected
      if (!hasSelectedRooms) {
        toast.error(t("toast.pleaseSelectRoom"));
        return;
      }

      // Prepare booking data so BookingReview has data after social login redirect
      prepareBookingData();

      // Rooms are selected, now show login modal
      setPendingAction("booking");
      setIsLoginModalOpen(true);
      return;
    }

    // User is authenticated - validate that at least one room is selected
    if (!hasSelectedRooms) {
      toast.error(t("toast.pleaseSelectRoom"));
      return;
    }

    // Prepare booking data from selected rooms
    prepareBookingData();

    // Navigate to booking review page with hotel ID
    router.push(`/${locale}/booking-review/${hotelId}`);
  };

  return (
    <main className="hotel-details-page padding-top-100 section-space-b">
      <div className="container">
        {loading && (
          <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
            <div className="hotel-details-skeleton" aria-hidden>
              <nav className="breadcrumbs" aria-label="Breadcrumb">
                <ol>
                  <li>
                    <Skeleton width={120} height={16} />
                  </li>
                </ol>
              </nav>
              <div className="hotel-details-main-content">
                <div className="hotel-details-left">
                  <div className="image-gallery-section">
                    <div className="main-image">
                      <Skeleton height={260} />
                    </div>
                    <div
                      className="thumbnail-images"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: 8,
                      }}
                    >
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <Skeleton key={idx} height={52} />
                      ))}
                    </div>
                  </div>
                  <div className="tabbing-conetnt">
                    <div className="tabbing-tabs-container">
                      <div className="hotel-tabs">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Skeleton
                            key={idx}
                            width={80}
                            height={20}
                            style={{ display: "inline-block", marginRight: 12 }}
                          />
                        ))}
                      </div>
                    </div>
                    <section className="hotel-tab-section">
                      <Skeleton
                        height={20}
                        width={160}
                        style={{ marginBottom: 12 }}
                      />
                      <Skeleton
                        count={4}
                        height={14}
                        style={{ marginBottom: 8 }}
                      />
                    </section>
                  </div>
                </div>
                <div className="hotel-details-right">
                  <Skeleton
                    height={28}
                    width={240}
                    style={{ marginBottom: 12 }}
                  />
                  <Skeleton
                    height={20}
                    width={160}
                    style={{ marginBottom: 8 }}
                  />
                  <Skeleton
                    height={16}
                    width={200}
                    style={{ marginBottom: 8 }}
                  />
                  <div className="hotel-price-info">
                    <Skeleton
                      height={20}
                      width={180}
                      style={{ marginBottom: 12 }}
                    />
                    <Skeleton height={44} width={200} />
                  </div>
                </div>
              </div>
              <section className="rooms-filter-section">
                <Skeleton
                  height={24}
                  width={120}
                  style={{ marginBottom: 16 }}
                />
                <div className="room-list">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div className="room-card" key={idx}>
                      <div className="room-card-image">
                        <Skeleton height={203} />
                      </div>
                      <div className="room-card-details">
                        <Skeleton
                          height={20}
                          width={220}
                          style={{ marginBottom: 8 }}
                        />
                        <Skeleton
                          count={2}
                          height={14}
                          width={260}
                          style={{ marginBottom: 6 }}
                        />
                        <Skeleton height={36} width={140} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </SkeletonTheme>
        )}
        {!loading && (
          <>
            {/* Breadcrumbs */}
            {/* <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
              <Image
                src={BreadcrumbArrow}
                width={18}
                height={18}
                alt="arrow icon"
                className="breadcrumb-arrow-icon"
              />
            </li>
            <li>
              <Link href="#">Bangkok</Link>
              <Image
                src={BreadcrumbArrow}
                width={18}
                height={18}
                alt="arrow icon"
                className="breadcrumb-arrow-icon"
              />
            </li>
            <li>
              <Link href="/thailand">Thailand</Link>
              <Image
                src={BreadcrumbArrow}
                width={18}
                height={18}
                alt="arrow icon"
                className="breadcrumb-arrow-icon"
              />
            </li>
            <li aria-current="page">Novotel</li>
          </ol>
        </nav> */}

            <div className="hotel-details-main-content mt-4">
              <div className="hotel-details-left">
                {/* Image Gallery */}
                <div className="image-gallery-section">
                  {sortedImages.length > 0 ? (
                    <div className="main-image">
                      <div className="slider-image-wrapper">
                        <Slider
                          ref={mainImageSliderRef}
                          dots={false}
                          infinite={sortedImages.length > 1}
                          speed={500}
                          slidesToShow={1}
                          slidesToScroll={1}
                          arrows={false}
                          className="main-image-slider"
                          beforeChange={(_: number, next: number) =>
                            setCurrentMainImageIndex(next)
                          }
                        >
                          {sortedImages.map((image, index) => (
                            <div key={`main-slider-img-${image.path}`} className="slider-item">
                              <Image
                                src={buildHotelbedsImageUrl(image.path)}
                                width={892}
                                height={260}
                                alt={hotelName}
                                className="hotel-details-main-image"
                                priority={index < 5}
                                unoptimized
                              />
                            </div>
                          ))}
                        </Slider>
                      </div>

                      <button
                        className="slider-nav-btn prev"
                        onClick={handleMainImagePrev}
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
                          ></path>
                        </svg>
                      </button>

                      <button
                        className="slider-nav-btn next"
                        onClick={handleMainImageNext}
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
                          ></path>
                        </svg>
                      </button>

                      <button
                        className="show-all-photos-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenImageModal();
                        }}
                      >
                        {t("showAllPhotos")} ({sortedImages.length})
                      </button>
                    </div>
                  ) : (
                    <div className="main-image">
                      {/* Fallback or skeleton if no images yet, though sortedImages check usually handles it. 
                           If empty, maybe show placeholder or nothing. */}
                    </div>
                  )}
                </div>

                <div className="tabbing-conetnt">
                  {/* Tabs */}
                  <div className="tabbing-tabs-container">
                    <div className="hotel-tabs">
                      <a
                        href="#overview"
                        className={activeTab === "overview" ? "active" : ""}
                        onClick={(e) => handleTabClick(e, "overview")}
                      >
                        {t("tabs.overview")}
                      </a>
                      <a
                        href="#rooms"
                        className={activeTab === "rooms" ? "active" : ""}
                        onClick={(e) => handleTabClick(e, "rooms")}
                      >
                        {t("tabs.rooms")}
                      </a>
                      <a
                        href="#amenities"
                        className={activeTab === "amenities" ? "active" : ""}
                        onClick={(e) => handleTabClick(e, "amenities")}
                      >
                        {t("tabs.amenities")}
                      </a>

                      {/* <a
                        href="#reviews"
                        className={activeTab === "reviews" ? "active" : ""}
                        onClick={(e) => handleTabClick(e, "reviews")}
                      >
                        {t("tabs.reviews")}
                      </a> */}
                      <a
                        href="#map"
                        className={activeTab === "map" ? "active" : ""}
                        onClick={(e) => handleTabClick(e, "map")}
                      >
                        {t("tabs.map")}
                      </a>
                    </div>
                  </div>

                  {/* Overview */}
                  <section id="overview" className="hotel-tab-section">
                    <h2 className="tabbing-sub-title">
                      {t("sections.descriptionTitle")}
                    </h2>
                    <p className="hotel-description">
                      {isDescriptionExpanded
                        ? descriptionContent
                        : truncatedDescription}
                      <a
                        href="#"
                        onClick={handleReadMoreClick}
                        style={{
                          marginLeft: "8px",
                          color: "#3E5B96",
                          textDecoration: "underline",
                        }}
                      >
                        {isDescriptionExpanded ? t("readLess") : t("readMore")}
                      </a>
                    </p>
                  </section>
                  <section className="hotel-tab-section important-tab-content">
                    <h2 className="tabbing-sub-title">
                      {t("sections.importantTitle")}
                    </h2>
                    <div className="important-info">
                      <div className="important-item">
                        <div className="important-icon arrow_icon d-flex align-items-center">
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
                              strokeWidth="1.5"
                            />
                            <path
                              d="M16 12L8 12M16 12C16 12.7002 14.0057 14.0085 13.5 14.5M16 12C16 11.2998 14.0057 9.99153 13.5 9.5"
                              stroke="#09090B"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {t("important.checkInLabel")}
                        </div>
                        <p className="important-text">{checkInTime}</p>
                      </div>
                      <div className="important-item">
                        <div className="important-icon arrow_icon d-flex align-items-center">
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
                              strokeWidth="1.5"
                            />
                            <path
                              d="M8 12L16 12M8 12C8 11.2998 9.9943 9.99153 10.5 9.5M8 12C8 12.7002 9.9943 14.0085 10.5 14.5"
                              stroke="#09090B"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {t("important.checkOutLabel")}
                        </div>
                        <p className="important-text">{checkOutTime}</p>
                      </div>
                      <div className="important-item">
                        <div className="important-icon d-flex align-items-center">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                              stroke="#09090B"
                              strokeWidth="1.5"
                            />
                            <path
                              d="M12.2422 17V12C12.2422 11.5286 12.2422 11.2929 12.0957 11.1464C11.9493 11 11.7136 11 11.2422 11"
                              stroke="#09090B"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M11.992 8H12.001"
                              stroke="#09090B"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {t("important.additionalFactsLabel")}
                        </div>
                        <p className="important-text">
                          {t("important.receptionOpenUntil", {
                            time: receptionCloseTime,
                          })}
                        </p>
                      </div>
                    </div>
                  </section>


                </div>
              </div>
              <div className="hotel-details-right">
                <div className="hotel-info-header">
                  <h2 className="hotel-name">{hotelName}</h2>
                  <div className="hotel-details-rating d-flex align-items-center">
                    <div className="hotel-details-rating-star d-flex align-items-center">
                      {Array.from({ length: starRating }, (_, index) => (
                        <Image
                          key={`hotel-star-${index}`}
                          src={starFillIcon}
                          width={16}
                          height={16}
                          alt="star"
                          className="hotel-rating-icon"
                        />
                      ))}
                    </div>
                    {/* <span className="rating-value-wrapper d-flex align-items-center">
                      <span className="rating-value">4.5</span> (120 Reviews)
                    </span> */}
                  </div>
                  {/* <div className="distance d-flex align-items-center">
                <Image
                  src={LocationMapIcon}
                  width={20}
                  height={20}
                  alt="location ,ap icon"
                  className="hotel-rating-icon"
                />
                2.4km away from city center
              </div> */}
                  <div className="location-address d-flex align-items-start">
                    <Image
                      src={LocationAddressIcon}
                      width={20}
                      height={20}
                      alt="location"
                      className="hotel-address-icon"
                    />
                    {hotelAddress}
                  </div>

                  <div className="hotel-price-info">
                    {/* <div className="price">
                  Price: Starts from <span>$500</span>/night
                </div> */}
                    {/* <div className="check-availability-action">
                      <button
                        className="button-primary check-availability-btn"
                        onClick={() => router.push(`/booking-review`)}
                      >
                        Check Availability
                      </button>
                    </div> */}
                  </div>
                  <div className="free-cancellation-section d-flex align-items-center">
                    <span>{t("labels.freeCancellation")}</span>
                    <span>{t("labels.noRepay")}</span>
                  </div>
                  <div className="share-like-section d-flex align-items-center">
                    <button
                      className="share-btn favarite-btn"
                      onClick={handleFavoriteClick}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill={isFavorited ? "#FB2C36" : "none"}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z"
                          stroke="#FB2C36"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      {t("actions.favorite")}
                    </button>
                    <button className="share-btn" onClick={handleShareClick}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18 7C18.7745 7.16058 19.3588 7.42859 19.8284 7.87589C21 8.99181 21 10.7879 21 14.38C21 17.9721 21 19.7681 19.8284 20.8841C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8841C3 19.7681 3 17.9721 3 14.38C3 10.7879 3 8.99181 4.17157 7.87589C4.64118 7.42859 5.2255 7.16058 6 7"
                          stroke="#2B7FFF"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M12.0253 2.00052L12 14M12.0253 2.00052C11.8627 1.99379 11.6991 2.05191 11.5533 2.17492C10.6469 2.94006 9 4.92886 9 4.92886M12.0253 2.00052C12.1711 2.00657 12.3162 2.06476 12.4468 2.17508C13.3531 2.94037 15 4.92886 15 4.92886"
                          stroke="#2B7FFF"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {t("actions.share")}
                    </button>
                  </div>
                </div>
              </div>
            </div>



            {/* Rooms */}
            <section id="rooms" className="rooms-filter-section">
              <h2 className="hotel-section-title">
                {t("sections.roomsTitle")}
              </h2>
              <div className="room-filters">
                <FilterComponents
                  onCheckAvailability={handleCheckAvailability}
                />
              </div>

              {/* Room Cards */}

              {/* room-list calss remove and add */}
              <div className="hotel-room-with-total">
                <div className="room-list-vertical">
                  {processedRooms.length === 0 ? (
                    <div
                      className="no-rooms-available-message"
                      style={{
                        textAlign: "center",
                        padding: "40px 20px",
                        color: "#666",
                        fontSize: "16px",
                      }}
                    >
                      <p style={{ marginBottom: "8px", fontWeight: "500" }}>
                        {t("placeholders.noRoomsAvailable") ||
                          "No rooms available"}
                      </p>
                      <p style={{ fontSize: "14px", color: "#999" }}>
                        {t("placeholders.changeFilters") ||
                          "Please try changing your filters"}
                      </p>
                    </div>
                  ) : (
                    processedRooms.map((room, roomIndex) => {
                      const sliderSettings = {
                        dots: false,
                        infinite: room.images.length > 1,
                        speed: 500,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: false,
                      };
                      const roomDisplayName = getRoomDisplayName(room);
                      const roomFacilitiesWithDescriptions =
                        room.facilities.filter(
                          (facility) => facility.description
                        );
                      console.log("roomFacilitiesWithDescriptions", roomFacilitiesWithDescriptions);
                      const displayedFacilities =
                        roomFacilitiesWithDescriptions
                          .filter((f) => !f.hasFee)
                          .slice(0, 4);
                      // console.log("displayedFacilities", displayedFacilities);
                      const bedDescription =
                        room.roomStays
                          .flatMap((stay) => stay.facilities)
                          .map((facility) => facility.description)
                          .find((description) => description) ||
                        room.characteristicDescription ||
                        null;
                      const displayRateDetails = getDisplayRate(room);
                      // const refundStatusLabel = displayRateDetails
                      //   ? displayRateDetails.isFullyRefundable
                      //     ? t("refund.fullyRefundable")
                      //     : t("refund.notFullyRefundable")
                      //   : t("placeholders.refundPolicyUnavailable");
                      // const refundDateLabel = displayRateDetails?.refundDate
                      //   ? t("refund.beforeDate", {
                      //     date: displayRateDetails.refundDate,
                      //   })
                      //   : t("placeholders.refundDateUnavailable");

                      return (
                        <div
                          className="room-card"
                          key={`room-${room.roomCode || roomIndex}`}
                        >
                          <div className="room-card-image">
                            {room.images.length > 0 ? (
                              <>
                                <Slider
                                  ref={(el) => {
                                    sliderRefs.current[roomIndex] = el;
                                  }}
                                  {...sliderSettings}
                                >
                                  {room.images.map((image, imgIndex) => (
                                    <div
                                      key={`room-${room.roomCode || roomIndex
                                        }-image-${image.path || imgIndex}`}
                                    >
                                      <Image
                                        src={image.fullUrl}
                                        width={378}
                                        height={246}
                                        alt={roomDisplayName}
                                        style={{
                                          objectFit: "cover",
                                          width: "100%",
                                          height: "246px",
                                        }}
                                      />
                                    </div>
                                  ))}
                                </Slider>
                                {room.images.length > 1 && (
                                  <div className="hotel-image-action d-flex align-items-center justify-content-between">
                                    <button
                                      className="hotel-img-btn border-0 p-0 bg-transparent"
                                      onClick={() =>
                                        sliderRefs.current[
                                          roomIndex
                                        ]?.slickPrev()
                                      }
                                    >
                                      <Image
                                        src={HotelImgPrevIcon}
                                        width={40}
                                        height={40}
                                        alt="Previous"
                                        className="arrow-icon"
                                      />
                                    </button>
                                    <button
                                      className="hotel-img-btn border-0 p-0 bg-transparent"
                                      onClick={() =>
                                        sliderRefs.current[
                                          roomIndex
                                        ]?.slickNext()
                                      }
                                    >
                                      <Image
                                        src={HotelImgNextIcon}
                                        width={40}
                                        height={40}
                                        alt="Next"
                                        className="arrow-icon"
                                      />
                                    </button>
                                  </div>
                                )}
                              </>
                            ) : (
                              <Image
                                src={HotelDetailsCardImage}
                                width={378}
                                height={203}
                                alt={roomDisplayName}
                              />
                            )}

                            <div className="hotel-card-total-image d-flex align-items-center">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5 14.9787C5.10725 16.0691 5.34963 16.803 5.89743 17.3508C6.87997 18.3333 8.46135 18.3333 11.6241 18.3333C14.7869 18.3333 16.3682 18.3333 17.3508 17.3508C18.3333 16.3682 18.3333 14.7869 18.3333 11.6241C18.3333 8.46135 18.3333 6.87997 17.3508 5.89743C16.803 5.34963 16.0691 5.10725 14.9787 5"
                                  stroke="white"
                                  strokeWidth="1.25"
                                />
                                <path
                                  d="M1.66602 8.33268C1.66602 5.18999 1.66602 3.61864 2.64233 2.64233C3.61864 1.66602 5.18999 1.66602 8.33268 1.66602C11.4754 1.66602 13.0467 1.66602 14.023 2.64233C14.9993 3.61864 14.9993 5.18999 14.9993 8.33268C14.9993 11.4754 14.9993 13.0467 14.023 14.023C13.0467 14.9993 11.4754 14.9993 8.33268 14.9993C5.18999 14.9993 3.61864 14.9993 2.64233 14.023C1.66602 13.0467 1.66602 11.4754 1.66602 8.33268Z"
                                  stroke="white"
                                  strokeWidth="1.25"
                                />
                                <path
                                  d="M1.66602 9.26477C2.18186 9.19922 2.70338 9.16682 3.22578 9.16797C5.43573 9.1271 7.59155 9.72962 9.30858 10.868C10.901 11.9238 12.02 13.3769 12.4993 14.9993"
                                  stroke="white"
                                  strokeWidth="1.25"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M10.8338 5.83398H10.8413"
                                  stroke="white"
                                  strokeWidth="1.66667"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              {room.imageCount}
                            </div>
                          </div>
                          <div className="room-card-details">
                            <div className="room-card-details-left">
                              <h3 className="hotel-room-name">
                                {roomDisplayName}
                              </h3>

                              <div className="room-card-amenities-list mt-0">
                                {displayedFacilities.length > 0 ? (
                                  <ul className="amenities-item d-flex">
                                    {displayedFacilities.map((facility) => (
                                      <li
                                        key={`${room.roomCode}-${facility.groupCode}-${facility.code}`}
                                      >
                                        <AmenityIcon
                                          facilityCode={facility.code}
                                        />
                                        {facility.description ||
                                          t("placeholders.facilityFallback", {
                                            code: facility.code,
                                          })}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="amenities-item no-facilities">
                                    {t("placeholders.noFacilityInfo")}
                                  </p>
                                )}
                              </div>

                              <div className="room-card-specs mt-0">
                                <ul className="card-specs-item d-flex align-items-center">
                                  <li>
                                    <svg
                                      width="20"
                                      height="20"
                                      viewBox="0 0 20 20"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M1.66602 15.8327V10.8327C1.66602 10.4577 1.7424 10.1174 1.89518 9.81185C2.04796 9.50629 2.24935 9.23546 2.49935 8.99935V6.66602C2.49935 5.97157 2.7424 5.38129 3.22852 4.89518C3.71463 4.40907 4.3049 4.16602 4.99935 4.16602H8.33268C8.65213 4.16602 8.95074 4.22518 9.22852 4.34352C9.50629 4.46185 9.76324 4.6249 9.99935 4.83268C10.2355 4.62435 10.4924 4.46129 10.7702 4.34352C11.048 4.22574 11.3466 4.16657 11.666 4.16602H14.9993C15.6938 4.16602 16.2841 4.40907 16.7702 4.89518C17.2563 5.38129 17.4993 5.97157 17.4993 6.66602V8.99935C17.7493 9.23546 17.9507 9.50629 18.1035 9.81185C18.2563 10.1174 18.3327 10.4577 18.3327 10.8327V15.8327H16.666V14.166H3.33268V15.8327H1.66602ZM10.8327 8.33268H15.8327V6.66602C15.8327 6.4299 15.7527 6.23213 15.5927 6.07268C15.4327 5.91324 15.2349 5.83324 14.9993 5.83268H11.666C11.4299 5.83268 11.2321 5.91268 11.0727 6.07268C10.9132 6.23268 10.8332 6.43046 10.8327 6.66602V8.33268ZM4.16602 8.33268H9.16602V6.66602C9.16602 6.4299 9.08602 6.23213 8.92602 6.07268C8.76602 5.91324 8.56824 5.83324 8.33268 5.83268H4.99935C4.76324 5.83268 4.56546 5.91268 4.40602 6.07268C4.24657 6.23268 4.16657 6.43046 4.16602 6.66602V8.33268ZM3.33268 12.4993H16.666V10.8327C16.666 10.5966 16.586 10.3988 16.426 10.2393C16.266 10.0799 16.0682 9.9999 15.8327 9.99935H4.16602C3.9299 9.99935 3.73213 10.0793 3.57268 10.2393C3.41324 10.3993 3.33324 10.5971 3.33268 10.8327V12.4993Z"
                                        fill="#27272A"
                                      />
                                    </svg>
                                    {bedDescription ??
                                      t("placeholders.bedInfoUnavailable")}
                                  </li>

                                  <li>
                                    <svg
                                      width="20"
                                      height="20"
                                      viewBox="0 0 20 20"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M17.3117 15C17.9361 15 18.4328 14.6071 18.8787 14.0576C19.7916 12.9329 18.2928 12.034 17.7211 11.5938C17.14 11.1463 16.4912 10.8928 15.8333 10.8333M15 9.16667C16.1506 9.16667 17.0833 8.23393 17.0833 7.08333C17.0833 5.93274 16.1506 5 15 5"
                                        stroke="#27272A"
                                        strokeWidth="1.25"
                                        strokeLinecap="round"
                                      />
                                      <path
                                        d="M2.68895 15C2.06453 15 1.56787 14.6071 1.12194 14.0576C0.209058 12.9329 1.70788 12.034 2.27952 11.5938C2.86063 11.1463 3.50947 10.8928 4.16732 10.8333M4.58398 9.16667C3.43339 9.16667 2.50065 8.23393 2.50065 7.08333C2.50065 5.93274 3.43339 5 4.58398 5"
                                        stroke="#27272A"
                                        strokeWidth="1.25"
                                        strokeLinecap="round"
                                      />
                                      <path
                                        d="M6.73715 12.594C5.88567 13.1205 3.65314 14.1955 5.0129 15.5408C5.67713 16.198 6.41692 16.668 7.34701 16.668H12.6543C13.5844 16.668 14.3242 16.198 14.9884 15.5408C16.3482 14.1955 14.1156 13.1205 13.2641 12.594C11.2674 11.3593 8.73387 11.3593 6.73715 12.594Z"
                                        stroke="#27272A"
                                        strokeWidth="1.25"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M12.9173 6.25065C12.9173 7.86148 11.6115 9.16732 10.0007 9.16732C8.38982 9.16732 7.08398 7.86148 7.08398 6.25065C7.08398 4.63982 8.38982 3.33398 10.0007 3.33398C11.6115 3.33398 12.9173 4.63982 12.9173 6.25065Z"
                                        stroke="#27272A"
                                        strokeWidth="1.25"
                                      />
                                    </svg>
                                    {t("labels.sleeps", {
                                      count:
                                        room.capacity?.maxAdults ??
                                        room.capacity?.maxPax ??
                                        "-",
                                    })}
                                  </li>
                                </ul>
                              </div>
                              {/* 
                          <div className="rooms-card-refund">
                            <div className="refund-item d-flex align-items-center">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M18.3327 10.0007C18.3327 5.39828 14.6017 1.66732 9.99935 1.66732C5.39698 1.66732 1.66602 5.39828 1.66602 10.0007C1.66602 14.603 5.39698 18.334 9.99935 18.334C14.6017 18.334 18.3327 14.603 18.3327 10.0007Z"
                                  stroke="#09090B"
                                  strokeWidth="1.25"
                                />
                                <path
                                  d="M10.2005 14.166V9.99935C10.2005 9.60651 10.2005 9.41009 10.0785 9.28805C9.95644 9.16602 9.76002 9.16602 9.36719 9.16602"
                                  stroke="#09090B"
                                  strokeWidth="1.25"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M9.99203 6.66602H9.99951"
                                  stroke="#09090B"
                                  strokeWidth="1.66667"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              {refundStatusLabel}
                              {displayRateDetails?.policyAmountFormatted && (
                                <span className="refund-amount d-inline-flex align-items-center">
                                  {" ( "}
                                  <span
                                    className="currency-icon"
                                    aria-hidden="true"
                                    dangerouslySetInnerHTML={{
                                      __html: buildCurrencySvgMarkup("#09090b"),
                                    }}
                                    style={{ display: "inline-flex" }}
                                  />{" "}
                                  {` ${displayRateDetails.policyAmountFormatted})`}
                                </span>
                              )}
                            </div>
                            {displayRateDetails ? (
                              <span className="refund-valid-date">
                                {refundDateLabel}
                              </span>
                            ) : null}
                          </div> */}
                            </div>
                            <div className="room-vertical-separetion"></div>
                            <div className="room-card-details-right">
                              <div className="hotel-room-more-details">
                                <a
                                  className="hotel-more-details-link d-inline-flex align-items-center"
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleOpenModal(room);
                                  }}
                                >
                                  {t("actions.moreDetails")}
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M7.50004 5L12.5 10L7.5 15"
                                      stroke="#3E5B96"
                                      strokeWidth="1.25"
                                      strokeMiterlimit="16"
                                    />
                                  </svg>
                                </a>
                              </div>
                              <div className="price-info">
                                <span className="total-price d-inline-flex align-items-center gap-1">
                                  {displayRateDetails ? (
                                    <>
                                      <span
                                        className="currency-icon"
                                        aria-hidden="true"
                                        dangerouslySetInnerHTML={{
                                          __html:
                                            buildCurrencySvgMarkup("#09090b"),
                                        }}
                                        style={{ display: "inline-flex" }}
                                      />{" "}
                                      {displayRateDetails.formattedPrice}
                                    </>
                                  ) : (
                                    t("placeholders.priceUnavailable")
                                  )}
                                </span>
                                {displayRateDetails?.rate.boardName && (
                                  <div className="hotel-room-number">
                                    {displayRateDetails.rate.boardName}
                                  </div>
                                )}
                              </div>
                              <div className="total-taxes-fees d-flex align-items-center justify-content-between">
                                <div className="taxes-fees d-flex align-items-center">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M3.33398 9.33398L5.66732 11.6673L12.6673 4.33398"
                                      stroke="#00C950"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  {t("labels.totalWithTaxesAndFees")}
                                </div>
                              </div>
                              <div className="hotel-room-booking-action">
                                <div className="select-room">
                                  <button
                                    className="see-all-room-types-btn"
                                    onClick={() =>
                                      setOpenRoomTypeAccordion(
                                        openRoomTypeAccordion === room.roomCode
                                          ? null
                                          : room.roomCode
                                      )
                                    }
                                  >
                                    {t("labels.seeAllRooms")}
                                    <svg
                                      width="20"
                                      height="20"
                                      viewBox="0 0 20 20"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      style={{
                                        transform:
                                          openRoomTypeAccordion ===
                                            room.roomCode
                                            ? "rotate(180deg)"
                                            : "rotate(0deg)",
                                        transition: "transform 0.3s ease",
                                      }}
                                    >
                                      <path
                                        d="M5 7.5L10 12.5L15 7.5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Room Types Accordion */}
                          {openRoomTypeAccordion === room.roomCode && (
                            <div className="room-card-more-details">
                              {room.rates && room.rates.length > 0 ? (
                                (() => {
                                  // Get unique rates based on rateKey
                                  const uniqueRates = room.rates.reduce(
                                    (acc: ProcessedRate[], rate) => {
                                      const isDuplicate = acc.some(
                                        (r) => r.rateKey === rate.rateKey
                                      );
                                      if (!isDuplicate) {
                                        acc.push(rate);
                                      }
                                      return acc;
                                    },
                                    []
                                  );

                                  return uniqueRates.map((rate, rateIndex) => {
                                    const rateKey = `${room.roomCode}_${rate.rateKey}`;
                                    const selectedCount =
                                      selectedRoomCounts[rateKey] || 0;
                                    const maxAvailable =
                                      getAvailableRoomOptionsForRate(
                                        room.roomCode,
                                        rate.rateKey,
                                        rate.allotment || 0
                                      );
                                    const isDisabled = isRoomRateDisabled(
                                      room.roomCode,
                                      rate.rateKey,
                                      rate.allotment || 0
                                    );

                                    // Get cancellation details for this specific rate
                                    const rateCancellationDetails =
                                      getRateCancellationDetails(rate);
                                    // const rateRefundStatusLabel =
                                    //   rateCancellationDetails.isFullyRefundable
                                    //     ? t("refund.fullyRefundable")
                                    //     : t("refund.notFullyRefundable");
                                    // const rateRefundDateLabel =
                                    //   rateCancellationDetails.refundDate
                                    //     ? t("refund.beforeDate", {
                                    //       date: rateCancellationDetails.refundDate,
                                    //     })
                                    //     : t("placeholders.refundDateUnavailable");

                                    return (
                                      <React.Fragment
                                        key={`${room.roomCode}-rate-${rateIndex}`}
                                      >
                                        <div className="room-card-more-hotel">
                                          <div className="room-left">
                                            <h3 className="room-title">
                                              {rate.boardName || "N/A"}
                                            </h3>
                                            {selectedCount > 0 && (
                                              <span className="selected-badge">
                                                {selectedCount}{" "}
                                                {selectedCount === 1
                                                  ? "room"
                                                  : "rooms"}{" "}
                                                selected
                                              </span>
                                            )}
                                          </div>
                                          <div className="room-card-more-saperation"></div>
                                          <div className="room-right">
                                            <div className="more-room-refund">
                                              <div className="rooms-card-refund">
                                                <div className="refund-item d-flex align-items-center">
                                                  <div className="refund-status-list">
                                                    {rate.rateClass === "NRF" ||
                                                      !rate.cancellationPolicies ||
                                                      rate.cancellationPolicies
                                                        .length === 0 ? (
                                                      <span className="refund-status-text show-refund-status">
                                                        {t(
                                                          "refund.nonRefundable"
                                                        ) || "Non-refundable"}
                                                      </span>
                                                    ) : (
                                                      <span className="refund-status-text show-refund-status">
                                                        {rateCancellationDetails.refundDate
                                                          ? t(
                                                            "refund.freeCancellationBefore",
                                                            {
                                                              date: rateCancellationDetails.refundDate,
                                                            }
                                                          ) ||
                                                          `Free cancellation before ${rateCancellationDetails.refundDate}`
                                                          : t(
                                                            "refund.nonRefundable"
                                                          ) ||
                                                          "Non-refundable"}
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="room-card-more-saperation"></div>

                                          <div className="room-right">
                                            <div className="more-room-pricing">
                                              <div className="price">
                                                <span
                                                  className="currency-icon"
                                                  aria-hidden="true"
                                                  dangerouslySetInnerHTML={{
                                                    __html:
                                                      buildCurrencySvgMarkup(
                                                        "#09090b"
                                                      ),
                                                  }}
                                                  style={{
                                                    display: "inline-flex",
                                                  }}
                                                />
                                                {priceFormatter.format(
                                                  Number(rate.net ?? 0)
                                                )}
                                              </div>

                                              <a
                                                href="#"
                                                className="price-details"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  const rateKey = `${room.roomCode}_${rate.rateKey}`;
                                                  const selectedCount =
                                                    selectedRoomCounts[
                                                    rateKey
                                                    ] || 1;
                                                  handleOpenPriceDetailsModal(
                                                    rate,
                                                    room.name ||
                                                    room.description ||
                                                    "Room",
                                                    selectedCount
                                                  );
                                                }}
                                              >
                                                {t("labels.priceDetails")}
                                              </a>

                                              <div className="rate-selection-controls">
                                                {/* {isDisabled &&
                                                  selectedCount === 0 && (
                                                    <span className="max-rooms-message">
                                                      Max {totalRoomCount}{" "}
                                                      {totalRoomCount === 1
                                                        ? "room"
                                                        : "rooms"}{" "}
                                                      reached
                                                    </span>
                                                  )} */}

                                                <label className="room-count-label">
                                                  {t("labels.selectRooms")}:
                                                  <select
                                                    value={selectedCount}
                                                    onChange={(e) => {
                                                      handleRoomRateCountChange(
                                                        room.roomCode,
                                                        rate.rateKey,
                                                        Number(e.target.value)
                                                      );
                                                    }}
                                                    disabled={isDisabled}
                                                    className="room-count-select"
                                                  >
                                                    <option value="0">0</option>
                                                    {Array.from(
                                                      { length: maxAvailable },
                                                      (_, i) => i + 1
                                                    ).map((num) => (
                                                      <option
                                                        key={num}
                                                        value={num}
                                                      >
                                                        {num}
                                                      </option>
                                                    ))}
                                                  </select>
                                                </label>
                                              </div>

                                              {selectedCount > 0 && (
                                                <>
                                                  <div className="mobile-room-booking-summary">
                                                    <div className="mobile-summary-item">
                                                      <span className="mobile-summary-label">
                                                        {totalSelectedRooms}{" "}
                                                        {totalSelectedRooms ===
                                                          1
                                                          ? t("labels.room")
                                                          : t(
                                                            "labels.rooms"
                                                          )}{" "}
                                                        {t("labels.for")}{" "}
                                                        {(() => {
                                                          if (
                                                            !searchFilters.checkInDate ||
                                                            !searchFilters.checkOutDate
                                                          ) {
                                                            return "";
                                                          }
                                                          const checkIn =
                                                            new Date(
                                                              searchFilters.checkInDate
                                                            );
                                                          const checkOut =
                                                            new Date(
                                                              searchFilters.checkOutDate
                                                            );
                                                          const nights =
                                                            Math.ceil(
                                                              (checkOut.getTime() -
                                                                checkIn.getTime()) /
                                                              (1000 *
                                                                60 *
                                                                60 *
                                                                24)
                                                            );
                                                          return `${nights} ${nights === 1
                                                            ? t(
                                                              "labels.night"
                                                            )
                                                            : t(
                                                              "labels.nights"
                                                            )
                                                            }`;
                                                        })()}
                                                      </span>
                                                      <span className="mobile-summary-value">
                                                        <span
                                                          className="currency-icon"
                                                          aria-hidden="true"
                                                          dangerouslySetInnerHTML={{
                                                            __html:
                                                              buildCurrencySvgMarkup(
                                                                "#09090b"
                                                              ),
                                                          }}
                                                          style={{
                                                            display:
                                                              "inline-flex",
                                                          }}
                                                        />
                                                        {priceFormatter.format(
                                                          bookingSummary.totalPrice
                                                        )}
                                                      </span>
                                                    </div>
                                                    <div className="mobile-summary-item mobile-summary-subtotal">
                                                      <span className="mobile-summary-label">
                                                        {t("labels.subtotal")}
                                                      </span>
                                                      <span className="mobile-summary-value">
                                                        <span
                                                          className="currency-icon"
                                                          aria-hidden="true"
                                                          dangerouslySetInnerHTML={{
                                                            __html:
                                                              buildCurrencySvgMarkup(
                                                                "#09090b"
                                                              ),
                                                          }}
                                                          style={{
                                                            display:
                                                              "inline-flex",
                                                          }}
                                                        />
                                                        {priceFormatter.format(
                                                          bookingSummary.subtotal
                                                        )}
                                                      </span>
                                                    </div>
                                                    <button
                                                      type="button"
                                                      className="button-primary room-booking-btn mobile-room-book-button"
                                                      onClick={
                                                        handleBookNowClick
                                                      }
                                                    >
                                                      {t("actions.bookNow")}
                                                    </button>
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        {rateIndex < uniqueRates.length - 1 && (
                                          <div className="more-room-card-deparetion"></div>
                                        )}
                                      </React.Fragment>
                                    );
                                  });
                                })()
                              ) : (
                                <div className="no-rates-available">
                                  {t("placeholders.noRatesAvailable")}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {processedRooms.length > 0 && (
                  <div className="hotel-detail-room-booking">
                    <div className="hotel-subtotal">
                      <ul>
                        <li>
                          <span className="label">
                            {bookingSummary.totalRooms}{" "}
                            {bookingSummary.totalRooms === 1
                              ? t("labels.room")
                              : t("labels.rooms")}{" "}
                            {t("labels.for")}{" "}
                            {(() => {
                              if (
                                !searchFilters.checkInDate ||
                                !searchFilters.checkOutDate
                              ) {
                                return "";
                              }
                              const checkIn = new Date(
                                searchFilters.checkInDate
                              );
                              const checkOut = new Date(
                                searchFilters.checkOutDate
                              );
                              const nights = Math.ceil(
                                (checkOut.getTime() - checkIn.getTime()) /
                                (1000 * 60 * 60 * 24)
                              );
                              return `${nights} ${nights === 1
                                ? t("labels.night")
                                : t("labels.nights")
                                }`;
                            })()}
                          </span>
                          <span className="value">
                            <span
                              className="currency-icon"
                              aria-hidden="true"
                              dangerouslySetInnerHTML={{
                                __html: buildCurrencySvgMarkup("#09090b"),
                              }}
                              style={{ display: "inline-flex" }}
                            />
                            {priceFormatter.format(bookingSummary.totalPrice)}
                          </span>
                        </li>
                        <li className="total">
                          <span className="label">{t("labels.subtotal")}</span>
                          <span className="value">
                            <span
                              className="currency-icon"
                              aria-hidden="true"
                              dangerouslySetInnerHTML={{
                                __html: buildCurrencySvgMarkup("#09090b"),
                              }}
                              style={{ display: "inline-flex" }}
                            />
                            {priceFormatter.format(bookingSummary.subtotal)}
                          </span>
                        </li>
                      </ul>

                      <div className="room-book-button">
                        <button
                          className="button-primary room-booking-btn"
                          onClick={handleBookNowClick}
                        >
                          {t("actions.bookNow")}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Amenities */}
            <section
              id="amenities"
              className="hotel-tab-section amenities-tab-content"
            >
              <h2 className="hotel-section-title">
                {t("sections.amenitiesTitle")}
              </h2>
              <div className="amenity-groups-container">
                <div
                  className="amenity-masonry-container"
                  style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}
                >
                  {(() => {
                    // 1. Build Data Chunks with approximate weights
                    type ChunkData = { codes: number[]; weight: number };
                    const chunks: ChunkData[] = [];
                    let i = 0;

                    while (i < sortedGroupCodes.length) {
                      const groupCode = sortedGroupCodes[i];
                      const amenitiesInGroup = groupedAmenities[groupCode];
                      const isSmallGroup = amenitiesInGroup.length < 2;

                      if (isSmallGroup && i + 1 < sortedGroupCodes.length) {
                        const nextGroupCode = sortedGroupCodes[i + 1];
                        const nextAmenities = groupedAmenities[nextGroupCode];
                        const nextIsSmall = nextAmenities.length < 2;

                        if (nextIsSmall) {
                          // Pair
                          const weight =
                            4 +
                            Math.max(
                              amenitiesInGroup.length,
                              nextAmenities.length
                            );
                          chunks.push({
                            codes: [groupCode, nextGroupCode],
                            weight,
                          });
                          i += 2;
                          continue;
                        }
                      }

                      // Single
                      const weight = 4 + amenitiesInGroup.length;
                      chunks.push({ codes: [groupCode], weight });
                      i++;
                    }

                    // 2. Distribute chunks to balance column heights
                    const leftCol: ChunkData[] = [];
                    const rightCol: ChunkData[] = [];
                    let leftDistHeight = 0;
                    let rightDistHeight = 0;

                    chunks.forEach((chunk) => {
                      if (leftDistHeight <= rightDistHeight) {
                        leftCol.push(chunk);
                        leftDistHeight += chunk.weight;
                      } else {
                        rightCol.push(chunk);
                        rightDistHeight += chunk.weight;
                      }
                    });

                    // 3. Render Helper
                    const renderChunk = (chunk: ChunkData) => {
                      const isPair = chunk.codes.length > 1;

                      if (isPair) {
                        return (
                          <div
                            key={`pair-${chunk.codes.join("-")}`}
                            style={{ display: "flex", gap: "10px" }}
                          >
                            {chunk.codes.map((code) => (
                              <div
                                key={code}
                                className="amenity-group-card"
                                style={{ flex: "1 1 0", minWidth: 0 }}
                              >
                                <h3 className="amenity-group-header">
                                  <span className="title-text">
                                    {FACILITY_GROUP_TITLES[code] ||
                                      t("sections.facilityGroups.others")}
                                    {/* <span className="group-id-inline">
                                      {" "}
                                      ({t("sections.groupLabel", { code })})
                                    </span> */}
                                  </span>
                                </h3>
                                <div
                                  className="amenity-list-grid"
                                  style={{ gridTemplateColumns: "1fr" }}
                                >
                                  {groupedAmenities[code].map((facility) => (
                                    <div
                                      key={`${facility.facilityGroupCode}-${facility.facilityCode}-${facility.description.content}`}
                                      className="amenity-item-box d-flex align-items-center"
                                    >
                                      <AmenityIcon
                                        facilityCode={facility.facilityCode}
                                      />
                                      <span className="facility-name">
                                        {facility.description.content}
                                        {(facility.indFee ||
                                          (facility as { hasFee?: boolean }).hasFee) && (
                                            <span className="extra-charge-badge">
                                              Extra Charge
                                            </span>
                                          )}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      }

                      // Single Rendering
                      const groupCode = chunk.codes[0];
                      const amenitiesInGroup = groupedAmenities[groupCode];
                      const isSmallGroup = amenitiesInGroup.length < 2;

                      return (
                        <div
                          key={groupCode}
                          className="amenity-group-card"
                          style={{ width: "100%" }}
                        >
                          <h3 className="amenity-group-header">
                            <span className="title-text">
                              {FACILITY_GROUP_TITLES[groupCode] ||
                                t("sections.facilityGroups.others")}
                              {/* <span className="group-id-inline">
                                {" "}
                                ({t("sections.groupLabel", { code: groupCode })})
                              </span> */}
                            </span>
                          </h3>
                          <div
                            className="amenity-list-grid"
                            style={
                              isSmallGroup
                                ? { gridTemplateColumns: "1fr" }
                                : undefined
                            }
                          >
                            {amenitiesInGroup.map((facility) => (
                              <div
                                key={`${facility.facilityGroupCode}-${facility.facilityCode}-${facility.description.content}`}
                                className="amenity-item-box d-flex align-items-center"
                              >
                                <AmenityIcon
                                  facilityCode={facility.facilityCode}
                                />
                                <span className="facility-name">
                                  {facility.description.content}
                                  {(facility.indFee ||
                                    (facility as { hasFee?: boolean })
                                      .hasFee) && (
                                      <span className="extra-charge-badge">
                                        Extra Charge
                                      </span>
                                    )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    };

                    return (
                      <>
                        <div
                          style={{
                            flex: "1",
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                          }}
                        >
                          {leftCol.map(renderChunk)}
                        </div>
                        <div
                          style={{
                            flex: "1",
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                          }}
                        >
                          {rightCol.map(renderChunk)}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </section>

            {/* Amenities Section */}
            {/* <section id="amenities" className="hotel-tab-section amenities-tab-content">
              <h2 className="hotel-section-title">Hotel &amp; Room Amenities</h2>
              <div className="amenity-groups-container">

                <div className="amenity-row">
                  <div className="amenity-group-card">
                    <h3 className="amenity-group-header">
                      <span className="title-text">Room Facilities <span className="group-id-inline">(Group 60)</span></span>
                    </h3>
                    <div className="amenity-list-grid">
                      <div className="amenity-item-box d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>
                        <span className="facility-name">Air conditioning</span>
                      </div>
                      <div className="amenity-item-box d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 4 8 6" /><path d="M17 19v2" /><path d="M2 12h20" /><path d="M7 19v2" /><path d="M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" /></svg>
                        <span className="facility-name">Balcony</span>
                      </div>
                      <div className="amenity-item-box d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.62 1.96V20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5.42a2 2 0 0 0-1.62-1.96Z" /><path d="M12 2v20" /><path d="M2 12h20" /><path d="M7 7h10" /><path d="M7 17h10" /></svg>
                        <span className="facility-name">Towels and bed linen</span>
                      </div>
                      <div className="amenity-item-box d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18h8" /><path d="M10 22h4" /><path d="M3 10V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5" /><path d="M3 10c0 1.1.9 2 2 2h14a2 2 0 0 1 2-2" /><path d="M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6" /></svg>
                        <span className="facility-name">Room service <span className="extra-charge-badge">Extra Charge</span></span>
                      </div>
                      <div className="amenity-item-box d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        <span className="facility-name">Safe</span>
                      </div>
                      <div className="amenity-item-box d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
                        <span className="facility-name">Photocopier</span>
                      </div>
                    </div>
                  </div>
                  <div className="amenity-group-card">
                    <h3 className="amenity-group-header">
                      <span className="title-text">Hotel Facilities <span className="group-id-inline">(Group 70)</span></span>
                    </h3>
                    <div className="amenity-list-grid" >
                      <div className="amenity-item-box d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
                        <span className="facility-name">Non-smoking establishment</span>
                      </div>
                      <div className="amenity-item-box d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1s2.5-.5 2.5-1 1.2-1 2.5-1 2.5.5 2.5 1 1.2 1 2.5 1 2.5-.5 2.5-1 1.2-1 2.5-1 2.5.5 2.5 1" /><path d="M2 12c.6.5 1.2 1 2.5 1s2.5-.5 2.5-1 1.2-1 2.5-1 2.5.5 2.5 1 1.2 1 2.5 1 2.5-.5 2.5-1 1.2-1 2.5-1 2.5.5 2.5 1" /><path d="M2 18c.6.5 1.2 1 2.5 1s2.5-.5 2.5-1 1.2-1 2.5-1 2.5.5 2.5 1 1.2 1 2.5 1 2.5-.5 2.5-1 1.2-1 2.5-1 2.5.5 2.5 1" /></svg>
                        <span className="facility-name">Outdoor freshwater pool</span>
                      </div>
                      <div className="amenity-item-box d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4" /><path d="M7 20V4" /><path d="m21 8-4-4-4 4" /><path d="M17 4v16" /></svg>
                        <span className="facility-name">Lifts</span>
                      </div>
                      <div className="amenity-item-box d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        <span className="facility-name">Indoor freshwater pool</span>
                      </div>
                      <div className="amenity-item-box d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="5"></circle><path d="M12 8V5"></path><rect x="3" y="5" width="18" height="16" rx="2"></rect></svg>
                        <span className="facility-name">Laundry service <span className="extra-charge-badge">Extra Charge</span></span>
                      </div>
                      <div className="amenity-item-box d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 18V9c0-1.7 1.3-3 3-3h10c1.7 0 3 1.3 3 3v9" /><path d="M2 18h20" /><path d="M12 9v9" /></svg>
                        <span className="facility-name">Sun loungers <span className="extra-charge-badge">Extra Charge</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="amenity-row">
                  <div className="amenity-group-card">
                    <h3 className="amenity-group-header">
                      <span className="title-text">Catering / Dining <span className="group-id-inline">(Group 10)</span></span>
                    </h3>
                    <div className="amenity-list-grid" >
                      <div className="amenity-item-box d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>
                        <span className="facility-name">Breakfast buffet</span>
                      </div>

                      <div className="amenity-item-box d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" /></svg>
                        <span className="facility-name">Coffee shop</span>
                      </div>
                    </div>
                  </div>
                  <div className="amenity-row" >
                    <div className="amenity-group-card">
                      <h3 className="amenity-group-header">
                        <span className="title-text">Health &amp; Beauty <span className="group-id-inline">(Group 20)</span></span>
                      </h3>
                      <div className="amenity-list-grid">
                        <div className="amenity-item-box d-flex align-items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5" /><path d="M12 13v8" /><path d="M12 13a5 5 0 0 1 5 5" /><path d="M12 13a5 5 0 0 0-5 5" /></svg>
                          <span className="facility-name">Babysitting service <span className="extra-charge-badge">Extra Charge</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="amenity-group-card" style={{ width: '100%' }}>
                      <h3 className="amenity-group-header">
                        <span className="title-text">Family &amp; Children <span className="group-id-inline">(Group 50)</span></span>
                      </h3>
                      <div className="amenity-list-grid">
                        <div className="amenity-item-box d-flex align-items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1s2.5-.5 2.5-1 1.2-1 2.5-1 2.5.5 2.5 1 1.2 1 2.5 1 2.5-.5 2.5-1 1.2-1 2.5-1 2.5.5 2.5 1" /><path d="M2 12c.6.5 1.2 1 2.5 1s2.5-.5 2.5-1 1.2-1 2.5-1 2.5.5 2.5 1 1.2 1 2.5 1 2.5-.5 2.5-1 1.2-1 2.5-1 2.5.5 2.5 1" /><path d="M2 18c.6.5 1.2 1 2.5 1s2.5-.5 2.5-1 1.2-1 2.5-1 2.5.5 2.5 1 1.2 1 2.5 1 2.5-.5 2.5-1 1.2-1 2.5-1 2.5.5 2.5 1" /></svg>
                          <span className="facility-name">Children's pool</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="amenity-row">
                  <div className="amenity-row">
                    <div className="amenity-group-card">
                      <h3 className="amenity-group-header">
                        <span className="title-text">Technology <span className="group-id-inline">(Group 130)</span></span>
                      </h3>
                      <div className="amenity-list-grid">
                        <div className="amenity-item-box d-flex align-items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>
                          <span className="facility-name">Wired internet <span className="extra-charge-badge">Extra Charge</span></span>
                        </div>
                        <div className="amenity-item-box d-flex align-items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="4" r="1" /><path d="m18 19 1-7-6 1" /><path d="m5 8 3-3 5.5 2-2.36 1.89" /><path d="M9 17c0 1.1.9 2 2 2s2-.9 2-2" /><path d="M13 13c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4" /></svg>
                          <span className="facility-name">Wheelchair accessible</span>
                        </div>
                      </div>
                    </div>
                    <div className="amenity-group-card">
                      <h3 className="amenity-group-header">
                        <span className="title-text">Accessibility <span className="group-id-inline">(Group 120)</span></span>
                      </h3>
                      <div className="amenity-list-grid">
                        <div className="amenity-item-box d-flex align-items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>
                          <span className="facility-name">Wi-Fi <span className="extra-charge-badge">Extra Charge</span></span>
                        </div>
                        <div className="amenity-item-box d-flex align-items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 13v-3.5a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5V13" /><path d="M12 8v5" /></svg>
                          <span className="facility-name">Accessible parking</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="amenity-row">


                    <div className="amenity-group-card">
                      <h3 className="amenity-group-header">
                        <span className="title-text">Business <span className="group-id-inline">(Group 40)</span></span>
                      </h3>
                      <div className="amenity-list-grid">
                        <div className="amenity-item-box d-flex align-items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                          <span className="facility-name">Business centre <span className="extra-charge-badge">Extra Charge</span></span>
                        </div>
                        <div className="amenity-item-box d-flex align-items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                          <span className="facility-name">Conference hostess</span>
                        </div>
                      </div>
                    </div>
                    <div className="amenity-group-card">
                      <h3 className="amenity-group-header">
                        <span className="title-text">Extra Services <span className="group-id-inline">(Group 190)</span></span>
                      </h3>
                      <div className="amenity-list-grid">
                        <div className="amenity-item-box d-flex align-items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7h2" /><circle cx="7" cy="17" r="3" /><circle cx="17" cy="17" r="3" /></svg>
                          <span className="facility-name">Car park</span>
                        </div>
                        <div className="amenity-item-box d-flex align-items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e5b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7h2" /><circle cx="7" cy="17" r="3" /><circle cx="17" cy="17" r="3" /></svg>
                          <span className="facility-name">Transfer service <span className="extra-charge-badge">Extra Charge</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section> */}

            {/* Reviews */}
            {/* <section id="reviews" className="hotel-review-section">
              <h2 className="hotel-section-title">Reviews</h2>
              <ReviewSlider slidesToShowDesktop={2} />
            </section> */}

            {/* Other Information & Policies Section */}
            {/* <section id="hotel-policies" className="hotel-tab-section policies-tab-content">
              <div className="policies-container">
                <div className="policies-header">
                  Other Information &amp; Policies (Essential Trip Information)
                </div>
                <div className="policies-body">
                  <div className="policy-column">
                    <h4 className="column-title">Timing &amp; Fees Policies</h4>
                    <ul className="policy-list">
                      <li>Check in hour 15:00 - Check-out hour 12:00 PM.</li>
                      <li>Deposit on arrival is required.</li>
                      <li>Tourism Tax (MYR10 per room/night) payable at hotel.</li>
                      <li>Estimated taxes &amp; fees: $2.00 MYR.</li>
                    </ul>
                  </div>
                  <div className="policy-column">
                    <h4 className="column-title">Room Rules &amp; Notes</h4>
                    <ul className="policy-list">
                      <li>Upper bunk bed weight limit 80kg.</li>
                      <li>Do not move mattress.</li>
                    </ul>
                  </div>
                  <div className="policy-column">
                    <h4 className="column-title">General Hotel Policies</h4>
                    <ul className="policy-list">
                      <li>Non-smoking establishment.</li>
                      <li>Pets are not allowed.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section> */}

            {/* Map */}
            <section id="map" className="hotel-map-section">
              <h2 className="hotel-section-title">{t("sections.mapTitle")}</h2>
              <div className="map-container">
                {canRenderInteractiveMap ? (
                  <HotelLocationMap
                    latitude={hotelLatitude as number}
                    longitude={hotelLongitude as number}
                    hotelName={hotelData?.name?.content}
                  />
                ) : (
                  <Image
                    src={mapImage}
                    width={1200}
                    height={344}
                    alt={t("alts.map")}
                  />
                )}
              </div>
            </section>
            <section className="nearby-hotel-section">
              <h2 className="hotel-section-title">
                {t("sections.similarHotelsTitle")}
              </h2>
              <div className="near-hotel-container">
                <NearByHotels currentHotelCode={hotelData?.code} />
              </div>
            </section>
            <section className="hotel-faq-section">
              <div className="faq-container">
                <FaqSection />
              </div>
            </section>
          </>
        )}
      </div>
      {isModalOpen && selectedRoom && (
        <div className="room-modal-overlay" onClick={handleCloseModal}>
          <div className="room-modal" onClick={(e) => e.stopPropagation()}>
            <div className="room-modal-header d-flex align-items-center">
              <button
                className="room-modal-close p-0"
                onClick={handleCloseModal}
              >
                <Image
                  src={ClosePopupIcon}
                  width={24}
                  height={24}
                  alt="close icon"
                />
              </button>
              <h2 className="room-modal-title">
                {t("modal.roomInformationTitle")}
              </h2>
            </div>

            <div className="room-modal-body">
              <div className="room-modal-content">
                <div className="room-modal-images">
                  {selectedRoom.images.length > 0 ? (
                    <>
                      <Slider
                        ref={modalSliderRef}
                        {...{
                          dots: false,
                          infinite: selectedRoom.images.length > 1,
                          speed: 500,
                          slidesToShow: 1,
                          slidesToScroll: 1,
                          arrows: false,
                        }}
                      >
                        {selectedRoom.images.map((image, imgIndex) => (
                          <div key={imgIndex}>
                            <Image
                              src={image.fullUrl}
                              width={742}
                              height={362}
                              alt={selectedRoomDisplayName}
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "362px",
                              }}
                            />
                          </div>
                        ))}
                      </Slider>
                      {selectedRoom.images.length > 1 && (
                        <div className="hotel-image-action d-flex align-items-center justify-content-between">
                          <button
                            className="hotel-img-btn border-0 p-0 bg-transparent"
                            onClick={() => modalSliderRef.current?.slickPrev()}
                          >
                            <Image
                              src={HotelImgPrevIcon}
                              width={48}
                              height={48}
                              alt="Previous"
                              className="arrow-icon"
                            />
                          </button>
                          <button
                            className="hotel-img-btn border-0 p-0 bg-transparent"
                            onClick={() => modalSliderRef.current?.slickNext()}
                          >
                            <Image
                              src={HotelImgNextIcon}
                              width={48}
                              height={48}
                              alt="Next"
                              className="arrow-icon"
                            />
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <Image
                      src={RoomInfoImage}
                      width={742}
                      height={362}
                      alt={t("alts.roomPlaceholder")}
                    />
                  )}
                </div>
                <div className="modal-room-name-with-review">
                  <h3 className="modal-room-title">
                    {selectedRoomDisplayName}
                  </h3>
                  {/* <div className="modal-room-rating d-flex align-items-center">
                    <div className="modal-room-rating-star d-flex align-items-center">
                      <Image
                        src={starFillIcon}
                        width={16}
                        height={16}
                        alt="star"
                        className="hotel-rating-icon"
                      />
                      <Image
                        src={starFillIcon}
                        width={16}
                        height={16}
                        alt="star"
                        className="hotel-rating-icon"
                      />
                      <Image
                        src={starFillIcon}
                        width={16}
                        height={16}
                        alt="star"
                        className="hotel-rating-icon"
                      />
                      <Image
                        src={starFillIcon}
                        width={16}
                        height={16}
                        alt="star"
                        className="hotel-rating-icon"
                      />
                      <Image
                        src={starFillIcon}
                        width={16}
                        height={16}
                        alt="star"
                        className="hotel-rating-icon"
                      />
                    </div>
                    <span className="rating-value-wrapper d-flex align-items-center">
                      <span className="rating-value">4.5</span> (120 Reviews)
                    </span>
                  </div> */}
                </div>
                <div className="modal-room-facility-list">
                  {selectedRoomFacilities.length > 0 ? (
                    <>
                      {/* Free Amenities */}
                      {selectedRoomFacilities.some((f) => !f.hasFee) && (
                        <div className="amenities-group mb-4">
                          <h3
                            className="amenities-group-title mb-3"
                            style={{
                              fontSize: "16px",
                              fontWeight: "600",
                              color: "#1B2236",
                            }}
                          >
                            {t("sections.freeAmenities")}
                          </h3>
                          <ul className="facility-item d-grid">
                            {selectedRoomFacilities
                              .filter((f) => !f.hasFee)
                              .map((facility) => (
                                <li
                                  key={`${selectedRoom.roomCode}-${facility.groupCode}-${facility.code}`}
                                >
                                  <AmenityIcon facilityCode={facility.code} />
                                  {facility.description ||
                                    t("placeholders.facilityFallback", {
                                      code: facility.code,
                                    })}
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}

                      {/* Paid Amenities */}
                      {selectedRoomFacilities.some((f) => f.hasFee) && (
                        <div className="amenities-group mb-0">
                          <h3
                            className="amenities-group-title mb-3"
                            style={{
                              fontSize: "16px",
                              fontWeight: "600",
                              color: "#1B2236",
                            }}
                          >
                            {t("sections.paidAmenities")}
                          </h3>
                          <ul className="facility-item d-grid">
                            {selectedRoomFacilities
                              .filter((f) => f.hasFee)
                              .map((facility) => (
                                <li
                                  key={`${selectedRoom.roomCode}-${facility.groupCode}-${facility.code}`}
                                >
                                  <AmenityIcon facilityCode={facility.code} />
                                  {facility.description ||
                                    t("placeholders.facilityFallback", {
                                      code: facility.code,
                                    })}
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="facility-item no-facilities">
                      {t("placeholders.noFacilityInfo")}
                    </p>
                  )}
                </div>
                {/* <div className="modal-room-policies-list">
                  <ul className="policies-item d-flex">
                    <li>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.16602 11.666L7.08268 14.5827L15.8327 5.41602"
                          stroke="#27272A"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Reserve now, pay later
                    </li>
                    <li>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.16602 11.666L7.08268 14.5827L15.8327 5.41602"
                          stroke="#27272A"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Free welcome drink
                    </li>
                  </ul>
                </div> */}
                <div className="modal-room-specs-list">
                  <ul className="card-specs-item d-flex align-items-center">
                    <li>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.66602 15.8327V10.8327C1.66602 10.4577 1.7424 10.1174 1.89518 9.81185C2.04796 9.50629 2.24935 9.23546 2.49935 8.99935V6.66602C2.49935 5.97157 2.7424 5.38129 3.22852 4.89518C3.71463 4.40907 4.3049 4.16602 4.99935 4.16602H8.33268C8.65213 4.16602 8.95074 4.22518 9.22852 4.34352C9.50629 4.46185 9.76324 4.6249 9.99935 4.83268C10.2355 4.62435 10.4924 4.46129 10.7702 4.34352C11.048 4.22574 11.3466 4.16657 11.666 4.16602H14.9993C15.6938 4.16602 16.2841 4.40907 16.7702 4.89518C17.2563 5.38129 17.4993 5.97157 17.4993 6.66602V8.99935C17.7493 9.23546 17.9507 9.50629 18.1035 9.81185C18.2563 10.1174 18.3327 10.4577 18.3327 10.8327V15.8327H16.666V14.166H3.33268V15.8327H1.66602ZM10.8327 8.33268H15.8327V6.66602C15.8327 6.4299 15.7527 6.23213 15.5927 6.07268C15.4327 5.91324 15.2349 5.83324 14.9993 5.83268H11.666C11.4299 5.83268 11.2321 5.91268 11.0727 6.07268C10.9132 6.23268 10.8332 6.43046 10.8327 6.66602V8.33268ZM4.16602 8.33268H9.16602V6.66602C9.16602 6.4299 9.08602 6.23213 8.92602 6.07268C8.76602 5.91324 8.56824 5.83324 8.33268 5.83268H4.99935C4.76324 5.83268 4.56546 5.91268 4.40602 6.07268C4.24657 6.23268 4.16657 6.43046 4.16602 6.66602V8.33268ZM3.33268 12.4993H16.666V10.8327C16.666 10.5966 16.586 10.3988 16.426 10.2393C16.266 10.0799 16.0682 9.9999 15.8327 9.99935H4.16602C3.9299 9.99935 3.73213 10.0793 3.57268 10.2393C3.41324 10.3993 3.33324 10.5971 3.33268 10.8327V12.4993Z"
                          fill="#27272A"
                        />
                      </svg>
                      {selectedRoomBedDescription ??
                        t("placeholders.bedInfoUnavailable")}
                    </li>

                    <li>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.3117 15C17.9361 15 18.4328 14.6071 18.8787 14.0576C19.7916 12.9329 18.2928 12.034 17.7211 11.5938C17.14 11.1463 16.4912 10.8928 15.8333 10.8333M15 9.16667C16.1506 9.16667 17.0833 8.23393 17.0833 7.08333C17.0833 5.93274 16.1506 5 15 5"
                          stroke="#27272A"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                        />
                        <path
                          d="M2.68895 15C2.06453 15 1.56787 14.6071 1.12194 14.0576C0.209058 12.9329 1.70788 12.034 2.27952 11.5938C2.86063 11.1463 3.50947 10.8928 4.16732 10.8333M4.58398 9.16667C3.43339 9.16667 2.50065 8.23393 2.50065 7.08333C2.50065 5.93274 3.43339 5 4.58398 5"
                          stroke="#27272A"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                        />
                        <path
                          d="M6.73715 12.594C5.88567 13.1205 3.65314 14.1955 5.0129 15.5408C5.67713 16.198 6.41692 16.668 7.34701 16.668H12.6543C13.5844 16.668 14.3242 16.198 14.9884 15.5408C16.3482 14.1955 14.1156 13.1205 13.2641 12.594C11.2674 11.3593 8.73387 11.3593 6.73715 12.594Z"
                          stroke="#27272A"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.9173 6.25065C12.9173 7.86148 11.6115 9.16732 10.0007 9.16732C8.38982 9.16732 7.08398 7.86148 7.08398 6.25065C7.08398 4.63982 8.38982 3.33398 10.0007 3.33398C11.6115 3.33398 12.9173 4.63982 12.9173 6.25065Z"
                          stroke="#27272A"
                          strokeWidth="1.25"
                        />
                      </svg>
                      {selectedRoomSleepsLabel}
                    </li>
                  </ul>
                </div>
                {/* <div className="modal-room-review-section">
                  <h2 className="hotel-section-title">Reviews</h2>
                  <ReviewSlider slidesToShowDesktop={2} />
                </div> */}
              </div>
              <div className="modal-room-pricing">
                <div className="modal-room-refund">
                  <div className="refund-item d-flex align-items-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18.3327 10.0007C18.3327 5.39828 14.6017 1.66732 9.99935 1.66732C5.39698 1.66732 1.66602 5.39828 1.66602 10.0007C1.66602 14.603 5.39698 18.334 9.99935 18.334C14.6017 18.334 18.3327 14.603 18.3327 10.0007Z"
                        stroke="#09090B"
                        strokeWidth="1.25"
                      />
                      <path
                        d="M10.2005 14.166V9.99935C10.2005 9.60651 10.2005 9.41009 10.0785 9.28805C9.95644 9.16602 9.76002 9.16602 9.36719 9.16602"
                        stroke="#09090B"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.99203 6.66602H9.99951"
                        stroke="#09090B"
                        strokeWidth="1.66667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {selectedRoomRefundStatus}
                    {selectedRoomRateDetails?.policyAmountFormatted && (
                      <span className="refund-amount d-inline-flex align-items-center">
                        {" ("}
                        <span
                          className="currency-icon"
                          aria-hidden="true"
                          dangerouslySetInnerHTML={{
                            __html: buildCurrencySvgMarkup("#09090b"),
                          }}
                          style={{ display: "inline-flex" }}
                        />{" "}
                        {` ${selectedRoomRateDetails.policyAmountFormatted})`}
                      </span>
                    )}
                  </div>
                  {selectedRoomRateDetails ? (
                    <span className="refund-valid-date">
                      {selectedRoomRefundDateLabel}
                    </span>
                  ) : null}
                </div>
                <div className="modal-room-price-info">
                  {/* <div className="discount-price">
                    <span className="discount">$51 off</span>
                  </div>
                  <span className="nightly-price">$40 nightly</span> */}
                  <span className="total-price d-inline-flex align-items-center gap-1">
                    {selectedRoomRateDetails ? (
                      <>
                        <span
                          className="currency-icon"
                          aria-hidden="true"
                          dangerouslySetInnerHTML={{
                            __html: buildCurrencySvgMarkup("#09090b"),
                          }}
                          style={{ display: "inline-flex" }}
                        />
                        {selectedRoomRateDetails.formattedPrice}
                      </>
                    ) : (
                      t("placeholders.priceUnavailable")
                    )}
                  </span>
                  {selectedRoomRateDetails?.rate.boardName && (
                    <div className="hotel-room-number">
                      {selectedRoomRateDetails.rate.boardName}
                    </div>
                  )}
                </div>
                <div className="total-taxes-fees d-flex align-items-center justify-content-between">
                  <div className="taxes-fees d-flex align-items-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.33398 9.33398L5.66732 11.6673L12.6673 4.33398"
                        stroke="#00C950"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {t("labels.totalWithTaxesAndFees")}
                  </div>
                  {/* <div className="hotel-room-left">We have 5 left</div> */}
                </div>
                {/* <div className="modal-room-booking-action">
                  <button className="button-primary room-booking-btn w-100">
                    {t("actions.bookNow")}
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={handleCloseImageModal}
        hotelImages={hotelData?.images || []}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setPendingAction(null);
        }}
        onLoginSuccess={() => {
          // Handle the pending action after successful login
          if (pendingAction === "favorite") {
            handleFavoriteClick();
            console.log("Logged in, now can favorite");
          } else if (pendingAction === "booking") {
            // Proceed with booking after login
            handleBookNowClick();
            console.log("Logged in, now can book");
          }
          setPendingAction(null);
        }}
        returnUrl={
          pendingAction === "booking"
            ? `/${locale}/booking-review/${hotelId}`
            : pathname || undefined
        }
      />

      {/* Price Details Modal */}
      {isPriceDetailsModalOpen && selectedRateForPriceDetails && (
        <div
          className="room-modal-overlay"
          onClick={handleClosePriceDetailsModal}
        >
          <div
            className="price-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="room-modal-header d-flex align-items-center">
              <button
                className="room-modal-close p-0"
                onClick={handleClosePriceDetailsModal}
              >
                <Image
                  src={ClosePopupIcon}
                  width={24}
                  height={24}
                  alt="close icon"
                />
              </button>
              <h2 className="room-modal-title">{hotelName}</h2>
            </div>

            <div className="price-details-modal-body">
              {(() => {
                const { dates, nights, averagePrice, totalPrice } =
                  calculateDailyPrices();

                return (
                  <>
                    <div className="price-per-night-section">
                      <h3 className="price-section-title">
                        {t("modal.pricePerNight")} ({nights}{" "}
                        {nights === 1 ? t("labels.night") : t("labels.nights")})
                      </h3>
                      <p className="average-price">
                        {t("modal.average")}:{" "}
                        <span className="d-inline-flex align-items-center">
                          <span
                            className="currency-icon"
                            aria-hidden="true"
                            dangerouslySetInnerHTML={{
                              __html: buildCurrencySvgMarkup("#09090b"),
                            }}
                            style={{ display: "inline-flex" }}
                          />
                          {priceFormatter.format(averagePrice)}
                        </span>
                      </p>
                    </div>

                    <div className="daily-prices-grid">
                      {dates.map((dayInfo, index) => (
                        <div key={index} className="daily-price-card">
                          <div className="date-label">
                            {dayInfo.formattedDate}
                          </div>
                          <div className="price-value d-inline-flex align-items-center">
                            <span
                              className="currency-icon"
                              aria-hidden="true"
                              dangerouslySetInnerHTML={{
                                __html: buildCurrencySvgMarkup("#09090b"),
                              }}
                              style={{ display: "inline-flex" }}
                            />
                            {priceFormatter.format(dayInfo.price)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="price-details-section">
                      <h3 className="price-section-title">
                        {t("labels.priceDetails")}
                      </h3>
                      <div className="price-breakdown-item">
                        <span className="breakdown-label">
                          {selectedRateForPriceDetails.count || 1}{" "}
                          {selectedRateForPriceDetails.count !== 1
                            ? t("labels.rooms")
                            : t("labels.room")}{" "}
                          x {selectedRateForPriceDetails.roomName},{" "}
                          {selectedRateForPriceDetails.rate.boardName ||
                            t("labels.roomOnly")}
                        </span>
                        <span className="breakdown-value d-inline-flex align-items-center">
                          <span
                            className="currency-icon"
                            aria-hidden="true"
                            dangerouslySetInnerHTML={{
                              __html: buildCurrencySvgMarkup("#09090b"),
                            }}
                            style={{ display: "inline-flex" }}
                          />
                          {priceFormatter.format(totalPrice)}
                        </span>
                      </div>
                    </div>

                    <div className="total-net-price-section">
                      <div className="total-price-row">
                        <span className="total-label">
                          {t("modal.totalPrice")}
                        </span>
                        <span className="total-value d-inline-flex align-items-center">
                          <span
                            className="currency-icon"
                            aria-hidden="true"
                            dangerouslySetInnerHTML={{
                              __html: buildCurrencySvgMarkup("#09090b"),
                            }}
                            style={{ display: "inline-flex" }}
                          />
                          {priceFormatter.format(totalPrice)}
                        </span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
      <SessionTimeoutModal isOpen={isInactive} />
    </main>
  );
};

export default HotelDetails;
