"use client"
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import locationIcon from '@/assets/images/location-icon.svg'
import downBlackArrowIcon from '@/assets/images/down-black-arrow-icon.svg'
import calendarIcon from '@/assets/images/calendar-icon.svg'
import plusIcon from '@/assets/images/plus-icon.svg'
import guestsIcon from '@/assets/images/guests-icon.svg'
import minusRoundIcon from '@/assets/images/minus-round-icon.svg'
import plusRoundIcon from '@/assets/images/plus-round-icon.svg'
import DatePicker from '../core/DatePicker/DatePicker'
import LocationPicker from '../core/LocationPicker/LocationPicker'
import GuestsPicker from '../core/GuestsPicker/GuestsPicker'
import Link from 'next/link'

interface Location {
  id: string
  name: string
  country: string
}

const Banner = () => {
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  
  const [isGuestsDropdownOpen, setIsGuestsDropdownOpen] = useState(false)
  const [guestCounts, setGuestCounts] = useState({
    adults: 2,
    children: 1,
    pets: 0
  })

  // Date picker states
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [checkInDate, setCheckInDate] = useState<Date | null>(null)
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null)
  const datePickerRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleLocationDropdown = () => {
    setIsLocationDropdownOpen(!isLocationDropdownOpen)
  }

  const handleLocationSelect = (location: Location | null) => {
    setSelectedLocation(location)
    setIsLocationDropdownOpen(false)
  }

  const toggleGuestsDropdown = () => {
    setIsGuestsDropdownOpen(!isGuestsDropdownOpen)
  }


  const getGuestsDisplayText = () => {
    const total = guestCounts.adults + guestCounts.children + guestCounts.pets
    if (total === 0) return 'Add Guests'
    return `${total} Guest${total > 1 ? 's' : ''}`
  }

  // Date picker functions
  const toggleDatePicker = () => {
    setIsDatePickerOpen(!isDatePickerOpen)
  }

  const handleDateSelect = (startDate: Date | null, endDate: Date | null) => {
    setCheckInDate(startDate)
    setCheckOutDate(endDate)
    if (startDate && endDate) {
      // Auto-close when both dates are selected
      setTimeout(() => {
        setIsDatePickerOpen(false)
      }, 200)
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getCheckInDisplayText = () => {
    return checkInDate ? formatDate(checkInDate) : 'Add Date'
  }

  const getCheckOutDisplayText = () => {
    return checkOutDate ? formatDate(checkOutDate) : 'Add Date'
  }

  const getLocationDisplayText = () => {
    return selectedLocation ? selectedLocation.name : 'Find Location'
  }

  return (
    <section className="home-banner-section">
      <div className="container">
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <div className="heading_section">
            <h1 className="section-title">Find your perfect stay, anywhere.</h1>
            <p className="section-description">Search thousands of hotels across the globe – compare, book, and relax.</p>
          </div>
          <div className="banner-property-filter">
            <h3 className="property-filter-title">Explore your journey</h3>
            <div className="choose-location-and-date d-grid">
              <div className="choose-location-items">
                <h4 className="choose-location-items-title">Location</h4>
                <div className="dropdown">
                  <button 
                    className="filter-dropdown w-100 d-flex align-items-center justify-content-between"
                    onClick={toggleLocationDropdown}
                    type="button"
                  >
                    <div className="filter-dropdown-inner d-flex align-items-center">
                      <Image src={locationIcon} width="20" height="20" alt="location icon" />
                      {getLocationDisplayText()}
                    </div>
                    <Image src={downBlackArrowIcon} width="24" height="24" alt="down icon"
                      className="arrow-and-plus-icon" />
                  </button>
                  <LocationPicker
                    isOpen={isLocationDropdownOpen}
                    onLocationSelect={handleLocationSelect}
                    selectedLocation={selectedLocation}
                  />
                </div>
              </div>
              <div className="choose-location-items">
                <h4 className="choose-location-items-title">Check-in Date</h4>
                <div className="dropdown" ref={datePickerRef}>
                  <button 
                    className="filter-dropdown w-100 d-flex align-items-center justify-content-between"
                    onClick={toggleDatePicker}
                    type="button"
                  >
                    <div className="filter-dropdown-inner d-flex align-items-center">
                      <Image src={calendarIcon} width="20" height="20" alt="calendar icon" />
                      {getCheckInDisplayText()}
                    </div>
                    <Image src={plusIcon} width="24" height="24" alt="plus icon"
                      className="arrow-and-plus-icon" />
                  </button>
                  <DatePicker
                    isOpen={isDatePickerOpen}
                    onDateSelect={handleDateSelect}
                    selectedStartDate={checkInDate}
                    selectedEndDate={checkOutDate}
                    minDate={new Date()}
                  />
                </div>
              </div>
              <div className="choose-location-items">
                <h4 className="choose-location-items-title">Check-out Date</h4>
                <button 
                  className="filter-dropdown w-100 d-flex align-items-center justify-content-between"
                  onClick={toggleDatePicker}
                  type="button"
                >
                  <div className="filter-dropdown-inner d-flex align-items-center">
                    <Image src={calendarIcon} width="20" height="20" alt="calendar icon" />
                    {getCheckOutDisplayText()}
                  </div>
                  <Image src={plusIcon} width="24" height="24" alt="plus icon"
                    className="arrow-and-plus-icon" />
                </button>
              </div>
              <div className="choose-location-items">
                <h4 className="choose-location-items-title">Guests and Rooms</h4>
                <div className="dropdown">
                  <button 
                    className="filter-dropdown w-100 d-flex align-items-center justify-content-between"
                    onClick={toggleGuestsDropdown}
                    type="button"
                  >
                    <div className="filter-dropdown-inner d-flex align-items-center">
                      <Image src={guestsIcon} width="20" height="20" alt="guests icon" />
                      {getGuestsDisplayText()}
                    </div>
                    <Image src={downBlackArrowIcon} width="24" height="24" alt="down icon"
                      className="arrow-and-plus-icon" />
                  </button>
                  <GuestsPicker
                    isOpen={isGuestsDropdownOpen}
                    onGuestCountChange={setGuestCounts}
                    guestCounts={guestCounts}
                  />
                </div>
              </div>
            </div>
            <div className="banner-filter-action d-flex align-items-center justify-content-between">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="freeCancel" />
                <label className="form-check-label" htmlFor="freeCancel">
                  Free Cancellation
                </label>
              </div>
              <Link href="/search-result" className='text-decoration-none'>

              <button className="btn banner-search-btn">
                Search
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 12L4 12M20 12L15.0001 17M20 12L15 7" stroke="white" strokeWidth="1.5" />
                </svg>
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Banner
