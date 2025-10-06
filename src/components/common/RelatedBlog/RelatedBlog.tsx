"use client";
import React, { useRef } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RelatedBlogImage from "@/assets/images/related-blog-card-img.jpg";
import "./RelatedBlog.scss";

type RelatedBlogItem = {
  id: string | number;
  title: string;
  slug: string;
  full_image_url: string;
};

interface RelatedBlogProps {
  blogs?: RelatedBlogItem[];
  onBlogClick?: (slug: string) => void;
}

const RelatedBlog: React.FC<RelatedBlogProps> = ({ blogs = [], onBlogClick }) => {
  const sliderRef = useRef<Slider>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderUpdate = () => {
    setTimeout(() => {
      if (containerRef.current && dotsRef.current) {
        const dotsElement = containerRef.current.querySelector(".slick-dots");
        if (dotsElement) {
          dotsRef.current.innerHTML = "";
          dotsRef.current.appendChild(dotsElement);
        }
      }
    }, 0);
  };

  const settings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    infinite: true,
    autoplay: false,
    onInit: handleSliderUpdate,
    onReInit: handleSliderUpdate,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div ref={containerRef}>
      <Slider ref={sliderRef} {...settings} className="related-blogs-slider">
        {(blogs && blogs.length ? blogs : [
          { id: 1, title: 'Limited-Time Hotel Deals You Can’t Miss This Season', slug: '#', full_image_url: '' },
          { id: 2, title: 'Top Beach Destinations for Your Next Getaway', slug: '#', full_image_url: '' },
          { id: 3, title: 'How to Save on Hotels Without Compromise', slug: '#', full_image_url: '' },
          { id: 4, title: 'Weekend Escapes Under $200', slug: '#', full_image_url: '' },
        ]).map((blog) => (
          <div key={blog.id} className="related-blog-card">
            <a
              href="#"
              className="related-blog-card-img"
              onClick={(e) => { e.preventDefault(); onBlogClick && blog.slug !== '#' && onBlogClick(blog.slug); }}
            >
              <Image
                src={blog.full_image_url || RelatedBlogImage}
                width={276}
                height={176}
                alt={blog.title}
              />
            </a>
            <div className="related-blog-card-details">
              <a
                href="#"
                className="related-blog-name"
                onClick={(e) => { e.preventDefault(); onBlogClick && blog.slug !== '#' && onBlogClick(blog.slug); }}
              >
                {blog.title}
              </a>
            </div>
          </div>
        ))}
      </Slider>
      <div className="testimonial-actions">
        <div className="testimonial-dots" ref={dotsRef}></div>
        <div className="testimonial-arrows">
          <button
            type="button"
            className="slick-prev"
            onClick={() => sliderRef.current?.slickPrev()}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 12L20 12M4 12L8.99996 17M4 12L9 7"
                stroke="#1B2236"
                strokeWidth="1.5"
              />
            </svg>
          </button>
          <button
            type="button"
            className="slick-next"
            onClick={() => sliderRef.current?.slickNext()}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 12L4 12M20 12L15.0001 17M20 12L15 7"
                stroke="#1B2236"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatedBlog;
