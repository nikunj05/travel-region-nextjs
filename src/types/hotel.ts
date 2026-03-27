import { HotelImage } from './favorite';
import { Room } from '@/store/searchFiltersStore';

export interface GetHotelsRequest {
  check_in: string; // YYYY-MM-DD
  check_out: string; // YYYY-MM-DD
  rooms: Room[];
  language: string; // e.g., "eng"
  latitude?: number;
  longitude?: number;
  destination_code?: string;
  hotel_code?: string;
  star_rating?: number; // Single star rating (1-5)
  min_price?: number;
  max_price?: number;
  accommodations?: string; // Comma-separated accommodation codes (e.g., "H,I")
  boards?: string; // Comma-separated board codes (e.g., "RO,HB")
  featured?: boolean;
}

export interface HotelRateCancellationPolicy {
  amount: string;
  from: string; // ISO string with timezone
}

export interface HotelRateOffer {
  code: string;
  name: string;
  amount: string;
}

export interface HotelRateTaxDetail {
  included: boolean;
  amount: string;
  currency: string;
  type: string;
  clientAmount: string;
  clientCurrency: string;
}

export interface HotelRateTaxes {
  allIncluded: boolean;
  taxes: HotelRateTaxDetail[];
}

export interface HotelRate {
  rateKey: string;
  rateClass: string; // e.g., "NRF"
  rateType: string; // e.g., "BOOKABLE"
  net: string;
  allotment: number;
  paymentType: string; // e.g., "AT_WEB"
  packaging: boolean;
  boardCode: string; // e.g., "RO", "BB"
  boardName: string; // e.g., "ROOM ONLY"
  cancellationPolicies: HotelRateCancellationPolicy[];
  rooms: number;
  adults: number;
  children: number;
  // Optional fields returned by availability API
  sellingRate?: number;
  hotelSellingRate?: number;
  commissionAmount?: string;
  commission_percentage?: string;
  convertedRate?: string;
  currency?: string;
  originalNet?: string;
  offers?: HotelRateOffer[];
  rateCommentsId?: string;
  taxes?: HotelRateTaxes;
  taxesRate?: string;
}

export interface HotelAvailabilityRoom {
  code: string; // e.g., "DBL.DX"
  name: string; // e.g., "Twin Room"
  rates: HotelRate[];
}

export interface HotelItem {
  id: number;
  code: number;
  name: string;
  categoryCode: string; // e.g., "3EST"
  categoryName: string; // e.g., "3 STARS"
  destinationCode: string; // e.g., "AMD"
  destinationName: string; // e.g., "Ahmedabad"
  zoneCode: number;
  zoneName: string;
  latitude: string; // keep as string to match API response
  longitude: string; // keep as string to match API response
  rooms: HotelAvailabilityRoom[];
  minRate: string;
  maxRate: string;
  currency: string; // e.g., "EUR"
  images?: HotelImage[];
  featured?: boolean;
  show_tag?: boolean;
  facilities?: Facility[];
}

export interface SearchFacility {
  code: string;
  facility_group_code: string;
  name: string;
  count: number;
}

export interface SearchZone {
  code: number;
  name: string;
  count: number;
}

export interface GetHotelsResponse {
  status: boolean;
  message: string;
  data: {
    hotels: HotelItem[];
    facilities: SearchFacility[];
    zones: SearchZone[];
    total: number;
  };
}

// Hotel Details Interfaces
export interface Content {
  content: string;
}

export interface Country {
  code: string;
  isoCode: string;
  description: Content;
}

export interface State {
  code: string;
  name: string;
}

export interface Destination {
  code: string;
  name: Content;
  countryCode: string;
}

export interface Zone {
  zoneCode: number;
  name: string;
  description: Content;
}

export interface Coordinates {
  longitude: number;
  latitude: number;
}

export interface Category {
  code: string;
  description: Content;
}

export interface CategoryGroup {
  code: string;
  description: Content;
}

export interface Chain {
  code: string;
  description: Content;
}

export interface AccommodationType {
  code: string;
  typeMultiDescription: Content;
  typeDescription: string;
}

export interface GetAccommodationTypesResponse {
  status: boolean;
  message: string;
  data: {
    accommodation_types: AccommodationType[];
  };
}

export interface Board {
  id: number;
  code: string;
  name: string;
  multi_lingual_code: string;
}

export interface GetBoardsResponse {
  status: boolean;
  message: string;
  data: {
    board_types: Board[];
  };
}

export interface Segment {
  code: number;
  description: Content;
}

export interface Address {
  content: string;
  street: string;
  number: string;
}

export interface City {
  content: string;
  phoneNumber?: string; // inferred
}

export interface Phone {
  phoneNumber: string;
  phoneType: string;
}

export interface RoomType {
  code: string;
  description: Content;
}

export interface RoomCharacteristic {
  code: string;
  description: Content;
}

export interface Facility {
  facilityCode: number;
  facilityGroupCode: number;
  description: Content;
  indLogic?: boolean;
  indFee?: boolean;
  indYesOrNo?: boolean;
  number?: number;
  voucher: boolean;
  timeFrom?: string;
  timeTo?: string;
  order?: number;
  dateTo?: string;
}

export interface RoomStayFacility {
  facilityCode: number;
  facilityGroupCode: number;
  description: Content;
  number: number;
}

export interface RoomStay {
  stayType: string;
  order: string;
  description: string;
  roomStayFacilities: RoomStayFacility[];
}

export interface HotelRoom {
  roomCode: string;
  isParentRoom: boolean;
  minPax: number;
  maxPax: number;
  maxAdults: number;
  maxChildren: number;
  minAdults: number;
  description: string;
  type: RoomType;
  characteristic: RoomCharacteristic;
  roomFacilities?: Facility[];
  roomStays?: RoomStay[];
  PMSRoomCode?: string;
}

export interface HotelDetails {
  code: number;
  name: Content;
  description: Content;
  country: Country;
  state: State;
  destination: Destination;
  zone: Zone;
  coordinates: Coordinates;
  category: Category;
  categoryGroup: CategoryGroup;
  chain: Chain;
  accommodationType: AccommodationType;
  boards: Board[];
  segments: Segment[];
  address: Address;
  postalCode: string;
  city: City;
  email: string;
  license: string;
  giataCode: number;
  phones: Phone[];
  rooms: HotelRoom[];
  images?: HotelImage[];
  facilities?: Facility[];
}

export interface GetHotelDetailsRequest {
  hotelId: string;
  check_in: string;
  check_out: string;
  language: string;
  rooms: Room[];
}

export interface GetHotelDetailsResponse {
  status: boolean;
  message: string;
  data: {
    hotel: HotelDetails;
  };
}

export interface GetHotelImagesResponse {
  status: boolean;
  message: string;
  data: {
    images: HotelImage[];
  };
}

export interface FavoriteHotelRequest {
  hotelId: number;
}

export interface FavoriteHotelResponse {
  status: boolean;
  message: string;
}

export interface LocationDestination {
  id: number;
  code: string;
  name: string;
  country_code: string;
  latitude: string;
  longitude: string;
}

export interface LocationHotel {
  id: number;
  code: string;
  name: string;
  city: string;
  latitude: string;
  longitude: string;
}

export interface GetHotelLocationsRequest {
  search: string;
}

export interface GetHotelLocationsResponse {
  status: boolean;
  message: string;
  data: {
    destinations: LocationDestination[];
    hotels: LocationHotel[];
  };
}
