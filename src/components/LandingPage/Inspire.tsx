import React from 'react'
import Image from 'next/image'
import blogCardImg1 from '@/assets/images/blog-card-img1.jpg'
import blogCardImg2 from '@/assets/images/blog-card-img2.jpg'
import blogCardImg3 from '@/assets/images/blog-card-img3.jpg'
import blogCardImg4 from '@/assets/images/blog-card-img4.jpg'

const Inspire = () => {
  return (
    <section className="home-blog-section section-space-tb">
    <div className="container">
      <div className="heading_section">
        <h1 className="section-title">Inspire Your Next Getaway</h1>
        <p className="section-description mx-width-790">Dive into inspiring stories, smart travel hacks, and detailed guides
          from real explorers who’ve been there and done that.</p>
      </div>
      <div className="blog-single-card d-flex align-items-start">
        <div className="blog-single-image">
          <a href="#" className="blog-card-items-img">
            <Image src={blogCardImg1} width={688} height={391} alt="7 Hidden Gems in the Maldives"
              className="blog-card-image" />
          </a>
        </div>
        <div className="blog-card-content">
          <span className="blog-card-date">Aug 15, 2025 • 4 min read</span>
          <a href="#" className="blog-card-title">7 Hidden Gems in the Maldives You’ve Never Heard Of</a>
          <p className="blog-card-description">
            Tired of crowded beaches? Escape the noise and explore serene Maldivian islands where white sands remain
            untouched, the
            breeze is gentle, and every sunset feels like a private show. Discover tranquil shores where time slows
            down, and the
            sea sparkles just for you.
          </p>
        </div>
      </div>
      <div className="blog-card-listing d-grid">
        <div className="blog-card-items">
          <a href="#" className="blog-card-items-img">
            <Image src={blogCardImg2} width={379} height={215} alt="How to Score Last-Minute Hotel Deals" />
          </a>
          <div className="blog-card-details">
            <div className="blog-card-details-date">April 10, 2025 • 8 min read</div>
            <a href="#" className="blog-card-details-title">
              How to Score Last-Minute Hotel Deals Like a Pro
            </a>
          </div>
        </div>
        <div className="blog-card-items">
          <a href="#" className="blog-card-items-img">
            <Image src={blogCardImg3} width={379} height={215} alt="The Complete Packing List for Tropical Destinations" />
          </a>
          <div className="blog-card-details">
            <div className="blog-card-details-date">May 30, 2025 • 4 min read</div>
            <a href="#" className="blog-card-details-title">
              The Complete Packing List for Tropical Destinations
            </a>
          </div>
        </div>
        <div className="blog-card-items">
          <a href="#" className="blog-card-items-img">
            <Image src={blogCardImg4} width={379} height={215} alt="Instant or Request: Which to Pick?" />
          </a>
          <div className="blog-card-details">
            <div className="blog-card-details-date">Aug 10, 2025 • 6 min read</div>
            <a href="#" className="blog-card-details-title">
              Instant or Request: Which to Pick?
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default Inspire
