"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useMemo, useCallback } from "react";
import "./Bookings.scss";
import Image from "next/image";
import HotelBookingImg from "@/assets/images/room-information-image.jpg";
// import StartIcon from "@/assets/images/star-fill-icon.svg";
import { Select } from "@/components/core/Select/Select";
import { useBookingsListStore } from "@/store/bookingsListStore";
import { bookingService } from "@/services/bookingService";
import { toast } from "react-toastify";
import { formatApiErrorMessage } from "@/lib/formatApiError";
import Pagination from "@/components/common/Pagination/Pagination";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "@/i18/navigation";
import { useLocale } from "next-intl";
import ClosePopupIcon from "@/assets/images/close-btn-icon.svg";
import { buildCurrencySvgMarkup } from "@/constants";
import { buildHotelSlug } from "@/lib/hotelSlug";

// Helper function to format date range (e.g., "12 -15 Aug 2025")
const formatDateRange = (checkIn: string | undefined, checkOut: string | undefined): string => {
  if (!checkIn || !checkOut) return "";

  try {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const checkInDay = checkInDate.getDate();
    const checkOutDay = checkOutDate.getDate();
    const month = checkOutDate.toLocaleDateString("en-US", { month: "short" });
    const year = checkOutDate.getFullYear();

    return `${checkInDay} - ${checkOutDay} ${month} ${year}`;
  } catch (error) {
    console.error("Error formatting date range:", error);
    return "";
  }
};

// Helper function to calculate total guests
const getTotalGuests = (adults: number | undefined, children: number | undefined): number => {
  const adultsCount = adults || 0;
  const childrenCount = children || 0;
  return adultsCount + childrenCount;
};

type BookingStatusFilter = "" | "pending" | "confirmed" | "cancelled";

interface BookingFiltersState {
  status: BookingStatusFilter;
  hotel_code: string;
}

interface CancellationPolicy {
  id: number;
  booking_room_id: number;
  amount: string;
  from: string;
  created_at: string;
  updated_at: string;
}

interface CancellationPoliciesResponseData {
  cancellation_policies?: CancellationPolicy[];
}

