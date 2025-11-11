"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
// import LocationPicker from "../core/LocationPicker/LocationPicker";
import DatePicker from "../core/DatePicker/DatePicker";
import GuestsPicker from "../core/GuestsPicker/GuestsPicker";
// import locationIcon from "@/assets/images/location-icon.svg";
import downBlackArrowIcon from "@/assets/images/down-black-arrow-icon.svg";
import calendarIcon from "@/assets/images/calendar-icon.svg";
import plusIcon from "@/assets/images/plus-icon.svg";
import guestsIcon from "@/assets/images/guests-icon.svg";
import "./FilterComponents.scss";
import { useSearchFiltersStore } from "@/store/searchFiltersStore";
import type { Location, Room } from "@/store/searchFiltersStore";

interface FilterComponentsProps {
  onCheckAvailability?: () => void;
}

const FilterComponents = ({ onCheckAvailability }: FilterComponentsProps) => {
  const t = useTranslations("HotelDetails");
  const locale = useLocale();
  // Use global search filters store
  const { 
    filters, 
    setLocation, 
    setCheckInDate, 
    setCheckOutDate, 
    setRooms
  } = useSearchFiltersStore();

  // const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestsPickerOpen, setIsGuestsPickerOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for Zustand store to hydrate from localStorage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Debug: Log filters to console
  useEffect(() => {
    if (isHydrated) {
      console.log('🔍 FilterComponents - Current filters:', {
        checkInDate: filters.checkInDate,
        checkOutDate: filters.checkOutDate,
        rooms: filters.rooms,
        location: filters.location
      });
    }
  }, [filters, isHydrated]);



  // Refs for click outside detection
  const locationPickerRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const guestsPickerRef = useRef<HTMLDivElement>(null);

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // if (
      //   locationPickerRef.current &&
      //   !locationPickerRef.current.contains(event.target as Node)
      // ) {
      //   setIsLocationPickerOpen(false);
      // }
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


  // const handleLocationSelect = (location: Location | null) => {
  //   setLocation(location);
  //   setIsLocationPickerOpen(false);
  // };

  const handleDateSelect = (startDate: Date | null, endDate: Date | null) => {
    setCheckInDate(startDate);
    setCheckOutDate(endDate);
    // Auto-close when both dates are selected
    if (startDate && endDate) {
      setTimeout(() => {
        setIsDatePickerOpen(false);
      }, 200);
    }
  };

  const handleRoomsChange = (rooms: Room[]) => {
    setRooms(rooms);
    // Don't auto-close guests picker, let user manually close or click outside
  };

  const formatDate = (date: Date | null) => {
    if (!date) return t("filters.addDate");
    // Ensure date is a valid Date object
    const validDate = date instanceof Date ? date : new Date(date);
    if (isNaN(validDate.getTime())) return t("filters.addDate");
    const intlLocale = locale === "ar" ? "ar-SA" : "en-US";
    return new Intl.DateTimeFormat(intlLocale, {
      month: "short",
      day: "2-digit",
    }).format(validDate);
  };

  const getGuestsDisplayText = () => {
    // Safety check for rooms array
    const rooms = filters.rooms || [{ adults: 0, children: 0 }];
    
    const totalAdults = rooms.reduce(
      (acc, room) => acc + (room?.adults || 0),
      0
    );
    const totalChildren = rooms.reduce(
      (acc, room) => acc + (room?.children || 0),
      0
    );
    const totalGuests = totalAdults + totalChildren;

    if (totalGuests === 0) return t("filters.addGuests");

    const guestsText = t("filters.guestsLabel", { count: totalGuests });
    const roomsText = t("filters.roomsLabel", { count: rooms.length });

    return t("filters.guestsRoomsSeparator", {
      guests: guestsText,
      rooms: roomsText,
    });
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
                {filters.location ? filters.location.name : "Find Location"}
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
            selectedLocation={filters.location}
          />
        </div> */}

        <div className="search-field" ref={datePickerRef}>
          <label>{t("filters.checkInLabel")}</label>
          <div
            className="search-input-wrapper"
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          >
            <div className="search-input-inner">
              <Image
                src={calendarIcon}
                width="20"
                height="20"
                alt={t("filters.calendarIconAlt")}
              />
              <span className="search-input-text">
                {formatDate(filters.checkInDate)}
              </span>
            </div>
            <Image
              src={plusIcon}
              width="24"
              height="24"
              alt={t("filters.plusIconAlt")}
            />
          </div>
          <DatePicker
            isOpen={isDatePickerOpen}
            onDateSelect={handleDateSelect}
            selectedStartDate={filters.checkInDate}
            selectedEndDate={filters.checkOutDate}
          />
        </div>

        <div className="search-field">
          <label>{t("filters.checkOutLabel")}</label>
          <div
            className="search-input-wrapper"
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          >
            <div className="search-input-inner">
              <Image
                src={calendarIcon}
                width="20"
                height="20"
                alt={t("filters.calendarIconAlt")}
              />
              <span className="search-input-text">
                {formatDate(filters.checkOutDate)}
              </span>
            </div>
            <Image
              src={plusIcon}
              width="24"
              height="24"
              alt={t("filters.plusIconAlt")}
            />
          </div>
        </div>

        <div className="search-field" ref={guestsPickerRef}>
          <label>{t("filters.guestsAndRoomsLabel")}</label>
          <div
            className="search-input-wrapper"
            onClick={() => setIsGuestsPickerOpen(!isGuestsPickerOpen)}
          >
            <div className="search-input-inner">
              <Image
                src={guestsIcon}
                width="20"
                height="20"
                alt={t("filters.guestsIconAlt")}
              />
              <span className="search-input-text">
                {getGuestsDisplayText()}
              </span>
            </div>
            <Image
              src={downBlackArrowIcon}
              width="24"
              height="24"
              alt={t("filters.dropdownIconAlt")}
            />
          </div>
          <GuestsPicker
            isOpen={isGuestsPickerOpen}
            onRoomsChange={handleRoomsChange}
            rooms={filters.rooms || [{ adults: 2, children: 1 }]}
          />
        </div>

        <button
          className="search-button"
          onClick={onCheckAvailability}
        >
          {t("filters.checkAvailabilityButton")}
        </button>
      </div>
    </div>
  );
};
export default FilterComponents;
