"use client";
import React, { useState, useEffect, useRef } from "react";
import { hotelService } from "@/services/hotelService";
import "./LocationPicker.scss";

interface Location {
  id: string;
  name: string;
  country: string;
  region?: string;
  icon?: React.ReactNode;
  coordinates?: {
    lat: number;
    lng: number;
  };
  types?: string[];
}

// Removed Google Places API Response Interfaces

interface LocationPickerProps {
  isOpen: boolean;
  onLocationSelect: (location: Location | null) => void;
  selectedLocation?: Location | null;
  recentSearches?: Location[];
  suggestedDestinations?: Location[];
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  locale?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  isOpen,
  onLocationSelect,
  // recentSearches = [],
  searchQuery: externalSearchQuery = "",
  onSearchQueryChange,
  locale = "en",
}) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCoordinates] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use external search query if provided, otherwise use internal
  const searchQuery = externalSearchQuery || internalSearchQuery;

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Hotel Locations Search API function
  const searchHotelLocations = async (query: string) => {
    const trimmedQuery = query.trim();

    // Minimum search length check
    if (!trimmedQuery || trimmedQuery.length < 3) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await hotelService.getHotelLocations({ search: trimmedQuery });

      if (response && response.data) {
        // Map the new API response to the Location interface
        // The API returns HotelLocationItem which has { id, name, lat, lng, type, country }
        const { destinations, hotels } = response.data;

        let mappedLocations: Location[] = [];

        // Map Destinations
        if (destinations && Array.isArray(destinations) && destinations.length > 0) {
          const mappedDestinations = destinations.map((item) => ({
            id: String(item.id),
            name: item.name,
            country: item.country_code,
            types: ['destination'],
            destination_code: item.code, // Map destination code
            coordinates: item.latitude && item.longitude ? {
              lat: parseFloat(item.latitude),
              lng: parseFloat(item.longitude)
            } : undefined
          }));
          mappedLocations = [...mappedLocations, ...mappedDestinations];
        }

        // Map Hotels
        if (hotels && Array.isArray(hotels) && hotels.length > 0) {
          const mappedHotels = hotels.map((item) => ({
            id: String(item.id),
            name: item.name,
            country: item.city || '',
            types: ['hotel'],
            hotel_code: item.code, // Map hotel code
            coordinates: {
              lat: parseFloat(item.latitude),
              lng: parseFloat(item.longitude)
            }
          }));
          mappedLocations = [...mappedLocations, ...mappedHotels];
        }

        setSuggestions(mappedLocations);
      } else {
        setSuggestions([]);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error searching hotel locations:", error);
      setIsLoading(false);
      setSuggestions([]);
    }
  };

  // Debounced search - re-run when locale changes too
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchHotelLocations(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, locale]);

  const handleLocationClick = async (location: Location) => {
    // Determine location type for store if needed
    // The existing Location interface has 'types' as string[]
    // Our new service returns 'type' as string (e.g. "destination" or "hotel")

    // Just select the location directly since we already have coordinates
    onLocationSelect(location);
    updateSearchQuery(location.name);
    setSuggestions([]);
  };

  const updateSearchQuery = (name: string) => {
    if (onSearchQueryChange) {
      onSearchQueryChange(name);
    } else {
      setInternalSearchQuery(name);
    }
  };

  const renderLocationIcon = (type?: string) => {
    // Hotel Icon (Bed)
    if (type === 'hotel') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 4v16"></path>
          <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
          <path d="M2 17h20"></path>
          <path d="M6 8v9"></path>
        </svg>
      );
    }

    // Default / Destination Icon (Map Pin)
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {searchQuery.trim() && (
        <div className="locationpicker-dropdown">
          <div className="locationpicker-content">
            {/* Show suggestions when user is typing */}

            <div className="locationpicker-section">
              <span className="locationpicker-section-header">
                {isLoading ? "Searching..." : isFetchingCoordinates ? "Loading..." : "Search Results"}
              </span>
              {isLoading || isFetchingCoordinates ? (
                <div className="locationpicker-loading">
                  <p>{isLoading ? "Loading suggestions..." : "Getting location details..."}</p>
                </div>
              ) : suggestions.length > 0 ? (
                <ul className="locationpicker-list">
                  {suggestions.map((location) => (
                    <li key={location.id}>
                      <button
                        className="locationpicker-item"
                        onClick={() => handleLocationClick(location)}
                        type="button"
                        disabled={isFetchingCoordinates}
                      >
                        {renderLocationIcon(location.types?.[0])}
                        <div className="destination-suggestion">
                          <span className="location-name">
                            {location.name}
                          </span>
                          <span className="location-country">
                            {location.region &&
                              location.region !== location.country
                              ? `${location.region}, ${location.country}`
                              : location.country}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="locationpicker-no-results">
                  <p>No locations found for &ldquo;{searchQuery}&rdquo;</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LocationPicker;
