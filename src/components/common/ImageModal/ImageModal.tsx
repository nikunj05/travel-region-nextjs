"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import "./ImageModal.scss";
import { buildHotelbedsImageUrl } from "@/constants";
import { HotelImage } from "@/types/favorite";

// Import the actual images for fallback
import hotelDetailsImg1 from "@/assets/images/hotel-details-img1.jpg";
import hotelDetailsImg2 from "@/assets/images/hotel-details-img2.jpg";
import hotelDetailsImg3 from "@/assets/images/hotel-details-img3.jpg";
import hotelDetailsImg4 from "@/assets/images/hotel-details-img4.jpg";
import hotelDetailsImg5 from "@/assets/images/hotel-details-img5.jpg";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelImages?: HotelImage[];
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, hotelImages = [] }) => {
  // Create categorized images from API data
  const createImageCategories = (): { [key: string]: { name: string; images: Array<{ src: string; alt: string }> } } => {
    if (!hotelImages || hotelImages.length === 0) {
      // Fallback to mock data if no images provided
      return {
        "Overview": {
          name: "Overview",
          images: [
            { src: hotelDetailsImg1 as unknown as string, alt: "Hotel Overview 1" },
            { src: hotelDetailsImg2 as unknown as string, alt: "Hotel Overview 2" },
            { src: hotelDetailsImg3 as unknown as string, alt: "Hotel Overview 3" },
            { src: hotelDetailsImg4 as unknown as string, alt: "Hotel Overview 4" },
            { src: hotelDetailsImg5 as unknown as string, alt: "Hotel Overview 5" },
          ],
        },
      };
    }

    // Group images by type description
    const categories: { [key: string]: { name: string; images: Array<{ src: string; alt: string }> } } = {};
    
    // Sort images by order
    const sortedImages = [...hotelImages].sort((a, b) => {
      const orderA = typeof a.order === 'number' ? a.order : a.visualOrder ?? 0;
      const orderB = typeof b.order === 'number' ? b.order : b.visualOrder ?? 0;
      return orderA - orderB;
    });

    sortedImages.forEach((img, index) => {
      const categoryName = img.type?.description?.content || "Other";
      if (!categories[categoryName]) {
        categories[categoryName] = {
          name: categoryName,
          images: []
        };
      }
      categories[categoryName].images.push({
        src: buildHotelbedsImageUrl(img.path),
        alt: `${categoryName} ${index + 1}`
      });
    });

    return categories;
  };

  const imageCategories = createImageCategories();
  const categoryKeys = Object.keys(imageCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryKeys[0] || "");
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Update selected category when categories change
  useEffect(() => {
    if (categoryKeys.length > 0 && !categoryKeys.includes(selectedCategory)) {
      setSelectedCategory(categoryKeys[0]);
    }
  }, [categoryKeys, selectedCategory]);

  const currentImages = imageCategories[selectedCategory]?.images || [];

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsImageViewerOpen(true);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? currentImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === currentImages.length - 1 ? 0 : prev + 1
    );
  };

  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isImageViewerOpen) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          handlePreviousImage();
          break;
        case "ArrowRight":
          event.preventDefault();
          handleNextImage();
          break;
        case "Escape":
          event.preventDefault();
          closeImageViewer();
          break;
      }
    };

    if (isImageViewerOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isImageViewerOpen, currentImages.length]);

  if (!isOpen) return null;

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="image-modal-header">
          <h2 className="hotel-name">
            ITC Maurya, a Luxury Collection Hotel, New Delhi
          </h2>
          <div className="header-actions">
            <button className="reserve-btn button-primary">Reserve now</button>
            <button className="close-btn" onClick={onClose}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Close
            </button>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="category-navigation">
          <div className="category-buttons">
            {categoryKeys.map((categoryKey) => {
              const category = imageCategories[categoryKey];
              return (
                <button
                  key={categoryKey}
                  className={`category-btn ${
                    selectedCategory === categoryKey ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(categoryKey)}
                >
                  <div className="category-thumbnail">
                    <Image
                      src={category.images[0]?.src || hotelDetailsImg1}
                      alt={category.name}
                      width={80}
                      height={60}
                    />
                  </div>
                  <span className="category-name">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Image Grid */}
        <div className="image-grid">
          {currentImages.map((image: { src: string; alt: string }, index: number) => (
            <div
              key={index}
              className="image-item"
              onClick={() => handleImageClick(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={300}
                height={200}
                className="grid-image"
              />
            </div>
          ))}
        </div>

        {/* Image Viewer within Modal */}
        {isImageViewerOpen && (
          <div className="image-viewer-container">
            {/* Header */}
            <div className="image-viewer-header">
              <button className="back-btn" onClick={closeImageViewer}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 12H5M12 19L5 12L12 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Gallery
              </button>
              <div className="image-counter">
                {currentImageIndex + 1} / {currentImages.length}
              </div>
              <button className="close-viewer-btn" onClick={closeImageViewer}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Close
              </button>
            </div>

            {/* Main Image */}
            <div className="main-image-container">
              <button
                className="nav-arrow nav-arrow-left"
                onClick={handlePreviousImage}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="main-image-wrapper">
                <Image
                  src={currentImages[currentImageIndex].src}
                  alt={currentImages[currentImageIndex].alt}
                  width={800}
                  height={600}
                  className="main-image"
                />
              </div>

              <button
                className="nav-arrow nav-arrow-right"
                onClick={handleNextImage}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Thumbnail Strip */}
            <div className="thumbnail-strip">
              {currentImages.map((image: { src: string; alt: string }, index: number) => (
                <div
                  key={index}
                  className={`thumbnail-item ${
                    index === currentImageIndex ? "active" : ""
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={80}
                    height={60}
                    className="thumbnail-image"
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

export default ImageModal;
