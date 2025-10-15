"use client"
import React, { useState, useEffect, useRef } from 'react'
import './LocationPicker.scss'

interface Location {
  id: string
  name: string
  country: string
  region?: string
  icon?: React.ReactNode
  coordinates?: {
    lat: number
    lng: number
  }
}

interface MapboxContext {
  id: string
  mapbox_id: string
  wikidata?: string
  short_code?: string
  text: string
}

interface MapboxFeature {
  id: string
  type: string
  place_type: string[]
  relevance: number
  properties: {
    mapbox_id: string
    wikidata?: string
  }
  text: string
  place_name: string
  bbox: number[]
  center: number[]
  context?: MapboxContext[]
  geometry: {
    type: string
    coordinates: number[]
  }
}

interface LocationPickerProps {
  isOpen: boolean
  onLocationSelect: (location: Location | null) => void
  selectedLocation?: Location | null
  recentSearches?: Location[]
  suggestedDestinations?: Location[]
  searchQuery?: string
  onSearchQueryChange?: (query: string) => void
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  isOpen,
  onLocationSelect,
  recentSearches = [],
  suggestedDestinations = [],
  searchQuery: externalSearchQuery = '',
  onSearchQueryChange
}) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState('')
  const [mapboxSuggestions, setMapboxSuggestions] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
