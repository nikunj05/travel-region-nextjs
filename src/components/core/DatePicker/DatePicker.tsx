"use client";
import React, { useState, useEffect } from "react";
import "./DatePicker.scss";

interface DatePickerProps {
  isOpen: boolean;
  onDateSelect: (startDate: Date | null, endDate: Date | null) => void;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  minDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({
  isOpen,
  onDateSelect,
  selectedStartDate,
  selectedEndDate,
  minDate,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  // const [selectingCheckout, setSelectingCheckout] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<Date[]>([]);

  // Initialize client-side state after hydration
  useEffect(() => {
    setIsClient(true);
    const now = new Date();
    setCurrentMonth(now);
    setNavigationHistory([now]);
  }, []);

  // Use provided minDate or current date, but only after client hydration
  const effectiveMinDate = minDate || (isClient ? new Date() : null);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    while (currentDate <= lastDayOfMonth || currentDate.getDay() !== 0) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const handleDateClick = (date: Date) => {
    // Don't allow selecting disabled dates
    if (isDateDisabled(date)) {
      return;
    }

    if (
      !selectedStartDate ||
      (selectedStartDate && selectedEndDate) ||
      date < selectedStartDate
    ) {
      // Starting new selection or date is before current start date
      onDateSelect(date, null);
      // setSelectingCheckout(true);
    } else {
      // Selecting end date
      onDateSelect(selectedStartDate, date);
      // setSelectingCheckout(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    if (!effectiveMinDate) return false;
    // Compare dates by setting time to 00:00:00 to avoid time comparison issues
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const minDateOnly = new Date(
      effectiveMinDate.getFullYear(),
      effectiveMinDate.getMonth(),
      effectiveMinDate.getDate()
    );
    return dateOnly < minDateOnly;
  };

  const isDateSelected = (date: Date) => {
    // Don't show disabled dates as selected
    if (isDateDisabled(date)) return false;

    if (!selectedStartDate) return false;
    if (selectedStartDate && !selectedEndDate) {
      return date.toDateString() === selectedStartDate.toDateString();
    }
    if (selectedStartDate && selectedEndDate) {
      return (
        date.toDateString() === selectedStartDate.toDateString() ||
        date.toDateString() === selectedEndDate.toDateString()
      );
    }
    return false;
  };

  const isDateInRange = (date: Date) => {
    // Don't show disabled dates as in range
    if (isDateDisabled(date)) return false;

    if (!selectedStartDate || !selectedEndDate) return false;
    return date > selectedStartDate && date < selectedEndDate;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    if (!currentMonth) return;
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentMonth(newMonth);
    
    if (direction === "next") {
      // Add to navigation history when going forward
      setNavigationHistory(prev => [...prev, newMonth]);
    } else {
      // Remove from navigation history when going back
      setNavigationHistory(prev => prev.slice(0, -1));
    }
  };

  const getNextMonth = () => {
    if (!currentMonth) return new Date();
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
  };

  const renderCalendar = (date: Date, isFirstCalendar: boolean = false) => {
    const days = getDaysInMonth(date);
    const month = date.getMonth();
    const year = date.getFullYear();
    
    // Show navigation arrows only on the right calendar (second calendar)
    const showNavigation = !isFirstCalendar;
    // Show previous arrow only if we have navigation history (user has navigated forward)
    const showPrevArrow = showNavigation && navigationHistory.length > 1;
    // Show next arrow by default on right calendar
    const showNextArrow = showNavigation;

    return (
      <div className="calendar-month">
        <div className="calendar-header d-flex justify-content-between align-items-center">
          <h4>
            {monthNames[month]} {year}
          </h4>
          {showNavigation && (
            <div className="calendar-header-buttons">
              {showPrevArrow && (
                <button
                  className="nav-button prev"
                  onClick={() => navigateMonth("prev")}
                  type="button"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
              {showNextArrow && (
                <button
                  className="nav-button next"
                  onClick={() => navigateMonth("next")}
                  type="button"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
        <div className="calendar-weekdays">
          {dayNames.map((day) => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-days">
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === month;
            const isSelected = isDateSelected(day);
            const isInRange = isDateInRange(day);
            const isDisabled = isDateDisabled(day);

            return (
              <button
                key={index}
                type="button"
                className={`calendar-day ${
                  !isCurrentMonth ? "other-month" : ""
                } ${isSelected ? "selected" : ""} ${
                  isInRange ? "in-range" : ""
                } ${isDisabled ? "disabled" : ""}`}
                onClick={() => handleDateClick(day)}
                disabled={isDisabled}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (!isOpen || !isClient || !currentMonth) return null;

  return (
    <div className="datepicker-dropdown">
      <div className="datepicker-header">
        <h3>Select Date</h3>
        {/* <div className="datepicker-navigation">
          <button
            className="nav-button prev"
            onClick={() => navigateMonth("prev")}
            type="button"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="nav-button next"
            onClick={() => navigateMonth("next")}
            type="button"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 6L15 12L9 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div> */}
      </div>
      <div className="datepicker-calendars">
        {renderCalendar(currentMonth, true)}
        {renderCalendar(getNextMonth(), false)}
      </div>
    </div>
  );
};

export default DatePicker;
