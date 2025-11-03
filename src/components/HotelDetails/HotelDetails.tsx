"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import "./HotelDetails.scss";
import { useHotelDetailsStore } from "@/store/hotelDetailsStore";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { buildHotelbedsImageUrl } from "@/constants";
import starFillIcon from "@/assets/images/star-fill-icon.svg";
import mapImage from "@/assets/images/map-image.jpg";
// import BreadcrumbArrow from "@/assets/images/breadcrumb-arrow-icon.svg";
import LocationMapIcon from "@/assets/images/location-distance-icon.svg";
import LocationAddressIcon from "@/assets/images/map-icon.svg";
import FilterComponents from "../FilterComponents/FilterComponents";
import HotelImgPrevIcon from "@/assets/images/slider-prev-arrow-icon.svg";
import HotelImgNextIcon from "@/assets/images/slider-next-arrow-icon.svg";
import HotelDetailsCardImage from "@/assets/images/hotel-card-image.jpg";
import FreeBreackfast from "@/assets/images/breackfast-icon.svg";
import SelfParking from "@/assets/images/parking-icon.svg";
import ReviewSlider from "../common/ReviewSlider/ReviewSlider";
import NearByHotels from "../common/NearbyHotels/NearbyHotels";
import FaqSection from "../common/FaqSection/FaqSection";
import RoomInfoImage from "@/assets/images/room-information-image.jpg";
import ClosePopupIcon from "@/assets/images/close-btn-icon.svg";
import ImageModal from "../common/ImageModal/ImageModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AmenityIcon from "../common/AmenityIcon/AmenityIcon";
import { HotelImage } from "@/types/favorite";

interface HotelDetailsProps {
  hotelId: string;
}

interface ProcessedRoomImage {
  path: string;
  fullUrl: string;
  type: string;
  typeDescription: string;
  order: number;
  characteristicCode: string;
}

interface ProcessedRoomFacility {
  code: number;
  groupCode: number;
  description: string;
  hasLogic: boolean;
  hasFee: boolean;
  number: number | null;
  isYesOrNo: boolean;
}

interface ProcessedRoomStayFacility {
  code: number;
  groupCode: number;
  description: string;
  number: number | null;
}

interface ProcessedRoomStay {
  type: string;
  order: string;
  description: string;
  facilities: ProcessedRoomStayFacility[];
}

interface ProcessedRoom {
  roomCode: string;
  description: string;
  type: string;
  typeDescription: string;
  characteristic: string;
  characteristicDescription: string;
  isParentRoom: boolean;
  capacity: {
    minPax: number;
    maxPax: number;
    minAdults: number;
    maxAdults: number;
    maxChildren: number;
  };
  images: ProcessedRoomImage[];
  imageCount: number;
  facilities: ProcessedRoomFacility[];
  facilityCount: number;
  roomStays: ProcessedRoomStay[];
  PMSRoomCode: string;
}

