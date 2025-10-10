"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./BlogDetails.scss";
import { useBlogStore } from "@/store/blogStore";
import { formatDateWithReadTime } from "@/lib/dateUtils";
import { useRouter } from "@/i18/navigation";
import userImage from "@/assets/images/testimonials-slider-user-img3.png";
import suitcaseTravel from "@/assets/images/blog-travel-ad-image.jpg";
import RelatedBlog from "../common/RelatedBlog/RelatedBlog";

const BlogDetails = ({ blogSlug }: { blogSlug: string }) => {
  const t = useTranslations("Blogs");
  const {
    currentBlog,
    relatedBlogs,
    detailLoading,
    detailError,
    fetchBlogBySlug,
  } = useBlogStore();
  const router = useRouter();

  useEffect(() => {
    if (blogSlug) {
      fetchBlogBySlug(blogSlug);
    }
  }, [blogSlug, fetchBlogBySlug]);

  const handleRelatedBlogClick = (relatedBlogSlug: string) => {
    router.push(`/blogs/${relatedBlogSlug}`);
  };

  // Skeleton Loading Component
  const BlogDetailsSkeleton = () => (
    <main className="padding-top-100">
      <div className="blog-details-section">
        <div className="container">
          <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
            {/* Blog Header Skeleton */}
            <div className="blog-header-full">
              <Skeleton height={48} style={{ marginBottom: "24px" }} />

              <div className="blog-meta">
                <div className="blog-meta-left">
                  <Skeleton
                    width={150}
                    height={16}
                    style={{ marginBottom: "12px" }}
                  />
                  <div className="blog-author">
                    <Skeleton width={32} height={32} borderRadius={16} />
                    <Skeleton
                      width={100}
                      height={16}
                      style={{ marginLeft: "8px" }}
                    />
                  </div>
                </div>

                <div className="blog-meta-right">
                  <Skeleton width={80} height={24} borderRadius={20} />
                  <div className="social-actions">
                    <Skeleton width={60} height={32} borderRadius={16} />
                    <Skeleton width={50} height={32} borderRadius={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Image Skeleton */}
            <div className="blog-main-image-full">
              <Skeleton height={500} />
            </div>

            {/* Two Column Layout Skeleton */}
            <div className="blog-content-layout">
              {/* Left Column - Main Content */}
              <div className="blog-main-content">
                {/* Blog Content Skeleton */}
                <div className="blog-content">
                  <Skeleton
                    count={8}
                    height={20}
                    style={{ marginBottom: "12px" }}
                  />
                  <Skeleton
                    count={6}
                    height={20}
                    style={{ marginBottom: "12px" }}
                  />
                  <Skeleton
                    count={7}
                    height={20}
                    style={{ marginBottom: "12px" }}
                  />
                  <Skeleton width="60%" height={20} />
                </div>

                {/* Author Bio Skeleton */}
                <div className="author-bio">
                  <div className="author-info">
                    <Skeleton width={60} height={60} borderRadius={30} />
                    <div className="author-details">
                      <Skeleton
                        width={150}
                        height={24}
                        style={{ marginBottom: "8px" }}
                      />
                      <Skeleton
                        count={3}
                        height={16}
                        style={{ marginBottom: "4px" }}
                      />
                      <Skeleton width="80%" height={16} />
                    </div>
                  </div>
                </div>

                {/* Related Articles Skeleton */}
                <div className="related-articles">
                  <Skeleton
                    width={150}
                    height={24}
                    style={{ marginBottom: "16px" }}
                  />
                  <div className="related-cards">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <div key={index} className="related-card">
                        <div className="related-card-image">
                          <Skeleton width={200} height={150} />
                        </div>
                        <Skeleton
                          count={2}
                          height={16}
                          style={{ marginTop: "8px" }}
                        />
                        <Skeleton width="70%" height={16} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments Section Skeleton */}
                {/* <div className="comments-section">
                  <div className="comment-input">
                    <Skeleton height={40} style={{ marginBottom: '8px' }} />
                    <Skeleton width={80} height={32} borderRadius={16} />
                  </div>

                  <div className="comments-header">
                    <Skeleton width={120} height={24} />
                    <Skeleton width={100} height={32} borderRadius={16} />
                  </div>

                  <div className="comments-list">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="comment-item">
                        <div className="comment-avatar">
                          <Skeleton width={40} height={40} borderRadius={20} />
                        </div>
                        <div className="comment-content">
                          <div className="comment-header">
                            <Skeleton width={100} height={16} />
                            <Skeleton width={80} height={14} />
                          </div>
                          <Skeleton count={2} height={16} style={{ marginTop: '8px' }} />
                          <Skeleton width="60%" height={16} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}
              </div>

              {/* Right Sidebar Skeleton */}
              <div className="blog-sidebar">
                <div className="sidebar-ad">
                  <Skeleton
                    width={150}
                    height={24}
                    style={{ marginBottom: "8px" }}
                  />
                  <Skeleton
                    width={200}
                    height={16}
                    style={{ marginBottom: "16px" }}
                  />
                  <div className="ad-image">
                    <Skeleton width={200} height={150} />
                  </div>
                  <div className="ad-cta">
                    <Skeleton
                      width={120}
                      height={20}
                      style={{ marginBottom: "8px" }}
                    />
                    <Skeleton width={180} height={40} borderRadius={20} />
                  </div>
                </div>
              </div>
            </div>
          </SkeletonTheme>
        </div>
      </div>
    </main>
  );

  if (detailLoading) {
    return <BlogDetailsSkeleton />;
  }

  if (detailError || !currentBlog) {
    return (
      <main className="padding-top-100">
        <div className="blog-details-error mt-4">
          <div className="container">
            <p>
              {t("errorLoadingBlog")} {detailError || t("blogNotFound")}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="padding-top-100">
      <div className="blog-details-section section-space-b">
        <div className="container">
          {/* Blog Header - Full Width */}
          <div className="blog-header-full">
            <h1 className="blog-title">{currentBlog.title}</h1>

            <div className="blog-meta">
              <div className="blog-meta-left">
                <span className="blog-date-read">
                  {formatDateWithReadTime(
                    currentBlog.created_at,
                    currentBlog.read_time,
                    t
                  )}
                </span>
                <div className="blog-author">
                  <div className="author-avatar">
                    <Image
                      src={currentBlog.full_author_image_url || userImage}
                      width={32}
                      height={32}
                      alt="Author"
                      className="avatar-img"
                    />
                  </div>
                  <span className="author-name">
                    {currentBlog.author || t("authorDefault")}
                  </span>
                </div>
              </div>

              <div className="blog-meta-right">
                <span className="blog-category-tag">
                  {currentBlog.category?.name}
                </span>
                <div className="social-actions">
                  <button className="social-btn share-btn">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 7C18.7745 7.16058 19.3588 7.42859 19.8284 7.87589C21 8.99181 21 10.7879 21 14.38C21 17.9721 21 19.7681 19.8284 20.8841C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8841C3 19.7681 3 17.9721 3 14.38C3 10.7879 3 8.99181 4.17157 7.87589C4.64118 7.42859 5.2255 7.16058 6 7"
                        stroke="#09090B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M12.0253 2.00052L12 14M12.0253 2.00052C11.8627 1.99379 11.6991 2.05191 11.5533 2.17492C10.6469 2.94006 9 4.92886 9 4.92886M12.0253 2.00052C12.1711 2.00657 12.3162 2.06476 12.4468 2.17508C13.3531 2.94037 15 4.92886 15 4.92886"
                        stroke="#09090B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {t("share")}
                  </button>
                  <button className="social-btn like-btn d-none">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z"
                        stroke="#09090B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    {t("like")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Blog Image - Full Width */}
          <div className="blog-main-image-full">
            <Image
              src={currentBlog.full_image_url}
              width={1200}
              height={500}
              alt={currentBlog.title}
              className="main-img-full"
            />
          </div>

          {/* Two Column Layout Below Image */}
          <div className="blog-content-layout">
            {/* Left Column - Main Content */}
            <div className="blog-main-content">
              {/* Blog Content */}
              <div className="blog-content">
                <p dangerouslySetInnerHTML={{ __html: currentBlog.content }} />
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="blog-sidebar">
              <div className="sidebar-ad">
                <h3 className="ad-title">{t("planningTrip")}</h3>
                <p className="ad-subtitle">{t("findPerfectHotel")}</p>
                <div className="ad-image">
                  <Image
                    src={suitcaseTravel}
                    width={276}
                    height={335}
                    alt="Travel"
                    className="ad-img"
                  />
                </div>
                <div className="ad-cta">
                  <button className="ad-btn button-primary">
                    {t("findHotelsMaldives")}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="related-blogs-section">
            <h2 className="related-blogs-title">{t("relatedPost")}</h2>
            <RelatedBlog
              blogs={relatedBlogs}
              onBlogClick={handleRelatedBlogClick}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default BlogDetails;
