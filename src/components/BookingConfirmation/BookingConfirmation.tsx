import React from "react";
import "./BookingConfirmation.scss";
import Image from "next/image";
import BookingConfirmIcon from "@/assets/images/booking-confirmed-icon.svg";

function BookingConfirmationComp() {
  return (
    <>
      <main className="booking-confirmation-page padding-top-100">
        <div className="booking-confirmation-inner section-space-tb">
          <div className="container">
            <div className="confirm-wrap">
              <div className="confirm-card">
                <div className="ico-box">
                  <Image
                    src={BookingConfirmIcon}
                    alt="Checkmark"
                    width={140}
                    height={140}
                    className="booking-confirmation-img"
                  />
                </div>

                <h1 className="card-title">
                  🎉 Thank You! Your Booking is Confirmed.
                </h1>
                <p className="card-booking-num">
                  Your booking number is{" "}
                  <span className="card-booking-id">#MBR6521</span>
                </p>
                <p className="confirmation-email">
                  A confirmation email has been sent to{" "}
                  <span className="confirmation-email-address">
                    zahidhossain@email.com
                  </span>
                </p>

                <div className="booking-action d-flex align-items-center">
                  <button className="button-primary print-button">
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
                        stroke-width="1.5"
                      />
                      <path
                        d="M17.5 8V6C17.5 4.11438 17.5 3.17157 16.9142 2.58579C16.3284 2 15.3856 2 13.5 2H11.5C9.61438 2 8.67157 2 8.08579 2.58579C7.5 3.17157 7.5 4.11438 7.5 6V8"
                        stroke="#3E5B96"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M14.4887 16L10.5113 16C9.82602 16 9.48337 16 9.19183 16.1089C8.80311 16.254 8.47026 16.536 8.2462 16.9099C8.07815 17.1904 7.99505 17.5511 7.82884 18.2724C7.56913 19.3995 7.43928 19.963 7.52759 20.4149C7.64535 21.0174 8.01237 21.5274 8.52252 21.7974C8.90513 22 9.44052 22 10.5113 22L14.4887 22C15.5595 22 16.0949 22 16.4775 21.7974C16.9876 21.5274 17.3547 21.0174 17.4724 20.4149C17.5607 19.963 17.4309 19.3995 17.1712 18.2724C17.005 17.5511 16.9218 17.1904 16.7538 16.9099C16.5297 16.536 16.1969 16.254 15.8082 16.1089C15.5166 16 15.174 16 14.4887 16Z"
                        stroke="#3E5B96"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M18.5 12H18.509"
                        stroke="#3E5B96"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    Print Confirmation
                  </button>
                  <button className="button-primary view-button">
                    View my Booking
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
                        stroke-width="1.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default BookingConfirmationComp;
