"use client";
import Image from "next/image";
import "./Checkout.scss";
// import MsaterCardIcon from "@/assets/images/master-card-icon.svg";
// import PaypalCardIcon from "@/assets/images/paypal-card-icon.svg";
// import StripeCardIcon from "@/assets/images/stripe-card-icon.svg";
// import UnionCardIcon from "@/assets/images/union-card-icon.svg";
// import visaCardIcon from "@/assets/images/visa-card-icon.svg";
// import AmericanExpressIcon from "@/assets/images/american-card-icon.svg";
import BookingHotelInfoImage from "@/assets/images/booking-hotel-info-image.jpg";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/store/bookingStore";
import { useSearchFiltersStore } from "@/store/searchFiltersStore";
import { useHotelDetailsStore } from "@/store/hotelDetailsStore";
import { bookingService } from "@/services/bookingService";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Controller, UseFormReturn } from "react-hook-form";
import { Select } from "@/components/core/Select/Select";
import { COUNTRY_CODES, buildHotelbedsImageUrl, buildCurrencySvgMarkup } from "@/constants";
import { useLocale } from "next-intl";
import { HotelImage } from "@/types/favorite";
import { Form } from "@/components/core/Form/Form";
import { Input } from "@/components/core/Input/Input";
import { Textarea } from "@/components/core/Textarea/Textarea";
import { createBookingSchema, BookingFormData } from "@/schemas/bookingSchema";

