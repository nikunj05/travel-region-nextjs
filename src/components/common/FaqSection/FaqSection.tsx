"use client";
import React, { useState } from "react";
import "./FaqSection.scss";

const faqs = [
  {
    question: "Does Novotel Bangkok On Siam Square have a pool?",
    answer: "Yes, the hotel offers an outdoor swimming pool for guests.",
  },
  {
    question: "What time is check-in at Novotel Bangkok On Siam Square?",
    answer:
      "Check-in is from 2:00 PM. Early check-in may be available (subject to availability).",
  },
  {
    question: "Is Novotel Bangkok On Siam Square pet-friendly?",
    answer: "No, pets are not allowed at this property.",
  },
  {
    question: "How much is parking at Novotel Bangkok On Siam Square?",
    answer: "Parking is available free of charge for hotel guests.",
  },
  {
    question: "What time is check-out at Novotel Bangkok On Siam Square?",
    answer:
      "Check-out is at noon. Late check-out is available for a fee (subject to availability).",
  },
];

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
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const mid = Math.ceil(faqs.length / 2);
  const leftColumn = faqs.slice(0, mid);
  const rightColumn = faqs.slice(mid);

  return (
    <section className="faq-section">
      <div className="faq-section-heading">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <p className="faq-description">
          Clear answers to help you book with confidence.
        </p>
      </div>

      <div className="faq-container">
        {/* Left Column */}
        <div style={{ flex: 1 }} className="faq-column">
          {leftColumn.map((faq, index) => (
            <div
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
              key={index}
            >
              <button className="faq-question" onClick={() => toggleFaq(index)}>
                {faq.question}
                <span className="icon">
                  {activeIndex === index ? <CloseIcon /> : <PlusIcon />}
                </span>
              </button>
              {activeIndex === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div style={{ flex: 1 }} className="faq-column">
          {rightColumn.map((faq, index) => (
            <div
              className={`faq-item ${
                activeIndex === index + mid ? "active" : ""
              }`}
              key={index + mid}
            >
              <button
                className="faq-question"
                onClick={() => toggleFaq(index + mid)}
              >
                {faq.question}
                <span className="icon">
                  {activeIndex === index + mid ? <CloseIcon /> : <PlusIcon />}
                </span>
              </button>
              {activeIndex === index + mid && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
