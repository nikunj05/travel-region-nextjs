"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { faqService } from "@/services/faqService";
import { FaqCategory } from "@/types/faq";
import "./FaqPage.scss";

const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z"
      stroke="#9CA3AF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="32" height="32" rx="16" fill="#1B2236" />
    <path
      d="M15.9993 10.668V21.3346M21.3327 16.0013H10.666"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" stroke="#1B2236" />
    <path
      d="M20 12L16 16M16 16L12 20M16 16L20 20M16 16L12 12"
      stroke="#1B2236"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FaqPage = () => {
  const t = useTranslations("FAQ");
  const [faqCategories, setFaqCategories] = useState<FaqCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await faqService.getFaqs();
        setFaqCategories(response.data.faqs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFaqItem = (categoryId: number, itemId: number) => {
    const key = `${categoryId}-${itemId}`;
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filteredFaqs = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.faqs.length > 0);

  // Skeleton Loading Component
  const FaqSkeleton = () => (
    <div className="faq-page section-space-b">
      <section className="banner-section-common faq-banner-section">
        <div className="container">
          <div className="banner-content">
            <div className="heading_section text-center">
              <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
                <Skeleton height={48} style={{ marginBottom: "16px" }} />
                <Skeleton
                  height={20}
                  count={2}
                  style={{ marginBottom: "24px" }}
                />
                <Skeleton width={200} height={40} borderRadius={20} />
              </SkeletonTheme>
            </div>
          </div>
        </div>
      </section>
      <div className="container">
        <div className="faq-main-content">
          {/* Left Sidebar Skeleton */}
          <div className="faq-sidebar">
            <div className="sidebar-categories">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  height={40}
                  style={{ marginBottom: "8px" }}
                  borderRadius={8}
                />
              ))}
            </div>
          </div>

          {/* Right Content Area Skeleton */}
          <div className="faq-content">
            {/* Search Bar Skeleton */}
            <div className="search-container">
              <Skeleton height={48} borderRadius={8} />
            </div>

            {/* FAQ Content Skeleton */}
            <div className="faq-sections">
              {Array.from({ length: 3 }).map((_, categoryIndex) => (
                <div key={categoryIndex} className="faq-section">
                  <Skeleton height={32} style={{ marginBottom: "16px" }} />
                  <div className="faq-items">
                    {Array.from({ length: 4 }).map((_, itemIndex) => (
                      <div key={itemIndex} className="faq-item">
                        <Skeleton
                          height={60}
                          style={{ marginBottom: "8px" }}
                          borderRadius={8}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <FaqSkeleton />;
  }

  return (
    <div className="faq-page section-space-b">
      <section
        className="banner-section-common faq-banner-section"
        style={{
          background: "linear-gradient(360deg, #CEDEFF 0.52%, #6C9CFF 100%)",
        }}
      >
        <div className="container">
          <div className="banner-content">
            <div className="heading_section text-center">
              <h1 className="section-title">{t("title")}</h1>
              <p className="section-description">{t("description")}</p>
              <button className="button-primary mx-auto banner-common-button">
                <svg
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.5 2C16.5888 2 20.1826 4.74883 20.4775 8.50098C20.4801 8.50239 20.4828 8.50346 20.4854 8.50488C20.7362 8.64569 20.9233 8.83521 21.0586 8.99023C21.1333 9.07584 21.2351 9.20364 21.3086 9.29688C21.7646 9.85072 22.2302 10.421 22.5039 10.8096C22.7865 11.2108 23.0008 11.5932 23.1191 12.0264C23.2936 12.6654 23.2936 13.3346 23.1191 13.9736C22.956 14.5706 22.6275 15.0849 22.2998 15.5137C22.1015 15.7732 21.8612 16.0524 21.6494 16.2979C21.5335 16.4321 21.3684 16.6266 21.2812 16.7324C21.0441 17.0218 20.8094 17.3068 20.5 17.4854V17.7998C20.5 20.3161 18.0417 22 15.5 22H13.5C12.9477 22 12.5 21.5523 12.5 21C12.5 20.4477 12.9477 20 13.5 20H15.5C17.3766 20 18.5 18.8181 18.5 17.7998V17.4893C18.3681 17.4332 18.2396 17.3767 18.125 17.3242C17.7688 17.1651 17.0976 16.8651 16.8418 16.1084C16.7488 15.8331 16.7493 15.5385 16.75 15.2646V10.7354C16.7493 10.4615 16.7488 10.1669 16.8418 9.8916C17.0976 9.1349 17.7688 8.83491 18.125 8.67578C18.2313 8.62712 18.349 8.57372 18.4707 8.52148C18.1847 6.09541 15.7517 4 12.5 4C9.24824 4 6.81426 6.09537 6.52832 8.52148C6.65033 8.57384 6.76844 8.62701 6.875 8.67578C7.23117 8.83491 7.9024 9.1349 8.1582 9.8916C8.2512 10.1669 8.25068 10.4615 8.25 10.7354V15.2646C8.25068 15.5385 8.2512 15.8331 8.1582 16.1084C7.9024 16.8651 7.23117 17.1651 6.875 17.3242C6.5121 17.4903 6.02079 17.7142 5.66309 17.7432C5.26586 17.7752 4.86358 17.6909 4.51465 17.4951C4.19768 17.3172 3.95977 17.0265 3.71875 16.7324C3.63162 16.6266 3.46647 16.4321 3.35059 16.2979C3.13875 16.0524 2.89853 15.7732 2.7002 15.5137C2.37254 15.0849 2.04395 14.5706 1.88086 13.9736C1.70637 13.3346 1.70637 12.6654 1.88086 12.0264C1.99919 11.5932 2.2135 11.2108 2.49609 10.8096C2.76982 10.421 3.23541 9.85072 3.69141 9.29688C3.76493 9.20364 3.86667 9.07584 3.94141 8.99023C4.07675 8.83521 4.26377 8.64569 4.51465 8.50488C4.51694 8.5036 4.51919 8.50225 4.52148 8.50098C4.81642 4.74879 8.41117 2 12.5 2Z"
                    fill="white"
                  />
                </svg>
                {t("chatWithTeam")}
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className=" container">
        <div className="faq-main-content">
          {/* Left Sidebar */}
          <div className="faq-sidebar">
            <div className="sidebar-categories">
              {faqCategories.map((category, index) => (
                <button
                  key={category.id}
                  className={`category-item ${
                    activeCategory === index ? "active" : ""
                  }`}
                  onClick={() => setActiveCategory(index)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="faq-content">
            {/* Search Bar */}
            <div className="search-container">
              <div className="search-bar">
                <SearchIcon />
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* FAQ Content */}
            <div className="faq-sections">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((category) => (
                  <div key={category.id} className="faq-section">
                    <h2 className="section-title">{category.name}</h2>
                    <div className="faq-items">
                      {category.faqs.map((faq) => {
                        const isExpanded =
                          expandedItems[`${category.id}-${faq.id}`];
                        return (
                          <div key={faq.id} className="faq-item">
                            <button
                              className="faq-question"
                              onClick={() => toggleFaqItem(category.id, faq.id)}
                            >
                              {faq.question}
                              <span className="icon">
                                {isExpanded ? <CloseIcon /> : <PlusIcon />}
                              </span>
                            </button>
                            {isExpanded && (
                              <div className="faq-answer">{faq.answer}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  {searchQuery ? t("noResultsFound") : t("noFaqsAvailable")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