const HotelDetails = ({ hotelId }: HotelDetailsProps) => {
  const t = useTranslations("HotelDetails");
  const locale = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [processedRooms, setProcessedRooms] = useState<ProcessedRoom[]>([]);
  const { hotel: hotelData, loading, fetchHotel } = useHotelDetailsStore();
  console.log('hotelData', hotelData);
  const router = useRouter();

  // Helper function to map locale to API language code
  const getLanguageCode = (currentLocale: string): string => {
    return currentLocale === 'ar' ? 'ARA' : 'ENG';
  };

  // Fetch hotel details on mount and when locale changes
  useEffect(() => {
    if (hotelId) {
      const languageCode = getLanguageCode(locale);
      console.log('Fetching hotel details with language:', languageCode, 'for hotelId:', hotelId);
      fetchHotel({ hotelId, language: languageCode });
    }
  }, [hotelId, locale, fetchHotel]);

  // Process and combine rooms with images and facilities
  useEffect(() => {
    if (hotelData && hotelData.rooms && hotelData.images) {
      const roomsWithDetails = hotelData.rooms.map((room) => {
        // Filter images for this room
        const roomImages = (hotelData.images || []).filter(
          (img) => img.roomCode === room.roomCode && img.path
        ).map((img) => ({
          path: img.path,
          fullUrl: buildHotelbedsImageUrl(img.path),
          type: img.type?.code || 'Unknown',
          typeDescription: img.type?.description?.content || '',
          order: img.order || img.visualOrder || 0,
          characteristicCode: img.characteristicCode || ''
        })).sort((a, b) => a.order - b.order);

        // Extract room facilities
        const facilities = (room.roomFacilities || []).map((facility) => ({
          code: facility.facilityCode,
          groupCode: facility.facilityGroupCode,
          description: facility.description?.content || '',
          hasLogic: facility.indLogic || false,
          hasFee: facility.indFee || false,
          number: facility.number || null,
          isYesOrNo: facility.indYesOrNo || false
        }));

        // Extract room stays info
        const roomStays = (room.roomStays || []).map((stay) => ({
          type: stay.stayType,
          order: stay.order,
          description: stay.description || '',
          facilities: (stay.roomStayFacilities || []).map((f) => ({
            code: f.facilityCode,
            groupCode: f.facilityGroupCode,
            description: f.description?.content || '',
            number: f.number || null
          }))
        }));

        return {
          roomCode: room.roomCode,
          description: room.description,
          type: room.type?.code || '',
          typeDescription: room.type?.description?.content || '',
          characteristic: room.characteristic?.code || '',
          characteristicDescription: room.characteristic?.description?.content || '',
          isParentRoom: room.isParentRoom,
          capacity: {
            minPax: room.minPax,
            maxPax: room.maxPax,
            minAdults: room.minAdults,
            maxAdults: room.maxAdults,
            maxChildren: room.maxChildren || 0
          },
          images: roomImages,
          imageCount: roomImages.length,
          facilities: facilities,
          facilityCount: facilities.length,
          roomStays: roomStays,
          PMSRoomCode: room.PMSRoomCode || ''
        };
      });

      // Console log with proper formatting
      console.group('🏨 ROOMS WITH COMPLETE DETAILS');
      console.log(`Total Rooms: ${roomsWithDetails.length}`);
      console.log(`Total Images Available: ${hotelData.images.length}`);
      console.log('─'.repeat(80));
      
      // roomsWithDetails.forEach((room, index) => {
      //   console.group(`\n📍 Room ${index + 1}: ${room.roomCode}`);
      //   console.log('Description:', room.description);
      //   console.log('Type:', `${room.type} - ${room.typeDescription}`);
      //   console.log('Characteristic:', `${room.characteristic} - ${room.characteristicDescription}`);
      //   console.log('Capacity:', `${room.capacity.minPax}-${room.capacity.maxPax} people (Max ${room.capacity.maxAdults} adults, ${room.capacity.maxChildren} children)`);
      //   console.log(`Images (${room.imageCount}):`, room.images);
      //   console.log(`Facilities (${room.facilityCount}):`, room.facilities);
      //   console.log('Room Stays:', room.roomStays);
      //   console.groupEnd();
      // });
      
      console.groupEnd();

      // Store processed rooms in state
      setProcessedRooms(roomsWithDetails);
      console.log('✅ Processed rooms stored in state:', roomsWithDetails);
    }
  }, [hotelData]);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenImageModal = () => {
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
  };

  const handleReadMoreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  // Helper functions for hotel images
  const getOrderedHotelImages = () => {
    if (!hotelData?.images) return [];
    const images = hotelData.images.filter((img) => !!img?.path);
    // Prioritize GEN images first; within each group, sort by 'order' then 'visualOrder'
    const getOrderValue = (img: HotelImage) => {
      if (typeof img.order === "number") return img.order;
      if (typeof img.visualOrder === "number") return img.visualOrder;
      return Number.MAX_SAFE_INTEGER;
    };
    const genImages = images
      .filter((img) => img.type?.code === "GEN")
      .sort((a, b) => getOrderValue(a) - getOrderValue(b));
    const otherImages = images
      .filter((img) => img.type?.code !== "GEN")
      .sort((a, b) => getOrderValue(a) - getOrderValue(b));
    // Return prioritized list (GEN first, then others)
    return [...genImages, ...otherImages];
  };

  const getMainAndThumbImages = () => {
    const sorted = getOrderedHotelImages();
    if (sorted.length === 0) {
      return {
        main: null as string | null,
        thumbs: [] as string[],
        totalCount: 0
      };
    }
    const mainPath = sorted[0]?.path;
    const thumbPaths = sorted.slice(1, 5).map((img) => img.path);
    return {
      main: mainPath ? buildHotelbedsImageUrl(mainPath) : null,
      thumbs: thumbPaths.map(buildHotelbedsImageUrl),
      totalCount: sorted.length
    };
  };

  const handleTabClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    tab: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(tab);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const amenities = hotelData?.facilities?.filter(f =>
    [70, 71, 72, 73, 85, 90].includes(f.facilityGroupCode) &&
    f.indLogic !== false && f.indYesOrNo !== false
  ) || [];

  const displayedAmenities = showAllAmenities ? amenities : amenities.slice(0, 8);

  return (
    <main className="hotel-details-page padding-top-100 section-space-b">
      <div className="container">
        {loading && (
          <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
            <div className="hotel-details-skeleton" aria-hidden>
              <nav className="breadcrumbs" aria-label="Breadcrumb">
                <ol>
                  <li>
                    <Skeleton width={120} height={16} />
                  </li>
                </ol>
              </nav>
              <div className="hotel-details-main-content">
                <div className="hotel-details-left">
                  <div className="image-gallery-section">
                    <div className="main-image">
                      <Skeleton height={260} />
                    </div>
                    <div className="thumbnail-images" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <Skeleton key={idx} height={52} />
                      ))}
                    </div>
                  </div>
                  <div className="tabbing-conetnt">
                    <div className="tabbing-tabs-container">
                      <div className="hotel-tabs">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Skeleton key={idx} width={80} height={20} style={{ display: 'inline-block', marginRight: 12 }} />
                        ))}
                      </div>
                    </div>
                    <section className="hotel-tab-section">
                      <Skeleton height={20} width={160} style={{ marginBottom: 12 }} />
                      <Skeleton count={4} height={14} style={{ marginBottom: 8 }} />
                    </section>
                  </div>
                </div>
                <div className="hotel-details-right">
                  <Skeleton height={28} width={240} style={{ marginBottom: 12 }} />
                  <Skeleton height={20} width={160} style={{ marginBottom: 8 }} />
                  <Skeleton height={16} width={200} style={{ marginBottom: 8 }} />
                  <div className="hotel-price-info">
                    <Skeleton height={20} width={180} style={{ marginBottom: 12 }} />
                    <Skeleton height={44} width={200} />
                  </div>
                </div>
              </div>
              <section className="rooms-filter-section">
                <Skeleton height={24} width={120} style={{ marginBottom: 16 }} />
                <div className="room-list">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div className="room-card" key={idx}>
                      <div className="room-card-image">
                        <Skeleton height={203} />
                      </div>
                      <div className="room-card-details">
                        <Skeleton height={20} width={220} style={{ marginBottom: 8 }} />
                        <Skeleton count={2} height={14} width={260} style={{ marginBottom: 6 }} />
                        <Skeleton height={36} width={140} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </SkeletonTheme>
        )}
        {!loading && (
          <>
        {/* Breadcrumbs */}
        {/* <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
              <Image
                src={BreadcrumbArrow}
                width={18}
                height={18}
                alt="arrow icon"
                className="breadcrumb-arrow-icon"
              />
            </li>
            <li>
              <Link href="#">Bangkok</Link>
              <Image
                src={BreadcrumbArrow}
                width={18}
                height={18}
                alt="arrow icon"
                className="breadcrumb-arrow-icon"
              />
            </li>
            <li>
              <Link href="/thailand">Thailand</Link>
              <Image
                src={BreadcrumbArrow}
                width={18}
                height={18}
                alt="arrow icon"
                className="breadcrumb-arrow-icon"
              />
            </li>
            <li aria-current="page">Novotel</li>
          </ol>
        </nav> */}

        <div className="hotel-details-main-content mt-4">
          <div className="hotel-details-left">
            {/* Image Gallery */}
            <div className="image-gallery-section">
              {(() => {
                const images = getMainAndThumbImages();
                return (
                  <>
                    <div className="main-image">
                      {images.main && (
                        <Image
                          src={images.main}
                          width={892}
                          height={260}
                          alt={hotelData?.name?.content || "Hotel"}
                          className="hotel-details-main-image"
                        />
                      )}
                    </div>
                    {images.thumbs.length > 0 && (
                      <div className="thumbnail-images">
                        {images.thumbs.slice(0, 4).map((imgSrc, index, arr) => (
                          <div key={`thumb-${index}`} className="thambnail-image-item">
                            <Image 
                              src={imgSrc} 
                              alt={`Thumbnail ${index + 1}`} 
                              width={66}
                              height={52}
                            />
                            {(images.totalCount > 0 && (index === 3 || index === arr.length - 1)) && (
                              <Link
                                href="#"
                                className="show-all-photos"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleOpenImageModal();
                                }}
                              >
                                {`${t("showAllPhotos")} (${images.totalCount})`}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            <div className="tabbing-conetnt">
              {/* Tabs */}
              <div className="tabbing-tabs-container">
                <div className="hotel-tabs">
                  <a
                    href="#overview"
                    onClick={(e) => handleTabClick(e, "overview")}
                  >
                    Overview
                  </a>
                  <a
                    href="#amenities"
                    onClick={(e) => handleTabClick(e, "amenities")}
                  >
                    Amenities
                  </a>
                  <a href="#rooms" onClick={(e) => handleTabClick(e, "rooms")}>
                    Rooms
                  </a>
                  <a
                    href="#reviews"
                    onClick={(e) => handleTabClick(e, "reviews")}
                  >
                    Reviews
                  </a>
                  <a href="#map" onClick={(e) => handleTabClick(e, "map")}>
                    Map
                  </a>
                </div>
              </div>

              {/* Overview */}
              <section id="overview" className="hotel-tab-section">
                <h2 className="tabbing-sub-title">Description</h2>
                <p className="hotel-description">
                  {isDescriptionExpanded 
                    ? hotelData?.description?.content || 'Hotel Description'
                    : (hotelData?.description?.content || 'Hotel Description').substring(0, 300) + '...'
                  }
                  <a 
                    href="#" 
                    onClick={handleReadMoreClick}
                    style={{ marginLeft: '8px', color: '#3E5B96', textDecoration: 'underline' }}
                  >
                    {isDescriptionExpanded ? t("readLess") : t("readMore")}
                  </a>
                </p>
              </section>
              <section className="hotel-tab-section important-tab-content">
                <h2 className="tabbing-sub-title">Important</h2>
                <div className="important-info">
                  <div className="important-item">
                    <div className="important-icon arrow_icon d-flex align-items-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="#09090B"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M16 12L8 12M16 12C16 12.7002 14.0057 14.0085 13.5 14.5M16 12C16 11.2998 14.0057 9.99153 13.5 9.5"
                          stroke="#09090B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Check-in
                    </div>
                    <p className="important-text">2:00 PM</p>
                  </div>
                  <div className="important-item">
                    <div className="important-icon arrow_icon d-flex align-items-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="#09090B"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M8 12L16 12M8 12C8 11.2998 9.9943 9.99153 10.5 9.5M8 12C8 12.7002 9.9943 14.0085 10.5 14.5"
                          stroke="#09090B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Check-out
                    </div>
                    <p className="important-text">11:00 AM</p>
                  </div>
                  <div className="important-item">
                    <div className="important-icon d-flex align-items-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                          stroke="#09090B"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M12.2422 17V12C12.2422 11.5286 12.2422 11.2929 12.0957 11.1464C11.9493 11 11.7136 11 11.2422 11"
                          stroke="#09090B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11.992 8H12.001"
                          stroke="#09090B"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Additional Facts
                    </div>
                    <p className="important-text">
                      Reception Open Until 12:00 PM
                    </p>
                  </div>
                </div>
              </section>
              {/* Amenities */}
              <section
                id="amenities"
                className="hotel-tab-section amenities-tab-content"
              >
                <h2 className="tabbing-sub-title">Hotel Room & Facilities</h2>
                <div className="amenities-info d-grid">
                  {displayedAmenities.map((facility) => (
                    <div key={`${facility.facilityGroupCode}-${facility.facilityCode}-${facility.description.content}`} className="amenities-item d-flex align-items-center">
                      <AmenityIcon facilityCode={facility.facilityCode} />
                      {facility.description.content}
                    </div>
                  ))}
                </div>
                {amenities.length > 8 && (
                  <button 
                    onClick={() => setShowAllAmenities(!showAllAmenities)} 
                    className="button-primary show-all-amenities-btn"
                  >
                    {showAllAmenities ? t("showLess") : t("showAll")}
                  </button>
                )}
              </section>
            </div>
          </div>
          <div className="hotel-details-right">
            <div className="hotel-info-header">
              <h2 className="hotel-name">{hotelData?.name?.content || 'Hotel Name'}</h2>
              <div className="hotel-details-rating d-flex align-items-center">
                <div className="hotel-details-rating-star d-flex align-items-center">
                  <Image
                    src={starFillIcon}
                    width={16}
                    height={16}
                    alt="star"
                    className="hotel-rating-icon"
                  />
                  <Image
                    src={starFillIcon}
                    width={16}
                    height={16}
                    alt="star"
                    className="hotel-rating-icon"
                  />
                  <Image
                    src={starFillIcon}
                    width={16}
                    height={16}
                    alt="star"
                    className="hotel-rating-icon"
                  />
                  <Image
                    src={starFillIcon}
                    width={16}
                    height={16}
                    alt="star"
                    className="hotel-rating-icon"
                  />
                  <Image
                    src={starFillIcon}
                    width={16}
                    height={16}
                    alt="star"
                    className="hotel-rating-icon"
                  />
                </div>
                <span className="rating-value-wrapper d-flex align-items-center">
                  <span className="rating-value">4.5</span> (120 Reviews)
                </span>
              </div>
              <div className="distance d-flex align-items-center">
                <Image
                  src={LocationMapIcon}
                  width={20}
                  height={20}
                  alt="location ,ap icon"
                  className="hotel-rating-icon"
                />
                2.4km away from city center
              </div>
              <div className="location-address d-flex align-items-start">
                <Image
                  src={LocationAddressIcon}
                  width={20}
                  height={20}
                  alt="location"
                  className="hotel-address-icon"
                />
                {hotelData?.address?.content || 'Hotel Address'}
              </div>

              <div className="hotel-price-info">
                <div className="price">
                  Price: Starts from <span>$500</span>/night
                </div>
                <div className="check-availability-action">
                  <button
                    className="button-primary check-availability-btn"
                    onClick={() => router.push(`/booking-review`)}
                  >
                    Check Availability
                  </button>
                </div>
              </div>
              <div className="free-cancellation-section d-flex align-items-center">
                <span>Free Cancellation</span>
                <span>No Repay</span>
              </div>
              <div className="share-like-section d-flex align-items-center">
                <button className="share-btn favarite-btn">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z"
                      stroke="#FB2C36"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Favorite
                </button>
                <button className="share-btn">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 7C18.7745 7.16058 19.3588 7.42859 19.8284 7.87589C21 8.99181 21 10.7879 21 14.38C21 17.9721 21 19.7681 19.8284 20.8841C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8841C3 19.7681 3 17.9721 3 14.38C3 10.7879 3 8.99181 4.17157 7.87589C4.64118 7.42859 5.2255 7.16058 6 7"
                      stroke="#2B7FFF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12.0253 2.00052L12 14M12.0253 2.00052C11.8627 1.99379 11.6991 2.05191 11.5533 2.17492C10.6469 2.94006 9 4.92886 9 4.92886M12.0253 2.00052C12.1711 2.00657 12.3162 2.06476 12.4468 2.17508C13.3531 2.94037 15 4.92886 15 4.92886"
                      stroke="#2B7FFF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms */}
        <section id="rooms" className="rooms-filter-section">
          <h2 className="hotel-section-title">Room</h2>
          <div className="room-filters">
            <FilterComponents />
          </div>
          <div className="room-filter-bar">
            <div className="room-filter-left">
              <button className="filter-btn active">All rooms</button>
              <button className="filter-btn">1 Bed</button>
              <button className="filter-btn">2 Bed</button>
            </div>
            <div className="room-filter-right">Showing 3 of 3 rooms</div>
          </div>

          <div className="room-list">
            {/* Room Cards */}
            {[1, 2, 3].map((i) => (
              <div className="room-card" key={i}>
                <div className="room-card-image">
                  <Image
                    src={HotelDetailsCardImage}
                    width={378}
                    height={203}
                    alt="Premium Double Room"
                  />
                  <div className="hotel-best-value d-flex align-items-center">
                    <span>Best Value</span>
                  </div>
                  <div className="hotel-image-action d-flex align-items-center justify-content-between">
                    <button className="hotel-img-btn border-0 p-0 bg-transparent">
                      <Image
                        src={HotelImgPrevIcon}
                        width={48}
                        height={48}
                        alt="arrow icon"
                        className="arrow-icon"
                      />
                    </button>
                    <button className="hotel-img-btn border-0 p-0 bg-transparent">
                      <Image
                        src={HotelImgNextIcon}
                        width={48}
                        height={48}
                        alt="arrow icon"
                        className="arrow-icon"
                      />
                    </button>
                  </div>
                  <div className="hotel-card-total-image d-flex align-items-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 14.9787C5.10725 16.0691 5.34963 16.803 5.89743 17.3508C6.87997 18.3333 8.46135 18.3333 11.6241 18.3333C14.7869 18.3333 16.3682 18.3333 17.3508 17.3508C18.3333 16.3682 18.3333 14.7869 18.3333 11.6241C18.3333 8.46135 18.3333 6.87997 17.3508 5.89743C16.803 5.34963 16.0691 5.10725 14.9787 5"
                        stroke="white"
                        strokeWidth="1.25"
                      />
                      <path
                        d="M1.66602 8.33268C1.66602 5.18999 1.66602 3.61864 2.64233 2.64233C3.61864 1.66602 5.18999 1.66602 8.33268 1.66602C11.4754 1.66602 13.0467 1.66602 14.023 2.64233C14.9993 3.61864 14.9993 5.18999 14.9993 8.33268C14.9993 11.4754 14.9993 13.0467 14.023 14.023C13.0467 14.9993 11.4754 14.9993 8.33268 14.9993C5.18999 14.9993 3.61864 14.9993 2.64233 14.023C1.66602 13.0467 1.66602 11.4754 1.66602 8.33268Z"
                        stroke="white"
                        strokeWidth="1.25"
                      />
                      <path
                        d="M1.66602 9.26477C2.18186 9.19922 2.70338 9.16682 3.22578 9.16797C5.43573 9.1271 7.59155 9.72962 9.30858 10.868C10.901 11.9238 12.02 13.3769 12.4993 14.9993"
                        stroke="white"
                        strokeWidth="1.25"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.8338 5.83398H10.8413"
                        stroke="white"
                        strokeWidth="1.66667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    4
                  </div>
                </div>
                <div className="room-card-details">
                  <h3 className="hotel-room-name">Premium Double Room</h3>
                  <div className="hotel-details-rating d-flex align-items-center">
                    <div className="hotel-details-rating-star d-flex align-items-center">
                      <Image
                        src={starFillIcon}
                        width={12}
                        height={12}
                        alt="star"
                        className="hotel-rating-icon"
                      />
                      <Image
                        src={starFillIcon}
                        width={12}
                        height={12}
                        alt="star"
                        className="hotel-rating-icon"
                      />
                      <Image
                        src={starFillIcon}
                        width={12}
                        height={12}
                        alt="star"
                        className="hotel-rating-icon"
                      />
                      <Image
                        src={starFillIcon}
                        width={12}
                        height={12}
                        alt="star"
                        className="hotel-rating-icon"
                      />
                      <Image
                        src={starFillIcon}
                        width={12}
                        height={12}
                        alt="star"
                        className="hotel-rating-icon"
                      />
                    </div>
                    <span className="rating-value-wrapper d-flex align-items-center">
                      <span className="rating-value">4.5</span> (120 Reviews)
                    </span>
                  </div>

                  <div className="room-card-amenities-list">
                    <ul className="amenities-item d-flex">
                      <li>
                        <Image
                          src={FreeBreackfast}
                          width={20}
                          height={20}
                          alt="Free continental breakfast"
                        />
                        Free continental breakfast
                      </li>
                      <li>
                        <Image
                          src={SelfParking}
                          width={20}
                          height={20}
                          alt="Free continental breakfast"
                        />
                        Free self parking
                      </li>
                    </ul>
                  </div>

                  <div className="room-card-specs">
                    <ul className="card-specs-item d-flex align-items-center">
                      <li>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.66602 15.8327V10.8327C1.66602 10.4577 1.7424 10.1174 1.89518 9.81185C2.04796 9.50629 2.24935 9.23546 2.49935 8.99935V6.66602C2.49935 5.97157 2.7424 5.38129 3.22852 4.89518C3.71463 4.40907 4.3049 4.16602 4.99935 4.16602H8.33268C8.65213 4.16602 8.95074 4.22518 9.22852 4.34352C9.50629 4.46185 9.76324 4.6249 9.99935 4.83268C10.2355 4.62435 10.4924 4.46129 10.7702 4.34352C11.048 4.22574 11.3466 4.16657 11.666 4.16602H14.9993C15.6938 4.16602 16.2841 4.40907 16.7702 4.89518C17.2563 5.38129 17.4993 5.97157 17.4993 6.66602V8.99935C17.7493 9.23546 17.9507 9.50629 18.1035 9.81185C18.2563 10.1174 18.3327 10.4577 18.3327 10.8327V15.8327H16.666V14.166H3.33268V15.8327H1.66602ZM10.8327 8.33268H15.8327V6.66602C15.8327 6.4299 15.7527 6.23213 15.5927 6.07268C15.4327 5.91324 15.2349 5.83324 14.9993 5.83268H11.666C11.4299 5.83268 11.2321 5.91268 11.0727 6.07268C10.9132 6.23268 10.8332 6.43046 10.8327 6.66602V8.33268ZM4.16602 8.33268H9.16602V6.66602C9.16602 6.4299 9.08602 6.23213 8.92602 6.07268C8.76602 5.91324 8.56824 5.83324 8.33268 5.83268H4.99935C4.76324 5.83268 4.56546 5.91268 4.40602 6.07268C4.24657 6.23268 4.16657 6.43046 4.16602 6.66602V8.33268ZM3.33268 12.4993H16.666V10.8327C16.666 10.5966 16.586 10.3988 16.426 10.2393C16.266 10.0799 16.0682 9.9999 15.8327 9.99935H4.16602C3.9299 9.99935 3.73213 10.0793 3.57268 10.2393C3.41324 10.3993 3.33324 10.5971 3.33268 10.8327V12.4993Z"
                            fill="#27272A"
                          />
                        </svg>
                        1 Double Bed
                      </li>
                      <li>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_40000469_6427)">
                            <path
                              d="M2.51 0C1.1324 0 0 1.1322 0 2.51C0 3.7134 0.8634 4.7292 2 4.9672V15.0528C0.8634 15.2908 0 16.3068 0 17.5102C0 18.888 1.1322 20.02 2.51 20.02C3.7194 20.02 4.728 19.1452 4.9582 18H15.0492C15.2796 19.1464 16.2998 20.02 17.5102 20.02C18.8402 20.02 19.9312 18.9624 20.0058 17.6496C20.0151 17.6037 20.0198 17.557 20.0198 17.5102C20.0198 17.4634 20.0151 17.4167 20.0058 17.3708C19.9406 16.2234 19.099 15.2712 18 15.0492V4.9708C19.099 4.7488 19.9406 3.7968 20.006 2.6496C20.0153 2.60372 20.02 2.55702 20.02 2.5102C20.02 2.46338 20.0153 2.41668 20.006 2.3708C19.931 1.058 18.8402 0 17.51 0C16.3068 0 15.2908 0.8634 15.0528 2H4.954C4.716 0.8648 3.712 0 2.51 0ZM2.51 1.4C3.1314 1.4 3.62 1.8888 3.62 2.51C3.62 3.1314 3.1314 3.62 2.51 3.62C1.889 3.62 1.4 3.1314 1.4 2.51C1.4 1.889 1.8888 1.4 2.51 1.4ZM17.51 1.4C18.1314 1.4 18.62 1.8888 18.62 2.51C18.62 3.1314 18.1314 3.62 17.51 3.62C16.8888 3.62 16.4 3.1314 16.4 2.51C16.4 1.889 16.8888 1.4 17.51 1.4ZM4.8436 3.4H15.1676C15.2936 3.72671 15.486 4.02378 15.7325 4.27248C15.979 4.52117 16.2744 4.71611 16.6 4.845V15.175C16.2777 15.3026 15.985 15.4948 15.7399 15.7399C15.4948 15.985 15.3026 16.2777 15.175 16.6H4.835C4.70762 16.2751 4.51436 15.9802 4.2674 15.7336C4.02043 15.4871 3.7251 15.2944 3.4 15.1676V4.8524C3.7286 4.72439 4.02678 4.52905 4.27536 4.27891C4.52395 4.02877 4.71744 3.72939 4.8434 3.4H4.8436ZM2.51 16.4C3.1312 16.4 3.6198 16.8888 3.6198 17.51C3.6198 18.1314 3.1312 18.62 2.5098 18.62C1.889 18.62 1.4 18.1314 1.4 17.51C1.4 16.889 1.8888 16.4 2.51 16.4ZM17.51 16.4C18.1312 16.4 18.6198 16.8888 18.6198 17.51C18.6198 18.1314 18.1312 18.62 17.5098 18.62C16.8886 18.62 16.3998 18.1314 16.3998 17.51C16.3998 16.8888 16.8888 16.4 17.51 16.4Z"
                              fill="#27272A"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_40000469_6427">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        274 sq ft
                      </li>
                      <li>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 17.4987C9.41667 17.4987 8.92361 17.2973 8.52083 16.8945C8.11806 16.4918 7.91667 15.9987 7.91667 15.4154C7.91667 14.832 8.11806 14.339 8.52083 13.9362C8.92361 13.5334 9.41667 13.332 10 13.332C10.5833 13.332 11.0764 13.5334 11.4792 13.9362C11.8819 14.339 12.0833 14.832 12.0833 15.4154C12.0833 15.9987 11.8819 16.4918 11.4792 16.8945C11.0764 17.2973 10.5833 17.4987 10 17.4987ZM5.29167 12.7904L3.54167 10.9987C4.36111 10.1793 5.32306 9.53009 6.4275 9.0512C7.53194 8.57231 8.72278 8.33259 10 8.33203C11.2772 8.33148 12.4683 8.57453 13.5733 9.0612C14.6783 9.54787 15.64 10.2076 16.4583 11.0404L14.7083 12.7904C14.0972 12.1793 13.3889 11.7001 12.5833 11.3529C11.7778 11.0056 10.9167 10.832 10 10.832C9.08333 10.832 8.22222 11.0056 7.41667 11.3529C6.61111 11.7001 5.90278 12.1793 5.29167 12.7904ZM1.75 9.2487L0 7.4987C1.27778 6.19314 2.77083 5.17231 4.47917 4.4362C6.1875 3.70009 8.02778 3.33203 10 3.33203C11.9722 3.33203 13.8125 3.70009 15.5208 4.4362C17.2292 5.17231 18.7222 6.19314 20 7.4987L18.25 9.2487C17.1806 8.17925 15.9411 7.34259 14.5317 6.7387C13.1222 6.13481 11.6117 5.83259 10 5.83203C8.38833 5.83148 6.87806 6.1337 5.46917 6.7387C4.06028 7.3437 2.82056 8.18037 1.75 9.2487Z"
                            fill="#27272A"
                          />
                        </svg>
                        Free Wi-Fi
                      </li>
                      <li>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15 16.6673C15.9205 16.6673 16.6667 15.9212 16.6667 15.0007V5.00065C16.6667 4.08018 15.9205 3.33398 15 3.33398"
                            stroke="#27272A"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3.33398 5.70577V14.2929C3.33398 15.6205 3.33398 16.2843 3.72107 16.7473C4.10814 17.2103 4.76244 17.329 6.07103 17.5665L8.57107 18.0203C10.3924 18.3508 11.3032 18.5161 11.9019 18.0173C12.5007 17.5185 12.5007 16.5945 12.5007 14.7467V5.25206C12.5007 3.40416 12.5007 2.48021 11.9019 1.98142C11.3032 1.48263 10.3924 1.64791 8.57107 1.97847L6.07103 2.43219C4.76244 2.66968 4.10814 2.78842 3.72107 3.25138C3.33398 3.71434 3.33398 4.37816 3.33398 5.70577Z"
                            stroke="#27272A"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9.58398 9.99857V9.99023"
                            stroke="#27272A"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        1 bedroom
                      </li>
                      <li>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.3117 15C17.9361 15 18.4328 14.6071 18.8787 14.0576C19.7916 12.9329 18.2928 12.034 17.7211 11.5938C17.14 11.1463 16.4912 10.8928 15.8333 10.8333M15 9.16667C16.1506 9.16667 17.0833 8.23393 17.0833 7.08333C17.0833 5.93274 16.1506 5 15 5"
                            stroke="#27272A"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                          />
                          <path
                            d="M2.68895 15C2.06453 15 1.56787 14.6071 1.12194 14.0576C0.209058 12.9329 1.70788 12.034 2.27952 11.5938C2.86063 11.1463 3.50947 10.8928 4.16732 10.8333M4.58398 9.16667C3.43339 9.16667 2.50065 8.23393 2.50065 7.08333C2.50065 5.93274 3.43339 5 4.58398 5"
                            stroke="#27272A"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                          />
                          <path
                            d="M6.73715 12.594C5.88567 13.1205 3.65314 14.1955 5.0129 15.5408C5.67713 16.198 6.41692 16.668 7.34701 16.668H12.6543C13.5844 16.668 14.3242 16.198 14.9884 15.5408C16.3482 14.1955 14.1156 13.1205 13.2641 12.594C11.2674 11.3593 8.73387 11.3593 6.73715 12.594Z"
                            stroke="#27272A"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12.9173 6.25065C12.9173 7.86148 11.6115 9.16732 10.0007 9.16732C8.38982 9.16732 7.08398 7.86148 7.08398 6.25065C7.08398 4.63982 8.38982 3.33398 10.0007 3.33398C11.6115 3.33398 12.9173 4.63982 12.9173 6.25065Z"
                            stroke="#27272A"
                            strokeWidth="1.25"
                          />
                        </svg>
                        Sleeps 3
                      </li>
                    </ul>
                  </div>

                  <div className="room-card-policies-list">
                    <ul className="policies-item d-flex">
                      <li>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.16602 11.666L7.08268 14.5827L15.8327 5.41602"
                            stroke="#27272A"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Reserve now, pay later
                      </li>
                      <li>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.16602 11.666L7.08268 14.5827L15.8327 5.41602"
                            stroke="#27272A"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Free welcome drink
                      </li>
                    </ul>
                  </div>

                  <div className="rooms-card-refund">
                    <div className="refund-item d-flex align-items-center">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.3327 10.0007C18.3327 5.39828 14.6017 1.66732 9.99935 1.66732C5.39698 1.66732 1.66602 5.39828 1.66602 10.0007C1.66602 14.603 5.39698 18.334 9.99935 18.334C14.6017 18.334 18.3327 14.603 18.3327 10.0007Z"
                          stroke="#09090B"
                          strokeWidth="1.25"
                        />
                        <path
                          d="M10.2005 14.166V9.99935C10.2005 9.60651 10.2005 9.41009 10.0785 9.28805C9.95644 9.16602 9.76002 9.16602 9.36719 9.16602"
                          stroke="#09090B"
                          strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                          d="M9.99203 6.66602H9.99951"
                          stroke="#09090B"
                          strokeWidth="1.66667"
                            strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Fully refundable
                    </div>
                    <span className="refund-valid-date">Before 8 Aug</span>
                  </div>

                  <div className="hotel-room-more-details">
                    <a
                      className="hotel-more-details-link d-inline-flex align-items-center"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenModal();
                      }}
                    >
                      More Details
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.50004 5L12.5 10L7.5 15"
                          stroke="#3E5B96"
                          strokeWidth="1.25"
                          strokeMiterlimit="16"
                        />
                      </svg>
                    </a>
                  </div>
                  <div className="price-info">
                    <div className="discount-price">
                      <span className="discount">$51 off</span>
                    </div>
                    <span className="nightly-price">$40 nightly</span>
                    <span className="total-price">
                      $349 Total <span>$400</span>
                    </span>
                    <div className="hotel-room-number">for 1 room</div>
                  </div>
                  <div className="total-taxes-fees d-flex align-items-center justify-content-between">
                    <div className="taxes-fees d-flex align-items-center">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.33398 9.33398L5.66732 11.6673L12.6673 4.33398"
                          stroke="#00C950"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                      </svg>
                      Totals with taxes and fees
                    </div>
                    <div className="hotel-room-left">We have 5 left</div>
                  </div>
                  <div className="hotel-room-booking-action">
                    <button className="button-primary room-booking-btn w-100">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="hotel-review-section">
          <h2 className="hotel-section-title">Reviews</h2>
          <ReviewSlider slidesToShowDesktop={2} />
        </section>

        {/* Map */}
        <section id="map" className="hotel-map-section">
          <h2 className="hotel-section-title">Map</h2>
          <div className="map-container">
            <Image src={mapImage} width={1201} height={344} alt="Map" />
          </div>
        </section>
        <section className="nearby-hotel-section">
          <h2 className="hotel-section-title">Similar Hotels Nearby</h2>
          <div className="near-hotel-container">
            <NearByHotels />
          </div>
        </section>
        <section className="hotel-faq-section">
          <div className="faq-container">
            <FaqSection />
          </div>
        </section>
        </>
        )}
      </div>
      {isModalOpen && (
        <div className="room-modal-overlay" onClick={handleCloseModal}>
          <div className="room-modal" onClick={(e) => e.stopPropagation()}>
            <div className="room-modal-header d-flex align-items-center">
              <button
                className="room-modal-close p-0"
                onClick={handleCloseModal}
              >
                <Image
                  src={ClosePopupIcon}
                  width={24}
                  height={24}
                  alt="close icon"
                />
              </button>
              <h2 className="room-modal-title">Room Information</h2>
            </div>

            <div className="room-modal-body">
              <div className="room-modal-content">
                <div className="room-modal-images">
                  <Image
                    src={RoomInfoImage}
                    width={742}
                    height={362}
                    alt="room info image"
                  />
                  <div className="hotel-image-action d-flex align-items-center justify-content-between">
                    <button className="hotel-img-btn border-0 p-0 bg-transparent">
                      <Image
                        src={HotelImgPrevIcon}
                        width={48}
                        height={48}
                        alt="arrow icon"
                        className="arrow-icon"
                      />
                    </button>
                    <button className="hotel-img-btn border-0 p-0 bg-transparent">
                      <Image
                        src={HotelImgNextIcon}
                        width={48}
                        height={48}
                        alt="arrow icon"
                        className="arrow-icon"
                      />
                    </button>
                  </div>
                </div>
                <div className="modal-room-name-with-review">
                  <h3 className="modal-room-title">Premium Double Room</h3>
                  <div className="modal-room-rating d-flex align-items-center">
                    <div className="modal-room-rating-star d-flex align-items-center">
                      <Image
                        src={starFillIcon}
                        width={16}
                        height={16}
                        alt="star"
                        className="hotel-rating-icon"
                      />
                      <Image
                        src={starFillIcon}
                        width={16}
                        height={16}
                        alt="star"
                        className="hotel-rating-icon"
                      />
                      <Image
                        src={starFillIcon}
                        width={16}
                        height={16}
                        alt="star"
                        className="hotel-rating-icon"
                      />
                      <Image
                        src={starFillIcon}
                        width={16}
                        height={16}
                        alt="star"
                        className="hotel-rating-icon"
                      />
                      <Image
                        src={starFillIcon}
                        width={16}
                        height={16}
                        alt="star"
                        className="hotel-rating-icon"
                      />
                    </div>
                    <span className="rating-value-wrapper d-flex align-items-center">
                      <span className="rating-value">4.5</span> (120 Reviews)
                    </span>
                  </div>
                </div>
                <div className="modal-room-facility-list">
                  <ul className="facility-item d-flex">
                    <li>
                      <svg
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.5 16.002V19.002M17.5 16.002V19.002"
                          stroke="#09090B"
                          strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                          d="M21.4976 9.27024C20.5411 8.71795 19.3179 9.0457 18.7656 10.0023L17.7561 12.3912C17.5059 12.9835 17.478 13.002 16.835 13.002H8.16109C7.51812 13.002 7.49023 12.9835 7.23996 12.3912L6.23043 10.0023C5.67815 9.0457 4.45497 8.71795 3.49838 9.27024C2.5418 9.82252 2.21405 11.0457 2.76633 12.0023C3.19737 12.7489 4.39297 12.6857 4.58651 13.2665C5.02644 14.5867 5.24641 15.2468 5.77021 15.6244C6.29401 16.002 6.98979 16.002 8.38136 16.002H16.6147C18.0063 16.002 18.7021 16.002 19.2259 15.6244C19.7497 15.2468 19.9696 14.5867 20.4095 13.2664C20.603 12.6858 21.7987 12.7488 22.2297 12.0023C22.782 11.0457 22.4542 9.82252 21.4976 9.27024Z"
                          stroke="#09090B"
                          strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                          d="M4.99805 9L5.03807 8.89326C5.74428 7.01005 6.09738 6.06845 6.86826 5.53422C7.63915 5 8.64478 5 10.656 5H14.34C16.3513 5 17.3569 5 18.1278 5.53422C18.8987 6.06845 19.2518 7.01005 19.958 8.89326L19.998 9"
                          stroke="#09090B"
                          strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                      </svg>
                      Separate sitting area
                    </li>
                    <li>
                      <svg
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.502 3C18.8409 3 20.0103 3 20.8641 3.53647C21.3093 3.81621 21.6858 4.19267 21.9655 4.63789C22.502 5.49167 22.502 6.66111 22.502 9C22.502 11.3389 22.502 12.5083 21.9655 13.3621C21.6858 13.8073 21.3093 14.1838 20.8641 14.4635C20.0103 15 18.8409 15 16.502 15H8.50195C6.16306 15 4.99362 15 4.13984 14.4635C3.69462 14.1838 3.31816 13.8073 3.03842 13.3621C2.50195 12.5083 2.50195 11.3389 2.50195 9C2.50195 6.66111 2.50195 5.49167 3.03842 4.63789C3.31816 4.19267 3.69462 3.81621 4.13984 3.53647C4.99362 3 6.16306 3 8.50195 3H16.502Z"
                          stroke="#09090B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M7.49805 12H17.498"
                          stroke="#09090B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M18.5 7H18.509"
                          stroke="#09090B"
                          strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                          d="M7.3 18C7.3 18 8.1 19.875 6.5 21"
                          stroke="#09090B"
                          strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                          d="M17.702 18C17.702 18 16.902 19.875 18.502 21"
                          stroke="#09090B"
                          strokeWidth="1.5"
                            strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.5 18V21"
                          stroke="#09090B"
                          strokeWidth="1.5"
                            strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Air Conditioning
                    </li>
                    <li>
                      <svg
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.49805 20L5.49805 21M18.498 20L19.498 21"
                          stroke="#09090B"
                          strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                        <path
                          d="M3.49805 12V13C3.49805 16.2998 3.49805 17.9497 4.52317 18.9749C5.5483 20 7.19822 20 10.498 20H14.498C17.7979 20 19.4478 20 20.4729 18.9749C21.498 17.9497 21.498 16.2998 21.498 13V12"
                          stroke="#09090B"
                          strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                          d="M2.49805 12H22.498"
                          stroke="#09090B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M4.5 12V5.5234C4.5 4.12977 5.62977 3 7.0234 3C8.14166 3 9.12654 3.73598 9.44339 4.80841L9.5 5"
                          stroke="#09090B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M8.49805 6L10.998 4"
                          stroke="#09090B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      Private Bathroom
                    </li>
                    <li>
                      <svg
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.5 14.502V6.50195C20.5 4.61633 20.5 3.67353 19.9142 3.08774C19.3284 2.50195 18.3856 2.50195 16.5 2.50195H8.5C6.61438 2.50195 5.67157 2.50195 5.08579 3.08774C4.5 3.67353 4.5 4.61634 4.5 6.50195V14.502"
                          stroke="#09090B"
                          strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                          d="M12.498 5.50195H12.507"
                          stroke="#09090B"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.99566 15.5174L4.51758 14.502H20.4498L21.0003 15.5174C22.4432 18.1789 22.8026 19.5097 22.2542 20.5058C21.7057 21.502 20.2516 21.502 17.3434 21.502L7.65267 21.502C4.74446 21.502 3.29036 21.502 2.74192 20.5058C2.19347 19.5097 2.55279 18.1789 3.99566 15.5174Z"
                          stroke="#09090B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Laptop workspace
                    </li>
                    <li>
                      <svg
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.5 8.99805H20.4948C20.9907 8.99805 21.2387 8.99805 21.3843 9.15832C21.5299 9.3186 21.5108 9.57065 21.4728 10.0747L20.8518 18.3048C20.7196 20.0569 20.6535 20.9329 20.0893 21.4655C19.5252 21.998 18.6633 21.998 16.9396 21.998H12.4354C10.7116 21.998 9.84972 21.998 9.28559 21.4655C8.44616 20.673 8.58069 19.0674 8.5 17.998"
                          stroke="#09090B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11.5 8.90714V14.3617C11.5 16.0759 11.5 16.933 10.9142 17.4655C10.3284 17.998 9.38562 17.998 7.5 17.998C5.61438 17.998 4.67157 17.998 4.08579 17.4655C3.5 16.933 3.5 16.0759 3.5 14.3617V13.4526C3.5 10.8813 3.5 9.59565 4.37868 8.79685C5.25736 7.99805 6.67157 7.99805 9.5 7.99805H10.5C10.9714 7.99805 11.2071 7.99805 11.3536 8.13118C11.5 8.26431 11.5 8.47859 11.5 8.90714Z"
                          stroke="#09090B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M19.5 8.99805C19.5 5.13205 17.25 1.99805 14.4746 1.99805C11.9428 1.99805 9.84836 4.60575 9.5 7.99805"
                          stroke="#09090B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.5 13.998H11.5"
                          stroke="#09090B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11.5 13H20.5"
                          stroke="#09090B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Daily housekeeping
                    </li>
                    <li>
                      <svg
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22.498 4.00195H2.49805"
                          stroke="#09090B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21.498 8.00195H3.49805"
                          stroke="#09090B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21.498 12H14.498"
                          stroke="#09090B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14.498 8.00195L14.498 18.002C14.498 18.9448 14.498 19.4162 14.7909 19.7091C15.0838 20.002 15.5552 20.002 16.498 20.002H19.498C20.4409 20.002 20.9123 20.002 21.2052 19.7091C21.498 19.4162 21.498 18.9448 21.498 18.002V8.00195"
                          stroke="#09090B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.49805 4.00195V20.002M21.498 4.00195V8.00195"
                          stroke="#09090B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Desk
                    </li>
                  </ul>
                </div>
                <div className="modal-room-amenities-list">
                  <ul className="amenities-item d-flex">
                    <li>
                      <Image
                        src={FreeBreackfast}
                        width={20}
                        height={20}
                        alt="Free continental breakfast"
                      />
                      Free continental breakfast
                    </li>
                    <li>
                      <Image
                        src={SelfParking}
                        width={20}
                        height={20}
                        alt="Free continental breakfast"
                      />
                      Free self parking
                    </li>
                  </ul>
                </div>
                <div className="modal-room-policies-list">
                  <ul className="policies-item d-flex">
                    <li>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.16602 11.666L7.08268 14.5827L15.8327 5.41602"
                          stroke="#27272A"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Reserve now, pay later
                    </li>
                    <li>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.16602 11.666L7.08268 14.5827L15.8327 5.41602"
                          stroke="#27272A"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Free welcome drink
                    </li>
                  </ul>
                </div>
                <div className="modal-room-specs-list">
                  <ul className="card-specs-item d-flex align-items-center">
                    <li>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.66602 15.8327V10.8327C1.66602 10.4577 1.7424 10.1174 1.89518 9.81185C2.04796 9.50629 2.24935 9.23546 2.49935 8.99935V6.66602C2.49935 5.97157 2.7424 5.38129 3.22852 4.89518C3.71463 4.40907 4.3049 4.16602 4.99935 4.16602H8.33268C8.65213 4.16602 8.95074 4.22518 9.22852 4.34352C9.50629 4.46185 9.76324 4.6249 9.99935 4.83268C10.2355 4.62435 10.4924 4.46129 10.7702 4.34352C11.048 4.22574 11.3466 4.16657 11.666 4.16602H14.9993C15.6938 4.16602 16.2841 4.40907 16.7702 4.89518C17.2563 5.38129 17.4993 5.97157 17.4993 6.66602V8.99935C17.7493 9.23546 17.9507 9.50629 18.1035 9.81185C18.2563 10.1174 18.3327 10.4577 18.3327 10.8327V15.8327H16.666V14.166H3.33268V15.8327H1.66602ZM10.8327 8.33268H15.8327V6.66602C15.8327 6.4299 15.7527 6.23213 15.5927 6.07268C15.4327 5.91324 15.2349 5.83324 14.9993 5.83268H11.666C11.4299 5.83268 11.2321 5.91268 11.0727 6.07268C10.9132 6.23268 10.8332 6.43046 10.8327 6.66602V8.33268ZM4.16602 8.33268H9.16602V6.66602C9.16602 6.4299 9.08602 6.23213 8.92602 6.07268C8.76602 5.91324 8.56824 5.83324 8.33268 5.83268H4.99935C4.76324 5.83268 4.56546 5.91268 4.40602 6.07268C4.24657 6.23268 4.16657 6.43046 4.16602 6.66602V8.33268ZM3.33268 12.4993H16.666V10.8327C16.666 10.5966 16.586 10.3988 16.426 10.2393C16.266 10.0799 16.0682 9.9999 15.8327 9.99935H4.16602C3.9299 9.99935 3.73213 10.0793 3.57268 10.2393C3.41324 10.3993 3.33324 10.5971 3.33268 10.8327V12.4993Z"
                          fill="#27272A"
                        />
                      </svg>
                      1 Double Bed
                    </li>
                    <li>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_40000469_6427)">
                          <path
                            d="M2.51 0C1.1324 0 0 1.1322 0 2.51C0 3.7134 0.8634 4.7292 2 4.9672V15.0528C0.8634 15.2908 0 16.3068 0 17.5102C0 18.888 1.1322 20.02 2.51 20.02C3.7194 20.02 4.728 19.1452 4.9582 18H15.0492C15.2796 19.1464 16.2998 20.02 17.5102 20.02C18.8402 20.02 19.9312 18.9624 20.0058 17.6496C20.0151 17.6037 20.0198 17.557 20.0198 17.5102C20.0198 17.4634 20.0151 17.4167 20.0058 17.3708C19.9406 16.2234 19.099 15.2712 18 15.0492V4.9708C19.099 4.7488 19.9406 3.7968 20.006 2.6496C20.0153 2.60372 20.02 2.55702 20.02 2.5102C20.02 2.46338 20.0153 2.41668 20.006 2.3708C19.931 1.058 18.8402 0 17.51 0C16.3068 0 15.2908 0.8634 15.0528 2H4.954C4.716 0.8648 3.712 0 2.51 0ZM2.51 1.4C3.1314 1.4 3.62 1.8888 3.62 2.51C3.62 3.1314 3.1314 3.62 2.51 3.62C1.889 3.62 1.4 3.1314 1.4 2.51C1.4 1.889 1.8888 1.4 2.51 1.4ZM17.51 1.4C18.1314 1.4 18.62 1.8888 18.62 2.51C18.62 3.1314 18.1314 3.62 17.51 3.62C16.8888 3.62 16.4 3.1314 16.4 2.51C16.4 1.889 16.8888 1.4 17.51 1.4ZM4.8436 3.4H15.1676C15.2936 3.72671 15.486 4.02378 15.7325 4.27248C15.979 4.52117 16.2744 4.71611 16.6 4.845V15.175C16.2777 15.3026 15.985 15.4948 15.7399 15.7399C15.4948 15.985 15.3026 16.2777 15.175 16.6H4.835C4.70762 16.2751 4.51436 15.9802 4.2674 15.7336C4.02043 15.4871 3.7251 15.2944 3.4 15.1676V4.8524C3.7286 4.72439 4.02678 4.52905 4.27536 4.27891C4.52395 4.02877 4.71744 3.72939 4.8434 3.4H4.8436ZM2.51 16.4C3.1312 16.4 3.6198 16.8888 3.6198 17.51C3.6198 18.1314 3.1312 18.62 2.5098 18.62C1.889 18.62 1.4 18.1314 1.4 17.51C1.4 16.889 1.8888 16.4 2.51 16.4ZM17.51 16.4C18.1312 16.4 18.6198 16.8888 18.6198 17.51C18.6198 18.1314 18.1312 18.62 17.5098 18.62C16.8886 18.62 16.3998 18.1314 16.3998 17.51C16.3998 16.8888 16.8888 16.4 17.51 16.4Z"
                            fill="#27272A"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_40000469_6427">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      274 sq ft
                    </li>
                    <li>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 17.4987C9.41667 17.4987 8.92361 17.2973 8.52083 16.8945C8.11806 16.4918 7.91667 15.9987 7.91667 15.4154C7.91667 14.832 8.11806 14.339 8.52083 13.9362C8.92361 13.5334 9.41667 13.332 10 13.332C10.5833 13.332 11.0764 13.5334 11.4792 13.9362C11.8819 14.339 12.0833 14.832 12.0833 15.4154C12.0833 15.9987 11.8819 16.4918 11.4792 16.8945C11.0764 17.2973 10.5833 17.4987 10 17.4987ZM5.29167 12.7904L3.54167 10.9987C4.36111 10.1793 5.32306 9.53009 6.4275 9.0512C7.53194 8.57231 8.72278 8.33259 10 8.33203C11.2772 8.33148 12.4683 8.57453 13.5733 9.0612C14.6783 9.54787 15.64 10.2076 16.4583 11.0404L14.7083 12.7904C14.0972 12.1793 13.3889 11.7001 12.5833 11.3529C11.7778 11.0056 10.9167 10.832 10 10.832C9.08333 10.832 8.22222 11.0056 7.41667 11.3529C6.61111 11.7001 5.90278 12.1793 5.29167 12.7904ZM1.75 9.2487L0 7.4987C1.27778 6.19314 2.77083 5.17231 4.47917 4.4362C6.1875 3.70009 8.02778 3.33203 10 3.33203C11.9722 3.33203 13.8125 3.70009 15.5208 4.4362C17.2292 5.17231 18.7222 6.19314 20 7.4987L18.25 9.2487C17.1806 8.17925 15.9411 7.34259 14.5317 6.7387C13.1222 6.13481 11.6117 5.83259 10 5.83203C8.38833 5.83148 6.87806 6.1337 5.46917 6.7387C4.06028 7.3437 2.82056 8.18037 1.75 9.2487Z"
                          fill="#27272A"
                        />
                      </svg>
                      Free Wi-Fi
                    </li>
                    <li>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 16.6673C15.9205 16.6673 16.6667 15.9212 16.6667 15.0007V5.00065C16.6667 4.08018 15.9205 3.33398 15 3.33398"
                          stroke="#27272A"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.33398 5.70577V14.2929C3.33398 15.6205 3.33398 16.2843 3.72107 16.7473C4.10814 17.2103 4.76244 17.329 6.07103 17.5665L8.57107 18.0203C10.3924 18.3508 11.3032 18.5161 11.9019 18.0173C12.5007 17.5185 12.5007 16.5945 12.5007 14.7467V5.25206C12.5007 3.40416 12.5007 2.48021 11.9019 1.98142C11.3032 1.48263 10.3924 1.64791 8.57107 1.97847L6.07103 2.43219C4.76244 2.66968 4.10814 2.78842 3.72107 3.25138C3.33398 3.71434 3.33398 4.37816 3.33398 5.70577Z"
                          stroke="#27272A"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.58398 9.99857V9.99023"
                          stroke="#27272A"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      1 bedroom
                    </li>
                    <li>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.3117 15C17.9361 15 18.4328 14.6071 18.8787 14.0576C19.7916 12.9329 18.2928 12.034 17.7211 11.5938C17.14 11.1463 16.4912 10.8928 15.8333 10.8333M15 9.16667C16.1506 9.16667 17.0833 8.23393 17.0833 7.08333C17.0833 5.93274 16.1506 5 15 5"
                          stroke="#27272A"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                        />
                        <path
                          d="M2.68895 15C2.06453 15 1.56787 14.6071 1.12194 14.0576C0.209058 12.9329 1.70788 12.034 2.27952 11.5938C2.86063 11.1463 3.50947 10.8928 4.16732 10.8333M4.58398 9.16667C3.43339 9.16667 2.50065 8.23393 2.50065 7.08333C2.50065 5.93274 3.43339 5 4.58398 5"
                          stroke="#27272A"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                        />
                        <path
                          d="M6.73715 12.594C5.88567 13.1205 3.65314 14.1955 5.0129 15.5408C5.67713 16.198 6.41692 16.668 7.34701 16.668H12.6543C13.5844 16.668 14.3242 16.198 14.9884 15.5408C16.3482 14.1955 14.1156 13.1205 13.2641 12.594C11.2674 11.3593 8.73387 11.3593 6.73715 12.594Z"
                          stroke="#27272A"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.9173 6.25065C12.9173 7.86148 11.6115 9.16732 10.0007 9.16732C8.38982 9.16732 7.08398 7.86148 7.08398 6.25065C7.08398 4.63982 8.38982 3.33398 10.0007 3.33398C11.6115 3.33398 12.9173 4.63982 12.9173 6.25065Z"
                          stroke="#27272A"
                          strokeWidth="1.25"
                        />
                      </svg>
                      Sleeps 3
                    </li>
                  </ul>
                </div>
                <div className="modal-room-review-section">
                  <h2 className="hotel-section-title">Reviews</h2>
                  <ReviewSlider slidesToShowDesktop={2} />
                </div>
              </div>
              <div className="modal-room-pricing">
                <div className="modal-room-refund">
                  <div className="refund-item d-flex align-items-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18.3327 10.0007C18.3327 5.39828 14.6017 1.66732 9.99935 1.66732C5.39698 1.66732 1.66602 5.39828 1.66602 10.0007C1.66602 14.603 5.39698 18.334 9.99935 18.334C14.6017 18.334 18.3327 14.603 18.3327 10.0007Z"
                        stroke="#09090B"
                        strokeWidth="1.25"
                      />
                      <path
                        d="M10.2005 14.166V9.99935C10.2005 9.60651 10.2005 9.41009 10.0785 9.28805C9.95644 9.16602 9.76002 9.16602 9.36719 9.16602"
                        stroke="#09090B"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.99203 6.66602H9.99951"
                        stroke="#09090B"
                        strokeWidth="1.66667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Fully refundable
                  </div>
                  <span className="refund-valid-date">Before 8 Aug</span>
                </div>
                <div className="modal-room-price-info">
                  <div className="discount-price">
                    <span className="discount">$51 off</span>
                  </div>
                  <span className="nightly-price">$40 nightly</span>
                  <span className="total-price">
                    $349 Total <span>$400</span>
                  </span>
                  <div className="hotel-room-number">for 1 room</div>
                </div>
                <div className="total-taxes-fees d-flex align-items-center justify-content-between">
                  <div className="taxes-fees d-flex align-items-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.33398 9.33398L5.66732 11.6673L12.6673 4.33398"
                        stroke="#00C950"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                      </svg>
                      Totals with taxes and fees
                    </div>
                    <div className="hotel-room-left">We have 5 left</div>
                  </div>
                  <div className="modal-room-booking-action">
                    <button className="button-primary room-booking-btn w-100">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
      )}

      {/* Image Modal */}
      <ImageModal 
        isOpen={isImageModalOpen} 
        onClose={handleCloseImageModal} 
        hotelImages={hotelData?.images || []}
      />
    </main>
  );
};

export default HotelDetails;
