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
import { buildHotelbedsImageUrl, currencyImage } from "@/constants";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useBookingStore } from "@/store/bookingStore";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<ProcessedRoom | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [processedRooms, setProcessedRooms] = useState<ProcessedRoom[]>([]);
  const [selectedRoomCounts, setSelectedRoomCounts] = useState<{
    [key: string]: number;
  }>({});
  const [selectedRoomRates, setSelectedRoomRates] = useState<{
    [key: string]: string;
  }>({});
  const { hotel: hotelData, loading, fetchHotel } = useHotelDetailsStore();
  const { favorites, addFavorite, removeFavorite, fetchFavorites } =
    useFavoriteStore();
  const { setBookingData } = useBookingStore();

  console.log("hotelData", hotelData);
  console.log("processedRooms", processedRooms);
  const router = useRouter();
  const sliderRefs = useRef<(Slider | null)[]>([]);
  const modalSliderRef = useRef<Slider>(null);
  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;
  const hasRequestedNearbySearch = useRef(false);

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

  // Get total room count from search filters
  const totalRoomCount = searchFilters.rooms?.length || 1;

  // Calculate total selected rooms across all cards
  const totalSelectedRooms = useMemo(() => {
    return Object.values(selectedRoomCounts).reduce(
      (sum, count) => sum + count,
      0
    );
  }, [selectedRoomCounts]);

  // Check if a room card dropdown should be disabled
  const isRoomSelectionDisabled = useCallback(
    (roomCode: string) => {
      const currentSelection = selectedRoomCounts[roomCode] || 0;
      // If this card already has a selection, don't disable it
      if (currentSelection > 0) {
        return false;
      }
      // If total selected rooms equals or exceeds the limit, disable this card
      return totalSelectedRooms >= totalRoomCount;
    },
    [selectedRoomCounts, totalSelectedRooms, totalRoomCount]
  );

  // Get available options for a specific room card
  const getAvailableRoomOptions = useCallback(
    (roomCode: string) => {
      const currentSelection = selectedRoomCounts[roomCode] || 0;
      const remainingSlots =
        totalRoomCount - totalSelectedRooms + currentSelection;
      return Math.min(remainingSlots, totalRoomCount);
    },
    [selectedRoomCounts, totalSelectedRooms, totalRoomCount]
  );

  // Handler for room count selection
  const handleRoomCountChange = (roomCode: string, count: number) => {
    setSelectedRoomCounts((prev) => ({
      ...prev,
      [roomCode]: count,
    }));
  };

  // Handler for room rate selection
  const handleRoomRateChange = (roomCode: string, rateKey: string) => {
    setSelectedRoomRates((prev) => ({
      ...prev,
      [roomCode]: rateKey,
    }));
  };

  // Calculate booking summary
  const bookingSummary = useMemo(() => {
    let totalRooms = 0;
    let totalPrice = 0;
    let currency = "SAR";

    processedRooms.forEach((room) => {
      const roomCount = selectedRoomCounts[room.roomCode] || 0;
      if (roomCount === 0) return;

      // Get the selected or default rate for this room
      const selectedRateKey = selectedRoomRates[room.roomCode];
      let rateToUse = null;

      if (selectedRateKey) {
        rateToUse = room.rates.find((rate) => rate.rateKey === selectedRateKey);
      }

      // If no rate selected, use the primary rate (RO or first)
      if (!rateToUse && room.rates.length > 0) {
        rateToUse =
          room.rates.find(
            (rate) =>
              rate.boardCode?.toUpperCase() === "RO" &&
              rate.boardName?.toUpperCase() === "ROOM ONLY"
          ) || room.rates[0];
      }

      if (rateToUse) {
        totalRooms += roomCount;
        const rateNet = Number(rateToUse.net) || 0;
        totalPrice += rateNet * roomCount;
        currency = rateToUse.currency || "SAR";
      }
    });

    const subtotal = totalPrice;

    return {
      totalRooms,
      totalPrice,
      subtotal,
      currency,
    };
  }, [processedRooms, selectedRoomCounts, selectedRoomRates]);

  // Helper function to map locale to API language code
  const getLanguageCode = (currentLocale: string): string => {
    return currentLocale === "ar" ? "ARA" : "ENG";
  };

  const getSearchLanguageCode = (currentLocale: string): string => {
    return currentLocale === "ar" ? "ara" : "eng";
  };

  const handleCheckAvailability = () => {
    if (hotelId) {
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

      // Store processed rooms in state
      setProcessedRooms(roomsWithDetails);
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

  // Helper functions for hotel images
  const getOrderedHotelImages = () => {
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
  };

  const getMainAndThumbImages = () => {
    const sorted = getOrderedHotelImages();
    if (sorted.length === 0) {
      return {
        main: null as string | null,
        thumbs: [] as string[],
        totalCount: 0,
      };
    }
    const mainPath = sorted[0]?.path;
    const thumbPaths = sorted.slice(1, 5).map((img) => img.path);
    return {
      main: mainPath ? buildHotelbedsImageUrl(mainPath) : null,
      thumbs: thumbPaths.map(buildHotelbedsImageUrl),
      totalCount: sorted.length,
    };
  };

  const handleTabClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    tab: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(tab);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const amenities =
    hotelData?.facilities?.filter(
      (f) =>
        [70, 71, 72, 73, 85, 90].includes(f.facilityGroupCode) &&
        f.indLogic !== false &&
        f.indYesOrNo !== false
    ) || [];

  const displayedAmenities = showAllAmenities
    ? amenities
    : amenities.slice(0, 8);
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
      }),
    [locale]
  );

  const formatCancellationDate = useCallback(
    (dateString: string) => {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) {
        return null;
      }
      return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
        day: "numeric",
        month: "short",
      }).format(date);
    },
    [locale]
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

  // Helper function to get the selected or default rate for a room
  const getDisplayRate = useCallback(
    (room: ProcessedRoom | null | undefined) => {
      if (!room || !room.rates || room.rates.length === 0) {
        return null;
      }

      const selectedRateKey = room.roomCode
        ? selectedRoomRates[room.roomCode]
        : null;

      // If a rate is selected, find it
      if (selectedRateKey) {
        const selectedRate = room.rates.find(
          (rate) => rate.rateKey === selectedRateKey
        );
        if (selectedRate) {
          const net = Number(selectedRate.net ?? 0);
          const cancellationPolicy = selectedRate.cancellationPolicies?.[0];
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
            rate: selectedRate,
            net,
            formattedPrice: priceFormatter.format(net),
            cancellationPolicy,
            refundDate,
            policyAmount,
            policyAmountFormatted:
              policyAmount !== null
                ? priceFormatter.format(policyAmount)
                : null,
            isFullyRefundable,
          };
        }
      }

      // Otherwise, return the primary rate (existing logic)
      return findPrimaryRate(room);
    },
    [selectedRoomRates, priceFormatter, formatCancellationDate, findPrimaryRate]
  );

  const selectedRoomRateDetails = findPrimaryRate(selectedRoom);
  const descriptionContent =
    hotelData?.description?.content || t("description.fallback");
  const hotelName = hotelData?.name?.content || t("placeholders.hotelName");
  const hotelAddress =
    hotelData?.address?.content || t("placeholders.hotelAddress");
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
      setIsLoginModalOpen(true);
    }
  };

  const handleBookNowClick = () => {
    console.log("handleBookNowClick");
    
    // Validate that at least one room is selected
    const hasSelectedRooms = Object.values(selectedRoomCounts).some(count => count > 0);
    
    if (!hasSelectedRooms) {
      toast.error(t("toast.pleaseSelectRoom"));
      return;
    }

    // Prepare booking data from selected rooms
    const selectedRoomsData = processedRooms
      .filter(room => (selectedRoomCounts[room.roomCode] || 0) > 0)
      .map(room => {
        const roomCount = selectedRoomCounts[room.roomCode] || 0;
        const selectedRateKey = selectedRoomRates[room.roomCode];
        
        // Find the selected rate or use the primary rate
        let rateToUse = null;
        if (selectedRateKey) {
          rateToUse = room.rates.find(rate => rate.rateKey === selectedRateKey);
        }
        if (!rateToUse && room.rates.length > 0) {
          rateToUse = room.rates.find(
            rate => rate.boardCode?.toUpperCase() === "RO" && 
                    rate.boardName?.toUpperCase() === "ROOM ONLY"
          ) || room.rates[0];
        }

        const pricePerRoom = Number(rateToUse?.net || 0);
        const totalPrice = pricePerRoom * roomCount;

        return {
          roomCode: room.roomCode,
          roomName: room.name || room.description || "",
          rateKey: rateToUse?.rateKey || "",
          boardCode: rateToUse?.boardCode || "",
          boardName: rateToUse?.boardName || "",
          count: roomCount,
          pricePerRoom: pricePerRoom,
          totalPrice: totalPrice,
          currency: rateToUse?.currency || "SAR",
          cancellationPolicies: rateToUse?.cancellationPolicies || [],
          adults: rateToUse?.adults || 0,
          children: rateToUse?.children || 0,
        };
      });

    // Calculate total amount
    const totalAmount = selectedRoomsData.reduce((sum, room) => sum + room.totalPrice, 0);
    const currency = selectedRoomsData[0]?.currency || "SAR";

    // Save booking data to store
    setBookingData({
      hotelId: hotelId,
      hotelName: hotelData?.name?.content || "",
      selectedRooms: selectedRoomsData,
      totalAmount: totalAmount,
      currency: currency,
      timestamp: Date.now(),
    });

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
                  {(() => {
                    const images = getMainAndThumbImages();
                    return (
                      <>
                        <div className="main-image">
                          {images.main && (
                            <Image
                              src={images.main}
                              width={892}
                              height={260}
                              alt={hotelName}
                              className="hotel-details-main-image"
                            />
                          )}
                        </div>
                        {images.thumbs.length > 0 && (
                          <div className="thumbnail-images">
                            {images.thumbs
                              .slice(0, 4)
                              .map((imgSrc, index, arr) => (
                                <div
                                  key={`thumb-${index}`}
                                  className="thambnail-image-item"
                                >
                                  <Image
                                    src={imgSrc}
                                    alt={t("alts.thumbnail", {
                                      index: index + 1,
                                    })}
                                    width={66}
                                    height={52}
                                  />
                                  {images.totalCount > 0 &&
                                    (index === 3 ||
                                      index === arr.length - 1) && (
                                      <Link
                                        href="#"
                                        className="show-all-photos"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleOpenImageModal();
                                        }}
                                      >
                                        {`${t("showAllPhotos")} (${
                                          images.totalCount
                                        })`}
                                      </Link>
                                    )}
                                </div>
                              ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>

                <div className="tabbing-conetnt">
                  {/* Tabs */}
                  <div className="tabbing-tabs-container">
                    <div className="hotel-tabs">
                      <a
                        href="#overview"
                        onClick={(e) => handleTabClick(e, "overview")}
                      >
                        {t("tabs.overview")}
                      </a>
                      <a
                        href="#amenities"
                        onClick={(e) => handleTabClick(e, "amenities")}
                      >
                        {t("tabs.amenities")}
                      </a>
                      <a
                        href="#rooms"
                        onClick={(e) => handleTabClick(e, "rooms")}
                      >
                        {t("tabs.rooms")}
                      </a>
                      <a
                        href="#reviews"
                        onClick={(e) => handleTabClick(e, "reviews")}
                      >
                        {t("tabs.reviews")}
                      </a>
                      <a href="#map" onClick={(e) => handleTabClick(e, "map")}>
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
                  {/* Amenities */}
                  <section
                    id="amenities"
                    className="hotel-tab-section amenities-tab-content"
                  >
                    <h2 className="tabbing-sub-title">
                      {t("sections.amenitiesTitle")}
                    </h2>
                    <div className="amenities-info d-grid">
                      {displayedAmenities.map((facility) => (
                        <div
                          key={`${facility.facilityGroupCode}-${facility.facilityCode}-${facility.description.content}`}
                          className="amenities-item d-flex align-items-center"
                        >
                          <AmenityIcon facilityCode={facility.facilityCode} />
                          {facility.description.content}
                        </div>
                      ))}
                    </div>
                    {amenities.length > 8 && (
                      <button
                        onClick={() => setShowAllAmenities(!showAllAmenities)}
                        className="button-primary show-all-amenities-btn"
                      >
                        {showAllAmenities ? t("showLess") : t("showAll")}
                      </button>
                    )}
                  </section>
                </div>
              </div>
              <div className="hotel-details-right">
                <div className="hotel-info-header">
                  <h2 className="hotel-name">{hotelName}</h2>
                  <div className="hotel-details-rating d-flex align-items-center">
                    <div className="hotel-details-rating-star d-flex align-items-center">
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
              {/* <div className="room-filter-bar">
            <div className="room-filter-left">
              <button className="filter-btn active">All rooms</button>
              <button className="filter-btn">1 Bed</button>
              <button className="filter-btn">2 Bed</button>
            </div>
            <div className="room-filter-right">Showing 3 of 3 rooms</div>
          </div> */}

              <div className="room-list">
                {/* Room Cards */}
                {processedRooms.map((room, roomIndex) => {
                  const sliderSettings = {
                    dots: false,
                    infinite: room.images.length > 1,
                    speed: 500,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                  };
                  const roomDisplayName =
                    room.name || room.description || t("placeholders.roomName");
                  const roomFacilitiesWithDescriptions = room.facilities.filter(
                    (facility) => facility.description
                  );
                  const displayedFacilities =
                    roomFacilitiesWithDescriptions.slice(0, 4);
                  const bedDescription =
                    room.roomStays
                      .flatMap((stay) => stay.facilities)
                      .map((facility) => facility.description)
                      .find((description) => description) ||
                    room.characteristicDescription ||
                    null;
                  const displayRateDetails = getDisplayRate(room);
                  const refundStatusLabel = displayRateDetails
                    ? displayRateDetails.isFullyRefundable
                      ? t("refund.fullyRefundable")
                      : t("refund.notFullyRefundable")
                    : t("placeholders.refundPolicyUnavailable");
                  const refundDateLabel = displayRateDetails?.refundDate
                    ? t("refund.beforeDate", {
                        date: displayRateDetails.refundDate,
                      })
                    : t("placeholders.refundDateUnavailable");

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
                                  key={`room-${
                                    room.roomCode || roomIndex
                                  }-image-${image.path || imgIndex}`}
                                >
                                  <Image
                                    src={image.fullUrl}
                                    width={378}
                                    height={203}
                                    alt={roomDisplayName}
                                    style={{
                                      objectFit: "cover",
                                      width: "100%",
                                      height: "203px",
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
                                    sliderRefs.current[roomIndex]?.slickPrev()
                                  }
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
                                  onClick={() =>
                                    sliderRefs.current[roomIndex]?.slickNext()
                                  }
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
                            src={HotelDetailsCardImage}
                            width={378}
                            height={203}
                            alt={roomDisplayName}
                          />
                        )}

                        {/* <div className="hotel-best-value d-flex align-items-center">
                          <span>{t("labels.bestValue")}</span>
                        </div> */}
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
                        <h3 className="hotel-room-name">{roomDisplayName}</h3>
                        {/* <div className="hotel-details-rating d-flex align-items-center">
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
                          </div> */}
                        {/* <span className="rating-value-wrapper d-flex align-items-center">
                      <span className="rating-value">4.5</span> (120 Reviews)
                    </span> 
                        </div>*/}

                        <div className="room-card-amenities-list mt-0">
                          {displayedFacilities.length > 0 ? (
                            <ul className="amenities-item d-flex">
                              {displayedFacilities.map((facility) => (
                                <li
                                  key={`${room.roomCode}-${facility.groupCode}-${facility.code}`}
                                >
                                  <AmenityIcon facilityCode={facility.code} />
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

                            {/* <li>
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10 17.4987C9.41667 17.4987 8.92361 17.2973 8.52083 16.8945C8.11806 16.4918 7.91667 15.9987 7.91667 15.4154C7.91667 14.832 8.11806 14.339 8.52083 13.9362C8.92361 13.5334 9.41667 13.332 10 13.332C10.5833 13.332 11.0764 13.5334 11.4792 13.9362C11.8819 14.339 12.0833 14.832 12.0833 15.4154C12.0833 15.9987 11.8819 16.4918 11.4792 16.8945C11.0764 17.2973 10.5833 17.4987 10 17.4987ZM5.29167 12.7904L3.54167 10.9987C4.36111 10.1793 5.32306 9.53009 6.4275 9.0512C7.53194 8.57231 8.72278 8.33259 10 8.33203C11.2772 8.33148 12.4683 8.57453 13.5733 9.0612C14.6783 9.54787 15.64 10.2076 16.4583 11.0404L14.7083 12.7904C14.0972 12.1793 13.3889 11.7001 12.5833 11.3529C11.7778 11.0056 10.9167 10.832 10 10.832C9.08333 10.832 8.22222 11.0056 7.41667 11.3529C6.61111 11.7001 5.90278 12.1793 5.29167 12.7904ZM1.75 9.2487L0 7.4987C1.27778 6.19314 2.77083 5.17231 4.47917 4.4362C6.1875 3.70009 8.02778 3.33203 10 3.33203C11.9722 3.33203 13.8125 3.70009 15.5208 4.4362C17.2292 5.17231 18.7222 6.19314 20 7.4987L18.25 9.2487C17.1806 8.17925 15.9411 7.34259 14.5317 6.7387C13.1222 6.13481 11.6117 5.83259 10 5.83203C8.38833 5.83148 6.87806 6.1337 5.46917 6.7387C4.06028 7.3437 2.82056 8.18037 1.75 9.2487Z"
                                  fill="#27272A"
                                />
                              </svg>
                              Free Wi-Fi
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
                                  d="M15 16.6673C15.9205 16.6673 16.6667 15.9212 16.6667 15.0007V5.00065C16.6667 4.08018 15.9205 3.33398 15 3.33398"
                                  stroke="#27272A"
                                  strokeWidth="1.25"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M3.33398 5.70577V14.2929C3.33398 15.6205 3.33398 16.2843 3.72107 16.7473C4.10814 17.2103 4.76244 17.329 6.07103 17.5665L8.57107 18.0203C10.3924 18.3508 11.3032 18.5161 11.9019 18.0173C12.5007 17.5185 12.5007 16.5945 12.5007 14.7467V5.25206C12.5007 3.40416 12.5007 2.48021 11.9019 1.98142C11.3032 1.48263 10.3924 1.64791 8.57107 1.97847L6.07103 2.43219C4.76244 2.66968 4.10814 2.78842 3.72107 3.25138C3.33398 3.71434 3.33398 4.37816 3.33398 5.70577Z"
                                  stroke="#27272A"
                                  strokeWidth="1.25"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M9.58398 9.99857V9.99023"
                                  stroke="#27272A"
                                  strokeWidth="1.25"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              1 bedroom
                            </li> */}
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

                        {/* <div className="room-card-policies-list">
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
                        </div>

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
                          {/* <div className="discount-price">
                            <span className="discount">$51 off</span>
                          </div> */}
                          {/* <span className="nightly-price">$40 nightly</span> */}
                          <span className="total-price d-inline-flex align-items-center gap-1">
                            {displayRateDetails ? (
                              <>
                                <span
                                  className="currency-icon"
                                  aria-hidden="true"
                                  dangerouslySetInnerHTML={{
                                    __html: buildCurrencySvgMarkup("#09090b"),
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
                          {/* <div className="hotel-room-left">We have 5 left</div> */}
                        </div>
                        <div className="hotel-room-booking-action">
                          <div className="select-room">
                            <label
                              className="select-rooms"
                              htmlFor={`selectRoom-${room.roomCode}`}
                            >
                              <span className="select-room-label">
                                Select Number of Rooms
                              </span>
                              <select
                                id={`selectRoom-${room.roomCode}`}
                                name="selectRoom"
                                value={selectedRoomCounts[room.roomCode] || 0}
                                onChange={(e) =>
                                  handleRoomCountChange(
                                    room.roomCode,
                                    Number(e.target.value)
                                  )
                                }
                                disabled={isRoomSelectionDisabled(
                                  room.roomCode
                                )}
                              >
                                <option value="0">0</option>
                                {Array.from(
                                  {
                                    length: getAvailableRoomOptions(
                                      room.roomCode
                                    ),
                                  },
                                  (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                      {String(i + 1).padStart(2, "0")}
                                    </option>
                                  )
                                )}
                              </select>
                            </label>
                          </div>

                          <div className="select-room">
                            <label
                              className="select-rooms"
                              htmlFor={`selectRoomType-${room.roomCode}`}
                            >
                              <span className="select-room-label">
                                Select Room Type
                              </span>
                              <select
                                id={`selectRoomType-${room.roomCode}`}
                                name="selectRoomType"
                                value={
                                  selectedRoomRates[room.roomCode] ||
                                  displayRateDetails?.rate.rateKey ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleRoomRateChange(
                                    room.roomCode,
                                    e.target.value
                                  )
                                }
                              >
                                {room.rates && room.rates.length > 0 ? (
                                  room.rates.map((rate, rateIndex) => (
                                    <option
                                      key={`${room.roomCode}-rate-${rateIndex}`}
                                      value={rate.rateKey}
                                    >
                                      {rate.boardName || "N/A"} - SAR{" "}
                                      {priceFormatter.format(
                                        Number(rate.net ?? 0)
                                      )}
                                    </option>
                                  ))
                                ) : (
                                  <option value="">
                                    {t("placeholders.noRatesAvailable")}
                                  </option>
                                )}
                              </select>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="hotel-detail-room-booking">
                <div className="hotel-subtotal">
                  <ul>
                    <li>
                      <span className="label">
                        {bookingSummary.totalRooms}{" "}
                        {bookingSummary.totalRooms === 1 ? "Room" : "Rooms"} for
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
                    {/* <li>
                      <span className="label">Discount</span>
                      <span className="value text-green">
                        -{" "}
                        <span
                          className="currency-icon"
                          aria-hidden="true"
                          dangerouslySetInnerHTML={{
                            __html: buildCurrencySvgMarkup("#09090b"),
                          }}
                          style={{ display: "inline-flex" }}
                        />
                        20,610
                      </span>
                    </li>
                    <li>
                      <span className="label">Taxes & Fees</span>
                      <span className="value">
                        <span
                          className="currency-icon"
                          aria-hidden="true"
                          dangerouslySetInnerHTML={{
                            __html: buildCurrencySvgMarkup("#09090b"),
                          }}
                          style={{ display: "inline-flex" }}
                        />
                        30,610
                      </span>
                    </li> */}
                    <li className="total">
                      <span className="label">Subtotal</span>
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
                    <button className="button-primary room-booking-btn" onClick={handleBookNowClick}>
                      {t("actions.bookNow")}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Reviews */}
            {/* <section id="reviews" className="hotel-review-section">
              <h2 className="hotel-section-title">Reviews</h2>
              <ReviewSlider slidesToShowDesktop={2} />
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
                    <ul className="facility-item d-grid">
                      {selectedRoomFacilities.map((facility) => (
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

                    {/* <li>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 17.4987C9.41667 17.4987 8.92361 17.2973 8.52083 16.8945C8.11806 16.4918 7.91667 15.9987 7.91667 15.4154C7.91667 14.832 8.11806 14.339 8.52083 13.9362C8.92361 13.5334 9.41667 13.332 10 13.332C10.5833 13.332 11.0764 13.5334 11.4792 13.9362C11.8819 14.339 12.0833 14.832 12.0833 15.4154C12.0833 15.9987 11.8819 16.4918 11.4792 16.8945C11.0764 17.2973 10.5833 17.4987 10 17.4987ZM5.29167 12.7904L3.54167 10.9987C4.36111 10.1793 5.32306 9.53009 6.4275 9.0512C7.53194 8.57231 8.72278 8.33259 10 8.33203C11.2772 8.33148 12.4683 8.57453 13.5733 9.0612C14.6783 9.54787 15.64 10.2076 16.4583 11.0404L14.7083 12.7904C14.0972 12.1793 13.3889 11.7001 12.5833 11.3529C11.7778 11.0056 10.9167 10.832 10 10.832C9.08333 10.832 8.22222 11.0056 7.41667 11.3529C6.61111 11.7001 5.90278 12.1793 5.29167 12.7904ZM1.75 9.2487L0 7.4987C1.27778 6.19314 2.77083 5.17231 4.47917 4.4362C6.1875 3.70009 8.02778 3.33203 10 3.33203C11.9722 3.33203 13.8125 3.70009 15.5208 4.4362C17.2292 5.17231 18.7222 6.19314 20 7.4987L18.25 9.2487C17.1806 8.17925 15.9411 7.34259 14.5317 6.7387C13.1222 6.13481 11.6117 5.83259 10 5.83203C8.38833 5.83148 6.87806 6.1337 5.46917 6.7387C4.06028 7.3437 2.82056 8.18037 1.75 9.2487Z"
                          fill="#27272A"
                        />
                      </svg>
                      Free Wi-Fi
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
                          d="M15 16.6673C15.9205 16.6673 16.6667 15.9212 16.6667 15.0007V5.00065C16.6667 4.08018 15.9205 3.33398 15 3.33398"
                          stroke="#27272A"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.33398 5.70577V14.2929C3.33398 15.6205 3.33398 16.2843 3.72107 16.7473C4.10814 17.2103 4.76244 17.329 6.07103 17.5665L8.57107 18.0203C10.3924 18.3508 11.3032 18.5161 11.9019 18.0173C12.5007 17.5185 12.5007 16.5945 12.5007 14.7467V5.25206C12.5007 3.40416 12.5007 2.48021 11.9019 1.98142C11.3032 1.48263 10.3924 1.64791 8.57107 1.97847L6.07103 2.43219C4.76244 2.66968 4.10814 2.78842 3.72107 3.25138C3.33398 3.71434 3.33398 4.37816 3.33398 5.70577Z"
                          stroke="#27272A"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.58398 9.99857V9.99023"
                          stroke="#27272A"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      1 bedroom
                    </li> */}
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
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          // You might want to trigger the favorite action again here
          handleFavoriteClick();
          console.log("Logged in, now can favorite");
        }}
      />
    </main>
  );
};

export default HotelDetails;
