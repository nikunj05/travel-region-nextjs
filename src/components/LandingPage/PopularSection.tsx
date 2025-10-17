"use client";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import popularDestinationsImg1 from "@/assets/images/popular-destinations-img1.png";
import popularDestinationsImg2 from "@/assets/images/popular-destinations-img2.png";
import popularDestinationsImg3 from "@/assets/images/popular-destinations-img3.png";
import popularDestinationsImg4 from "@/assets/images/popular-destinations-img4.png";
import locationFillIcon from "@/assets/images/location-fill-icon.svg";
import hotelsAvailableIcon from "@/assets/images/hotels-available-icon.svg";

const Popular = () => {
  const t = useTranslations("PopularSection");

  return (
    <section className="popular-destinations-section section-space-tb">
      <div className="container">
        <div className="heading_section">
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-description mx-width-790">
            {t("description")}
          </p>
        </div>
        <div className="destination-card-mian">
          <div className="destination-card d-flex card-first-row">
            <div className="destination-card-items">
              <Image
                src={popularDestinationsImg1}
                width={789}
                height={408}
                alt="Santorini, Greece"
                className="destination-card-image"
              />
              <div className="property-location-tag">
                <Image
                  src={locationFillIcon}
                  width={16}
                  height={16}
                  alt="location icon"
                />{" "}
                {t("destinations.santorini")}
              </div>
              <div className="destination-card-inner-content">
                <p className="hotel-available-status d-flex align-items-center">
                  <Image
                    src={hotelsAvailableIcon}
                    width={20}
                    height={20}
                    alt="hotel icon"
                  />{" "}
                  31 {t("hotelsAvailable")}
                </p>
                <h5 className="destination-hotel-pricing">
                  <div>{t("from")}</div> $179{" "}
                  <span className="destination-hotel-pricing-night">
                    {t("perNight")}
                  </span>
                </h5>
              </div>
              <div className="overlay">
                <div className="overlay-content">
                  <a
                    href="#"
                    className="d-flex justify-content-center view-more-details-btn"
                  >
                    <svg
                      width="65"
                      height="64"
                      viewBox="0 0 65 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.5"
                        width="64"
                        height="64"
                        rx="32"
                        fill="white"
                      />
                      <path
                        d="M40.5 24H41.5V23H40.5V24ZM40.5 24L39.7929 23.2929L23.7929 39.293L24.5 40.0001L25.2071 40.7072L41.2071 24.7071L40.5 24ZM31.1667 24V25H40.5V24V23H31.1667V24ZM40.5 24H39.5V33.3333H40.5H41.5V24H40.5Z"
                        fill="#09090B"
                      />
                    </svg>
                  </a>
                  <span>{t("viewDetails")}</span>
                </div>
              </div>
            </div>
            <div className="destination-card-items">
              <Image
                src={popularDestinationsImg2}
                width={379}
                height={408}
                alt="Dubai, UAE"
                className="destination-card-image"
              />
              <div className="property-location-tag">
                <Image
                  src={locationFillIcon}
                  width={16}
                  height={16}
                  alt="location icon"
                />{" "}
                {t("destinations.dubai")}
              </div>
              <div className="destination-card-inner-content">
                <p className="hotel-available-status d-flex align-items-center">
                  <Image
                    src={hotelsAvailableIcon}
                    width={20}
                    height={20}
                    alt="hotel icon"
                  />{" "}
                  31 {t("hotelsAvailable")}
                </p>
                <h5 className="destination-hotel-pricing">
                  <div>{t("from")}</div> $179{" "}
                  <span className="destination-hotel-pricing-night">
                    {t("perNight")}
                  </span>
                </h5>
              </div>
              <div className="overlay">
                <div className="overlay-content">
                  <a
                    href="#"
                    className="d-flex justify-content-center view-more-details-btn"
                  >
                    <svg
                      width="65"
                      height="64"
                      viewBox="0 0 65 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.5"
                        width="64"
                        height="64"
                        rx="32"
                        fill="white"
                      />
                      <path
                        d="M40.5 24H41.5V23H40.5V24ZM40.5 24L39.7929 23.2929L23.7929 39.293L24.5 40.0001L25.2071 40.7072L41.2071 24.7071L40.5 24ZM31.1667 24V25H40.5V24V23H31.1667V24ZM40.5 24H39.5V33.3333H40.5H41.5V24H40.5Z"
                        fill="#09090B"
                      />
                    </svg>
                  </a>
                  <span>{t("viewDetails")}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="destination-card d-flex">
            <div className="destination-card-items">
              <Image
                src={popularDestinationsImg3}
                width={379}
                height={408}
                alt="Navigo, Greece"
                className="destination-card-image"
              />
              <div className="property-location-tag">
                <Image
                  src={locationFillIcon}
                  width={16}
                  height={16}
                  alt="location icon"
                />
                {t("destinations.navigo")}
              </div>
              <div className="destination-card-inner-content">
                <p className="hotel-available-status d-flex align-items-center">
                  <Image
                    src={hotelsAvailableIcon}
                    width={20}
                    height={20}
                    alt="hotel icon"
                  />{" "}
                  31 {t("hotelsAvailable")}
                </p>
                <h5 className="destination-hotel-pricing">
                  <div>{t("from")}</div> $179{" "}
                  <span className="destination-hotel-pricing-night">
                    {t("perNight")}
                  </span>
                </h5>
              </div>
              <div className="overlay">
                <div className="overlay-content">
                  <a
                    href="#"
                    className="d-flex justify-content-center view-more-details-btn"
                  >
                    <svg
                      width="65"
                      height="64"
                      viewBox="0 0 65 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.5"
                        width="64"
                        height="64"
                        rx="32"
                        fill="white"
                      />
                      <path
                        d="M40.5 24H41.5V23H40.5V24ZM40.5 24L39.7929 23.2929L23.7929 39.293L24.5 40.0001L25.2071 40.7072L41.2071 24.7071L40.5 24ZM31.1667 24V25H40.5V24V23H31.1667V24ZM40.5 24H39.5V33.3333H40.5H41.5V24H40.5Z"
                        fill="#09090B"
                      />
                    </svg>
                  </a>
                  <span>{t("viewDetails")}</span>
                </div>
              </div>
            </div>
            <div className="destination-card-items">
              <Image
                src={popularDestinationsImg4}
                width={789}
                height={408}
                alt="Maldives"
                className="destination-card-image"
              />
              <div className="property-location-tag">
                <Image
                  src={locationFillIcon}
                  width={16}
                  height={16}
                  alt="location icon"
                />{" "}
                {t("destinations.maldives")}
              </div>
              <div className="destination-card-inner-content">
                <p className="hotel-available-status d-flex align-items-center">
                  <Image
                    src={hotelsAvailableIcon}
                    width={20}
                    height={20}
                    alt="hotel icon"
                  />{" "}
                  31 {t("hotelsAvailable")}
                </p>
                <h5 className="destination-hotel-pricing">
                  <div>{t("from")}</div> $179{" "}
                  <span className="destination-hotel-pricing-night">
                    {t("perNight")}
                  </span>
                </h5>
              </div>
              <div className="overlay">
                <div className="overlay-content">
                  <a
                    href="#"
                    className="d-flex justify-content-center view-more-details-btn"
                  >
                    <svg
                      width="65"
                      height="64"
                      viewBox="0 0 65 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.5"
                        width="64"
                        height="64"
                        rx="32"
                        fill="white"
                      />
                      <path
                        d="M40.5 24H41.5V23H40.5V24ZM40.5 24L39.7929 23.2929L23.7929 39.293L24.5 40.0001L25.2071 40.7072L41.2071 24.7071L40.5 24ZM31.1667 24V25H40.5V24V23H31.1667V24ZM40.5 24H39.5V33.3333H40.5H41.5V24H40.5Z"
                        fill="#09090B"
                      />
                    </svg>
                  </a>
                  <span>{t("viewDetails")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Popular;
