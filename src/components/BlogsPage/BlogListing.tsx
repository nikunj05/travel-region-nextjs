'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import './BlogListing.scss'
import { useBlogStore } from '@/store/blogStore'
import { formatDateWithReadTime } from '@/lib/dateUtils'
import BlogContent from '@/components/common/BlogContent/BlogContent'

const categories = [
  { id: 'all', name: 'All Articles' },
  { id: 'destinations', name: 'Destinations' },
  { id: 'travel-tips', name: 'Travel Tips' },
  { id: 'offers', name: 'Offers' },
  { id: 'inspiration', name: 'Inspiration' },
  { id: 'hotel', name: 'Hotel' },
  { id: 'culture', name: 'Culture' },
  { id: 'halal-food', name: 'Halal Food' }
]

const tags = [
  '#luxury_hotels',
  '#budget_travel',
  '#beach_resort',
  '#city_breaks',
  '#family_friendly',
  '#halal',
  '#lastminute_deal'
]

const sortOptions = [
  { value: 'recommended', label: 'Sort by Recommended' },
  { value: 'newest', label: 'Sort by Newest' },
  { value: 'oldest', label: 'Sort by Oldest' },
  { value: 'popular', label: 'Sort by Most Popular' }
]

const BlogListing = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('recommended')
  const [currentPage, setCurrentPage] = useState(1)
  const blogsPerPage = 8

  const { blogs, pagination, loading, error, fetchBlogs } = useBlogStore()

  useEffect(() => {
    fetchBlogs({ page: currentPage, per_page: blogsPerPage })
  }, [fetchBlogs, currentPage])

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
    setCurrentPage(1)
  }

  const handleSortChange = (sortValue: string) => {
    setSortBy(sortValue)
    setCurrentPage(1)
  }

  // Calculate total pages from API pagination
  const totalPages = useMemo(() => {
    if (!pagination) return 1
    if (!pagination.per_page || !pagination.total) return 1
    return Math.max(1, Math.ceil(pagination.total / pagination.per_page))
  }, [pagination])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="blog-listing-section section-space-tb">
      <div className="container">
        <h2 className="section-title text-start">Latest From The Blog</h2>
        
        <div className="blog-listing-layout">
          {/* Left Sidebar - Filters */}
          <div className="blog-filters-sidebar">
            {/* Quick Filters */}
            <div className="filter-section">
              <h3 className="filter-title">Quick Filters:</h3>
              <div className="filter-options" role="radiogroup" aria-label="Quick Filters">
                {categories.map(category => (
                  <label key={category.id} className="filter-option">
                    <input
                      type="radio"
                      name="blog-category"
                      checked={selectedCategory === category.id}
                      onChange={() => handleCategoryChange(category.id)}
                      className="filter-radio"
                      aria-checked={selectedCategory === category.id}
                    />
                    <span className="filter-label">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="filter-section">
              <h3 className="filter-title">Tags:</h3>
              <div className="tags-container">
                {tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`tag-button ${selectedTags.includes(tag) ? 'active' : ''}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Blog Grid */}
          <div className="blog-content-area">
            {/* Sort Options */}
            <div className="blog-sort-bar">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="sort-dropdown"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Blog Grid */}
            <div className="blog-grid">
              {loading && (
                <div className="loading-state">
                  <p>Loading blogs...</p>
                </div>
              )}
              {error && !loading && (
                <div className="error-state">
                  <p>Error loading blogs: {error}</p>
                </div>
              )}
              {!loading && !error && blogs && blogs.length === 0 && (
                <div className="empty-state">
                  <p>No blogs available</p>
                </div>
              )}
              {!loading && !error && blogs && blogs.length > 0 && (
                <>
                  {blogs.map(blog => (
                    <div key={blog.id} className="blog-card">
                      <div className="blog-card-image">
                        <Image
                          src={blog.full_image_url}
                          width={400}
                          height={250}
                          alt={blog.title}
                          className="blog-img"
                        />
                      </div>
                      <div className="blog-card-content">
                        <div className="blog-meta">
                          <span className="blog-category">{blog.category.name}</span>
                          <span className="blog-date-read">
                            {formatDateWithReadTime(blog.created_at, blog.read_time)}
                          </span>
                        </div>
                        <h3 className="blog-title">{blog.title}</h3>
                        <div className="blog-description">
                          <BlogContent content={blog.content} maxLength={160} className="blog-description-text" />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Pagination */}
            <div className="pagination">
                  <button className="pagination-arrow" disabled={currentPage <= 1} onClick={() => handlePageChange(Math.max(1, currentPage - 1))}>
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
                    const page = idx + 1
                    return (
                      <button
                        key={page}
                        className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    )
                  })}

                  <button className="pagination-arrow" disabled={currentPage >= totalPages} onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}>
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
  )
}

export default BlogListing
