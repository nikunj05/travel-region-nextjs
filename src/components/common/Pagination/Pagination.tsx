"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

function getPageItems(currentPage: number, totalPages: number): (number | string)[] {
  // Small totals: show all pages
  if (totalPages <= 8) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Early pages: show first five pages, then ellipsis and last
  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  // Late pages: show first, ellipsis, then last five pages
  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  // Middle pages: show first, ellipsis, current and next two, ellipsis, last
  return [1, "...", currentPage, currentPage + 1, currentPage + 2, "...", totalPages];
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onChange, className }) => {
  const items = getPageItems(currentPage, totalPages);

  const handlePrev = () => {
    if (currentPage > 1) onChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onChange(currentPage + 1);
  };

  return (
    <div className={className ? className : "pagination"}>
      <button
        className="pagination-arrow"
        disabled={currentPage <= 1}
        onClick={handlePrev}
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
            stroke="#09090B"
            strokeWidth="1.5"
            strokeMiterlimit="16"
          />
        </svg>
      </button>

      {items.map((item, idx) => {
        if (typeof item === "string") {
          return (
            <button key={`e-${idx}`} className="pagination-page" disabled>
              {item}
            </button>
          );
        }

        const page = item as number;
        return (
          <button
            key={page}
            className={`pagination-page ${currentPage === page ? "active" : ""}`}
            onClick={() => onChange(page)}
          >
            {page}
          </button>
        );
      })}

      <button
        className="pagination-arrow"
        disabled={currentPage >= totalPages}
        onClick={handleNext}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.00005 6L15 12L9 18"
            stroke="#09090B"
            strokeWidth="1.5"
            strokeMiterlimit="16"
          />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;


