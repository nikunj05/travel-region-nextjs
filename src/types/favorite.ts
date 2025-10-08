// Favorite Hotels API Types

export interface HotelImage {
  imageTypeCode: string;
  path: string;
  order: number;
  visualOrder: number;
  roomCode?: string;
  roomType?: string;
  characteristicCode?: string;
}

export interface HotelPhone {
  phoneNumber: string;
  phoneType: string;
}

export interface HotelCoordinates {
  longitude: number;
  latitude: number;
}

export interface HotelAddress {
  content: string;
  street: string;
  number: string;
}

export interface HotelCity {
  content: string;
}

export interface HotelName {
  content: string;
}

export interface HotelDescription {
  content: string;
}

export interface RoomFacility {
  facilityCode: number;
  facilityGroupCode: number;
  indLogic?: boolean;
  number?: number;
  voucher: boolean;
  indYesOrNo?: boolean;
}

export interface RoomStayFacility {
  facilityCode: number;
  facilityGroupCode: number;
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
  roomType: string;
  characteristicCode: string;
  roomFacilities?: RoomFacility[];
  roomStays?: RoomStay[];
  PMSRoomCode?: string;
}

export interface HotelFacility {
  facilityCode: number;
  facilityGroupCode: number;
  order: number;
  indLogic?: boolean;
  indFee?: boolean;
  indYesOrNo?: boolean;
  number?: number;
  distance?: number;
  timeFrom?: string;
  timeTo?: string;
  amount?: number;
  currency?: string;
  applicationType?: string;
  dateTo?: string;
  voucher: boolean;
}

export interface HotelTerminal {
  terminalCode: string;
  distance: number;
}

export interface InterestPoint {
  facilityCode: number;
  facilityGroupCode: number;
  order: number;
  poiName: string;
  distance: string;
}

export interface HotelWildcard {
  roomType: string;
  roomCode: string;
  characteristicCode: string;
  hotelRoomDescription: {
    content: string;
  };
}

export interface AuditData {
  processTime: string;
  timestamp: string;
  requestHost: string;
  serverId: string;
  environment: string;
  release: string;
}

export interface FavoriteHotel {
  code: number;
  name: HotelName;
  description: HotelDescription;
  countryCode: string;
  stateCode: string;
  destinationCode: string;
  zoneCode: number;
  coordinates: HotelCoordinates;
  categoryCode: string;
  categoryGroupCode: string;
  chainCode: string;
  accommodationTypeCode: string;
  boardCodes: string[];
  segmentCodes: number[];
  address: HotelAddress;
  postalCode: string;
  city: HotelCity;
  email: string;
  license: string;
  giataCode: number;
  phones: HotelPhone[];
  rooms: HotelRoom[];
  facilities: HotelFacility[];
  terminals: HotelTerminal[];
  interestPoints: InterestPoint[];
  images: HotelImage[];
  wildcards: HotelWildcard[];
  web: string;
  lastUpdate: string;
  S2C: string;
  ranking: number;
}

export interface FavoriteHotelsData {
  from: number;
  to: number;
  total: number;
  auditData: AuditData;
  hotels: FavoriteHotel[];
}

export interface FavoriteHotelsResponse {
  status: boolean;
  message: string;
  data: {
    favorites: FavoriteHotelsData;
  };
}

export interface AddFavoriteRequest {
  hotel_code: number;
}

export interface FavoriteRecord {
  id: number;
  user_id: number;
  hotel_codes: string;
  created_at: string;
  updated_at: string;
}

export interface AddFavoriteResponse {
  status: boolean;
  message: string;
  data: {
    favorite: FavoriteRecord;
  };
}

export interface FavoriteHotelsParams {
  language?: string;
  page?: number;
  limit?: number;
}
