"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Camera, Hotel, ChevronDown } from "lucide-react";
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

const categoryMap: { [key: string]: string } = {
  GEN: "General",
  HAB: "Room",
  DEP: "Sports/Leisure",
  RES: "Restaurant",
  COM: "Common area",
  CON: "Meeting room",
  EXT: "Exterior",
  LOB: "Lobby",
  PZC: "Pool",
  SPA: "Spa",
  BAR: "Bar",
  BEA: "Beach",
  ENT: "Entertainment",
  GYM: "Gym",
};

const SearchResultGalleryModal: React.FC<SearchResultGalleryModalProps> = ({
  isOpen,
  onClose,
  hotelName,
  hotelImages = [],
  isLoading = false,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getCategoryName = (img: HotelImage) => {
    const code = img.image_type_code || img.imageTypeCode;
    if (code && categoryMap[code]) return categoryMap[code];
    return img.type?.description?.content || "Other";
  };

  // Group images by category
  const categories = hotelImages.reduce((acc, img) => {
    const category = getCategoryName(img);
    if (!acc.includes(category)) acc.push(category);
    return acc;
  }, ["All categories"]);

  const filteredImages = selectedCategory === "All categories"
    ? hotelImages
    : hotelImages.filter(img => getCategoryName(img) === selectedCategory);

  const currentImage = filteredImages[currentImageIndex] || hotelImages[0];

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedCategory]);

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
            <Hotel className="hotel-icon" size={24} />
            <div className="header-text">
              <h3>{hotelName}</h3>
              <p>Photo gallery</p>
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
                  {selectedCategory}
                  <ChevronDown size={16} />
                </button>
                {isDropdownOpen && (
                  <ul className="category-menu">
                    {categories.map(cat => (
                      <li key={cat} onClick={() => {
                        setSelectedCategory(cat);
                        setIsDropdownOpen(false);
                      }}>
                        {cat}
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
                    <ChevronLeft size={32} />
                  </button>
                  <button className="nav-btn next" onClick={handleNext}>
                    <ChevronRight size={32} />
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
