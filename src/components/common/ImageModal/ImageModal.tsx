"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import "./ImageModal.scss";

// Import the actual images
import hotelDetailsImg1 from "@/assets/images/hotel-details-img1.jpg";
import hotelDetailsImg2 from "@/assets/images/hotel-details-img2.jpg";
import hotelDetailsImg3 from "@/assets/images/hotel-details-img3.jpg";
import hotelDetailsImg4 from "@/assets/images/hotel-details-img4.jpg";
import hotelDetailsImg5 from "@/assets/images/hotel-details-img5.jpg";

// Mock data for hotel image categories
const hotelImageCategories = {
  overview: {
    name: "Overview",
    images: [
      { src: hotelDetailsImg1, alt: "Hotel Overview 1" },
      { src: hotelDetailsImg2, alt: "Hotel Overview 2" },
      { src: hotelDetailsImg3, alt: "Hotel Overview 3" },
      { src: hotelDetailsImg4, alt: "Hotel Overview 4" },
      { src: hotelDetailsImg5, alt: "Hotel Overview 5" },
    ],
  },
  towersRoom: {
    name: "Towers Room",
    images: [
      { src: hotelDetailsImg1, alt: "Towers Room 1" },
      { src: hotelDetailsImg2, alt: "Towers Room 2" },
      { src: hotelDetailsImg3, alt: "Towers Room 3" },
      { src: hotelDetailsImg2, alt: "Towers Room 2" },
      { src: hotelDetailsImg3, alt: "Towers Room 3" },
    ],
  },
  itcOne: {
    name: "ITC One, Executive",
    images: [
      { src: hotelDetailsImg2, alt: "ITC One 1" },
      { src: hotelDetailsImg3, alt: "ITC One 2" },
      { src: hotelDetailsImg4, alt: "ITC One 3" },
    ],
  },
  executiveClub: {
    name: "Executive Club",
    images: [
      { src: hotelDetailsImg3, alt: "Executive Club 1" },
      { src: hotelDetailsImg4, alt: "Executive Club 2" },
      { src: hotelDetailsImg5, alt: "Executive Club 3" },
    ],
  },
  deluxeSuite: {
    name: "Deluxe Suite with Balcony",
    images: [
      { src: hotelDetailsImg4, alt: "Deluxe Suite 1" },
      { src: hotelDetailsImg5, alt: "Deluxe Suite 2" },
      { src: hotelDetailsImg1, alt: "Deluxe Suite 3" },
    ],
  },
};

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] =
    useState<keyof typeof hotelImageCategories>("overview");
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const currentImages = hotelImageCategories[selectedCategory].images;

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
            {Object.entries(hotelImageCategories).map(([key, category]) => (
              <button
                key={key}
                className={`category-btn ${
                  selectedCategory === key ? "active" : ""
                }`}
                onClick={() =>
                  setSelectedCategory(key as keyof typeof hotelImageCategories)
                }
              >
                <div className="category-thumbnail">
                  <Image
                    src={category.images[0].src}
                    alt={category.name}
                    width={80}
                    height={60}
                  />
                </div>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Image Grid */}
        <div className="image-grid">
          {currentImages.map((image, index) => (
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
              {currentImages.map((image, index) => (
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