console.log('mapboxSuggestions ==>' , mapboxSuggestions)
  // Use external search query if provided, otherwise use internal
  const searchQuery = externalSearchQuery || internalSearchQuery

  // Default locations if none provided
  // const defaultRecentSearches: Location[] = [
  //   { id: '1', name: 'Kuala Lumpur', country: 'Malaysia' }
  // ]

  // const defaultSuggestedDestinations: Location[] = [
  //   { id: '2', name: 'Kuala Lumpur', country: 'Malaysia' },
  //   { id: '3', name: 'Toronto', country: 'Canada' },
  //   { id: '4', name: 'Bangkok', country: 'Thailand' },
  //   { id: '5', name: 'London', country: 'United Kingdom' },
  //   { id: '6', name: 'NY City', country: 'New York' }
  // ]

  // const recentLocations = recentSearches.length > 0 ? recentSearches : defaultRecentSearches

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Mapbox search function
  const searchMapboxPlaces = async (query: string) => {
    if (!query.trim()) {
      setMapboxSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_KEY
      if (!mapboxToken) {
        console.error('Mapbox token not found')
        return
      }

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=5&types=place,locality,neighborhood`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions')
      }

      const data = await response.json()
      console.log("data ==>" , data)
      const features: MapboxFeature[] = data.features || []

      const suggestions: Location[] = features.map((feature, index) => {
        // Extract country, region, and district from context array
        const countryContext = feature.context?.find((ctx: MapboxContext) => ctx.id.startsWith('country'))
        const regionContext = feature.context?.find((ctx: MapboxContext) => ctx.id.startsWith('region'))
        const districtContext = feature.context?.find((ctx: MapboxContext) => ctx.id.startsWith('district'))
        
        return {
          id: feature.id || `mapbox-${index}`,
          name: feature.text || 'Unknown',
          country: countryContext?.text || 'Unknown',
          region: regionContext?.text || districtContext?.text || undefined,
          coordinates: {
            lat: feature.center[1],
            lng: feature.center[0]
          }
        }
      })

      setMapboxSuggestions(suggestions)
    } catch (error) {
      console.error('Error fetching Mapbox suggestions:', error)
      setMapboxSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchMapboxPlaces(searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleLocationClick = (location: Location) => {
    onLocationSelect(location)
    // Keep the location name in the input for editing
    if (onSearchQueryChange) {
      onSearchQueryChange(location.name)
    } else {
      setInternalSearchQuery(location.name)
    }
    setMapboxSuggestions([])
  }

  

  const renderLocationIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.37497 7.875H4.87496C4.77553 7.87503 4.68017 7.91454 4.60986 7.98486C4.53954 8.05517 4.50003 8.15053 4.5 8.24996V23.625C4.50003 23.7245 4.53954 23.8198 4.60986 23.8901C4.68017 23.9604 4.77553 24 4.87496 24H9.37497C9.47441 24 9.56977 23.9604 9.64008 23.8901C9.71039 23.8198 9.74991 23.7245 9.74994 23.625V8.24996C9.74991 8.15053 9.71039 8.05517 9.64008 7.98486C9.56977 7.91454 9.47441 7.87503 9.37497 7.875ZM9.00001 23.2501H5.25004V8.62504H9.00001V23.2501Z"
        fill="black" />
      <path
        d="M21.3758 23.25H2.62576C2.52789 23.2524 2.43482 23.2929 2.36643 23.363C2.29805 23.4331 2.25977 23.5271 2.25977 23.625C2.25977 23.7229 2.29805 23.8169 2.36643 23.887C2.43482 23.957 2.52789 23.9976 2.62576 24H21.3758C21.4737 23.9976 21.5668 23.957 21.6352 23.887C21.7035 23.8169 21.7418 23.7229 21.7418 23.625C21.7418 23.5271 21.7035 23.4331 21.6352 23.363C21.5668 23.2929 21.4737 23.2524 21.3758 23.25ZM8.62584 5.25H5.6258C5.52637 5.25003 5.43101 5.28954 5.3607 5.35986C5.29038 5.43017 5.25087 5.52553 5.25084 5.62496V8.24993C5.25087 8.34937 5.29038 8.44473 5.3607 8.51504C5.43101 8.58535 5.52637 8.62487 5.6258 8.6249H8.62584C8.72528 8.62487 8.82064 8.58535 8.89095 8.51504C8.96126 8.44473 9.00078 8.34937 9.00081 8.24993V5.62496C9.00078 5.52553 8.96126 5.43017 8.89095 5.35986C8.82064 5.28954 8.72528 5.25003 8.62584 5.25ZM8.25077 7.87497H6.00077V5.99993H8.25077V7.87497Z"
        fill="black" />
      <path
        d="M8.55 3.89991L7.425 2.39994C7.28328 2.21109 6.96676 2.21109 6.82504 2.39994L5.70004 3.89991C5.65128 3.96478 5.62494 4.04375 5.625 4.12491V5.62487C5.62503 5.72431 5.66454 5.81967 5.73486 5.88998C5.80517 5.96029 5.90053 5.99981 5.99996 5.99984H8.24997C8.34941 5.99981 8.44476 5.96029 8.51507 5.88998C8.58539 5.81967 8.6249 5.72431 8.62493 5.62487V4.12491C8.62506 4.04376 8.59876 3.96478 8.55 3.89991ZM7.875 5.24991H6.37504V4.24993L7.12508 3.24996L7.87511 4.24993L7.875 5.24991Z"
        fill="black" />
      <path
        d="M7.125 0C7.02556 2.91222e-05 6.93021 0.0395435 6.85989 0.109857C6.78958 0.18017 6.75007 0.275526 6.75004 0.374964V2.62497C6.75241 2.72284 6.79295 2.81591 6.86301 2.8843C6.93307 2.95268 7.0271 2.99096 7.125 2.99096C7.22291 2.99096 7.31693 2.95268 7.38699 2.8843C7.45705 2.81591 7.4976 2.72284 7.49997 2.62497V0.374964C7.49994 0.275526 7.46042 0.18017 7.39011 0.109857C7.3198 0.0395435 7.22444 2.91222e-05 7.125 0ZM6 9.37498H8.25V10.125H6V9.37498ZM6 10.8751H8.25V11.6251H6V10.8751ZM6 12.375H8.25V13.1251H6V12.375ZM6 13.875H8.25V14.625H6V13.875ZM6 15.3751H8.25V16.1251H6V15.3751ZM6 16.875H8.25V17.6251H6V16.875ZM6 18.375H8.25V19.125H6V18.375ZM6 19.8751H8.25V20.6251H6V19.8751ZM19.1251 7.87501H14.625C14.5256 7.87504 14.4303 7.91456 14.3599 7.98487C14.2896 8.05518 14.2501 8.15054 14.2501 8.24998V23.625C14.2501 23.7245 14.2896 23.8198 14.3599 23.8901C14.4303 23.9605 14.5256 24 14.625 24H19.1251C19.2245 24 19.3198 23.9605 19.3902 23.8901C19.4605 23.8198 19.5 23.7245 19.5 23.625V8.24998C19.5 8.15054 19.4605 8.05518 19.3902 7.98487C19.3198 7.91456 19.2245 7.87504 19.1251 7.87501ZM18.7501 23.2501H15.0001V8.62505H18.7501V23.2501Z"
        fill="black" />
      <path
        d="M18.375 5.25H15.375C15.2755 5.25003 15.1802 5.28954 15.1099 5.35986C15.0395 5.43017 15 5.52553 15 5.62496V8.24993C15 8.34937 15.0395 8.44473 15.1099 8.51504C15.1802 8.58535 15.2755 8.62487 15.375 8.6249H18.375C18.4744 8.62487 18.5698 8.58535 18.6401 8.51504C18.7104 8.44473 18.7499 8.34937 18.75 8.24993V5.62496C18.7499 5.52553 18.7104 5.43017 18.6401 5.35986C18.5698 5.28954 18.4744 5.25003 18.375 5.25ZM18 7.87497H15.75V5.99993H18V7.87497Z"
        fill="black" />
      <path
        d="M18.302 3.89991L17.177 2.39994C17.0352 2.21109 16.7187 2.21109 16.577 2.39994L15.452 3.89991C15.4032 3.96478 15.3769 4.04375 15.377 4.12491V5.62487C15.377 5.72431 15.4165 5.81967 15.4868 5.88998C15.5571 5.96029 15.6525 5.99981 15.7519 5.99984H18.0019C18.1014 5.99981 18.1967 5.96029 18.267 5.88998C18.3373 5.81967 18.3769 5.72431 18.3769 5.62487V4.12491C18.3769 4.04383 18.3506 3.96473 18.302 3.89991ZM17.627 5.24991H16.127V4.24993L16.877 3.24996L17.6271 4.24993L17.627 5.24991Z"
        fill="black" />
      <path
        d="M16.875 0C16.7756 2.91222e-05 16.6802 0.0395435 16.6099 0.109857C16.5396 0.18017 16.5001 0.275526 16.5 0.374964V2.62497C16.5024 2.72284 16.543 2.81591 16.613 2.8843C16.6831 2.95268 16.7771 2.99096 16.875 2.99096C16.9729 2.99096 17.0669 2.95268 17.137 2.8843C17.2071 2.81591 17.2476 2.72284 17.25 2.62497V0.374964C17.2499 0.275526 17.2104 0.18017 17.1401 0.109857C17.0698 0.0395435 16.9745 2.91222e-05 16.875 0ZM15.75 9.37498H18V10.125H15.75V9.37498ZM15.75 10.8751H18V11.6251H15.75V10.8751ZM15.75 12.375H18V13.1251H15.75V12.375ZM15.75 13.875H18V14.625H15.75V13.875ZM15.75 15.3751H18V16.1251H15.75V15.3751ZM15.75 16.875H18V17.6251H15.75V16.875ZM15.75 18.375H18V19.125H15.75V18.375ZM15.75 19.8751H18V20.6251H15.75V19.8751ZM14.625 13.875H9.37496C9.27553 13.875 9.18017 13.9145 9.10986 13.9848C9.03954 14.0552 9.00003 14.1505 9 14.2499V15.375C9.00003 15.4744 9.03954 15.5697 9.10986 15.6401C9.18017 15.7104 9.27553 15.7499 9.37496 15.7499H14.625C14.7244 15.7499 14.8198 15.7104 14.8901 15.6401C14.9604 15.5697 14.9999 15.4744 15 15.375V14.2499C14.9999 14.1505 14.9604 14.0552 14.8901 13.9849C14.8198 13.9146 14.7244 13.875 14.625 13.875ZM14.25 15H9.75004V14.625H14.25V15Z"
        fill="black" />
      <path
        d="M12.2427 15.0874C12.2049 15.0558 12.1613 15.032 12.1143 15.0172C12.0673 15.0025 12.0179 14.9971 11.9688 15.0015C11.9198 15.0058 11.8721 15.0198 11.8284 15.0426C11.7848 15.0654 11.746 15.0966 11.7144 15.1343L9.15187 18.1968C9.08804 18.273 9.05713 18.3715 9.06592 18.4706C9.07472 18.5697 9.12251 18.6612 9.19878 18.725C9.27505 18.7888 9.37355 18.8197 9.47261 18.8109C9.57167 18.8021 9.66318 18.7544 9.727 18.6781L12.2896 15.6156C12.3534 15.5394 12.3843 15.4409 12.3755 15.3418C12.3667 15.2428 12.3189 15.1513 12.2427 15.0874Z"
        fill="black" />
      <path
        d="M14.9146 18.1968L12.352 15.1343C12.2882 15.0581 12.1967 15.0103 12.0976 15.0015C11.9985 14.9927 11.9 15.0236 11.8238 15.0874C11.7475 15.1512 11.6997 15.2427 11.6909 15.3418C11.6821 15.4409 11.713 15.5394 11.7769 15.6156L14.3392 18.6781C14.3744 18.7202 14.4184 18.7541 14.4682 18.7774C14.5179 18.8006 14.5721 18.8126 14.6271 18.8126C14.712 18.8126 14.7973 18.7841 14.8677 18.725C14.9054 18.6934 14.9366 18.6547 14.9594 18.611C14.9822 18.5674 14.9962 18.5196 15.0005 18.4706C15.0049 18.4215 14.9995 18.3721 14.9848 18.3251C14.97 18.2781 14.9462 18.2345 14.9146 18.1968Z"
        fill="black" />
    </svg>
  )

  if (!isOpen) return null

  return (
    <div className="locationpicker-dropdown">
      <div className="locationpicker-content">
        {/* Show Mapbox suggestions when user is typing */}
        {searchQuery.trim() && (
          <div className="locationpicker-section">
            <span className="locationpicker-section-header">
              {isLoading ? 'Searching...' : 'Search Results'}
            </span>
            {isLoading ? (
              <div className="locationpicker-loading">
                <p>Loading suggestions...</p>
              </div>
            ) : mapboxSuggestions.length > 0 ? (
              <ul className="locationpicker-list">
                {mapboxSuggestions.map((location) => (
                  <li key={location.id}>
                    <button
                      className="locationpicker-item"
                      onClick={() => handleLocationClick(location)}
                      type="button"
                    >
                      {renderLocationIcon()}
                      <div className="destination-suggestion">
                        <span className="location-name">{location.name}</span>
                        <span className="location-country">
                          {location.region && location.region !== location.country 
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
                <p>No locations found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}

        {/* Show recent searches when no search query */}
        {/* {!searchQuery.trim() && recentLocations.length > 0 && (
          <div className="locationpicker-section">
            <span className="locationpicker-section-header">Recent Searches</span>
            <ul className="locationpicker-list">
              {recentLocations.map((location) => (
                <li key={location.id}>
                  <button
                    className="locationpicker-item"
                    onClick={() => handleLocationClick(location)}
                    type="button"
                  >
                    {renderLocationIcon()}
                    <span className="location-name">{location.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )} */}

        {/* Show no content message when no search and no recent searches */}
        {/* {!searchQuery.trim() && recentLocations.length === 0 && (
          <div className="locationpicker-no-results">
            <p>Start typing to search for locations</p>
          </div>
        )} */}
      </div>
    </div>
  )
}

export default LocationPicker
