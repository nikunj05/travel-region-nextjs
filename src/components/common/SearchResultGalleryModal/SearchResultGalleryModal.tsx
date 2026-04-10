"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import "./SearchResultGalleryModal.scss";
import { buildHotelbedsImageUrl } from "@/constants";
import { HotelImage } from "@/types/favorite";
import NoImageFallback from "@/assets/images/no-image.jpg";

interface SearchResultGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelName: string;
  hotelImages?: HotelImage[];
  isLoading?: boolean;
}

const SearchResultGalleryModal: React.FC<SearchResultGalleryModalProps> = ({
  isOpen,
  onClose,
  hotelName,
  hotelImages = [],
  isLoading = false,
}) => {
  const t = useTranslations("Gallery");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getCategoryKey = (img: HotelImage) => {
    return img.image_type_code || img.imageTypeCode || img.type?.description?.content || "other";
  };

  const getCategoryDisplay = (key: string) => {
    if (key === "all") return t("allCategories");

    // List of category codes we have translations for in the Gallery.categories namespace
    const knownCodes = ["GEN", "HAB", "DEP", "RES", "COM", "CON", "EXT", "LOB", "PZC", "PIS", "SPA", "BAR", "BEA", "ENT", "GYM", "OTH", "other"];

    if (knownCodes.includes(key)) {
      return t(`categories.${key}`);
    }

    return key;
  };

  // Group images by category keys
  const categoryKeys = hotelImages.reduce((acc, img) => {
    const key = getCategoryKey(img);
    if (!acc.includes(key)) acc.push(key);
    return acc;
  }, ["all"]);

  const filteredImages = selectedCategoryKey === "all"
    ? hotelImages
    : hotelImages.filter(img => getCategoryKey(img) === selectedCategoryKey);

  const currentImage = filteredImages[currentImageIndex] || (hotelImages.length > 0 ? hotelImages[0] : null);

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedCategoryKey]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredImages.length]);

  if (!isOpen) return null;

  return (
    <div className="gallery-modal-overlay" onClick={onClose}>
      <div className="gallery-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="gallery-header">
          <div className="header-left">
            <svg className="hotel-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2f2f2f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16"></path><path d="M2 8h18a2 2 0 0 1 2 2v10"></path><path d="M2 17h20"></path><path d="M6 8v9"></path></svg>
            <div className="header-text">
              <h3>{hotelName}</h3>
              <p>{t("title")}</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Main Gallery Area */}
        <div className="gallery-main">
          {isLoading ? (
            <div className="gallery-loader">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="main-image-wrapper">
              {/* Category Dropdown Overlay */}
              <div className="category-dropdown-wrapper">
                <button
                  className="category-trigger"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {getCategoryDisplay(selectedCategoryKey)}
                  <ChevronDown size={16} />
                </button>
                {isDropdownOpen && (
                  <ul className="category-menu">
                    {categoryKeys.map((key: string) => (
                      <li key={key} onClick={() => {
                        setSelectedCategoryKey(key);
                        setIsDropdownOpen(false);
                      }}>
                        {getCategoryDisplay(key)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Photo Count Overlay */}
              <div className="photo-count">
                {filteredImages.length > 0 ? `${currentImageIndex + 1}/${filteredImages.length}` : "0/0"}
              </div>

              {/* Main Image */}
              <div className="image-display">
                {filteredImages.length > 0 ? (
                  <Image
                    src={buildHotelbedsImageUrl(currentImage.path)}
                    alt={hotelName}
                    width={1200}
                    height={800}
                    className="active-image"
                    unoptimized
                  />
                ) : (
                  <Image src={NoImageFallback} alt="No image" width={1200} height={800} />
                )}
              </div>

              {/* Navigation Arrows */}
              {filteredImages.length > 1 && (
                <>
                  <button className="nav-btn prev" onClick={handlePrevious}>
                    <ChevronLeft size={24} />
                  </button>
                  <button className="nav-btn next" onClick={handleNext}>
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {!isLoading && (
          <div className="gallery-thumbnails">
            <div className="thumbnail-track">
              {filteredImages.map((img, index) => (
                <div
                  key={index}
                  className={`thumb-item ${index === currentImageIndex ? "active" : ""}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={buildHotelbedsImageUrl(img.path)}
                    alt={`${hotelName} ${index}`}
                    width={120}
                    height={80}
                    className="thumb-img"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultGalleryModal;
