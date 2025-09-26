"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import "./BlogDetails.scss";
import { useBlogStore } from "@/store/blogStore";
import { formatDateWithReadTime } from "@/lib/dateUtils";
import { useRouter } from "@/i18/navigation";
import userImage from "@/assets/images/testimonials-slider-user-img3.png";
import suitcaseTravel from "@/assets/images/property-image.jpg";

const BlogDetails = ({ blogId }: { blogId: string }) => {
  const {
    currentBlog,
    relatedBlogs,
    detailLoading,
    detailError,
    fetchBlogById,
  } = useBlogStore();
  const router = useRouter();

  useEffect(() => {
    if (blogId) {
      fetchBlogById(parseInt(blogId));
    }
  }, [blogId, fetchBlogById]);

  const handleRelatedBlogClick = (relatedBlogId: number) => {
    router.push(`/blogs/${relatedBlogId}`);
  };

  if (detailLoading) {
    return (
      <main className="padding-top-100">
        <div className="blog-details-loading">
          <div className="container">
            <p>Loading blog details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (detailError || !currentBlog) {
    return (
      <main className="padding-top-100">
        <div className="blog-details-error">
          <div className="container">
            <p>Error loading blog: {detailError || "Blog not found"}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="padding-top-100">
      <div className="blog-details-section section-space-tb">
        <div className="container">
          {/* Blog Header - Full Width */}
          <div className="blog-header-full">
            <h1 className="blog-title">{currentBlog.title}</h1>

            <div className="blog-meta">
              <div className="blog-meta-left">
                <span className="blog-date-read">
                  {formatDateWithReadTime(
                    currentBlog.created_at,
                    currentBlog.read_time
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
                    {currentBlog.author || "John Doe"}
                  </span>
                </div>
              </div>

              <div className="blog-meta-right">
                <span className="blog-category-tag">
                  {currentBlog.category?.name}
                </span>
                <div className="social-actions">
                  <button className="social-btn share-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 9.5913 6.63214 11.1174 7.75736 12.2426C8.88258 13.3679 10.4087 14 12 14C13.5913 14 15.1174 13.3679 16.2426 12.2426C17.3679 11.1174 18 9.5913 18 8Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M6 22V18C6 16.9391 6.42143 15.9217 7.17157 15.1716C7.92172 14.4214 8.93913 14 10 14H14C15.0609 14 16.0783 14.4214 16.8284 15.1716C17.5786 15.9217 18 16.9391 18 18V22"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    Share
                  </button>
                  <button className="social-btn like-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    Like
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

              {/* Author Bio */}
              <div className="author-bio">
                <div className="author-info">
                  <div className="author-avatar-large">
                    <Image
                      src={currentBlog.full_author_image_url || userImage}
                      width={60}
                      height={60}
                      alt="Author"
                      className="avatar-img-large"
                    />
                  </div>
                  <div className="author-details">
                    <h3 className="author-name-large">
                      {currentBlog.author || "John Doe"}
                    </h3>
                    <p className="author-description">
                      Travel writer and ocean enthusiast who has explored over
                      30 islands in the Maldives, sharing insider tips and
                      stories from paradise.
                    </p>
                  </div>
                </div>
              </div>

              {/* Related Articles */}
              <div className="related-articles">
                <h3 className="related-title">Other Articles:</h3>
                <div className="related-cards">
                  {relatedBlogs.slice(0, 2).map((blog) => (
                    <div 
                      key={blog.id} 
                      className="related-card" 
                      onClick={() => handleRelatedBlogClick(blog.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="related-card-image">
                        <Image
                          src={blog.full_image_url}
                          width={200}
                          height={150}
                          alt={blog.title}
                          className="related-img"
                        />
                      </div>
                      <h4 className="related-card-title">{blog.title}</h4>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments Section */}
              <div className="comments-section">
                <div className="comment-input">
                  <input
                    type="text"
                    placeholder="Share your thoughts"
                    className="comment-text-input"
                  />
                  <button className="post-comment-btn">Post it</button>
                </div>

                <div className="comments-header">
                  <h3 className="comments-title">3 Comments</h3>
                  <select className="comments-sort">
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>

                <div className="comments-list">
                  <div className="comment-item">
                    <div className="comment-avatar">
                      <Image
                        src={userImage}
                        width={40}
                        height={40}
                        alt="Commenter"
                        className="comment-avatar-img"
                      />
                    </div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">Habib Ahmed</span>
                        <span className="comment-time">about 1 hour ago</span>
                      </div>
                      <p className="comment-text">
                        I've been to the Maldives twice and never knew about
                        these places! Definitely adding them to my next trip
                        itinerary.
                      </p>
                    </div>
                  </div>

                  <div className="comment-item">
                    <div className="comment-avatar">
                      <Image
                        src={userImage}
                        width={40}
                        height={40}
                        alt="Commenter"
                        className="comment-avatar-img"
                      />
                    </div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">Tazrin Kamal</span>
                        <span className="comment-time">about 3 hour ago</span>
                      </div>
                      <p className="comment-text">
                        Love how you highlighted the lesser-known islands. Makes
                        me want to explore beyond the resorts.
                      </p>
                    </div>
                  </div>

                  <div className="comment-item">
                    <div className="comment-avatar">
                      <Image
                        src={userImage}
                        width={40}
                        height={40}
                        alt="Commenter"
                        className="comment-avatar-img"
                      />
                    </div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">Robert Smith</span>
                        <span className="comment-time">1 Day ago</span>
                      </div>
                      <p className="comment-text">
                        Great read! The hidden beach spot you mentioned sounds
                        like paradise.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="blog-sidebar">
              <div className="sidebar-ad">
                <h3 className="ad-title">Planning a Trip?</h3>
                <p className="ad-subtitle">
                  Find the perfect hotel in Maldives.
                </p>
                <div className="ad-image">
                  <Image
                    src={suitcaseTravel}
                    width={200}
                    height={150}
                    alt="Travel"
                    className="ad-img"
                  />
                </div>
                <div className="ad-cta">
                  <h2 className="ad-cta-text">TIME TO TRAVEL</h2>
                  <button className="ad-btn">Find Hotels in Maldives</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BlogDetails;
