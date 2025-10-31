"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import LocationPicker from "../core/LocationPicker/LocationPicker";
import DatePicker from "../core/DatePicker/DatePicker";
import GuestsPicker from "../core/GuestsPicker/GuestsPicker";
import locationIcon from "@/assets/images/location-icon.svg";
import downBlackArrowIcon from "@/assets/images/down-black-arrow-icon.svg";
import calendarIcon from "@/assets/images/calendar-icon.svg";
import plusIcon from "@/assets/images/plus-icon.svg";
import guestsIcon from "@/assets/images/guests-icon.svg";
import "./FilterComponents.scss";

interface Location {
  id: string;
  name: string;
  country: string;
}

interface GuestCounts {
  adults: number;
  children: number;
  pets: number;
}

// interface Hotel {
//   id: string;
//   name: string;
//   rating: number;
//   reviewCount: number;
//   location: string;
//   amenities: string[];
//   description: string;
//   price: number;
//   currency: string;
//   mainImage: any;
//   thumbnailImages: any[];
//   ame: { name: string; icon: string }[];
// }

const FilterComponents = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>({
    id: "1",
    name: "Bangkok",
    country: "Thailand",
  });
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    new Date(2024, 7, 8)
  ); // Aug 08
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
    new Date(2024, 7, 18)
  ); // Aug 18
  const [guestCounts, setGuestCounts] = useState<GuestCounts>({
    adults: 3,
    children: 0,
    pets: 0,
  });
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestsPickerOpen, setIsGuestsPickerOpen] = useState(false);



  // Refs for click outside detection
  const locationPickerRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const guestsPickerRef = useRef<HTMLDivElement>(null);

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationPickerRef.current &&
        !locationPickerRef.current.contains(event.target as Node)
      ) {
        setIsLocationPickerOpen(false);
      }
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false);
      }
      if (
        guestsPickerRef.current &&
        !guestsPickerRef.current.contains(event.target as Node)
      ) {
        setIsGuestsPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleLocationSelect = (location: Location | null) => {
    setSelectedLocation(location);
    setIsLocationPickerOpen(false);
  };

  const handleDateSelect = (startDate: Date | null, endDate: Date | null) => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
    // Auto-close when both dates are selected
    if (startDate && endDate) {
      setTimeout(() => {
        setIsDatePickerOpen(false);
      }, 200);
    }
  };

  const handleGuestCountChange = (counts: GuestCounts) => {
    setGuestCounts(counts);
    // Don't auto-close guests picker, let user manually close or click outside
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Add Date";
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
  };

  const getTotalGuests = () => {
    return guestCounts.adults + guestCounts.children + guestCounts.pets;
  };


  return (
    <div className="search-bar-common">
      <div className="search-bar-container">
        {/* <div className="search-field" ref={locationPickerRef}>
          <label>Location</label>
          <div
            className="search-input-wrapper"
            onClick={() => setIsLocationPickerOpen(!isLocationPickerOpen)}
          >
            <div className="search-input-inner">
              <Image
                src={locationIcon}
                width="20"
                height="20"
                alt="location icon"
              />
              <span className="search-input-text">
                {selectedLocation ? selectedLocation.name : "Find Location"}
              </span>
            </div>
            <Image
              src={downBlackArrowIcon}
              width="24"
              height="24"
              alt="down arrow"
            />
          </div>
          <LocationPicker
            isOpen={isLocationPickerOpen}
            onLocationSelect={handleLocationSelect}
            selectedLocation={selectedLocation}
          />
        </div> */}

        <div className="search-field" ref={datePickerRef}>
          <label>Check-in Date</label>
          <div
            className="search-input-wrapper"
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          >
            <div className="search-input-inner">
              <Image
                src={calendarIcon}
                width="20"
                height="20"
                alt="calendar icon"
              />
              <span className="search-input-text">
                {formatDate(selectedStartDate)}
              </span>
            </div>
            <Image src={plusIcon} width="24" height="24" alt="plus icon" />
          </div>
          <DatePicker
            isOpen={isDatePickerOpen}
            onDateSelect={handleDateSelect}
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
          />
        </div>

        <div className="search-field">
          <label>Check-out Date</label>
          <div
            className="search-input-wrapper"
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          >
            <div className="search-input-inner">
              <Image
                src={calendarIcon}
                width="20"
                height="20"
                alt="calendar icon"
              />
              <span className="search-input-text">
                {formatDate(selectedEndDate)}
              </span>
            </div>
            <Image src={plusIcon} width="24" height="24" alt="plus icon" />
          </div>
        </div>

        <div className="search-field" ref={guestsPickerRef}>
          <label>Guests and Rooms</label>
          <div
            className="search-input-wrapper"
            onClick={() => setIsGuestsPickerOpen(!isGuestsPickerOpen)}
          >
            <div className="search-input-inner">
              <Image
                src={guestsIcon}
                width="20"
                height="20"
                alt="guests icon"
              />
              <span className="search-input-text">
                {getTotalGuests() > 0
                  ? `${getTotalGuests()} Guests`
                  : "Add Guests"}
              </span>
            </div>
            <Image
              src={downBlackArrowIcon}
              width="24"
              height="24"
              alt="down arrow"
            />
          </div>
          <GuestsPicker
            isOpen={isGuestsPickerOpen}
            onGuestCountChange={handleGuestCountChange}
            guestCounts={guestCounts}
          />
        </div>

        <button className="search-button">Check Availability</button>
      </div>
    </div>
  );
};
export default FilterComponents;
