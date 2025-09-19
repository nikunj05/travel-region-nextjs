"use client"
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import LocationPicker from '../core/LocationPicker/LocationPicker'
import DatePicker from '../core/DatePicker/DatePicker'
import GuestsPicker from '../core/GuestsPicker/GuestsPicker'
import locationIcon from '@/assets/images/location-icon.svg'
import downBlackArrowIcon from '@/assets/images/down-black-arrow-icon.svg'
import calendarIcon from '@/assets/images/calendar-icon.svg'
import plusIcon from '@/assets/images/plus-icon.svg'
import guestsIcon from '@/assets/images/guests-icon.svg'
import './SearchResult.scss'

interface Location {
  id: string
  name: string
  country: string
}

interface GuestCounts {
  adults: number
  children: number
  pets: number
}

interface Hotel {
  id: string
  name: string
  rating: number
  reviewCount: number
  location: string
  amenities: string[]
  description: string
  price: number
  currency: string
  mainImage: string
  thumbnailImages: string[]
  ame: {name: string, icon: string}[]
}

const SearchResult = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>({
    id: '1',
    name: 'Bangkok',
    country: 'Thailand'
  })
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(new Date(2024, 7, 8)) // Aug 08
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(new Date(2024, 7, 18)) // Aug 18
  const [guestCounts, setGuestCounts] = useState<GuestCounts>({
    adults: 3,
    children: 0,
    pets: 0
  })
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isGuestsPickerOpen, setIsGuestsPickerOpen] = useState(false)
  
  // Filter sidebar dropdown states
  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(true)
  const [isStarRatingOpen, setIsStarRatingOpen] = useState(true)
  const [isGuestRatingOpen, setIsGuestRatingOpen] = useState(true)
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(true)
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(true)
  const [isLocationTypeOpen, setIsLocationTypeOpen] = useState(true)

  // Refs for click outside detection
  const locationPickerRef = useRef<HTMLDivElement>(null)
  const datePickerRef = useRef<HTMLDivElement>(null)
  const guestsPickerRef = useRef<HTMLDivElement>(null)

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationPickerRef.current && !locationPickerRef.current.contains(event.target as Node)) {
        setIsLocationPickerOpen(false)
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false)
      }
      if (guestsPickerRef.current && !guestsPickerRef.current.contains(event.target as Node)) {
        setIsGuestsPickerOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Static hotel data
  const hotels: Hotel[] = [
    {
      id: '1',
      name: 'lebua',
      rating: 4.5,
      reviewCount: 120,
      location: '123 Sukhumvit Road, Bangkok, Thailand',
      ame: [{name: 'Breakfast', icon: locationIcon}, {name: 'Parking', icon: locationIcon}, {name: 'Pool', icon: locationIcon}],
      amenities: ['Breakfast', 'Parking', 'Pool'],
      description: 'Unbeatable location at the heart of the city. Steps from the SkyTrain, top shopping malls, and exciting activities.',
      price: 266,
      currency: 'US$',
      mainImage: '/api/placeholder/400/300',
      thumbnailImages: ['/api/placeholder/100/75', '/api/placeholder/100/75', '/api/placeholder/100/75', '/api/placeholder/100/75']
    },
    {
      id: '2',
      name: 'Novtel',
      rating: 4.5,
      reviewCount: 120,
      location: '456 Silom Road, Bangkok, Thailand',
      ame: [{name: 'Breakfast', icon: locationIcon}, {name: 'Parking', icon: locationIcon}, {name: 'Pool', icon: locationIcon}],
      amenities: ['Breakfast', 'Parking', 'Pool'],
      description: 'Modern luxury with stunning city views. Perfect for business and leisure travelers.',
      price: 500,
      currency: 'US$',
      mainImage: '/api/placeholder/400/300',
      thumbnailImages: ['/api/placeholder/100/75', '/api/placeholder/100/75', '/api/placeholder/100/75', '/api/placeholder/100/75']
    },
    {
      id: '3',
      name: 'X GO INN The Grand Palace',
      rating: 4.5,
      reviewCount: 120,
      location: '789 Grand Palace Road, Bangkok, Thailand',
      ame: [{name: 'Breakfast', icon: locationIcon}, {name: 'Parking', icon: locationIcon}, {name: 'Pool', icon: locationIcon}],
      amenities: ['Breakfast', 'Parking', 'Pool'],
      description: 'Budget-friendly accommodation near historic landmarks. Clean and comfortable rooms.',
      price: 24,
      currency: 'US$',
      mainImage: '/api/placeholder/400/300',
      thumbnailImages: ['/api/placeholder/100/75', '/api/placeholder/100/75', '/api/placeholder/100/75', '/api/placeholder/100/75']
    },
    {
      id: '4',
      name: 'INNSIDE by Meliá',
      rating: 4.5,
      reviewCount: 120,
      location: '321 Riverside Road, Bangkok, Thailand',
      ame: [{name: 'Breakfast', icon: locationIcon}, {name: 'Parking', icon: locationIcon}, {name: 'Pool', icon: locationIcon}],
      amenities: ['Breakfast', 'Parking', 'Pool'],
      description: 'Contemporary design meets comfort. Rooftop pool with panoramic city views.',
      price: 300,
      currency: 'US$',
      mainImage: '/api/placeholder/400/300',
      thumbnailImages: ['/api/placeholder/100/75', '/api/placeholder/100/75', '/api/placeholder/100/75', '/api/placeholder/100/75']
    },
    {
      id: '5',
      name: 'GM Serviced Apartment',
      rating: 4.5,
      reviewCount: 120,
      location: '654 Business District, Bangkok, Thailand',
      ame: [{name: 'Breakfast', icon: locationIcon}, {name: 'Parking', icon: locationIcon}, {name: 'Pool', icon: locationIcon}],
      amenities: ['Breakfast', 'Parking', 'Pool'],
      description: 'Spacious apartments with full kitchen facilities. Ideal for extended stays.',
      price: 200,
      currency: 'US$',
      mainImage: '/api/placeholder/400/300',
      thumbnailImages: ['/api/placeholder/100/75', '/api/placeholder/100/75', '/api/placeholder/100/75', '/api/placeholder/100/75']
    }
  ]

  const handleLocationSelect = (location: Location | null) => {
    setSelectedLocation(location)
    setIsLocationPickerOpen(false)
  }

  const handleDateSelect = (startDate: Date | null, endDate: Date | null) => {
    setSelectedStartDate(startDate)
    setSelectedEndDate(endDate)
    // Auto-close when both dates are selected
    if (startDate && endDate) {
      setTimeout(() => {
        setIsDatePickerOpen(false)
      }, 200)
    }
  }

  const handleGuestCountChange = (counts: GuestCounts) => {
    setGuestCounts(counts)
    // Don't auto-close guests picker, let user manually close or click outside
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'Add Date'
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
  }

  const getTotalGuests = () => {
    return guestCounts.adults + guestCounts.children + guestCounts.pets
  }

  return (
    <div className="search-result-page">
      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-bar-container">
          <div className="search-field" ref={locationPickerRef}>
            <label>Location</label>
            <div className="search-input-wrapper" onClick={() => setIsLocationPickerOpen(!isLocationPickerOpen)}>
              <div className="search-input-inner">
                <Image src={locationIcon} width="20" height="20" alt="location icon" />
                <span className="search-input-text">
                  {selectedLocation ? selectedLocation.name : 'Find Location'}
                </span>
              </div>
              <Image src={downBlackArrowIcon} width="24" height="24" alt="down arrow" />
            </div>
            <LocationPicker
              isOpen={isLocationPickerOpen}
              onLocationSelect={handleLocationSelect}
              selectedLocation={selectedLocation}
            />
          </div>

          <div className="search-field" ref={datePickerRef}>
            <label>Check-in Date</label>
            <div className="search-input-wrapper" onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
              <div className="search-input-inner">
                <Image src={calendarIcon} width="20" height="20" alt="calendar icon" />
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
            <div className="search-input-wrapper" onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
              <div className="search-input-inner">
                <Image src={calendarIcon} width="20" height="20" alt="calendar icon" />
                <span className="search-input-text">
                  {formatDate(selectedEndDate)}
                </span>
              </div>
              <Image src={plusIcon} width="24" height="24" alt="plus icon" />
            </div>
          </div>

          <div className="search-field" ref={guestsPickerRef}>
            <label>Guests and Rooms</label>
            <div className="search-input-wrapper" onClick={() => setIsGuestsPickerOpen(!isGuestsPickerOpen)}>
              <div className="search-input-inner">
                <Image src={guestsIcon} width="20" height="20" alt="guests icon" />
                <span className="search-input-text">
                  {getTotalGuests() > 0 ? `${getTotalGuests()} Guests` : 'Add Guests'}
                </span>
              </div>
              <Image src={downBlackArrowIcon} width="24" height="24" alt="down arrow" />
            </div>
            <GuestsPicker
              isOpen={isGuestsPickerOpen}
              onGuestCountChange={handleGuestCountChange}
              guestCounts={guestCounts}
            />
          </div>

          <button className="search-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Header Section */}
      <div className="search-header">
        <div className="search-header-left">
          <button className="map-view-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Map View
          </button>
          <div className="search-results-info">
            Showing 45 hotels in Bangkok (Aug 08 - Aug 18, 3 Guests)
          </div>
        </div>
        <div className="search-header-right">
          <select className="sort-dropdown">
            <option>Recommended</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="search-content">
        {/* Filter Sidebar */}
        <div className="filter-sidebar">
          <div className="filter-header">
            <h3>Filter by</h3>
            <button className="clear-filters">Clear</button>
          </div>

          <div className="filter-section">
            <div className="filter-title" onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}>
              Price Range
              <svg 
                className={`dropdown-arrow ${isPriceRangeOpen ? 'open' : ''}`} 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {isPriceRangeOpen && (
              <div className="price-range">
                <span>$500</span>
                <div className="price-slider">
                  <div className="slider-track"></div>
                  <div className="slider-thumb"></div>
                </div>
                <span>$1500</span>
              </div>
            )}
          </div>

          <div className="filter-section">
            <div className="filter-title" onClick={() => setIsStarRatingOpen(!isStarRatingOpen)}>
              Star Rating
              <svg 
                className={`dropdown-arrow ${isStarRatingOpen ? 'open' : ''}`} 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {isStarRatingOpen && (
              <div className="filter-options">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <label key={stars} className="filter-option">
                    <input type="checkbox" defaultChecked={stars === 5} />
                    <span className="checkmark"></span>
                    <span className="stars">{'★'.repeat(stars)}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="filter-section">
            <div className="filter-title" onClick={() => setIsGuestRatingOpen(!isGuestRatingOpen)}>
              Guest Rating
              <svg 
                className={`dropdown-arrow ${isGuestRatingOpen ? 'open' : ''}`} 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {isGuestRatingOpen && (
              <div className="filter-options">
                <label className="filter-option">
                  <input type="radio" name="guest-rating" defaultChecked />
                  <span className="radio-mark"></span>
                  Excellent
                </label>
                <label className="filter-option">
                  <input type="radio" name="guest-rating" />
                  <span className="radio-mark"></span>
                  Very Good
                </label>
                <label className="filter-option">
                  <input type="radio" name="guest-rating" />
                  <span className="radio-mark"></span>
                  Good
                </label>
              </div>
            )}
          </div>

          <div className="filter-section">
            <div className="filter-title" onClick={() => setIsAmenitiesOpen(!isAmenitiesOpen)}>
              Amenities
              <svg 
                className={`dropdown-arrow ${isAmenitiesOpen ? 'open' : ''}`} 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {isAmenitiesOpen && (
              <div className="filter-options">
                {['Wi-Fi', 'Parking', 'Pet Friendly', 'Breakfast'].map((amenity) => (
                  <label key={amenity} className="filter-option">
                    <input type="checkbox" defaultChecked={amenity === 'Wi-Fi'} />
                    <span className="checkmark"></span>
                    {amenity}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="filter-section">
            <div className="filter-title" onClick={() => setIsPropertyTypeOpen(!isPropertyTypeOpen)}>
              Property Type
              <svg 
                className={`dropdown-arrow ${isPropertyTypeOpen ? 'open' : ''}`} 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {isPropertyTypeOpen && (
              <div className="filter-options">
                {['Hotel', 'Resort', 'Apartment', 'Villa'].map((type) => (
                  <label key={type} className="filter-option">
                    <input type="radio" name="property-type" defaultChecked={type === 'Hotel'} />
                    <span className="radio-mark"></span>
                    {type}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="filter-section">
            <div className="filter-title" onClick={() => setIsLocationTypeOpen(!isLocationTypeOpen)}>
              Location Type
              <svg 
                className={`dropdown-arrow ${isLocationTypeOpen ? 'open' : ''}`} 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {isLocationTypeOpen && (
              <div className="filter-options">
                <label className="filter-option">
                  <input type="checkbox" defaultChecked />
                  <span className="checkmark"></span>
                  Near Beach
                </label>
                <label className="filter-option">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  City Center
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Hotel Results */}
        <div className="hotel-results">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              <div className="hotel-images">
                <div className="main-image">
                  <img src={hotel.mainImage} alt={hotel.name} />
                </div>
                <div className="thumbnail-images">
                  {hotel.thumbnailImages.map((img, index) => (
                    <img key={index} src={img} alt={`${hotel.name} ${index + 1}`} />
                  ))}
                </div>
              </div>
              
              <div className="hotel-info">
                <div className="hotel-header">
                  <h3 className="hotel-name">{hotel.name}</h3>
                  <div className="hotel-rating">
                    <span className="rating-score">{hotel.rating}</span>
                    <span className="rating-reviews">({hotel.reviewCount} Reviews)</span>
                  </div>
                </div>
                
                <div className="hotel-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{hotel.location}</span>
                </div>
                
                <div className="hotel-amenities">
                  {hotel.ame.map((amenity, index) => (
                  <>
                    <Image src={amenity.icon} width="20" height="20" alt={amenity.name} />
                    <span key={index} className="amenity-tag">{amenity.name}</span>
                  </>
                  ))}
                </div>
                
                <p className="hotel-description">{hotel.description}</p>
                
                <div className="hotel-footer">
                  <div className="hotel-price">
                    <span className="price-amount">{hotel.currency}{hotel.price}</span>
                    <span className="price-period">Per night</span>
                  </div>
                  <button className="view-details-button">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchResult