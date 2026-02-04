"use client";
import Image from "next/image";
import "./Checkout.scss";
import "../BookingReview/BookingReview.scss";

// import MsaterCardIcon from "@/assets/images/master-card-icon.svg";
// import PaypalCardIcon from "@/assets/images/paypal-card-icon.svg";
// import StripeCardIcon from "@/assets/images/stripe-card-icon.svg";
// import UnionCardIcon from "@/assets/images/union-card-icon.svg";
// import visaCardIcon from "@/assets/images/visa-card-icon.svg";
// import AmericanExpressIcon from "@/assets/images/american-card-icon.svg";
import BookingHotelInfoImage from "@/assets/images/booking-hotel-info-image.jpg";
import { useRouter } from "next/navigation";
import { useBookingStore, SelectedRoom } from "@/store/bookingStore";
import { useSearchFiltersStore } from "@/store/searchFiltersStore";
import { useHotelDetailsStore } from "@/store/hotelDetailsStore";
import { useCouponStore } from "@/store/couponStore";
import { bookingService } from "@/services/bookingService";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Controller, UseFormReturn } from "react-hook-form";
import { Select } from "@/components/core/Select/Select";
import {
  COUNTRY_CODES,
  buildHotelbedsImageUrl,
  buildCurrencySvgMarkup,
} from "@/constants";
import { useLocale, useTranslations } from "next-intl";
import { HotelImage } from "@/types/favorite";
import { Form } from "@/components/core/Form/Form";
import { Input } from "@/components/core/Input/Input";
import { Textarea } from "@/components/core/Textarea/Textarea";
import { createBookingSchema, BookingFormData, GuestFormData } from "@/schemas/bookingSchema";
import {
  BookingDetailsResponse,
  BookingDetail,
  RoomDetailWithComments,
} from "@/types/booking";
import Link from "next/link";
import { SelectWithFlag, SelectWithFlagOption } from "@/components/core/SelectWithFlag/SelectWithFlag";
import { countryService } from "@/services/countryService";

