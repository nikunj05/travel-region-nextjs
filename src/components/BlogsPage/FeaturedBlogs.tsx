'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import { useBlogStore } from '@/store/blogStore'
import { formatDateWithReadTime } from '@/lib/dateUtils'
import BlogContent from '@/components/common/BlogContent/BlogContent'
import './FeaturedBlogs.scss'

const FeaturedBlogs = () => {
  const { blogs, fetchBlogs, loading, error } = useBlogStore()

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  if (loading) {
    return (
      <main className="padding-top-100">
      <div className="container">
        <div className="featured-reads-section section-space-tb">
          <div className="loading-state">
            <p>Loading featured blogs...</p>
          </div>
        </div>
      </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="padding-top-100">
      <div className="container">
        <div className="featured-reads-section section-space-tb">
          <div className="error-state">
            <p>Error loading blogs: {error}</p>
          </div>
        </div>
      </div>
      </main>
    )
  }

  if (!blogs || blogs.length === 0) {
    return (
      <main className="padding-top-100">
      <div className="container">
        <div className="featured-reads-section section-space-tb">
          <div className="empty-state">
            <p>No blogs available</p>
          </div>
        </div>
      </div>
      </main>
    )
  }

  const featuredBlog = blogs[0] // First blog as featured
  const sidebarBlogs = blogs.slice(1, 6) // Next 5 blogs for sidebar

  return (
    <main className="padding-top-100">  
    <div className="container">
      <div className="featured-reads-section section-space-tb">
        <h1 className="section-title text-start">Featured Reads</h1>
        
        <div className="featured-blogs-layout">
          {/* Main Featured Blog */}
          <div className="featured-main-blog">
            <div className="featured-blog-card">
              <div className="featured-blog-image">
                <Image 
                  src={featuredBlog.full_image_url} 
                  width={600} 
                  height={400} 
                  alt={featuredBlog.title}
                  className="featured-blog-img"
                />
              </div>
              <div className="featured-blog-content">
                <div className="blog-meta">
                  <span className="blog-category">{featuredBlog.category.name}</span>
                  <span className="blog-date-read">
                    {formatDateWithReadTime(featuredBlog.created_at, featuredBlog.read_time)}
                  </span>
                </div>
                <h2 className="featured-blog-title">{featuredBlog.title}</h2>
                <div className="featured-blog-description">
                  <BlogContent 
                    content={featuredBlog.content} 
                    maxLength={200}
                    className="blog-description-text"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Blogs */}
          <div className="featured-sidebar-blogs">
            {sidebarBlogs.map((blog) => (
              <div key={blog.id} className="sidebar-blog-item">
                <div className="sidebar-blog-image">
                  <Image 
                    src={blog.full_image_url} 
                    width={120} 
                    height={120} 
                    alt={blog.title}
                    className="sidebar-blog-img"
                  />
                </div>
                <div className="sidebar-blog-content">
                  <span className="sidebar-blog-category">{blog.category.name}</span>
                  <h3 className="sidebar-blog-title">{blog.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
    </main>
  )
}

export default FeaturedBlogs
