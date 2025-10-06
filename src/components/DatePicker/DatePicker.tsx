"use client";
import React, { useState } from "react";
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
  minDate = new Date(),
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // const [selectingCheckout, setSelectingCheckout] = useState(false);

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
    // Compare dates by setting time to 00:00:00 to avoid time comparison issues
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const minDateOnly = new Date(
      minDate.getFullYear(),
      minDate.getMonth(),
      minDate.getDate()
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
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  const getNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
  };

  const renderCalendar = (date: Date) => {
    const days = getDaysInMonth(date);
    const month = date.getMonth();
    const year = date.getFullYear();

    return (
      <div className="calendar-month">
        <div className="calendar-header">
          <h4>
            {monthNames[month]} {year}
          </h4>
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

  if (!isOpen) return null;

  return (
    <div className="datepicker-dropdown">
      <div className="datepicker-header">
        <h3>Select Date</h3>
        <div className="datepicker-navigation">
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
        </div>
      </div>
      <div className="datepicker-calendars">
        {renderCalendar(currentMonth)}
        {renderCalendar(getNextMonth())}
      </div>
    </div>
  );
};

export default DatePicker;
