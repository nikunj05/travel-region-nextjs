"use client";
import React, { useState, useEffect } from "react";
import { faqService } from "@/services/faqService";
import { FaqCategory, FaqItem } from "@/types/faq";
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
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="12" fill="#374151" />
    <path
      d="M12 8V16M8 12H16"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="11.5" stroke="#374151" />
    <path
      d="M15 9L9 15M9 9L15 15"
      stroke="#374151"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FaqPage = () => {
  const [faqCategories, setFaqCategories] = useState<FaqCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
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
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  if (loading) {
    return (
      <div className="faq-page">
        <div className="faq-container">
          <div className="loading">Loading FAQs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="faq-page padding-top-100 ">
      <div className="faq-container">
        {/* Left Sidebar */}
        <div className="faq-sidebar">
          <div className="sidebar-categories">
            {faqCategories.map((category, index) => (
              <button
                key={category.id}
                className={`category-item ${activeCategory === index ? 'active' : ''}`}
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
                placeholder="Search for a question..."
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
                      const isExpanded = expandedItems[`${category.id}-${faq.id}`];
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
                {searchQuery ? "No FAQs found matching your search." : "No FAQs available."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
