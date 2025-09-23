"use client";
import React from "react";
import Image from "next/image";
import "./HotelDetails.scss";

//-Asstes
import mainImage from "@/assets/images/property-image.jpg";
import thumbnailImages1 from "@/assets/images/property-thumb-img1.jpg";
import thumbnailImages2 from "@/assets/images/property-thumb-img2.jpg";
import thumbnailImages3 from "@/assets/images/property-thumb-img3.jpg";
import thumbnailImages4 from "@/assets/images/property-thumb-img4.jpg";
import starFillIcon from "@/assets/images/star-fill-icon.svg";
import locationFillIcon from "@/assets/images/location-fill-icon.svg";
import poolIcon from "@/assets/images/pool-icon.svg";
import tvIcon from "@/assets/images/breackfast-icon.svg";
import restaurantIcon from "@/assets/images/breackfast-icon.svg";
import wifiIcon from "@/assets/images/breackfast-icon.svg";
import bathtubIcon from "@/assets/images/breackfast-icon.svg";
import golfIcon from "@/assets/images/breackfast-icon.svg";
import nightclubIcon from "@/assets/images/breackfast-icon.svg";
import elevatorIcon from "@/assets/images/breackfast-icon.svg";
import user1 from "@/assets/images/testimonials-slider-user-img1.png";
import user2 from "@/assets/images/testimonials-slider-user-img2.png";
import user3 from "@/assets/images/testimonials-slider-user-img3.png";
import mapImage from "@/assets/images/contact-us-image.jpg";