function CheckoutComponent() {
  const router = useRouter();
  const locale = useLocale();
  const { travelerDetails, bookingData, setTravelerDetails, bookingResponse } = useBookingStore();
  const { filters: searchFilters } = useSearchFiltersStore();
  const { hotel: hotelData } = useHotelDetailsStore();
  const formRef = useRef<HTMLFormElement>(null);
  const formMethodsRef = useRef<UseFormReturn<BookingFormData> | null>(null);
  const watchSetupRef = useRef(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToTermsError, setAgreeToTermsError] = useState(false);

  // Generate default values for the form - load from store if available
  const defaultValues = useMemo(() => {
    if (travelerDetails) {
      return travelerDetails;
    }
    return {
      primaryGuest: {
        firstName: "",
        lastName: "",
        email: "",
        country: "",
        countryCode: "966",
        phone: "",
      },
      specialRequests: "",
    };
  }, [travelerDetails]);

  // Create validation schema
  const bookingSchema = useMemo(() => {
    return createBookingSchema();
  }, []);


  // Watch form values and save to store when they change
  useEffect(() => {
    if (!formMethodsRef.current || watchSetupRef.current) return;

    const subscription = formMethodsRef.current.watch((value) => {
      if (value?.primaryGuest && (value.primaryGuest.firstName || value.primaryGuest.lastName || value.primaryGuest.email)) {
        setTravelerDetails(value as BookingFormData);
      }
    });

    watchSetupRef.current = true;

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
        watchSetupRef.current = false;
      }
    };
  }, [setTravelerDetails]);

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
      const order = bookingResponse?.data?.booking && 'order' in bookingResponse.data.booking
        ? bookingResponse.data.booking.order
        : undefined;

      if (!order || typeof order !== 'string') {
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
        toast.error(checkoutResponse.message || "Checkout failed. Please try again.");
      }
    } catch (error) {
      console.error("❌ Checkout Error:", error);
      toast.error("An error occurred during checkout. Please try again.");
    }
  };

  // Calculate total guests
  const totalGuests = useMemo(() => {
    const adults = searchFilters.rooms?.reduce((sum, room) => sum + room.adults, 0) || 0;
    const children = searchFilters.rooms?.reduce((sum, room) => sum + room.children, 0) || 0;
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

  const totalNights = calculateNights(searchFilters.checkInDate, searchFilters.checkOutDate);

  const formatDate = (
    date: string | Date | null | undefined
  ): string => {
    if (!date) return "Not selected";
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(dateObj);
    } catch {
      return "Not selected";
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

  const hotelName = hotelData?.name?.content || bookingData?.hotelName || "Hotel Name";

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

  // Price formatter
  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
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
            <span className="step-label">Hotel Selection</span>
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
            <span className="step-label">Your Details</span>
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
            <span className="step-label">Pending</span>
          </div>
        </div>

        <div className="review-booking-heading">
          <h1 className="review-booking-title">Complete Your Booking</h1>
          <p className="review-booking-desc">
            Please provide traveler details and complete your secure payment.
          </p>
        </div>

        <div className="booking-review-details">
          <div className="review-booking-details-left">
            <div className="booking-detail-box booking-stays-summary">
              <h3 className="booking-details-sub-title">Stay Details</h3>
              <ul className="booking-listing-info">
                <li className="booking-listing-item d-flex align-items-center justify-content-between">
                  <div className="booking-list-left d-flex align-items-center">
                    Check-in
                  </div>
                  <div className="booking-list-right d-flex align-items-center">
                    {formatDate(searchFilters.checkInDate)}
                  </div>
                </li>
                <li className="booking-listing-item d-flex align-items-center justify-content-between">
                  <div className="booking-list-left d-flex align-items-center">
                    Check-out
                  </div>
                  <div className="booking-list-right d-flex align-items-center">
                    {formatDate(searchFilters.checkOutDate)}
                  </div>
                </li>
                <li className="booking-listing-item d-flex align-items-center justify-content-between">
                  <div className="booking-list-left d-flex align-items-center">
                    Guests & Rooms
                  </div>
                  <div className="booking-list-right d-flex align-items-center">
                    {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"} •{" "}
                    {totalRooms} {totalRooms === 1 ? "Room" : "Rooms"}
                  </div>
                </li>
                <li className="booking-listing-item d-flex align-items-center justify-content-between">
                  <div className="booking-list-left d-flex align-items-center">
                    Total Price
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

                return (
                  <>
                    <h3 className="booking-details-sub-title">Traveler Details</h3>

                    {/* Primary Guest - Mandatory */}
                    <div className="booking-details-form mandatory-field">
                      <h3 className="booking-form-title">
                        Primary Guest <span className="text-red">(Mandatory)</span>
                      </h3>
                      <div className="booking-form-content form-field">
                        <div className="form-row">
                          <Input
                            name="primaryGuest.firstName"
                            label="First Name"
                            labelWithContent={<span className="required">*</span>}
                            type="text"
                            disabled
                            placeholder="Your first name"
                            className="form-input"
                          />
                          <Input
                            name="primaryGuest.lastName"
                            label="Last Name"
                            labelWithContent={<span className="required">*</span>}
                            type="text"
                            disabled
                            placeholder="Your last name"
                            className="form-input"
                          />
                        </div>

                        <div className="form-row">
                          <Input
                            name="primaryGuest.email"
                            label="Email address"
                            labelWithContent={<span className="required">*</span>}
                            type="email"
                            disabled
                            placeholder="Your email"
                            className="form-input"
                          />
                          <Input
                            name="primaryGuest.country"
                            label="Country/ Region"
                            labelWithContent={<span className="required">*</span>}
                            type="text"
                            disabled
                            placeholder="Your country"
                            className="form-input"
                          />
                        </div>

                        <div className="form-row">
                          <div className="form-group select-with-input-field">
                            <label className="form-label">
                              Phone Number <span className="required">*</span>
                            </label>
                            <div className="select-with-input">
                              <div className="country-code-input">
                                <Controller
                                  name="primaryGuest.countryCode"
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
                                  name="primaryGuest.phone"
                                  type="tel"
                                  placeholder="Your phone number"
                                  className="form-input form-control"
                                  disabled
                                />
                              </div>
                            </div>
                          </div>
                          <div className="form-group"></div>
                        </div>
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div className="booking-details-form special-request-field">
                      <h3 className="booking-form-title">Special Request</h3>
                      <p className="booking-form-desc">
                        Please write your request in English or Arabic.
                      </p>
                      <div className="booking-form-content form-field">
                        <div className="form-row">
                          <div className="form-group d-flex w-100">
                            <Textarea
                              name="specialRequests"
                              rows={5}
                              placeholder="Enter any requests..."
                              className="w-100 text-field"
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              }}
            </Form>
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
                    {totalGuests} {totalGuests === 1 ? 'Guest' : 'Guests'} • {totalNights} {totalNights === 1 ? 'Night' : 'Nights'}
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
                    Hotel Fare
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
                    {priceFormatter.format(priceBreakdown.totalPrice)}
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
                <div className="booking-review-separetor"></div>
                <div className="booking-tital-price d-flex align-items-center justify-content-between">
                  <span>Total Price</span>
                  <span className="checkout-total-price">
                    <span
                      className="currency-icon"
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{
                        __html: buildCurrencySvgMarkup("#09090b"),
                      }}
                      style={{ display: "inline-flex" }}
                    />{" "}
                    {priceFormatter.format(priceBreakdown.totalPrice)}
                  </span>
                </div>
                <div className="booking-price-tax">
                  Included all taxes & fees
                </div>
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
                    I agree to <a href="#">Terms</a> and{" "}
                    <a href="#">Privacy Policy.</a>
                  </label>
                </div>
                {agreeToTermsError && (
                  <div className="terms-error-message">
                    Please accept Terms and Privacy Policy.
                  </div>
                )}
              </div>
              <div className="check-availability-action">
                <button className="button-primary check-availability-btn" onClick={handleCheckout}>
                  Pay
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
