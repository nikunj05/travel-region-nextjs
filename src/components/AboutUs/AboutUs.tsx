'use client'
import Image from 'next/image'
import { CmsPageItem } from '@/types/cms'
import './AboutUs.scss'

interface AboutUsProps {
  page: CmsPageItem
}

export default function AboutUs({ page }: AboutUsProps) {
  return (
    <div className="about-us-page">
      {/* Hero Section with Story */}
      <section className="about-hero section-space-tb">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div dangerouslySetInnerHTML={{ __html: page.content }} />
            </div>
            {page.founder_image_url && (
              <div className="col-lg-6">
                <div className="founder-image-wrapper">
                  <Image
                    src={page.founder_image_url}
                    alt="Founder"
                    width={600}
                    height={600}
                    className="founder-image"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why We Exist Section */}
      {page.why_we_exist && page.why_we_exist.length > 0 && (
        <section className="why-we-exist-section section-space-tb bg-light">
          <div className="container">
            <h2 className="section-title text-center mb-5">Why We Exist</h2>
            <div className="row g-4">
              {page.why_we_exist.map((item, idx) => (
                <div key={idx} className="col-lg-4 col-md-6">
                  <div className="why-card">
                    <h3 className="why-card-title">{item.title}</h3>
                    <p className="why-card-description">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Few Highlights Section */}
      {page.few_highlights && page.few_highlights.length > 0 && (
        <section className="highlights-section section-space-tb">
          <div className="container">
            <h2 className="section-title text-center mb-5">A Few Highlights</h2>
            <div className="row g-4">
              {page.few_highlights.map((item, idx) => (
                <div key={idx} className="col-lg-3 col-md-6 col-6">
                  <div className="highlight-card text-center">
                    <h3 className="highlight-number">{item.title}</h3>
                    <p className="highlight-label">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Our Partners Section */}
      {page.our_partners && page.our_partners.length > 0 && (
        <section className="partners-section section-space-tb bg-light">
          <div className="container">
            <h2 className="section-title text-center mb-5">Our Partners</h2>
            <div className="partners-grid">
              {page.our_partners.map((partner, idx) => (
                <div key={idx} className="partner-logo-wrapper">
                  <Image
                    src={partner}
                    alt={`Partner ${idx + 1}`}
                    width={150}
                    height={80}
                    className="partner-logo"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ready to Explore Section */}
      {page.ready_to_explore_title && page.ready_to_explore_image_url && (
        <section className="explore-section section-space-tb">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <h2 className="explore-title">{page.ready_to_explore_title}</h2>
                {page.ready_to_explore_sub_title && (
                  <p className="explore-subtitle">{page.ready_to_explore_sub_title}</p>
                )}
              </div>
              <div className="col-lg-6">
                <div className="explore-image-wrapper">
                  <Image
                    src={page.ready_to_explore_image_url}
                    alt="Ready to Explore"
                    width={600}
                    height={400}
                    className="explore-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