export default function Bookings() {
  const t = useTranslations("Bookings");
  const router = useRouter();
  const locale = useLocale();
  const { bookings, loading, error, fetchBookings, total, perPage, currentPage: storeCurrentPage, lastPage } = useBookingsListStore();
  const [filters, setFilters] = useState<BookingFiltersState>({
    status: "",
    hotel_code: "",
  });
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
  const [downloadingOrder, setDownloadingOrder] = useState<string | null>(null);
  const [completingOrder, setCompletingOrder] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCancellationModalOpen, setIsCancellationModalOpen] = useState(false);
  const [cancellationPoliciesData, setCancellationPoliciesData] = useState<{
    order: string;
    policies: Array<{
      id: number;
      booking_room_id: number;
      amount: string;
      from: string;
      created_at: string;
      updated_at: string;
    }>;
  } | null>(null);

  // console.log("bookings", bookings);

  // Sync local currentPage with store's currentPage from API
  useEffect(() => {
    if (storeCurrentPage > 0) {
      setCurrentPage(storeCurrentPage);
    }
  }, [storeCurrentPage]);

  useEffect(() => {
    // Fetch bookings with current page and filters
    const params: { status?: string; hotel_code?: string | number; page?: number; per_page?: number } = {};
    if (filters.status) params.status = filters.status;
    if (filters.hotel_code) params.hotel_code = filters.hotel_code;
    params.page = currentPage;
    // Use per_page from API response (15) or default to 15
    params.per_page = perPage || 15;

    fetchBookings(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      // If already on page 1, fetch with current filters
      const params: { status?: string; hotel_code?: string | number; page?: number; per_page?: number } = {};
      if (filters.status) params.status = filters.status;
      if (filters.hotel_code) params.hotel_code = filters.hotel_code;
      params.page = 1;
      params.per_page = perPage || 15;
      fetchBookings(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.hotel_code]);

  const handleStatusChange = (value: string) => {
    const nextStatus = value as BookingStatusFilter;

    setFilters((prev) => {
      const next: BookingFiltersState = {
        ...prev,
        status: nextStatus,
      };

      // Reset to page 1 when filter changes
      setCurrentPage(1);

      return next;
    });
  };

  // Calculate total pages - use lastPage from API directly
  const totalPages = useMemo(() => {
    if (lastPage > 0) return lastPage;
    if (!total || !perPage) return 1;
    return Math.max(1, Math.ceil(total / perPage));
  }, [total, perPage, lastPage]);

  // Debug pagination
  // console.log("Pagination debug:", { total, perPage, lastPage, totalPages, currentPage });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelBooking = async (order: string | undefined) => {
    if (!order) {
      toast.error("Invalid booking order. Please try again.");
      return;
    }

    try {
      setCancellingOrder(order);

      // Get cancellation policies first
      const cancellationPoliciesResponse = await bookingService.getCancellationPolicies(order);
      console.log("📋 Cancellation Policies Response:", cancellationPoliciesResponse);

      // Check if policies exist and have data
      // API response structure: { status: true, message: "...", data: { cancellation_policies: [...] } }
      const responseData = cancellationPoliciesResponse.data as CancellationPoliciesResponseData | CancellationPolicy[] | undefined;
      const policies = (responseData && 'cancellation_policies' in responseData
        ? responseData.cancellation_policies
        : Array.isArray(responseData) ? responseData : []) || [];

      if (policies && policies.length > 0) {
        // Show modal with policies
        setCancellationPoliciesData({
          order,
          policies: policies,
        });
        setIsCancellationModalOpen(true);
        setCancellingOrder(null);
      } else {
        // No policies, directly cancel
        await proceedWithCancellation(order);
      }
    } catch (err: unknown) {
      const errorMessage = formatApiErrorMessage(err);
      toast.error(errorMessage);
      setCancellingOrder(null);
    }
  };

  const proceedWithCancellation = async (order: string) => {
    try {
      setCancellingOrder(order);

      const response = await bookingService.cancelBooking(order);

      if (response.status) {
        toast.success(response.message || "Booking cancelled successfully.");

        // Refresh bookings with current filters and pagination
        const params: { status?: string; hotel_code?: string | number; page?: number; per_page?: number } = {};
        if (filters.status) params.status = filters.status;
        if (filters.hotel_code) params.hotel_code = filters.hotel_code;
        params.page = currentPage;
        params.per_page = perPage || 15;
        fetchBookings(params);
      } else {
        toast.error(response.message || "Failed to cancel booking. Please try again.");
      }
    } catch (err: unknown) {
      const errorMessage = formatApiErrorMessage(err);
      toast.error(errorMessage);
    } finally {
      setCancellingOrder(null);
    }
  };

  const handleDownloadPdf = async (order: string | undefined) => {
    if (!order) {
      toast.error("Invalid booking order. Please try again.");
      return;
    }

    try {
      setDownloadingOrder(order);
      const response = await bookingService.getBookingPdf(order);
      if (response.status && response.data.pdf_url) {
        try {
          // Route the cross-origin PDF URL through our Next.js API proxy to enforce download
          const apiRoute = `/api/download-pdf?url=${encodeURIComponent(response.data.pdf_url)}&order=${order}`;

          const pdfResponse = await fetch(apiRoute);
          if (!pdfResponse.ok) throw new Error("Proxy download failed");

          const blob = await pdfResponse.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = `booking-${order}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        } catch (downloadError) {
          console.error("Error downloading PDF via proxy:", downloadError);
          // Ultimate fallback to just opening the URL natively
          window.open(response.data.pdf_url, "_blank");
        }
      } else {
        toast.error(response.message || "Failed to get PDF URL.");
      }
    } catch (err: unknown) {
      const errorMessage = formatApiErrorMessage(err);
      toast.error(errorMessage);
    } finally {
      setDownloadingOrder(null);
    }
  };

  const handleConfirmCancellation = async () => {
    if (!cancellationPoliciesData) return;

    setIsCancellationModalOpen(false);
    await proceedWithCancellation(cancellationPoliciesData.order);
    setCancellationPoliciesData(null);
  };

  const handleCloseCancellationModal = () => {
    setIsCancellationModalOpen(false);
    setCancellationPoliciesData(null);
    setCancellingOrder(null);
  };

  // Format date helper
  const formatCancellationDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return null;
    }
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }, [locale]);

  // Price formatter
  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        numberingSystem: "latn",
      }),
    [locale]
  );

  const handleOpenHotelDetails = (hotelCode?: string | number, hotelName?: string) => {
    if (!hotelCode) return;

    const numericCode =
      typeof hotelCode === "string" ? parseInt(hotelCode, 10) : hotelCode;

    if (!numericCode || Number.isNaN(numericCode)) return;

    const hotelSlug = buildHotelSlug(hotelName, numericCode);

    try {
      const url = `/${locale}/hotel-details/${hotelSlug}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleCompleteBooking = async (order: string | undefined) => {
    if (!order) {
      toast.error("Invalid booking order. Please try again.");
      return;
    }

    try {
      setCompletingOrder(order);

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
          router.push(`/booking-confirmation`);
        }
      } else {
        toast.error(checkoutResponse.message || "Checkout failed. Please try again.");
      }
    } catch (error) {
      console.error("❌ Checkout Error:", error);
      const errorMessage = formatApiErrorMessage(error);
      toast.error(errorMessage || "An error occurred during checkout. Please try again.");
    } finally {
      setCompletingOrder(null);
    }
  };

  return (
    <div className="my-booking-page">
      <div className="my-booking-title-with-filter">
        <h1 className="my-booking-title">{t("pageTitle")}</h1>
        <div className="my-booking-filter-wrapper d-flex align-items-center">
          <div className="my-booking-status-select">
            <Select
              label={t("filter")}
              options={[
                { value: "", label: "All statuses" },
                { value: "pending", label: "Pending" },
                { value: "confirmed", label: "Confirmed" },
                { value: "cancelled", label: "Cancelled" },
              ]}
              value={filters.status}
              onChange={handleStatusChange}
              placeholder="Filter by status"
            />
          </div>
        </div>
      </div>
      {loading ? (
        <div className="hotel-booking-card d-grid">
          {[...Array(perPage || 15)].map((_, index) => (
            <div key={index} className="hotel-booking-card-item">
              <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
                <Skeleton height={222} borderRadius={18} />
                <div style={{ paddingTop: "12px" }}>
                  <Skeleton height={24} width="60%" style={{ marginBottom: "12px" }} />
                  <Skeleton height={20} width="50%" style={{ marginBottom: "18px" }} />
                  <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: "12px" }}>
                    <Skeleton height={20} width="45%" />
                    <Skeleton height={20} width="40%" />
                  </div>
                  <Skeleton height={44} />
                </div>
              </SkeletonTheme>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-5 text-danger">
          <p>{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-5">
          <p>No bookings found</p>
        </div>
      ) : (
        <div className="hotel-booking-card d-grid">
          {bookings.map((booking) => {
            const hotelName = booking.hotel_name || "Hotel";
            const hotelLocation = booking.hotel_location || "";

            // Safely determine hotel image source
            let hotelImageSrc: string | typeof HotelBookingImg = HotelBookingImg;

            if (Array.isArray(booking.hotel_images) && booking.hotel_images.length > 0) {
              const firstImage = booking.hotel_images[0];
              if (typeof firstImage === "string") {
                const candidate = firstImage.trim();
                if (candidate && /^https?:\/\//.test(candidate)) {
                  hotelImageSrc = candidate;
                }
              }
            } else if (typeof booking.hotel_images === "string") {
              const candidate = booking.hotel_images.trim();
              if (candidate && /^https?:\/\//.test(candidate)) {
                hotelImageSrc = candidate;
              }
            }

            return (
              <div key={booking.id} className="hotel-booking-card-item">
                <div
                  className="hotel-booking-image"
                  onClick={() => handleOpenHotelDetails(booking.hotel_code, booking.hotel_name)}
                  style={{ cursor: "pointer" }}
                >
                  <Image
                    src={hotelImageSrc}
                    alt={hotelName}
                    width={414}
                    height={222}
                    className="hotel-booking-img"
                  />
                </div>
                <div className="hotel-booking-info">
                  <div className="hotel-title-with-rating d-flex align-items-start justify-content-between">
                    <h2
                      className="hotel-title"
                      onClick={() => handleOpenHotelDetails(booking.hotel_code, booking.hotel_name)}
                      style={{ cursor: "pointer" }}
                    >
                      {hotelName}
                    </h2>
                    {/* <div className="hotel-review-rating d-flex align-items-center">
                    <Image
                      src={StartIcon}
                      alt="star icon"
                      width={20}
                      height={20}
                      className="ration-star-icon"
                    />
                    4.9 {t("rating")}
                  </div> */}
                  </div>
                  <div className="hotel-location d-flex align-items-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.3481 17.8071C10.9867 18.1455 10.5037 18.3346 10.0009 18.3346C9.49821 18.3346 9.01515 18.1455 8.65374 17.8071C5.34418 14.6896 0.908969 11.2071 3.07189 6.15102C4.24136 3.41727 7.04862 1.66797 10.0009 1.66797C12.9532 1.66797 15.7605 3.41727 16.93 6.15102C19.0902 11.2007 14.6658 14.7004 11.3481 17.8071Z"
                        stroke="#71717B"
                        strokeWidth="1.25"
                      />
                      <path
                        d="M12.9173 9.16667C12.9173 10.7775 11.6115 12.0833 10.0007 12.0833C8.38982 12.0833 7.08398 10.7775 7.08398 9.16667C7.08398 7.55584 8.38982 6.25 10.0007 6.25C11.6115 6.25 12.9173 7.55584 12.9173 9.16667Z"
                        stroke="#71717B"
                        strokeWidth="1.25"
                      />
                    </svg>
                    {hotelLocation || "—"}
                  </div>
                  <div className="date-guest-number d-flex align-items-center justify-content-between">
                    <div className="text-with-icon d-flex align-items-center">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 1.66797V3.33464M5 1.66797V3.33464"
                          stroke="#71717B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.99756 10.8359H10.005M9.99756 14.1693H10.005M13.3272 10.8359H13.3346M6.66797 10.8359H6.67545M6.66797 14.1693H6.67545"
                          stroke="#71717B"
                          strokeWidth="1.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.91797 6.66797H17.0846"
                          stroke="#71717B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.08398 10.2027C2.08398 6.57161 2.08398 4.75607 3.12742 3.62803C4.17085 2.5 5.85023 2.5 9.20898 2.5H10.7923C14.1511 2.5 15.8305 2.5 16.8739 3.62803C17.9173 4.75607 17.9173 6.57161 17.9173 10.2027V10.6306C17.9173 14.2617 17.9173 16.0773 16.8739 17.2053C15.8305 18.3333 14.1511 18.3333 10.7923 18.3333H9.20898C5.85023 18.3333 4.17085 18.3333 3.12742 17.2053C2.08398 16.0773 2.08398 14.2617 2.08398 10.6306V10.2027Z"
                          stroke="#71717B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.5 6.66797H17.5"
                          stroke="#71717B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {formatDateRange(booking.check_in, booking.check_out) || "N/A"}
                    </div>
                    <div className="text-with-icon d-flex align-items-center">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.5 18.3346H17.5C17.5 14.6527 14.1421 11.668 10 11.668C5.85786 11.668 2.5 14.6527 2.5 18.3346Z"
                          stroke="#71717B"
                          strokeWidth="1.25"
                        />
                        <path
                          d="M13.75 5.41797C13.75 7.48904 12.0711 9.16797 10 9.16797C7.92893 9.16797 6.25 7.48904 6.25 5.41797C6.25 3.3469 7.92893 1.66797 10 1.66797C12.0711 1.66797 13.75 3.3469 13.75 5.41797Z"
                          stroke="#71717B"
                          strokeWidth="1.25"
                        />
                      </svg>
                      {getTotalGuests(booking.adults, booking.children)} {t("guests")}
                    </div>
                  </div>
                </div>
                <div className="hotel-bookig-action d-flex align-items-center justify-content-between">
                  {booking.status === "pending" ? (
                    <button
                      className="hotel-bookig-action-btn button-primary"
                      onClick={() => handleCompleteBooking(booking.order)}
                      disabled={completingOrder === booking.order}
                    >
                      {completingOrder === booking.order ? `${t("completeBooking")}...` : t("completeBooking")}
                    </button>
                  ) : booking.status === "cancelled" ? (
                    <button
                      className="hotel-bookig-action-btn cancel-button"
                      disabled
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ marginRight: "6px" }}
                      >
                        <path
                          d="M15 5L5 15M5 5L15 15"
                          stroke="#EF4444"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {t("bookingCanceled")}
                    </button>
                  ) : (
                    <>
                      <button
                        className="hotel-bookig-action-btn button-primary"
                        onClick={() => handleDownloadPdf(booking.order)}
                        disabled={downloadingOrder === booking.order}
                      >
                        {downloadingOrder === booking.order ? `${t("downloading")}` : t("downloadPdf")}
                      </button>
                      <button
                        className="hotel-bookig-action-btn cancel-button"
                        onClick={() => handleCancelBooking(booking.order)}
                        disabled={cancellingOrder === booking.order}
                      >
                        {cancellingOrder === booking.order ? `${t("cancel")}...` : t("cancel")}
                      </button>

                    </>
                  )}
                  {/* <button className="hotel-bookig-action-btn button-primary">
                  {t("modify")}
                </button> */}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination - matching SearchResult style */}
      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={handlePageChange}
        />
      )}

      {/* Cancellation Policy Modal */}
      {
        isCancellationModalOpen && cancellationPoliciesData && (
          <div className="room-modal-overlay" onClick={handleCloseCancellationModal}>
            <div className="cancellation-policy-modal" onClick={(e) => e.stopPropagation()}>
              <div className="room-modal-header d-flex align-items-center">
                <button
                  className="room-modal-close p-0"
                  onClick={handleCloseCancellationModal}
                >
                  <Image
                    src={ClosePopupIcon}
                    width={24}
                    height={24}
                    alt="close icon"
                  />
                </button>
                <h2 className="room-modal-title">
                  {t("cancellationPolicy") || "Cancellation Policy"}
                </h2>
              </div>

              <div className="cancellation-policy-modal-body">
                <div className="cancellation-policies-section">
                  <h3 className="policy-section-title">
                    {t("cancellationCharges") || "Cancellation Charges"}
                  </h3>
                  <p className="policy-description">
                    {t("cancellationPolicyDescription") || "The following cancellation charges will apply:"}
                  </p>

                  <div className="policies-list">
                    {(() => {
                      const displayPolicies = cancellationPoliciesData.policies.filter((policy, index, self) => {
                        const isPast = new Date() > new Date(policy.from);
                        return index === self.findIndex((p) => {
                          const pIsPast = new Date() > new Date(p.from);
                          if (isPast && pIsPast) {
                            return p.from === policy.from;
                          }
                          return p.from === policy.from && p.amount === policy.amount;
                        });
                      });

                      return displayPolicies.map((policy, index) => {
                        const formattedDate = formatCancellationDate(policy.from);
                        const amount = Number(policy.amount) || 0;
                        const isPast = new Date() > new Date(policy.from);

                        return (
                          <div key={policy.id} className="policy-item">
                            <div className="policy-date-amount">
                              <div className="policy-date">
                                {formattedDate ? (
                                  <>
                                    <span className="policy-date-label">
                                      {t("cancelAfter") || "Cancel after"}:
                                    </span>
                                    <span className="policy-date-value">{formattedDate}</span>
                                  </>
                                ) : (
                                  <span className="policy-date-value">N/A</span>
                                )}
                              </div>
                              {isPast ? (
                                <div className="policy-amount d-inline-flex align-items-center">
                                  <span className="policy-non-refundable" style={{ color: "#EF4444", fontWeight: 500 }}>
                                    {t("nonRefundable") || "Non-refundable."}
                                  </span>
                                </div>
                              ) : (
                                <div className="policy-amount d-inline-flex align-items-center">
                                  <span className="policy-amount-label">
                                    {t("penaltyAmount") || "Penalty Amount"}:
                                  </span>
                                  <span
                                    className="currency-icon"
                                    aria-hidden="true"
                                    dangerouslySetInnerHTML={{
                                      __html: buildCurrencySvgMarkup("#09090b"),
                                    }}
                                    style={{ display: "inline-flex", margin: "0 4px" }}
                                  />
                                  <span className="policy-amount-value">
                                    {priceFormatter.format(amount)}
                                  </span>
                                </div>
                              )}
                            </div>
                            {/* {index < displayPolicies.length - 1 && (
                              <div className="policy-separator"></div>
                            )} */}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                <div className="cancellation-modal-actions">
                  <button
                    className="button-secondary"
                    onClick={handleCloseCancellationModal}
                    disabled={cancellingOrder !== null}
                  >
                    {t("cancel") || "Cancel"}
                  </button>
                  <button
                    className="button-primary"
                    onClick={handleConfirmCancellation}
                    disabled={cancellingOrder !== null}
                  >
                    {cancellingOrder ? `${t("confirmCancellation") || "Confirming"}...` : t("confirmCancellation") || "Confirm Cancellation"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
