'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import { useBlogStore } from '@/store/blogStore'
import { formatDateWithReadTime } from '@/lib/dateUtils'
import BlogContent from '@/components/common/BlogContent/BlogContent'
import { useRouter } from '@/i18/navigation'

const DashboardBlogs = () => {
  const { blogs, fetchBlogs, loading, error } = useBlogStore()
  const router = useRouter()

  useEffect(() => {
    fetchBlogs() // This will fetch 15 blogs by default
  }, [fetchBlogs])

  useEffect(() => {
    console.log('All Blogs:', blogs)
  }, [blogs])

  const handleBlogClick = (blogId: number) => {
    router.push(`/blogs/${blogId}`)
  }

  if (loading) {
    return <div className="container"><p>Loading blogs...</p></div>
  }

  if (error) {
    return <div className="container"><p>Error loading blogs: {error}</p></div>
  }

  if (!blogs || blogs.length === 0) {
    return <div className="container"><p>No blogs available</p></div>
  }

  return (
    <section className="home-blog-section section-space-tb">
    <div className="container">
      <div className="heading_section">
        <h1 className="section-title">Inspire Your Next Getaway</h1>
        <p className="section-description mx-width-790">Dive into inspiring stories, smart travel hacks, and detailed guides
          from real explorers who’ve been there and done that.</p>
      </div>
      <div className="blog-single-card d-flex align-items-start" onClick={() => handleBlogClick(blogs[0].id)} style={{ cursor: 'pointer' }}>
        <div className="blog-single-image">
          <div className="blog-card-items-img">
            <Image src={blogs[0].full_image_url} width={688} height={391} alt={blogs[0].title}
              className="blog-card-image" />
          </div>
        </div>
        <div className="blog-card-content">
          <span className="blog-card-date">{blogs[0] && formatDateWithReadTime(blogs[0].created_at, blogs[0].read_time)}</span>
          <div className="blog-card-title">{blogs[0]?.title}</div>
          <BlogContent 
            content={blogs[0]?.content || ''} 
            maxLength={550}
            className="blog-card-description"
          />
        </div>
      </div>
      <div className="blog-card-listing d-grid">
        {blogs.slice(1, 4).map((blog, index) => (
          <div key={blog.id} className="blog-card-items" onClick={() => handleBlogClick(blog.id)} style={{ cursor: 'pointer' }}>
            <div className="blog-card-items-img">
              <Image src={blog.full_image_url} width={379} height={215} alt={blog.title} />
            </div>
            <div className="blog-card-details">
              <div className="blog-card-details-date">{formatDateWithReadTime(blog.created_at, blog.read_time)}</div>
              <div className="blog-card-details-title">
                {blog.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
  )
}

export default DashboardBlogs
