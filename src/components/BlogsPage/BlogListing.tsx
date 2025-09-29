"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./BlogListing.scss";
import { useBlogStore } from "@/store/blogStore";
import { formatDateWithReadTime } from "@/lib/dateUtils";
import BlogContent from "@/components/common/BlogContent/BlogContent";
import FilterBtnIcon from "@/assets/images/filter-icon.svg";
import downBlackArrowIcon from "@/assets/images/down-black-arrow-icon.svg";
import { useRouter } from "@/i18/navigation";
import { Select } from "../core/Select";

// Static sort options remain the same

const sortOptions = [
  { value: "newest", label: "Sort by Newest" },
  { value: "oldest", label: "Sort by Oldest" },
];

const BlogListing = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 8;

  const {
    blogs,
    pagination,
    loading,
    error,
    fetchBlogs,
    categories,
    tags,
    categoriesLoading,
    tagsLoading,
    categoriesError,
    tagsError,
    fetchCategories,
    fetchTags,
  } = useBlogStore();
  const router = useRouter();

  // Fetch categories and tags on component mount
  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, [fetchCategories, fetchTags]);

  // Fetch blogs with current filters
  useEffect(() => {
    const filters: any = {
      page: currentPage,
      per_page: blogsPerPage,
    };

    // Add category filter if any categories are selected
    if (selectedCategories.length > 0) {
      filters.category_id = selectedCategories.join(",");
    }

    // Add tags filter if any tags are selected
    if (selectedTags.length > 0) {
      filters.tags = selectedTags.join(",");
    }

    // Add sorting parameters
    if (sortBy === "newest") {
      filters.sort_by = "created_at";
      filters.sort_order = "desc";
    } else if (sortBy === "oldest") {
      filters.sort_by = "created_at";
      filters.sort_order = "asc";
    }

    fetchBlogs(filters);
  }, [fetchBlogs, currentPage, selectedCategories, selectedTags, sortBy]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleAllArticlesToggle = () => {
    if (selectedCategories.length === categories.length) {
      // If all categories are selected, deselect all
      setSelectedCategories([]);
    } else {
      // Select all categories
      setSelectedCategories(categories.map((cat) => cat.id.toString()));
    }
    setCurrentPage(1);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const handleSortChange = (sortValue: string) => {
    setSortBy(sortValue);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Calculate total pages from API pagination
  const totalPages = useMemo(() => {
    if (!pagination) return 1;
    if (!pagination.per_page || !pagination.total) return 1;
    return Math.max(1, Math.ceil(pagination.total / pagination.per_page));
  }, [pagination]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBlogClick = (blogSlug: string) => {
    console.log("Blog clicked:", blogSlug);
    router.push(`/blogs/${blogSlug}`);
  };

  // Skeleton Components
  const BlogGridSkeleton = () => (
    <div className="blog-grid">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="blog-card">
          <div className="blog-card-image">
            <Skeleton height={250} />
          </div>
          <div className="blog-card-content">
            <div className="blog-meta">
              <Skeleton width={80} height={24} borderRadius={20} />
              <Skeleton width={120} height={16} />
            </div>
            <Skeleton height={24} style={{ marginBottom: "12px" }} />
            <Skeleton count={3} height={16} style={{ marginBottom: "8px" }} />
            <Skeleton width="70%" height={16} />
          </div>
        </div>
      ))}
    </div>
  );

  const CategoriesSkeleton = () => (
    <div className="filter-options" role="group" aria-label="Category Filters">
      <div className="filter-option all-articles-option">
        <Skeleton width={20} height={20} borderRadius={4} />
        <Skeleton width={80} height={16} style={{ marginLeft: "8px" }} />
      </div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="filter-option">
          <Skeleton width={20} height={20} borderRadius={4} />
          <Skeleton width={100} height={16} style={{ marginLeft: "8px" }} />
        </div>
      ))}
    </div>
  );

  const TagsSkeleton = () => (
    <div className="tags-container">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton
          key={index}
          width={60}
          height={32}
          borderRadius={16}
          style={{ margin: "4px" }}
        />
      ))}
    </div>
  );

  return (
    <div className="blog-listing-section section-space-tb">
      <div className="container">
        <div className="blog-listing-header">
          <h2 className="section-title text-start">Latest From The Blog</h2>
          <div className="blog-sort-bar d-flex align-items-center">
            <div className="mobile-filter-button d-md-none ">
              <button className="filter-button button-primary ">
                <span className="filter-icon-with-text">
                  <Image
                    src={FilterBtnIcon}
                    alt="filter icon"
                    width={20}
                    height={20}
                    className="sort-filter-icon"
                  />
                  Filter
                </span>
                <Image
                  src={downBlackArrowIcon}
                  alt="arrow icon"
                  width={20}
                  height={20}
                  className="sort-filter-icon"
                />
              </button>
            </div>
            <div className="blog-sort-by-select-option">
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                label="Sort by"
                className="sort-dropdown"
              />
            </div>
          </div>
        </div>

        <div className="blog-listing-layout">
          {/* Left Sidebar - Filters */}
          <div className="blog-filters-sidebar">
            {/* Quick Filters */}
            <div className="filter-section">
              <h3 className="filter-title">Categories:</h3>
              {categoriesLoading ? (
                <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
                  <CategoriesSkeleton />
                </SkeletonTheme>
              ) : categoriesError ? (
                <div className="error-state">
                  <p>Error loading categories: {categoriesError}</p>
                </div>
              ) : (
                <div
                  className="filter-options"
                  role="group"
                  aria-label="Category Filters"
                >
                  {/* All Articles checkbox */}
                  <label className="filter-option all-articles-option">
                    <input
                      type="checkbox"
                      checked={
                        selectedCategories.length === categories.length &&
                        categories.length > 0
                      }
                      onChange={handleAllArticlesToggle}
                      className="filter-checkbox"
                      aria-checked={
                        selectedCategories.length === categories.length &&
                        categories.length > 0
                      }
                    />
                    <span className="filter-label">All Articles</span>
                  </label>

                  {/* Dynamic categories */}
                  {categories.map((category) => (
                    <label key={category.id} className="filter-option">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(
                          category.id.toString()
                        )}
                        onChange={() =>
                          handleCategoryToggle(category.id.toString())
                        }
                        className="filter-checkbox"
                        aria-checked={selectedCategories.includes(
                          category.id.toString()
                        )}
                      />
                      <span className="filter-label">{category.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="filter-section">
              <h3 className="filter-title">Tags:</h3>
              {tagsLoading ? (
                <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
                  <TagsSkeleton />
                </SkeletonTheme>
              ) : tagsError ? (
                <div className="error-state">
                  <p>Error loading tags: {tagsError}</p>
                </div>
              ) : (
                <div className="tags-container">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`tag-button ${
                        selectedTags.includes(tag) ? "active" : ""
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Blog Grid */}
          <div className="blog-content-area">
            {/* Sort Options */}
            {/* <div className="blog-sort-bar">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="sort-dropdown"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div> */}

            {/* Blog Grid */}
            {loading ? (
              <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
                <BlogGridSkeleton />
              </SkeletonTheme>
            ) : error && !loading ? (
              <div className="error-state">
                <p>Error loading blogs: {error}</p>
              </div>
            ) : !loading && !error && blogs && blogs.length === 0 ? (
              <div className="empty-state">
                <p>No blogs available</p>
              </div>
            ) : (
              <div className="blog-grid">
                {blogs && blogs.length > 0 && (
                  <>
                    {blogs.map((blog) => (
                      <div
                        key={blog.id}
                        className="blog-card"
                        onClick={() => handleBlogClick(blog.slug)}
                      >
                        <div className="blog-card-image">
                          <Image
                            src={blog.full_image_url}
                            width={400}
                            height={250}
                            alt={blog.title}
                            className="blog-img"
                          />
                          <div className="blog-card-overlay">
                            <button className="blog-list-read-more-btn">
                              Read More
                            </button>
                          </div>
                        </div>
                        <div className="blog-card-content">
                          <div className="blog-meta">
                            <span className="blog-category">
                              {blog.category.name}
                            </span>
                            <span className="blog-date-read">
                              {formatDateWithReadTime(
                                blog.created_at,
                                blog.read_time
                              )}
                            </span>
                          </div>
                          <h3 className="blog-title">{blog.title}</h3>
                          <div className="blog-description">
                            <BlogContent
                              content={blog.content}
                              maxLength={160}
                              className="blog-description-text"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* Pagination */}
            <div className="pagination">
              <button
                className="pagination-arrow"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 6L9 12L15 18"
                    stroke="#09090B"
                    strokeWidth="1.5"
                    strokeMiterlimit="16"
                  />
                </svg>
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const page = idx + 1;
                return (
                  <button
                    key={page}
                    className={`pagination-page ${
                      currentPage === page ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                className="pagination-arrow"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogListing;
