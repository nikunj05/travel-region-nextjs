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
import { destinationService } from "@/services/destinationService";
import type { PopularDestinationItem } from "@/types/destination";
import { useRouter } from "next/navigation";
import { useHotelSearchStore } from "@/store/hotelSearchStore";
import { getTodayAtMidnight } from "@/lib/dateUtils";
import { useSearchFiltersStore } from "@/store/searchFiltersStore";

const Popular = () => {
  const t = useTranslations("PopularSection");
  const [destinations, setDestinations] = React.useState<PopularDestinationItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const router = useRouter();
  const setLocation = useSearchFiltersStore((s) => s.setLocation);

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await destinationService.getPopularDestinations();
        console.log("Popular destinations:", res.data.destinations);
        setDestinations(res.data.destinations || []);
      } catch (error) {
        console.error("Failed to fetch popular destinations", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleViewDetails = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item?: PopularDestinationItem
  ) => {
    e.preventDefault();
    if (!item) return;

    const latitude = parseFloat(item.latitude);
    const longitude = parseFloat(item.longitude);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return;

    const today = getTodayAtMidnight();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Set visible location (city) for header/search UI
    setLocation({
      id: String(item.id),
      name: item.city || item.location,
      country: item.country || "",
      region: item.state,
      coordinates: { lat: latitude, lng: longitude },
    });

    useHotelSearchStore.getState().setDates(today, tomorrow);
    useHotelSearchStore.getState().setRooms([{ adults: 2, children: 0 }]);
    useHotelSearchStore.getState().setLanguage("eng");
    useHotelSearchStore.getState().setCoordinates(latitude, longitude);
    
    // We don't search here. Just set the state and navigate.
    // The search-result page will trigger the search.
    router.push("/search-result");
  };

  return (
    <section className="popular-destinations-section section-space-tb">
      <div className="container">
        <div className="heading_section">
          <h1 className="section-title">{t("title")}</h1>
          {/* <p className="section-description mx-width-790">
            {t("description")}
          </p> */}
        </div>
        <div className="destination-card-mian">
          {isLoading ? (
            <>
              <div className="destination-card d-flex card-first-row">
                <div className="destination-card-items">
                  <div
                    className="destination-card-image"
                    style={{ width: 789, height: 408, background: '#f0f0f0' }}
                  />
                  <div className="property-location-tag" style={{ width: 180, height: 24, background: '#f0f0f0' }} />
                  <div className="destination-card-inner-content">
                    <div style={{ width: 140, height: 20, background: '#f0f0f0' }} />
                    <div style={{ width: 120, height: 28, background: '#f0f0f0', marginTop: 8 }} />
                  </div>
                </div>
                <div className="destination-card-items">
                  <div
                    className="destination-card-image"
                    style={{ width: 379, height: 408, background: '#f0f0f0' }}
                  />
                  <div className="property-location-tag" style={{ width: 160, height: 24, background: '#f0f0f0' }} />
                  <div className="destination-card-inner-content">
                    <div style={{ width: 140, height: 20, background: '#f0f0f0' }} />
                    <div style={{ width: 120, height: 28, background: '#f0f0f0', marginTop: 8 }} />
                  </div>
                </div>
              </div>
              <div className="destination-card d-flex">
                <div className="destination-card-items">
                  <div
                    className="destination-card-image"
                    style={{ width: 379, height: 408, background: '#f0f0f0' }}
                  />
                  <div className="property-location-tag" style={{ width: 160, height: 24, background: '#f0f0f0' }} />
                  <div className="destination-card-inner-content">
                    <div style={{ width: 140, height: 20, background: '#f0f0f0' }} />
                    <div style={{ width: 120, height: 28, background: '#f0f0f0', marginTop: 8 }} />
                  </div>
                </div>
                <div className="destination-card-items">
                  <div
                    className="destination-card-image"
                    style={{ width: 789, height: 408, background: '#f0f0f0' }}
                  />
                  <div className="property-location-tag" style={{ width: 180, height: 24, background: '#f0f0f0' }} />
                  <div className="destination-card-inner-content">
                    <div style={{ width: 140, height: 20, background: '#f0f0f0' }} />
                    <div style={{ width: 120, height: 28, background: '#f0f0f0', marginTop: 8 }} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
          <div className="destination-card d-flex card-first-row">
            <div className="destination-card-items">
              <Image
                src={destinations[0]?.full_image_url || popularDestinationsImg1}
                width={789}
                height={408}
                alt={destinations[0]?.location || "Santorini, Greece"}
                className="destination-card-image"
              />
              <div className="property-location-tag">
                <Image
                  src={locationFillIcon}
                  width={16}
                  height={16}
                  alt="location icon"
                />{" "}
                {destinations[0]?.location || t("destinations.santorini")}
              </div>
              <div className="destination-card-inner-content">
                <p className="hotel-available-status d-flex align-items-center">
                  <Image
                    src={hotelsAvailableIcon}
                    width={20}
                    height={20}
                    alt="hotel icon"
                  />{" "}
                  {destinations[0]?.hotel_count ?? 0} {t("hotelsAvailable")}
                </p>
                <h5 className="destination-hotel-pricing">
                  <div>{t("from")}</div> ${destinations[0]?.hotel_min_price ?? 0}{" "}
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
                    onClick={(e) => handleViewDetails(e, destinations[0])}
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
                src={destinations[1]?.full_image_url || popularDestinationsImg2}
                width={379}
                height={408}
                alt={destinations[1]?.location || "Dubai, UAE"}
                className="destination-card-image"
              />
              <div className="property-location-tag">
                <Image
                  src={locationFillIcon}
                  width={16}
                  height={16}
                  alt="location icon"
                />{" "}
                {destinations[1]?.location || t("destinations.dubai")}
              </div>
              <div className="destination-card-inner-content">
                <p className="hotel-available-status d-flex align-items-center">
                  <Image
                    src={hotelsAvailableIcon}
                    width={20}
                    height={20}
                    alt="hotel icon"
                  />{" "}
                  {destinations[1]?.hotel_count ?? 0} {t("hotelsAvailable")}
                </p>
                <h5 className="destination-hotel-pricing">
                  <div>{t("from")}</div> ${destinations[1]?.hotel_min_price ?? 0}{" "}
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
                    onClick={(e) => handleViewDetails(e, destinations[1])}
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
                src={destinations[2]?.full_image_url || popularDestinationsImg3}
                width={379}
                height={408}
                alt={destinations[2]?.location || "Navigo, Greece"}
                className="destination-card-image"
              />
              <div className="property-location-tag">
                <Image
                  src={locationFillIcon}
                  width={16}
                  height={16}
                  alt="location icon"
                />
                {destinations[2]?.location || t("destinations.navigo")}
              </div>
              <div className="destination-card-inner-content">
                <p className="hotel-available-status d-flex align-items-center">
                  <Image
                    src={hotelsAvailableIcon}
                    width={20}
                    height={20}
                    alt="hotel icon"
                  />{" "}
                  {destinations[2]?.hotel_count ?? 0} {t("hotelsAvailable")}
                </p>
                <h5 className="destination-hotel-pricing">
                  <div>{t("from")}</div> ${destinations[2]?.hotel_min_price ?? 0}{" "}
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
                    onClick={(e) => handleViewDetails(e, destinations[2])}
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
                src={destinations[3]?.full_image_url || popularDestinationsImg4}
                width={789}
                height={408}
                alt={destinations[3]?.location || "Maldives"}
                className="destination-card-image"
              />
              <div className="property-location-tag">
                <Image
                  src={locationFillIcon}
                  width={16}
                  height={16}
                  alt="location icon"
                />{" "}
                {destinations[3]?.location || t("destinations.maldives")}
              </div>
              <div className="destination-card-inner-content">
                <p className="hotel-available-status d-flex align-items-center">
                  <Image
                    src={hotelsAvailableIcon}
                    width={20}
                    height={20}
                    alt="hotel icon"
                  />{" "}
                  {destinations[3]?.hotel_count ?? 0} {t("hotelsAvailable")}
                </p>
                <h5 className="destination-hotel-pricing">
                  <div>{t("from")}</div> ${destinations[3]?.hotel_min_price ?? 0}{" "}
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
                    onClick={(e) => handleViewDetails(e, destinations[3])}
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
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Popular;
