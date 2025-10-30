import { HotelImage } from './favorite';

export interface GetHotelsRequest {
  check_in: string; // YYYY-MM-DD
  check_out: string; // YYYY-MM-DD
  rooms: number;
  adults: number;
  children: number;
  language: string; // e.g., "eng"
  latitude: number;
  longitude: number;
  star_rating?: number; // Single star rating (1-5)
  min_price?: number;
  max_price?: number;
}

export interface HotelRateCancellationPolicy {
  amount: string;
  from: string; // ISO string with timezone
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
}

export interface GetHotelsResponse {
  status: boolean;
  message: string;
  data: {
    hotels: HotelItem[];
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

export interface Board {
  code: string;
  description: Content;
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

export interface Room {
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
  rooms: Room[];
  images?: HotelImage[];
  facilities?: Facility[];
}

export interface GetHotelDetailsRequest {
  hotelId: string;
  language?: string;
}

export interface GetHotelDetailsResponse {
  status: boolean;
  message: string;
  data: {
    hotel: HotelDetails;
  };
}


