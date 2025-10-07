"use client";
import Image from "next/image";
import "./Checkout.scss";
import MsaterCardIcon from "@/assets/images/master-card-icon.svg";
import PaypalCardIcon from "@/assets/images/paypal-card-icon.svg";
import StripeCardIcon from "@/assets/images/stripe-card-icon.svg";
import UnionCardIcon from "@/assets/images/union-card-icon.svg";
import visaCardIcon from "@/assets/images/visa-card-icon.svg";
import AmericanExpressIcon from "@/assets/images/american-card-icon.svg";
import BookingHotelInfoImage from "@/assets/images/booking-hotel-info-image.jpg";
import { useRouter } from "next/navigation";

function CheckoutComponent() {
  const router = useRouter();
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
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
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
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
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
                  stroke-width="2"
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
            <div className="booking-detail-box booking-traveler-details">
              <h3 className="booking-details-sub-title">Traveler Details</h3>
              <div className="booking-details-form mandatory-field">
                <h3 className="booking-form-title">Primary Guest</h3>
                <form action="" className="booking-form-content form-field ">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName " className="form-label">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        placeholder="Zahid"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="lastName" className="form-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        placeholder="Hossain"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName " className="form-label">
                        Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="zahidhossain@gmail.com"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="lastName" className="form-label">
                        Country/ Region
                      </label>
                      <input
                        type="text"
                        id="Your country"
                        placeholder="Your country"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName " className="form-label">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        id="PhoneNumberl"
                        placeholder="19511-123456"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group"></div>
                  </div>
                </form>
              </div>

              <div className="booking-details-form special-request-field">
                <h3 className="booking-form-title">Special Request</h3>
                <p className="booking-form-desc">
                  Please write your request in English or Arabic.
                </p>
                <form action="" className="booking-form-content form-field ">
                  <div className="form-row">
                    <div className="form-group d-flex">
                      <textarea
                        id="specialRequests"
                        rows={5}
                        placeholder="Enter any requests..."
                        className="form-input w-100 text-field"
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="booking-detail-box booking-traveler-details choose-payment-option">
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
            </div>
          </div>
          <div className="review-booking-details-right">
            <div className="hotel-info-header">
              <div className="booking-hotel-info d-flex align-items-start">
                <div className="booking-hotel-image">
                  <Image
                    src={BookingHotelInfoImage}
                    width={44}
                    height={44}
                    alt="hotel image"
                    className="booking-hotel-img"
                  />
                </div>
                <div className="booking-hotel-content">
                  <h3 className="hotel-name">Novotel Bangkok</h3>
                  <span className="booking-guest-info">
                    2 Guests • 10 Nights
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
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M14.551 12C14.551 13.3807 13.4317 14.5 12.051 14.5C10.6703 14.5 9.55099 13.3807 9.55099 12C9.55099 10.6193 10.6703 9.5 12.051 9.5C13.4317 9.5 14.551 10.6193 14.551 12Z"
                        stroke="#09090B"
                        stroke-width="1.5"
                      />
                      <path
                        d="M5 12L6 12"
                        stroke="#09090B"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M18 12L19 12"
                        stroke="#09090B"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                    </svg>
                    Hotel Fare
                  </div>
                  <div className="booking-pricing">$540</div>
                </div>
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
                    Discount
                  </div>
                  <div className="booking-pricing discount">-$51</div>
                </div>
                <div className="booking-review-separetor"></div>
                <div className="booking-tital-price d-flex align-items-center justify-content-between">
                  <span>Total Price</span>
                  <span>$51</span>
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
                    id="freeCancel"
                  />
                  <label className="form-check-label" htmlFor="freeCancel">
                    I agree to <a href="#">Terms</a> and{" "}
                    <a href="#">Privacy Policy.</a>
                  </label>
                </div>
              </div>
              <div className="check-availability-action">
                <button className="button-primary check-availability-btn" onClick={() => router.push(`/booking-confirmation`)}>
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