function CheckoutComponent() {
  const router = useRouter();
  const locale = useLocale();
  // console.log("Current locale:", locale);
  const t = useTranslations("Checkout");
  const tBooking = useTranslations("BookingReview");
  const tv = useTranslations("Auth.validation");
  const { travelerDetails, bookingData, setTravelerDetails, bookingResponse } =
    useBookingStore();
  const { filters: searchFilters } = useSearchFiltersStore();
  const { hotel: hotelData } = useHotelDetailsStore();
  const {
    couponCode,
    setCouponCode,
    applyCoupon,
    loading: loadingCoupon,
    couponResponse,
  } = useCouponStore();
  const [isChildAgePopoverOpen, setIsChildAgePopoverOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const formMethodsRef = useRef<UseFormReturn<BookingFormData> | null>(null);
  const watchSetupRef = useRef(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToTermsError, setAgreeToTermsError] = useState(false);
  const [bookingDetails, setBookingDetails] =
    useState<BookingDetailsResponse | null>(null);
  const [roomDetails, setRoomDetails] = useState<
    Array<{ room_name: string; rate_comments: string }>
  >([]);
  const [translatedTexts, setTranslatedTexts] = useState<Map<string, string>>(
    new Map()
  );
  const [countryOptions, setCountryOptions] = useState<SelectWithFlagOption[]>([]);


  // Generate default values for the form - load from booking details (API) first, then store
  const defaultValues = useMemo(() => {
    // Priority 1: Populate from booking details API response as it's the source of truth from server
    if (
      bookingDetails?.data?.booking?.details &&
      Array.isArray(bookingDetails.data.booking.details) &&
      bookingDetails.data.booking.details.length > 0
    ) {
      const guests = bookingDetails.data.booking.details.map((detail: BookingDetail) => ({
        firstName: detail.first_name || "",
        lastName: detail.last_name || "",
        email: detail.email || "",
        country: detail.country || "",
        countryCode: detail.country_code?.replace("+", "") || "966",
        phone: detail.phone || "",
      }));

      return {
        guests,
        specialRequests: bookingDetails.data.booking.special_requests || "",
      };
    }

    // Priority 2: Use travelerDetails from store
    if (travelerDetails) {
      return travelerDetails;
    }

    return {
      guests: [{
        firstName: "",
        lastName: "",
        email: "",
        country: "Saudi Arabia",
        countryCode: "966",
        phone: "",
      }],
      specialRequests: "",
    };
  }, [travelerDetails, bookingDetails]);

  // Create validation schema with translations
  const bookingSchema = useMemo(() => {
    return createBookingSchema((key, params) => {
      if (key === "firstNameMinLength" && params?.min) {
        return tv("firstNameMinLength", { min: params.min });
      }
      if (key === "lastNameMinLength" && params?.min) {
        return tv("lastNameMinLength", { min: params.min });
      }
      if (key === "specialRequestsMaxLength" && params?.max) {
        return tv("specialRequestsMaxLength", { max: params.max });
      }
      return tv(key);
    });
  }, [tv]);

  // Calculate total guests and child ages for display
  const { totalAdults, totalChildren, childAges } = useMemo(() => {
    const adults = searchFilters.rooms?.reduce((sum, room) => sum + room.adults, 0) || 0;
    const children = searchFilters.rooms?.reduce((sum, room) => sum + room.children, 0) || 0;

    // Collect all child ages
    const ages: number[] = [];
    if (searchFilters.rooms) {
      searchFilters.rooms.forEach(room => {
        if (Array.isArray(room.childrenAges)) {
          ages.push(...room.childrenAges);
        }
      });
    }

    return {
      totalAdults: adults,
      totalChildren: children,
      childAges: ages
    };
  }, [searchFilters.rooms]);

  // Watch form values and save to store when they change
  useEffect(() => {
    if (!formMethodsRef.current || watchSetupRef.current) return;

    const subscription = formMethodsRef.current.watch((value) => {
      if (value?.guests?.[0] && (value.guests[0].firstName || value.guests[0].lastName || value.guests[0].email)) {
        setTravelerDetails(value as BookingFormData);
      }
    });

    watchSetupRef.current = true;

    return () => {
      if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe();
        watchSetupRef.current = false;
      }
    };
  }, [setTravelerDetails]);

  // Reset form when booking details are loaded and form is ready
  useEffect(() => {
    if (!bookingDetails || !formMethodsRef.current) return;

    if (
      bookingDetails?.data?.booking?.details &&
      Array.isArray(bookingDetails.data.booking.details) &&
      bookingDetails.data.booking.details.length > 0
    ) {
      const guests = bookingDetails.data.booking.details.map((detail: BookingDetail) => ({
        firstName: detail.first_name || "",
        lastName: detail.last_name || "",
        email: detail.email || "",
        country: detail.country || "",
        countryCode: detail.country_code?.replace("+", "") || "966",
        phone: detail.phone || "",
      }));

      // Only update if we have guests
      if (guests.length > 0) {
        const formData: BookingFormData = {
          guests,
          specialRequests: bookingDetails.data.booking.special_requests || "",
        };

        // Reset form with new values
        formMethodsRef.current.reset(formData);
        // Save to store to keep in sync
        setTravelerDetails(formData);
      }
    }
  }, [bookingDetails, setTravelerDetails]);

  // Call getBookingDetails API and populate form data
  useEffect(() => {
    const fetchBookingDetails = async () => {
      // Get order from booking response
      const order =
        bookingResponse?.data?.booking &&
          "order" in bookingResponse.data.booking
          ? bookingResponse.data.booking.order
          : undefined;

      if (!order || typeof order !== "string") {
        return;
      }

      try {
        const response = await bookingService.getBookingDetails(order);
        console.log("📋 Booking Details Response:", response);

        // Store booking details
        setBookingDetails(response);

        // Extract room details with room names and rate comments
        if (
          response?.data?.booking?.room_details &&
          Array.isArray(response.data.booking.room_details)
        ) {
          // Get unique rooms based on room_name and rate_key combination, keeping only those with rate_comments
          const roomMap = new Map<
            string,
            { room_name: string; rate_comments: string }
          >();

          response.data.booking.room_details.forEach(
            (room: RoomDetailWithComments) => {
              if (room.rate_comments && room.rate_comments.trim() !== "") {
                const key = `${room.room_name}_${room.rate_key}`;
                // Only add if not already in map (to avoid duplicates)
                if (!roomMap.has(key)) {
                  roomMap.set(key, {
                    room_name: room.room_name || "Room",
                    rate_comments: room.rate_comments,
                  });
                }
              }
            }
          );

          setRoomDetails(Array.from(roomMap.values()));
        }

        // Always try to populate form from API response, regardless of current local state
        if (
          response?.data?.booking?.details &&
          Array.isArray(response.data.booking.details) &&
          response.data.booking.details.length > 0
        ) {
          const guests = response.data.booking.details.map((detail: BookingDetail) => ({
            firstName: detail.first_name || "",
            lastName: detail.last_name || "",
            email: detail.email || "",
            country: detail.country || "",
            countryCode: detail.country_code?.replace("+", "") || "966",
            phone: detail.phone || "",
          }));

          if (guests.length > 0) {
            const formData: BookingFormData = {
              guests,
              specialRequests: response.data.booking?.special_requests || "",
            };
            // Save to store
            setTravelerDetails(formData);
            // Reset form with new values if form is ready
            if (formMethodsRef.current) {
              formMethodsRef.current.reset(formData);
            }
          }
        }
      } catch (error) {
        console.error("❌ Error fetching booking details:", error);
      }
    };

    fetchBookingDetails();
  }, [bookingResponse, setTravelerDetails]);

  // Handle form submission (if needed for checkout)
  const handleSubmit = async (data: BookingFormData) => {
    console.log("Checkout form submitted:", data);
    // Form values are already saved to store via watch
    // Additional submission logic can be added here if needed
  };

  // Handle checkout payment
  const handleCheckout = async () => {
    try {
      // Check if terms and conditions are accepted
      if (!agreeToTerms) {
        setAgreeToTermsError(true);
        return;
      }

      // Clear any previous error when terms are accepted
      setAgreeToTermsError(false);

      // Get order from booking response
      const order =
        bookingResponse?.data?.booking &&
          "order" in bookingResponse.data.booking
          ? bookingResponse.data.booking.order
          : undefined;

      if (!order || typeof order !== "string") {
        console.error("Order not found. Please complete booking first.");
        toast.error("Order not found. Please complete booking first.");
        return;
      }

      // Prepare checkout payload - only send order
      const checkoutPayload = {
        order: order,
      };

      console.log("🛒 Checkout Payload:", checkoutPayload);

      // Call checkout service
      const checkoutResponse = await bookingService.checkout(checkoutPayload);

      // Console log the full response
      console.log("✅ Checkout Response:", checkoutResponse);
      console.log("📋 Checkout Status:", checkoutResponse.status);
      console.log("📋 Checkout Message:", checkoutResponse.message);
      if (checkoutResponse.data) {
        console.log("📋 Checkout Data:", checkoutResponse.data);
      }

      // Redirect to payment URL on success
      if (checkoutResponse.status) {
        const redirectUrl = checkoutResponse.data?.checkout?.transaction?.url;
        if (redirectUrl) {
          // Redirect to the payment gateway URL
          window.location.href = redirectUrl;
        } else {
          // Fallback to confirmation page if no redirect URL
          router.push(`/${locale}/booking-confirmation`);
        }
      } else {
        toast.error(
          checkoutResponse.message || "Checkout failed. Please try again."
        );
      }
    } catch (error) {
      console.error("❌ Checkout Error:", error);
      toast.error("An error occurred during checkout. Please try again.");
    }
  };

  const handleApplyCoupon = async () => {
    const order =
      bookingResponse?.data?.booking && "order" in bookingResponse.data.booking
        ? bookingResponse.data.booking.order
        : undefined;

    if (!order || typeof order !== "string") {
      toast.error("Booking order not found");
      return;
    }

    if (!couponCode) return;

    const response = await applyCoupon({
      coupon_code: couponCode,
      order: order,
    });

    if (response) {
      if (response.status) {
        toast.success(t("coupon.success"));
      } else {
        toast.error(t("coupon.error"));
      }
    }
  };

  // Translate texts using Google Translate when locale is Arabic
  useEffect(() => {
    if (locale !== "ar" || roomDetails.length === 0) {
      return;
    }

    const translateTexts = async () => {
      const translations = new Map<string, string>();

      const translatePromises = roomDetails.flatMap((room) => {
        const textsToTranslate = [room.room_name, room.rate_comments].filter(
          (text) => {
            // Only translate English text that hasn't been translated yet
            return (
              text &&
              !translatedTexts.has(text) &&
              !text.match(/[\u0600-\u06FF]/) &&
              text.match(/[a-zA-Z]/)
            );
          }
        );

        return textsToTranslate.map(async (text) => {
          try {
            // Use Google Translate API
            const response = await fetch(
              `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(
                text
              )}`
            );

            if (response.ok) {
              const data = await response.json();
              // Google translate API returns an array of sentences. We need to join them.
              if (data && data[0]) {
                const translated = data[0]
                  .map((item: string) => item[0])
                  .join("");
                if (translated && translated !== text) {
                  translations.set(text, translated);
                }
              }
            }
          } catch (error) {
            console.warn(`Translation failed for "${text}":`, error);
          }
        });
      });

      await Promise.all(translatePromises);

      if (translations.size > 0) {
        setTranslatedTexts((prev) => {
          const updated = new Map(prev);
          translations.forEach((value, key) => {
            updated.set(key, value);
          });
          return updated;
        });
      }
    };

    translateTexts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, roomDetails]);

  // Fetch countries list
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await countryService.getCountries();

        if (response.data && response.data.countries) {
          // Transform countries data to match SelectWithFlagOption format
          const options: SelectWithFlagOption[] = response.data.countries.map((country: { name: string; flag: string; code: string }) => {
            const option: SelectWithFlagOption = {
              value: country.name,
              label: country.name,
            };

            // Only include flag if country has a flag and code
            if (country.flag && country.code) {
              option.flag = `https://flagcdn.com/w40/${country.code.toLowerCase()}.png`;
            }

            return option;
          });

          setCountryOptions(options);
        }
      } catch (error: unknown) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  // Calculate total guests
  const totalGuests = useMemo(() => {
    const adults =
      searchFilters.rooms?.reduce((sum, room) => sum + room.adults, 0) || 0;
    const children =
      searchFilters.rooms?.reduce((sum, room) => sum + room.children, 0) || 0;
    return adults + children;
  }, [searchFilters.rooms]);

  const totalRooms = useMemo(
    () => searchFilters.rooms?.length || 0,
    [searchFilters.rooms]
  );

  // Calculate nights
  const calculateNights = (
    checkIn: string | Date | null | undefined,
    checkOut: string | Date | null | undefined
  ): number => {
    if (!checkIn || !checkOut) return 0;
    try {
      const start = checkIn instanceof Date ? checkIn : new Date(checkIn);
      const end = checkOut instanceof Date ? checkOut : new Date(checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 0;
    }
  };

  const totalNights = calculateNights(
    searchFilters.checkInDate,
    searchFilters.checkOutDate
  );

  const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return t("notSelected");
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      // Always use Gregorian calendar (en-US) so Arabic does NOT switch to Islamic months
      return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(dateObj);
    } catch {
      return t("notSelected");
    }
  };

  // Get hotel image
  const getOrderedHotelImages = () => {
    if (!hotelData?.images) return [];
    const images = hotelData.images.filter((img) => !!img?.path);
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
    return [...genImages, ...otherImages];
  };

  const getMainImage = () => {
    const sorted = getOrderedHotelImages();
    if (sorted.length === 0) {
      return BookingHotelInfoImage;
    }
    const mainPath = sorted[0]?.path;
    return mainPath ? buildHotelbedsImageUrl(mainPath) : BookingHotelInfoImage;
  };

  const hotelName =
    hotelData?.name?.content ||
    bookingData?.hotelName ||
    t("placeholders.hotelName");

  // Get selected rooms info from booking data
  const selectedRoomsInfo = bookingData?.selectedRooms || [];

  // Filter out duplicate rooms based on roomCode + rateKey combination
  const uniqueRooms = useMemo(() => {
    const processedKeys = new Set<string>();
    return selectedRoomsInfo.filter((room) => {
      const key = `${room.roomCode}_${room.rateKey}`;
      if (processedKeys.has(key)) {
        return false; // Skip duplicate
      }
      processedKeys.add(key);
      return true; // Keep unique room
    });
  }, [selectedRoomsInfo]);

  // Expand rooms based on count
  const expandedRooms = useMemo(() => {
    return uniqueRooms.flatMap(room => Array(room.count).fill(room));
  }, [uniqueRooms]);

  // Calculate price breakdown
  const priceBreakdown = useMemo(() => {
    if (!bookingData?.selectedRooms || bookingData.selectedRooms.length === 0) {
      return {
        totalPrice: 0,
        currency: "SAR",
      };
    }

    // Filter out duplicate rooms based on roomCode + rateKey combination
    const processedKeys = new Set<string>();
    const uniqueRooms = bookingData.selectedRooms.filter((room) => {
      const key = `${room.roomCode}_${room.rateKey}`;
      if (processedKeys.has(key)) {
        return false;
      }
      processedKeys.add(key);
      return true;
    });

    // pricePerRoom already includes total stay price from backend, so multiply by room count only
    const totalPrice = uniqueRooms.reduce((sum, room) => {
      const roomTotal = room.pricePerRoom * room.count;
      return sum + roomTotal;
    }, 0);

    const currency = uniqueRooms[0]?.currency || "SAR";

    return {
      totalPrice,
      currency,
    };
  }, [bookingData]);

  // Price formatter - keep amounts consistent with BookingReview (always Western digits)
  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        numberingSystem: "latn", // Force Western numerals (0-9) instead of Arabic-Indic numerals
      }),
    [locale]
  );

  return (
    <main className="checkout-page padding-top-100 section-space-b">
      <div className="container">
        <div className="progress-steps">
          <div className="step completed">
            <span className="step-circle">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="16" cy="16" r="16" fill="#3E5B96" />
                <path
                  d="M10.166 16.834L13.4993 20.1673L21.8327 11.834"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="mobile-progress-line d-md-none"></span>
            </span>
            <span className="step-label">
              {t("progressSteps.hotelSelection")}
            </span>
          </div>

          <div className="step-line"></div>

          {/* <div className="step active"> */}
          <div className="step completed active">
            <span className="step-circle">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="16" cy="16" r="16" fill="#3E5B96" />
                <path
                  d="M10.166 16.834L13.4993 20.1673L21.8327 11.834"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="mobile-progress-line d-md-none"></span>
            </span>
            <span className="step-label">{t("progressSteps.yourDetails")}</span>
          </div>

          <div className="step-line"></div>

          <div className="step">
            <span className="step-circle">
              <svg
                width="33"
                height="32"
                viewBox="0 0 33 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="16.5"
                  cy="16"
                  r="15"
                  stroke="#3E5B96"
                  strokeWidth="2"
                />
                <circle cx="16.5" cy="16" r="5" fill="#3E5B96" />
              </svg>
              <span className="mobile-progress-line d-md-none"></span>
            </span>
            <span className="step-label">{t("progressSteps.pending")}</span>
          </div>
        </div>

        <div className="review-booking-heading">
          <h1 className="review-booking-title">{t("title")}</h1>
          <p className="review-booking-desc">{t("description")}</p>
        </div>

        <div className="booking-review-details">
          <div className="review-booking-details-left">
            <div className="booking-detail-box booking-stays-summary">
              <h3 className="booking-details-sub-title">
                {t("stayDetails.title")}
              </h3>
              <ul className="booking-listing-info">
                <li className="booking-listing-item d-flex align-items-center justify-content-between">
                  <div className="booking-list-left d-flex align-items-center">
                    {t("stayDetails.checkIn")}
                  </div>
                  <div className="booking-list-right d-flex align-items-center">
                    {formatDate(searchFilters.checkInDate)}
                  </div>
                </li>
                <li className="booking-listing-item d-flex align-items-center justify-content-between">
                  <div className="booking-list-left d-flex align-items-center">
                    {t("stayDetails.checkOut")}
                  </div>
                  <div className="booking-list-right d-flex align-items-center">
                    {formatDate(searchFilters.checkOutDate)}
                  </div>
                </li>
                <li className="booking-listing-item d-flex align-items-center justify-content-between">
                  <div className="booking-list-left d-flex align-items-center">

                    {t("travelerDetails.title")}
                  </div>
                  <div className="booking-list-right booking-list-guest d-flex flex-column align-items-center">
                    <ul className="list-unstyled mb-0 ">
                      <li>
                        <span>{t("stayDetails.adults")} : </span>
                        <span> {totalAdults} </span>
                      </li>
                      <li>
                        <span>{t("stayDetails.children")} : </span>
                        <span> {totalChildren} </span>
                        {totalChildren > 0 && (
                          <div
                            className="booking-list-child-age"
                            onClick={() => setIsChildAgePopoverOpen(!isChildAgePopoverOpen)}
                            role="button"
                          >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18.3327 10.0007C18.3327 5.39828 14.6017 1.66732 9.99935 1.66732C5.39698 1.66732 1.66602 5.39828 1.66602 10.0007C1.66602 14.603 5.39698 18.334 9.99935 18.334C14.6017 18.334 18.3327 14.603 18.3327 10.0007Z" stroke="#141B34" strokeWidth="1.25" />
                              <path d="M10.2025 14.168V10.0013C10.2025 9.60846 10.2025 9.41205 10.0804 9.29001C9.9584 9.16797 9.76198 9.16797 9.36914 9.16797" stroke="#141B34" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M9.99398 6.66797H10.0015" stroke="#141B34" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                            {isChildAgePopoverOpen && (
                              <div className="child-age-popover">
                                <div className="popover-content">
                                  {childAges.map((age, index) => (
                                    <div key={index} className="child-age-item">
                                      <span className="label">{t("stayDetails.child")} {index + 1}</span>
                                      <span className="value">{age} {t("stayDetails.years")}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    </ul>
                    {/* <table className="table table-borderless table-sm mb-0 w-auto ms-auto">
                      <tbody>
                        <tr>
                          <td className="text-end py-1 pe-3 align-middle text-muted">{t("staysDetails.adults")}</td>
                          <td className="text-end py-1 fw-bold align-middle">{totalAdults}</td>
                        </tr>
                        {totalChildren > 0 && (
                          <tr>
                            <td className="text-end py-1 pe-3 align-middle text-muted">{t("staysDetails.children")}</td>
                            <td className="text-end py-1 fw-bold align-middle">{totalChildren}</td>
                          </tr>
                        )}
                        {totalChildren > 0 && childAges.map((age, index) => (
                          <tr key={`child-${index}`}>
                            <td className="text-end py-0 pe-3 text-secondary small align-middle">
                              {t("staysDetails.child")} {index + 1} {t("staysDetails.age")}
                            </td>
                            <td className="text-end py-0 text-secondary small align-middle">
                              {age} {t("staysDetails.years")}
                            </td>
                          </tr>
                        ))}
                      </tbody> 
                  </table>*/}
                  </div>
                </li>
                <li className="booking-listing-item d-flex align-items-center justify-content-between">
                  <div className="booking-list-left d-flex align-items-center">
                    {t("stayDetails.guestsAndRooms")}
                  </div>
                  <div className="booking-list-right d-flex align-items-center">
                    {totalGuests}{" "}
                    {totalGuests === 1
                      ? t("stayDetails.guest")
                      : t("stayDetails.guests")}{" "}
                    • {totalRooms}{" "}
                    {totalRooms === 1
                      ? t("stayDetails.room")
                      : t("stayDetails.rooms")}
                  </div>
                </li>
                <li className="booking-listing-item d-flex align-items-center justify-content-between">
                  <div className="booking-list-left d-flex align-items-center">
                    {t("stayDetails.totalPrice")}
                  </div>
                  <div className="booking-list-right d-flex align-items-center">
                    <span
                      className="currency-icon"
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{
                        __html: buildCurrencySvgMarkup("#09090b"),
                      }}
                      style={{ display: "inline-flex" }}
                    />{" "}
                    {priceFormatter.format(priceBreakdown.totalPrice)}
                  </div>
                </li>
              </ul>
            </div>

            <Form<BookingFormData>
              ref={formRef}
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              schema={bookingSchema}
              className="booking-detail-box booking-traveler-details"
            >
              {(methods) => {
                // Store form methods in ref for useEffect access
                formMethodsRef.current = methods;
                const guests: BookingFormData['guests'] = methods.watch('guests');
                const specialRequests = methods.watch('specialRequests');
                console.log("🚀 ~ Checkout ~ specialRequests:", specialRequests)

                return (
                  <>
                    <h3 className="booking-details-sub-title">{t("travelerDetails.title")}</h3>

                    {/* Guests List */}
                    {(() => {
                      const renderList = expandedRooms.length > 0 && expandedRooms.length === guests?.length
                        ? expandedRooms
                        : guests || [];

                      return renderList.map((item: SelectedRoom | GuestFormData, index: number) => {
                        const guest = guests?.[index];
                        // If item is from expandedRooms (SelectedRoom), it has roomName. Else use generic.
                        const title = 'roomName' in item
                          ? `${item.roomName}`
                          : `${tBooking("travelerDetails.guest")} ${index + 1}`;

                        return (
                          <div key={index} className="booking-details-form mandatory-field">
                            <h3 className="booking-form-title">
                              {title}
                              {index === 0 && <span className="text-red"> ({t("travelerDetails.mandatory")})</span>}
                            </h3>
                            <div className="booking-form-content form-field">
                              <div className="form-row">
                                <Input
                                  name={`guests.${index}.firstName`}
                                  label={t("travelerDetails.firstName")}
                                  labelWithContent={<span className="required">*</span>}
                                  type="text"
                                  disabled
                                  value={guest.firstName || ''}
                                  placeholder="First Name"
                                  className="form-input"
                                />
                                <Input
                                  name={`guests.${index}.lastName`}
                                  label={t("travelerDetails.lastName")}
                                  labelWithContent={<span className="required">*</span>}
                                  type="text"
                                  disabled
                                  value={guest.lastName || ''}
                                  placeholder="Last Name"
                                  className="form-input"
                                />
                              </div>

                              <div className="form-row">
                                <Input
                                  name={`guests.${index}.email`}
                                  label={t("travelerDetails.email")}
                                  labelWithContent={<span className="required">*</span>}
                                  type="email"
                                  disabled
                                  value={guest.email || ''}
                                  placeholder="Email"
                                  className="form-input"
                                />
                                <div className="form-group">
                                  <label className="form-label">
                                    {t("travelerDetails.country")} <span className="required">*</span>
                                  </label>
                                  <Controller
                                    name={`guests.${index}.country`}
                                    control={methods.control}
                                    render={({ field }) => (
                                      <SelectWithFlag
                                        options={countryOptions}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Country"
                                        disabled
                                      />
                                    )}
                                  />
                                </div>
                              </div>

                              <div className="form-row">
                                <div className="form-group select-with-input-field mb-0">
                                  <label className="form-label">
                                    {t("travelerDetails.phoneNumber")} <span className="required">*</span>
                                  </label>
                                  <div className="select-with-input">
                                    <div className="country-code-input">
                                      <Controller
                                        name={`guests.${index}.countryCode`}
                                        control={methods.control}
                                        render={({ field }) => (
                                          <Select
                                            options={COUNTRY_CODES.map((c) => ({
                                              value: c.value,
                                              label: `+${c.label}`,
                                            }))}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="+966"
                                            disabled
                                          />
                                        )}
                                      />
                                    </div>
                                    <div className="phone-number-input">
                                      <Input
                                        name={`guests.${index}.phone`}
                                        type="tel"
                                        disabled
                                        value={guest.phone || ''}
                                        placeholder="Phone Number"
                                        className="form-input form-control"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="form-group"></div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    })()}

                    {/* Special Requests */}
                    <div className="booking-details-form special-request-field">
                      <h3 className="booking-form-title">
                        {t("travelerDetails.specialRequest")}
                      </h3>
                      <p className="booking-form-desc">
                        {t("travelerDetails.specialRequestDescription")}
                      </p>
                      <div className="booking-form-content form-field">
                        <div className="form-row">
                          <div className="form-group d-flex w-100">
                            <Textarea
                              name="specialRequests"
                              rows={5}
                              // Keep placeholder text always in English (same as BookingReview)
                              placeholder={tBooking("travelerDetails.specialRequestPlaceholderLong")}
                              className="w-100 text-field"
                              disabled
                              value={specialRequests || ''}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              }}
            </Form >
            {/* Other Information & Policies Section */}
            {/* Rate Comments Card */}
            {
              roomDetails.length > 0 && (
                <section
                  id="hotel-policies"
                  className="hotel-tab-section policies-tab-content"
                >
                  <div className="policies-container">
                    <div className="policies-header">
                      {t("rateComments.policiesHeader")}
                    </div>
                    <div className="policies-body">
                      {roomDetails.map((room, index) => (
                        <div
                          className="policy-column"
                          key={`room-policy-${index}`}
                        >
                          <h4 className="column-title">
                            {(() => {
                              const roomName = room.room_name;
                              try {
                                return t("rateComments.roomWithName", {
                                  number: index + 1,
                                  roomName: roomName,
                                });
                              } catch {
                                return `Room ${index + 1} - ${roomName}`;
                              }
                            })()}
                          </h4>
                          <ul className="policy-list">
                            <li>
                              {translatedTexts.get(room.rate_comments) ||
                                room.rate_comments}
                            </li>
                          </ul>
                        </div>
                      ))}
                      {/* <div className="policy-column">
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
                  </div> */}
                    </div>
                  </div>
                </section>
              )
            }


            {/* <div className="booking-detail-box booking-traveler-details choose-payment-option">
              <h3 className="booking-details-sub-title">
                Choose Payment Option
              </h3>
              <div className="payment-options">
                <div className="payment-list">
                  <label className="payment-card">
                    <input
                      type="radio"
                      name="payment"
                      value="mastercard"
                      defaultChecked
                    />
                    <div className="payment-card-content">
                      <Image
                        src={MsaterCardIcon}
                        width={64}
                        height={64}
                        alt="MasterCard"
                      />
                    </div>
                  </label>

                  <label className="payment-card">
                    <input type="radio" name="payment" value="paypal" />
                    <div className="payment-card-content">
                      <Image
                        src={PaypalCardIcon}
                        width={64}
                        height={64}
                        alt="PayPal"
                      />
                    </div>
                  </label>

                  <label className="payment-card">
                    <input type="radio" name="payment" value="stripe" />
                    <div className="payment-card-content">
                      <Image
                        src={StripeCardIcon}
                        width={64}
                        height={64}
                        alt="Stripe"
                      />
                    </div>
                  </label>

                  <label className="payment-card">
                    <input type="radio" name="payment" value="unionpay" />
                    <div className="payment-card-content">
                      <Image
                        src={UnionCardIcon}
                        width={64}
                        height={64}
                        alt="UnionPay"
                      />
                    </div>
                  </label>

                  <label className="payment-card">
                    <input type="radio" name="payment" value="visa" />
                    <div className="payment-card-content">
                      <Image
                        src={visaCardIcon}
                        width={64}
                        height={64}
                        alt="Visa"
                      />
                    </div>
                  </label>

                  <label className="payment-card">
                    <input type="radio" name="payment" value="amex" />
                    <div className="payment-card-content">
                      <Image
                        src={AmericanExpressIcon}
                        width={64}
                        height={64}
                        alt="American Express"
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="booking-details-form ">
                <h3 className="booking-form-title">Card Details</h3>
                <form action="" className="booking-form-content form-field ">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName " className="form-label">
                        Card Holder Name <span>*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        placeholder="Zahid Hossain"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="lastName" className="form-label">
                        Card Number <span>*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        placeholder="5460 5460 5460 5460"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName " className="form-label">
                        Expiration Date <span>*</span>
                      </label>
                      <input
                        type="text"
                        id="expiry-date"
                        placeholder="Your 26/11"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="lastName" className="form-label">
                        CVC <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="Your country"
                        placeholder="501"
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="save-card-checkbox">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="freeCancel"
                      />
                      <label className="form-check-label" htmlFor="freeCancel">
                        Save card for future payment.
                      </label>
                    </div>
                  </div>
                </form>
              </div>
            </div> */}

          </div>

          <div className="review-booking-details-right">
            <div className="hotel-info-header">
              <div className="booking-hotel-info d-flex align-items-start">
                <div className="booking-hotel-image">
                  <Image
                    src={getMainImage()}
                    width={44}
                    height={44}
                    alt="hotel image"
                    className="booking-hotel-img"
                  />
                </div>
                <div className="booking-hotel-content">
                  <h3 className="hotel-name">{hotelName}</h3>
                  <span className="booking-guest-info">
                    {totalGuests}{" "}
                    {totalGuests === 1
                      ? t("summary.guest")
                      : t("summary.guests")}{" "}
                    • {totalNights}{" "}
                    {totalNights === 1
                      ? t("summary.night")
                      : t("summary.nights")}
                  </span>
                </div>
              </div>

              <div className="booking-price-info">
                <div className="booking-price-item d-flex align-items-center">
                  <div className="booking-iocn-with-text d-flex align-items-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 12C2 8.46252 2 6.69377 3.0528 5.5129C3.22119 5.32403 3.40678 5.14935 3.60746 4.99087C4.86213 4 6.74142 4 10.5 4H13.5C17.2586 4 19.1379 4 20.3925 4.99087C20.5932 5.14935 20.7788 5.32403 20.9472 5.5129C22 6.69377 22 8.46252 22 12C22 15.5375 22 17.3062 20.9472 18.4871C20.7788 18.676 20.5932 18.8506 20.3925 19.0091C19.1379 20 17.2586 20 13.5 20H10.5C6.74142 20 4.86213 20 3.60746 19.0091C3.40678 18.8506 3.22119 18.676 3.0528 18.4871C2 17.3062 2 15.5375 2 12Z"
                        stroke="#09090B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.551 12C14.551 13.3807 13.4317 14.5 12.051 14.5C10.6703 14.5 9.55099 13.3807 9.55099 12C9.55099 10.6193 10.6703 9.5 12.051 9.5C13.4317 9.5 14.551 10.6193 14.551 12Z"
                        stroke="#09090B"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M5 12L6 12"
                        stroke="#09090B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M18 12L19 12"
                        stroke="#09090B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    {t("summary.hotelFare")}
                  </div>
                  <div className="booking-pricing">
                    <span
                      className="currency-icon"
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{
                        __html: buildCurrencySvgMarkup("#09090b"),
                      }}
                      style={{ display: "inline-flex" }}
                    />{" "}
                    {(() => {
                      // Use API total price if available (Gross amount)
                      const apiTotalPrice =
                        couponResponse?.data?.booking?.total_price ||
                        bookingDetails?.data?.booking?.total_price ||
                        bookingResponse?.data?.booking?.total_price;

                      if (apiTotalPrice) {
                        return priceFormatter.format(Number(apiTotalPrice));
                      }

                      return priceFormatter.format(priceBreakdown.totalPrice);
                    })()}
                  </div>
                </div>
                {/* <div className="booking-price-item d-flex align-items-center">
                  <div className="booking-iocn-with-text d-flex align-items-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="1.5"
                        cy="1.5"
                        r="1.5"
                        transform="matrix(1 0 0 -1 16 8)"
                        stroke="#09090B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.77423 11.1439C1.77108 12.2643 1.7495 13.9546 2.67016 15.1437C4.49711 17.5033 6.49674 19.5029 8.85633 21.3298C10.0454 22.2505 11.7357 22.2289 12.8561 21.2258C15.8979 18.5022 18.6835 15.6559 21.3719 12.5279C21.6377 12.2187 21.8039 11.8397 21.8412 11.4336C22.0062 9.63798 22.3452 4.46467 20.9403 3.05974C19.5353 1.65481 14.362 1.99377 12.5664 2.15876C12.1603 2.19608 11.7813 2.36233 11.472 2.62811C8.34412 5.31646 5.49781 8.10211 2.77423 11.1439Z"
                        stroke="#09090B"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M7 14L10 17"
                        stroke="#09090B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Discount
                  </div>
                  <div className="booking-pricing discount">-$51</div>
                </div> */}

                {couponResponse?.status &&
                  couponResponse?.data?.booking?.discount_amount && (
                    <div className="booking-price-item d-flex align-items-center">
                      <div className="booking-iocn-with-text d-flex align-items-center">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="1.5"
                            cy="1.5"
                            r="1.5"
                            transform="matrix(1 0 0 -1 16 8)"
                            stroke="#09090B"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M2.77423 11.1439C1.77108 12.2643 1.7495 13.9546 2.67016 15.1437C4.49711 17.5033 6.49674 19.5029 8.85633 21.3298C10.0454 22.2505 11.7357 22.2289 12.8561 21.2258C15.8979 18.5022 18.6835 15.6559 21.3719 12.5279C21.6377 12.2187 21.8039 11.8397 21.8412 11.4336C22.0062 9.63798 22.3452 4.46467 20.9403 3.05974C19.5353 1.65481 14.362 1.99377 12.5664 2.15876C12.1603 2.19608 11.7813 2.36233 11.472 2.62811C8.34412 5.31646 5.49781 8.10211 2.77423 11.1439Z"
                            stroke="#09090B"
                            stroke-width="1.5"
                          />
                          <path
                            d="M7 14L10 17"
                            stroke="#09090B"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>

                        {t("summary.discount")}
                      </div>
                      {/* <span className="text-success"></span> */}

                      <div className="booking-pricing discount discount_price">
                        -
                        <span
                          className="currency-icon"
                          aria-hidden="true"
                          dangerouslySetInnerHTML={{
                            __html: buildCurrencySvgMarkup("#FB2C36"),
                          }}
                          style={{ display: "inline-flex" }}
                        />{" "}
                        {priceFormatter.format(
                          Number(couponResponse.data.booking.discount_amount)
                        )}
                      </div>
                    </div>
                  )}
                <div className="booking-review-separetor"></div>
                <div className="booking-tital-price d-flex align-items-center justify-content-between">
                  <span>{t("summary.totalPrice")}</span>
                  <span className="checkout-total-price">
                    <span
                      className="currency-icon"
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{
                        __html: buildCurrencySvgMarkup("#09090b"),
                      }}
                      style={{ display: "inline-flex" }}
                    />{" "}
                    {(() => {
                      const discountAmount =
                        couponResponse?.status &&
                          couponResponse?.data?.booking?.discount_amount
                          ? Number(couponResponse.data.booking.discount_amount)
                          : 0;

                      // Use API total price if available (Gross amount)
                      const apiTotalPrice =
                        couponResponse?.data?.booking?.total_price ||
                        bookingDetails?.data?.booking?.total_price ||
                        bookingResponse?.data?.booking?.total_price;

                      const basePrice = apiTotalPrice
                        ? Number(apiTotalPrice)
                        : priceBreakdown.totalPrice;

                      const finalPrice = Math.max(
                        0,
                        basePrice - discountAmount
                      );
                      return priceFormatter.format(finalPrice);
                    })()}
                  </span>
                </div>
                <div className="booking-price-tax">
                  {t("summary.includedAllTaxes")}
                </div>
                <div className="booking-review-separetor"></div>
              </div>
              <div className="coupon-section">
                <label className="form-label">
                  {t("coupon.label") || "Coupon Code"}
                </label>
                <div className="coupon-input-with-btn">
                  <input
                    type="text"
                    className="form-control form-input"
                    maxLength={20}
                    placeholder={t("coupon.placeholder") || "Enter coupon code"}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={loadingCoupon}
                  />
                  <button
                    className="button-primary coupon-apply-btn"
                    onClick={handleApplyCoupon}
                    disabled={loadingCoupon || !couponCode}
                  >
                    {loadingCoupon
                      ? t("coupon.applying") || "Applying.."
                      : t("coupon.apply") || "Apply"}
                  </button>
                </div>
                {couponResponse && (
                  <div
                    className={`mt-1 ${couponResponse.status ? "text-success" : "text-danger"
                      }`}
                    style={{ fontSize: "12px" }}
                  >
                    {couponResponse.status
                      ? t("coupon.success")
                      : t("coupon.error")}
                  </div>
                )}
              </div>
              <div className="chekout-agree-terms-box">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="agreeToTerms"
                    checked={agreeToTerms}
                    onChange={(e) => {
                      setAgreeToTerms(e.target.checked);
                      if (e.target.checked) {
                        setAgreeToTermsError(false);
                      }
                    }}
                  />
                  <label className="form-check-label" htmlFor="agreeToTerms">
                    {t("agreeToTerms.label")}{" "}
                    <Link href="/terms-conditions">
                      {t("agreeToTerms.terms")}
                    </Link>{" "}
                    {t("agreeToTerms.and")}{" "}
                    <Link href="/privacy-policy">
                      {t("agreeToTerms.privacyPolicy")}
                    </Link>
                  </label>
                </div>
                {agreeToTermsError && (
                  <div className="terms-error-message">
                    {t("agreeToTerms.errorMessage")}
                  </div>
                )}
              </div>
              <div className="check-availability-action">
                <button
                  className="button-primary check-availability-btn"
                  onClick={handleCheckout}
                >
                  {t("payButton")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CheckoutComponent;