const HotelDetails = () => {
  const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>, tab: string) => {
    e.preventDefault();
    const element = document.getElementById(tab);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="hotel-details-page">
      <div className="container">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <a href="#">Home</a> &gt; <a href="#">Bangkok</a> &gt;{" "}
          <a href="#">Thailand</a> &gt; <span>Novotel</span>
        </div>

        {/* Image Gallery */}
        <div className="image-gallery">
          <div className="main-image">
            <Image src={mainImage} alt="Novotel Bangkok" />
          </div>
          <div className="thumbnail-images">
            <Image src={thumbnailImages1} alt="Thumbnail 1" />
            <Image src={thumbnailImages2} alt="Thumbnail 2" />
            <Image src={thumbnailImages3} alt="Thumbnail 3" />
            <div className="show-all-photos">
              <Image src={thumbnailImages4} alt="Thumbnail 4" />
              <span>Show all 34 photos</span>
            </div>
          </div>
        </div>

        {/* Hotel Info */}
        <div className="hotel-info-header">
          <div className="hotel-info-left">
            <h1>Novotel Bangkok</h1>
            <div className="rating-location">
              <div className="rating">
                <Image src={starFillIcon} alt="star" />
                <span>4.5 (120 Reviews)</span>
              </div>
              <div className="distance">2.4km away from city center</div>
              <div className="address">
                <Image src={locationFillIcon} alt="location" />
                <span>
                  Soi 6 Rama I Road Pathumwan, Siam, Bangkok, Thailand 10330
                </span>
              </div>
            </div>
          </div>
          <div className="hotel-info-right">
            <div className="price">
              Price: Starts from <span>$500/night</span>
            </div>
            <button className="button-primary">Check Availability</button>
            <div className="actions">
              <button>Favorite</button>
              <button>Share</button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="hotel-tabs">
          <a href="#overview" onClick={(e) => handleTabClick(e, 'overview')}>Overview</a>
          <a href="#amenities" onClick={(e) => handleTabClick(e, 'amenities')}>Amenities</a>
          <a href="#rooms" onClick={(e) => handleTabClick(e, 'rooms')}>Rooms</a>
          <a href="#reviews" onClick={(e) => handleTabClick(e, 'reviews')}>Reviews</a>
          <a href="#map" onClick={(e) => handleTabClick(e, 'map')}>Map</a>
        </div>

        <div className="hotel-details-content">
          <div className="details-left">
            {/* Overview */}
            <section id="overview" className="hotel-section">
              <h2>Description</h2>
              <p>
                Novotel Bangkok On Siam Square Hotel is located in Bangkok. This
                hotel is located in 4 km from the city center. Take a walk and
                explore the neighborhood area of the hotel. Places nearby: Siam
                Paragon Mall, MBK Center and National Stadium. Spend an evening
                in a nice atmosphere of the bar. Stop by the restaurant. If
                can’t live without coffee, drop by the cafe. Free Wi-Fi is
                available on the territory. If... <a href="#">Read More</a>
              </p>
              <h2>Important</h2>
              <div className="important-info">
                <div>
                  <strong>Check-in</strong>
                  <p>2:00 PM</p>
                </div>
                <div>
                  <strong>Check-out</strong>
                  <p>11:00 AM</p>
                </div>
                <div>
                  <strong>Additional Facts</strong>
                  <p>Reception Open Until 12:00 PM</p>
                </div>
              </div>
            </section>

            {/* Amenities */}
            <section id="amenities" className="hotel-section">
              <h2>Hotel Room & Facilities</h2>
              <div className="amenities-grid">
                <div className="amenity-item">
                  <Image src={poolIcon} alt="Pool" /> <span>Pool</span>
                </div>
                <div className="amenity-item">
                  <Image src={tvIcon} alt="TV" /> <span>TV</span>
                </div>
                <div className="amenity-item">
                  <Image src={restaurantIcon} alt="Restaurant" />{" "}
                  <span>Restaurant</span>
                </div>
                <div className="amenity-item">
                  <Image src={wifiIcon} alt="Wi-Fi" /> <span>Wi-Fi</span>
                </div>
                <div className="amenity-item">
                  <Image src={bathtubIcon} alt="Bathtub" /> <span>Bathtub</span>
                </div>
                <div className="amenity-item">
                  <Image src={golfIcon} alt="Golf Course" /> <span>Golf Course</span>
                </div>
                <div className="amenity-item">
                  <Image src={nightclubIcon} alt="Nightclub" />{" "}
                  <span>Nightclub</span>
                </div>
                <div className="amenity-item">
                  <Image src={elevatorIcon} alt="Elevator" /> <span>Elevator</span>
                </div>
              </div>
            </section>

            {/* Rooms */}
            <section id="rooms" className="hotel-section">
              <h2>Room</h2>
              {/* This section would have search filters as in the image */}
              <div className="room-filters">
                {/* Filters here */}
              </div>
              <div className="room-list">
                {/* Room Cards */}
                {[1, 2, 3].map((i) => (
                  <div className="room-card" key={i}>
                    <div className="room-card-image">
                      <Image src={mainImage} alt="Premium Double Room" />
                    </div>
                    <div className="room-card-details">
                      <h3>Premium Double Room</h3>
                      <div className="rating">
                         <Image src={starFillIcon} alt="star" /> 4.5 (120 Reviews)
                      </div>
                      <ul>
                        <li>Free continental breakfast</li>
                        <li>Free self parking</li>
                      </ul>
                      <div className="room-specs">
                        <span>1 Double Bed</span>
                        <span>274 sq ft</span>
                        <span>Free Wi-fi</span>
                        <span>1 bedroom</span>
                        <span>Sleeps 3</span>
                      </div>
                      <div className="room-policies">
                        <p>Reserve now, pay later</p>
                        <p>Fully refundable</p>
                      </div>
                      <a href="#">More Details &gt;</a>
                    </div>
                    <div className="room-card-booking">
                        <div className="price-info">
                            <span className="discount">$51 off</span>
                            <span className="nightly-price">$40 nightly</span>
                            <span className="total-price">$349 Total <s>$400</s></span>
                        </div>
                      <button className="button-primary">Book Now</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section id="reviews" className="hotel-section">
                <h2>Reviews</h2>
                <div className="reviews-list">
                    {[
                        {user: user1, name: "Steven"},
                        {user: user2, name: "Maria"},
                        {user: user3, name: "John"}
                    ].map((review, i) => (
                        <div className="review-card" key={i}>
                            <div className="review-rating">
                                <Image src={starFillIcon} alt="star" /> 4.9 Rating
                            </div>
                            <p>
                                The staff at Prime-Park Hotel truly ‘went the extra mile’, arranging for boxed breakfast to be available for us, and arranging transport for us, checking.
                            </p>
                            <a href="#">See More</a>
                            <div className="reviewer-info">
                                <Image src={review.user} alt={review.name}/>
                                <div>
                                    <strong>{review.name}</strong>
                                    <span>United Arab Emirates</span>
                                </div>
                                <span>25 June 2025</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Map */}
            <section id="map" className="hotel-section">
                <h2>Map</h2>
                <div className="map-container">
                    <Image src={mapImage} alt="Map" />
                </div>
            </section>
          </div>
          <div className="details-right">
              {/* might be a booking widget or ads, leaving empty for now */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default HotelDetails;