"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslations, useLocale } from "next-intl";
import { faqService } from "@/services/faqService";
import { FaqItem, FaqCategory } from "@/types/faq";
import "./FaqSection.scss";

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
      d="M15.9993 10.666V21.3327M21.3327 15.9993H10.666"
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

const FaqSection = () => {
  const t = useTranslations("FAQ");
  const locale = useLocale();
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const fetchFaqs = useCallback(async () => {
    try {
      const response = await faqService.getFaqs();
      const fetchedFaqs =
        (response?.data?.faqs || []).reduce<FaqItem[]>(
          (accumulator, category: FaqCategory) => {
            if (Array.isArray(category.faqs)) {
              return accumulator.concat(category.faqs);
            }
            return accumulator;
          },
          []
        );
      setFaqItems(fetchedFaqs);
      setActiveIndex(fetchedFaqs.length > 0 ? 0 : null);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setFaqItems([]);
      setActiveIndex(null);
    }
  }, [locale]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const { leftColumn, rightColumn, mid } = useMemo(() => {
    if (faqItems.length === 0) {
      return { leftColumn: [], rightColumn: [], mid: 0 };
    }

    const midpoint = Math.ceil(faqItems.length / 2);
    return {
      leftColumn: faqItems.slice(0, midpoint),
      rightColumn: faqItems.slice(midpoint),
      mid: midpoint,
    };
  }, [faqItems]);

  const toggleFaq = (index: number) => {
    setActiveIndex((previous) => (previous === index ? null : index));
  };

  return (
    <section className="faq-section">
      <div className="faq-section-heading">
        <h2 className="faq-title">{t("title")}</h2>
        <p className="faq-description">{t("description")}</p>
      </div>

      <div className="faq-container">
        {faqItems.length > 0 ? (
          <>
            {/* Left Column */}
            <div style={{ flex: 1 }} className="faq-column">
              {leftColumn.map((faq, index) => {
                const currentIndex = index;
                const isActive = activeIndex === currentIndex;
                return (
                  <div
                    className={`faq-item ${isActive ? "active" : ""}`}
                    key={`${faq.id}-${currentIndex}`}
                  >
                    <button
                      className="faq-question"
                      onClick={() => toggleFaq(currentIndex)}
                    >
                      {faq.question}
                      <span className="icon">
                        {isActive ? <CloseIcon /> : <PlusIcon />}
                      </span>
                    </button>
                    {isActive && (
                      <div className="faq-answer">{faq.answer}</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Column */}
            <div style={{ flex: 1 }} className="faq-column">
              {rightColumn.map((faq, index) => {
                const currentIndex = index + mid;
                const isActive = activeIndex === currentIndex;
                return (
                  <div
                    className={`faq-item ${isActive ? "active" : ""}`}
                    key={`${faq.id}-${currentIndex}`}
                  >
                    <button
                      className="faq-question"
                      onClick={() => toggleFaq(currentIndex)}
                    >
                      {faq.question}
                      <span className="icon">
                        {isActive ? <CloseIcon /> : <PlusIcon />}
                      </span>
                    </button>
                    {isActive && (
                      <div className="faq-answer">{faq.answer}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{ flex: 1 }} className="faq-column">
            <div className="faq-item active">
              <div className="faq-answer">{t("noFaqsAvailable")}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FaqSection;
