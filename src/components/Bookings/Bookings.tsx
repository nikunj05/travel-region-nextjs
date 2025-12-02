"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useMemo } from "react";
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

export default function Bookings() {
  const t = useTranslations("Bookings");
  const { bookings, loading, error, fetchBookings, total, perPage, currentPage: storeCurrentPage, lastPage } = useBookingsListStore();
  const [filters, setFilters] = useState<BookingFiltersState>({
    status: "",
    hotel_code: "",
  });
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  console.log("bookings", bookings);

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
  console.log("Pagination debug:", { total, perPage, lastPage, totalPages, currentPage });

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
      {loading && (
        <div className="text-center py-5">
          <p>Loading bookings...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-5 text-danger">
          <p>{error}</p>
        </div>
      )}
      {!loading && !error && bookings.length === 0 && (
        <div className="text-center py-5">
          <p>No bookings found</p>
        </div>
      )}
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
              <div className="hotel-booking-image">
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
                  <h2 className="hotel-title">{hotelName}</h2>
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
                <button
                  className="hotel-bookig-action-btn cancel-button"
                  onClick={() => handleCancelBooking(booking.order)}
                  disabled={cancellingOrder === booking.order}
                >
                  {cancellingOrder === booking.order ? `${t("cancel")}...` : t("cancel")}
                </button>
                {/* <button className="hotel-bookig-action-btn button-primary">
                  {t("modify")}
                </button> */}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Pagination - matching SearchResult style */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
}
