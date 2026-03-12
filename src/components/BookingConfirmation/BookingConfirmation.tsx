'use client'
import React, { useEffect, useState } from "react";
import "./BookingConfirmation.scss";
import Image from "next/image";
import BookingConfirmIcon from "@/assets/images/booking-confirmed-icon.svg";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { bookingService } from "@/services/bookingService";
import { toast } from "react-toastify";
import { BookingDetailsData } from "@/types/booking";

interface BookingConfirmationCompProps {
  bookingId?: string;
}

interface BookingData {
  order: string;
  email: string;
  status?: string;
}

function BookingConfirmationComp({ bookingId }: BookingConfirmationCompProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("BookingConfirmation");
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [delayCompleted, setDelayCompleted] = useState(false);

  // Ensure we always show a short pending/loading state (1–2s) before showing final status
  useEffect(() => {
    const timer = setTimeout(() => setDelayCompleted(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (bookingId) {
      const fetchBookingDetails = async () => {
        try {
          setLoading(true);
          const response = await bookingService.getBookingDetails(bookingId);
          console.log("📋 Booking Details Response:", response);

          if (response.status && response.data) {
            const bookingData = response.data as BookingDetailsData;
            const booking = bookingData.booking;
            if (booking) {
              const email =
                booking.details && booking.details.length > 0
                  ? booking.details[0].email
                  : "";

              let currentStatus = typeof booking.status === "string" ? booking.status : undefined;
              const paymentStatus = typeof booking.payment_status === "string"
                ? booking.payment_status.toLowerCase()
                : "";

              if (paymentStatus === "declined" || paymentStatus === "decline") {
                toast.error("Payment failed.");
                currentStatus = "failed";
              }

              setBookingData({
                order: booking.order || bookingId,
                email: email,
                status: currentStatus,
              });
            } else {
              setBookingData({
                order: bookingId,
                email: "",
                status: "not_found",
              });
            }
          } else {
            setBookingData({
              order: bookingId,
              email: "",
              status: "not_found",
            });
          }
        } catch (error) {
          console.error("❌ Error fetching booking details:", error);
          setBookingData({
            order: bookingId,
            email: "",
            status: "not_found",
          });
        } finally {
          setLoading(false);
        }
      };
      fetchBookingDetails();
    } else {
      setLoading(false);
    }
  }, [bookingId]);
  const status = (bookingData?.status || "").toString().toLowerCase();

  const handleRetryPayment = async () => {
    try {
      const order = bookingData?.order || bookingId;

      if (!order || typeof order !== "string") {
        console.error("Order not found. Please try again from checkout.");
        toast.error("Order not found. Please try again from checkout.");
        return;
      }

      const checkoutPayload = { order };
      console.log("🛒 Retry Checkout Payload:", checkoutPayload);

      const checkoutResponse = await bookingService.checkout(checkoutPayload);

      console.log("✅ Retry Checkout Response:", checkoutResponse);
      console.log("📋 Checkout Status:", checkoutResponse.status);
      console.log("📋 Checkout Message:", checkoutResponse.message);
      if (checkoutResponse.data) {
        console.log("📋 Checkout Data:", checkoutResponse.data);
      }

      if (checkoutResponse.status) {
        const redirectUrl = checkoutResponse.data?.checkout?.transaction?.url;
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          router.push(`/${locale}/booking-confirmation`);
        }
      } else {
        toast.error(checkoutResponse.message || "Checkout failed. Please try again.");
      }
    } catch (error) {
      console.error("❌ Retry Checkout Error:", error);
      toast.error("An error occurred during checkout. Please try again.");
    }
  };

  const handlePrintConfirmation = async () => {
    try {
      const order = bookingData?.order || bookingId;
      if (!order) {
        console.error("Order ID not found");
        toast.error("Order ID not found");
        return;
      }
      const response = await bookingService.getBookingPdf(order);
      // console.log("Print Confirmation Response:", response);

      if (response.status && response.data?.pdf_url) {
        window.open(response.data.pdf_url, "_blank");
      } else {
        toast.error(response.message || "Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error fetching PDF:", error);
      toast.error("Failed to fetch confirmation PDF");
    }
  };

  const isLoadingState = loading || !delayCompleted;

  const renderContent = () => {
    if (isLoadingState) {
      return (
        <div className="booking-confirmation-skeleton">
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line skeleton-subtitle" />
          <div className="skeleton-line skeleton-subtitle short" />
          <div className="skeleton-action-group">
            <div className="skeleton-line skeleton-button" />
            <div className="skeleton-line skeleton-button" />
          </div>
        </div>
      );
    }

    // Pending payment
    if (status === "pending") {
      return (
        <>
          <h1 className="card-title">
            {t("pendingPaymentTitle")}
          </h1>
          <p className="card-booking-num">
            {t("bookingReference")}{" "}
            <span className="card-booking-id">
              #{bookingData?.order || bookingId || "N/A"}
            </span>
          </p>
          {bookingData?.email && (
            <p className="confirmation-email">
              {t("notifyEmailPending")}{" "}
              <span className="confirmation-email-address">
                {bookingData.email}
              </span>{" "}
              {t("oncePaymentCompleted")}
            </p>
          )}
          <div className="booking-action d-flex align-items-center">
            <button
              className="button-primary print-button"
              onClick={handleRetryPayment}
            >
              {t("retryPayment")}
            </button>
          </div>
        </>
      );
    }

    // Failed / Cancelled payment
    if (status === "failed" || status === "cancelled" || status === "canceled") {
      return (
        <div className="failed-card">
          <div className="ico-box">
            <svg
              width="140"
              height="140"
              viewBox="0 0 140 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="booking-failed-img"
            >
              <path d="M130.319 56.2769C128.522 55.0704 126.899 53.623 125.495 51.9751C125.599 49.6808 126.061 47.4168 126.862 45.2645C128.369 40.1634 130.246 33.8147 126.629 28.8469C122.986 23.8397 116.331 23.6716 110.985 23.5349C108.735 23.6248 106.485 23.3829 104.307 22.817C103.109 20.9381 102.194 18.8929 101.592 16.7474C99.8084 11.6669 97.5861 5.34351 91.6345 3.40941C85.8596 1.53249 80.6768 5.09847 76.1071 8.23433C74.2706 9.7006 72.2087 10.8597 70.0016 11.6667C67.7933 10.8606 65.7305 9.70141 63.8936 8.23433C59.3236 5.09572 54.1395 1.54098 48.3659 3.40941C42.4159 5.34351 40.1943 11.6637 38.4083 16.7454C37.8076 18.8802 36.903 20.9176 35.7224 22.795C33.5369 23.378 31.2757 23.6268 29.0157 23.5329C23.6695 23.6693 17.0145 23.8376 13.3715 28.8446C9.7548 33.8152 11.6313 40.1638 13.1382 45.2655C13.9305 47.4062 14.3958 49.6542 14.5182 51.9336C13.121 53.6048 11.4919 55.0674 9.68039 56.2771C5.36667 59.5669 0 63.6624 0 70C0 76.3377 5.36667 80.4332 9.68131 83.7232C11.4784 84.9297 13.1014 86.3771 14.5049 88.025C14.4007 90.3193 13.9394 92.5833 13.1378 94.7355C11.631 99.8367 9.75434 106.186 13.3711 111.153C17.014 116.16 23.669 116.329 29.0155 116.465C31.2645 116.376 33.5146 116.617 35.6932 117.183C36.8911 119.062 37.8057 121.107 38.4076 123.253C40.1936 128.334 42.4152 134.657 48.3666 136.592C49.4211 136.937 50.5237 137.113 51.6334 137.113C56.1124 137.113 60.2025 134.302 63.8941 131.767C65.7305 130.3 67.7925 129.141 69.9998 128.333C72.2082 129.14 74.2711 130.299 76.1082 131.766C80.678 134.904 85.8607 138.456 91.6357 136.591C97.5857 134.657 99.8073 128.336 101.593 123.255C102.194 121.12 103.099 119.082 104.279 117.205C106.465 116.622 108.726 116.373 110.986 116.467C116.332 116.331 122.987 116.162 126.63 111.155C130.247 106.185 128.37 99.836 126.863 94.7346C126.071 92.5938 125.606 90.3459 125.483 88.0665C126.881 86.3953 128.51 84.9326 130.321 83.7229C134.633 80.4332 140 76.3377 140 70C140 63.6624 134.633 59.5669 130.319 56.2769ZM58.5851 51.2909L70.0003 62.7061L81.4155 51.2909C83.6927 49.0131 87.3852 49.0124 89.6631 51.2896C91.941 53.5668 91.9417 57.2593 89.6645 59.5371L78.2493 70.9523L89.6645 82.3675C91.9417 84.6453 91.9402 88.3378 89.6631 90.615C87.3852 92.8922 83.6927 92.8915 81.4155 90.6143L70.0003 79.1991L58.5851 90.6143C56.3079 92.8915 52.6154 92.8922 50.3375 90.615C48.0604 88.3378 48.0589 84.6453 50.3361 82.3675L61.7513 70.9523L50.3361 59.5371C48.0589 57.2593 48.0604 53.5668 50.3375 51.2896C52.6154 49.0124 56.3079 49.0131 58.5851 51.2909Z" fill="#FF6B6B" />
            </svg>
          </div>

          <h1 className="card-title">
            {t("failedTitle")}
          </h1>
          <p className="card-booking-num">
            {t("bookingReference")}{" "}
            <span className="card-booking-id">
              #{bookingData?.order || bookingId || "N/A"}
            </span>
          </p>
          {bookingData?.email && (
            <p className="confirmation-email">
              {t("notifyEmailFailed")}{" "}
              <span className="confirmation-email-address">
                {bookingData.email}
              </span>
            </p>
          )}
          <p className="failed-message">
            {t("failedMessage")}
          </p>

          <div className="booking-action d-flex align-items-center">
            {status === "failed" && (
              <button
                className="button-primary try-again-button"
                onClick={handleRetryPayment}
              >
                {t("tryAgain")}
              </button>
            )}
            <button
              className="button-primary contact-button"
              onClick={() => {
                window.location.href = "#";
              }}
            >
              {t("contactSupport")}
              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.5 12L4.5 12M20.5 12L15.5001 17M20.5 12L15.5 7"
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          </div>
        </div>
      );
    }

    // Not Found payment
    if (status === "not_found") {
      return (
        <div className="failed-card">
          <div className="ico-box">
            <svg
              width="140"
              height="140"
              viewBox="0 0 140 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="booking-failed-img"
            >
              <circle cx="70" cy="70" r="70" fill="#f8f9fa" />
              <path d="M70 30C47.9086 30 30 47.9086 30 70C30 92.0914 47.9086 110 70 110C92.0914 110 110 92.0914 110 70C110 47.9086 92.0914 30 70 30ZM70 102C52.3269 102 38 87.6731 38 70C38 52.3269 52.3269 38 70 38C87.6731 38 102 52.3269 102 70C102 87.6731 87.6731 102 70 102ZM76.5 50H63.5V75H76.5V50ZM76.5 82H63.5V90H76.5V82Z" fill="#6c757d" />
            </svg>
          </div>

          <h1 className="card-title">
            Booking Not Found
          </h1>
          <p className="card-booking-num">
            {t("bookingReference")}{" "}
            <span className="card-booking-id">
              #{bookingId || "N/A"}
            </span>
          </p>
          <p className="failed-message">
            We couldn&apos;t find any booking details matching this reference number.
          </p>

          <div className="booking-action d-flex align-items-center">
            <button
              className="button-primary view-button"
              onClick={() => router.push(`/${locale}`)}
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }

    // Default: success
    return (
      <>
        <h1 className="card-title">
          {t("successTitle")}
        </h1>
        <p className="card-booking-num">
          {t("yourBookingNumber")}{" "}
          <span className="card-booking-id">
            #{bookingData?.order || bookingId || "N/A"}
          </span>
        </p>
        {bookingData?.email && (
          <p className="confirmation-email">
            {t("confirmationEmailSent")}{" "}
            <span className="confirmation-email-address">
              {bookingData.email}
            </span>
          </p>
        )}

        <div className="booking-action d-flex align-items-center">
          <button className="button-primary print-button" onClick={handlePrintConfirmation}>
            <svg
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.85396 18C5.73084 18 4.66928 18 3.91349 17.5468C3.41953 17.2506 3.02158 16.8271 2.76475 16.3242C2.37179 15.5547 2.47742 14.5373 2.68868 12.5025C2.86503 10.8039 2.95321 9.95455 3.38684 9.33081C3.67153 8.92129 4.05659 8.58564 4.50797 8.35353C5.19548 8 6.08164 8 7.85396 8H17.146C18.9184 8 19.8045 8 20.492 8.35353C20.9434 8.58564 21.3285 8.92129 21.6132 9.33081C22.0468 9.95455 22.135 10.8039 22.3113 12.5025C22.5226 14.5373 22.6282 15.5547 22.2352 16.3242C21.9784 16.8271 21.5805 17.2506 21.0865 17.5468C20.3307 18 19.2692 18 17.146 18"
                stroke="#3E5B96"
                strokeWidth="1.5"
              />
              <path
                d="M17.5 8V6C17.5 4.11438 17.5 3.17157 16.9142 2.58579C16.3284 2 15.3856 2 13.5 2H11.5C9.61438 2 8.67157 2 8.08579 2.58579C7.5 3.17157 7.5 4.11438 7.5 6V8"
                stroke="#3E5B96"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M14.4887 16L10.5113 16C9.82602 16 9.48337 16 9.19183 16.1089C8.80311 16.254 8.47026 16.536 8.2462 16.9099C8.07815 17.1904 7.99505 17.5511 7.82884 18.2724C7.56913 19.3995 7.43928 19.963 7.52759 20.4149C7.64535 21.0174 8.01237 21.5274 8.52252 21.7974C8.90513 22 9.44052 22 10.5113 22L14.4887 22C15.5595 22 16.0949 22 16.4775 21.7974C16.9876 21.5274 17.3547 21.0174 17.4724 20.4149C17.5607 19.963 17.4309 19.3995 17.1712 18.2724C17.005 17.5511 16.9218 17.1904 16.7538 16.9099C16.5297 16.536 16.1969 16.254 15.8082 16.1089C15.5166 16 15.174 16 14.4887 16Z"
                stroke="#3E5B96"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M18.5 12H18.509"
                stroke="#3E5B96"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t("printConfirmation")}
          </button>
          <button
            className="button-primary view-button"
            onClick={() => router.push(`/${locale}/bookings`)}
          >
            {t("viewMyBooking")}
            <svg
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.5 12L4.5 12M20.5 12L15.5001 17M20.5 12L15.5 7"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <main className="booking-confirmation-page padding-top-100">
        <div className="booking-confirmation-inner section-space-tb">
          <div className="container">
            <div className="confirm-wrap">
              <div className="confirm-card">
                {isLoadingState ? (
                  <div className="ico-box">
                    <div className="skeleton-line skeleton-circle" />
                  </div>
                ) : status === "failed" ||
                  status === "cancelled" ||
                  status === "canceled" ||
                  status === "not_found" ? null : status === "pending" ? (
                    <div className="ico-box">
                      <svg
                        width="140"
                        height="140"
                        viewBox="0 0 140 140"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="booking-confirmation-img"
                      >
                        <path
                          d="M130.319 56.2769C128.522 55.0704 126.899 53.623 125.495 51.9751C125.599 49.6808 126.061 47.4168 126.862 45.2645C128.369 40.1634 130.246 33.8147 126.629 28.8469C122.986 23.8397 116.331 23.6716 110.985 23.5349C108.735 23.6248 106.485 23.3829 104.307 22.817C103.109 20.9381 102.194 18.8929 101.592 16.7474C99.8084 11.6669 97.5861 5.34351 91.6345 3.40941C85.8596 1.53249 80.6768 5.09847 76.1071 8.23433C74.2706 9.7006 72.2087 10.8597 70.0016 11.6667C67.7933 10.8606 65.7305 9.70141 63.8936 8.23433C59.3236 5.09572 54.1395 1.54098 48.3659 3.40941C42.4159 5.34351 40.1943 11.6637 38.4083 16.7454C37.8076 18.8802 36.903 20.9176 35.7224 22.795C33.5369 23.378 31.2757 23.6268 29.0157 23.5329C23.6695 23.6693 17.0145 23.8376 13.3715 28.8446C9.7548 33.8152 11.6313 40.1638 13.1382 45.2655C13.9305 47.4062 14.3958 49.6542 14.5182 51.9336C13.121 53.6048 11.4919 55.0674 9.68039 56.2771C5.36667 59.5669 0 63.6624 0 70C0 76.3377 5.36667 80.4332 9.68131 83.7232C11.4784 84.9297 13.1014 86.3771 14.5049 88.025C14.4007 90.3193 13.9394 92.5833 13.1378 94.7355C11.631 99.8367 9.75434 106.186 13.3711 111.153C17.014 116.16 23.669 116.329 29.0155 116.465C31.2645 116.376 33.5146 116.617 35.6932 117.183C36.8911 119.062 37.8057 121.107 38.4076 123.253C40.1936 128.334 42.4152 134.657 48.3666 136.592C49.4211 136.937 50.5237 137.113 51.6334 137.113C56.1124 137.113 60.2025 134.302 63.8941 131.767C65.7305 130.3 67.7925 129.141 69.9998 128.333C72.2082 129.14 74.2711 130.299 76.1082 131.766C80.678 134.904 85.8607 138.456 91.6357 136.591C97.5857 134.657 99.8073 128.336 101.593 123.255C102.194 121.12 103.099 119.082 104.279 117.205C106.465 116.622 108.726 116.373 110.986 116.467C116.332 116.331 122.987 116.162 126.63 111.155C130.247 106.185 128.37 99.836 126.863 94.7346C126.071 92.5938 125.606 90.3459 125.483 88.0665C126.881 86.3953 128.51 84.9326 130.321 83.7229C134.633 80.4332 140 76.3377 140 70C140 63.6624 134.633 59.5669 130.319 56.2769Z"
                          fill="#F4A261"
                        />
                        <circle cx="70" cy="70" r="30" stroke="white" strokeWidth="8" fill="none" />
                        <path d="M70 50 V70 L82 82" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  ) : (
                  <div className="ico-box">
                    <Image
                      src={BookingConfirmIcon}
                      alt="Checkmark"
                      width={140}
                      height={140}
                      className="booking-confirmation-img"
                    />
                  </div>
                )}
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default BookingConfirmationComp;
