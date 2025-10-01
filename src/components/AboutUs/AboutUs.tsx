"use client";
import Image from "next/image";
import { CmsPageItem } from "@/types/cms";
import "./AboutUs.scss";
import OurStoryimage from "@/assets/images/about-image.png";
import WatchIcon from "@/assets/images/watch-icon.svg";
import VisionIcon from "@/assets/images/vision-icon.svg";
import MissionIcon from "@/assets/images/mission-icon.svg";
import PartnerLogo1 from "@/assets/images/marriott-logo.png";
import PartnerLogo2 from "@/assets/images/all-logo.png";
import PartnerLogo3 from "@/assets/images/radisson-logo.png";
import PartnerLogo4 from "@/assets/images/wyndham-logo.png";
import PartnerLogo5 from "@/assets/images/ihg-logo.png";
import PartnerLogo6 from "@/assets/images/hyatt-logo.png";
import PartnerLogo7 from "@/assets/images/hilton-logo.png";

interface AboutUsProps {
  page: CmsPageItem;
}

export default function AboutUs({ page }: AboutUsProps) {
  return (
    // <div className="about-us-page">
    //   <section className="about-hero section-space-tb">
    //     <div className="container">
    //       <div className="row align-items-center">
    //         <div className="col-lg-6 mb-4 mb-lg-0">
    //           <div dangerouslySetInnerHTML={{ __html: page.content }} />
    //         </div>
    //         {page.founder_image_url && (
    //           <div className="col-lg-6">
    //             <div className="founder-image-wrapper">
    //               <Image
    //                 src={page.founder_image_url}
    //                 alt="Founder"
    //                 width={600}
    //                 height={600}
    //                 className="founder-image"
    //               />
    //             </div>
    //           </div>
    //         )}
    //       </div>
    //     </div>
    //   </section>

    //   {page.why_we_exist && page.why_we_exist.length > 0 && (
    //     <section className="why-we-exist-section section-space-tb bg-light">
    //       <div className="container">
    //         <h2 className="section-title text-center mb-5">Why We Exist</h2>
    //         <div className="row g-4">
    //           {page.why_we_exist.map((item, idx) => (
    //             <div key={idx} className="col-lg-4 col-md-6">
    //               <div className="why-card">
    //                 <h3 className="why-card-title">{item.title}</h3>
    //                 <p className="why-card-description">{item.description}</p>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     </section>
    //   )}

    //   {page.few_highlights && page.few_highlights.length > 0 && (
    //     <section className="highlights-section section-space-tb">
    //       <div className="container">
    //         <h2 className="section-title text-center mb-5">A Few Highlights</h2>
    //         <div className="row g-4">
    //           {page.few_highlights.map((item, idx) => (
    //             <div key={idx} className="col-lg-3 col-md-6 col-6">
    //               <div className="highlight-card text-center">
    //                 <h3 className="highlight-number">{item.title}</h3>
    //                 <p className="highlight-label">{item.description}</p>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     </section>
    //   )}

    //   {page.our_partners && page.our_partners.length > 0 && (
    //     <section className="partners-section section-space-tb bg-light">
    //       <div className="container">
    //         <h2 className="section-title text-center mb-5">Our Partners</h2>
    //         <div className="partners-grid">
    //           {page.our_partners.map((partner, idx) => (
    //             <div key={idx} className="partner-logo-wrapper">
    //               <Image
    //                 src={partner}
    //                 alt={`Partner ${idx + 1}`}
    //                 width={150}
    //                 height={80}
    //                 className="partner-logo"
    //               />
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     </section>
    //   )}

    //   {page.ready_to_explore_title && page.ready_to_explore_image_url && (
    //     <section className="explore-section section-space-tb">
    //       <div className="container">
    //         <div className="row align-items-center">
    //           <div className="col-lg-6 mb-4 mb-lg-0">
    //             <h2 className="explore-title">{page.ready_to_explore_title}</h2>
    //             {page.ready_to_explore_sub_title && (
    //               <p className="explore-subtitle">
    //                 {page.ready_to_explore_sub_title}
    //               </p>
    //             )}
    //           </div>
    //           <div className="col-lg-6">
    //             <div className="explore-image-wrapper">
    //               <Image
    //                 src={page.ready_to_explore_image_url}
    //                 alt="Ready to Explore"
    //                 width={600}
    //                 height={400}
    //                 className="explore-image"
    //               />
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </section>
    //   )}
    // </div>
    <main className="about-us-page section-space-b">
      <section className="banner-section-common about-us-banner-section">
        <div className="container">
          <div className="banner-content">
            <div className="heading_section text-center">
              <h1 className="section-title">Who We Are</h1>
              <p className="section-description">
                Your trusted partner in discovering the perfect stay, anywhere.
              </p>
              <button className="button-primary mx-auto banner-common-button">
                Explore Our Story
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="our-story-section section-space-tb">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-5">
              <div className="about-our-storyimage">
                <Image
                  src={OurStoryimage}
                  width={387}
                  height={463}
                  alt="about image"
                />
              </div>
            </div>
            <div className="col-md-7">
              <div className="about-our-story-content">
                <h2 className="about-us-section-title">
                  Our Story – How It All Started
                </h2>
                <p className="about-our-story-description">
                  Founded in 2015, our journey began with a simple yet powerful
                  vision — to make hotel discovery and booking effortless,
                  transparent, and enjoyable for travelers everywhere. What
                  started as a small idea born from personal travel frustrations
                  quickly grew into a platform trusted by thousands of users
                  every month. Over the years, we’ve partnered with top hotels,
                  refined our technology, and built a passionate team dedicated
                  to delivering seamless travel experiences. Every booking we
                  facilitate is a step towards our mission.
                </p>
                <div className="about-self-info">
                  <h4 className="about-self-name">Imran Ahmed</h4>
                  <p className="about-self-title">Founder of Travel Region</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="why-we-exist-section section-space-tb">
        <div className="container">
          <h2 className="about-us-section-title">Why We Exist</h2>
          <div className="why-exist-cards">
            <div className="why-exist-card">
              <div className="why-exist-icon">
                <Image
                  src={WatchIcon}
                  width={32}
                  height={32}
                  alt="watch icon"
                />
              </div>
              <h3 className="why-exist-title">Mission</h3>
              <p className="why-exist-description">
                To make hotel booking effortless, transparent, and trustworthy
                for all travelers.
              </p>
            </div>
            <div className="why-exist-card vision-card">
              <div className="why-exist-icon">
                <Image
                  src={VisionIcon}
                  width={32}
                  height={32}
                  alt="vision icon"
                />
              </div>
              <h3 className="why-exist-title">Vision</h3>
              <p className="why-exist-description">
                To become the go-to platform for booking authentic and tailored
                stays.
              </p>
            </div>

            <div className="why-exist-card mission-card">
              <div className="why-exist-icon">
                <Image
                  src={MissionIcon}
                  width={32}
                  height={32}
                  alt="mission icon"
                />
              </div>
              <h3 className="why-exist-title">Mission</h3>
              <p className="why-exist-description">
                Real reviews, real photos, real peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="hotel-partner-section section-space-tb">
        <div className="container">
          <h2 className="about-us-section-title">Our Hotel Partners</h2>
          <div className="hotel-partner-cards">
            <div className="hotel-partner-card">
              <Image
                src={PartnerLogo1}
                width={104}
                height={40}
                alt="hotel partner icon"
              />
            </div>
            <div className="hotel-partner-card">
              <Image
                src={PartnerLogo2}
                width={120}
                height={40}
                alt="hotel partner icon"
              />
            </div>
            <div className="hotel-partner-card">
              <Image
                src={PartnerLogo3}
                width={114}
                height={40}
                alt="hotel partner icon"
              />
            </div>
            <div className="hotel-partner-card">
              <Image
                src={PartnerLogo4}
                width={119}
                height={40}
                alt="hotel partner icon"
              />
            </div>
            <div className="hotel-partner-card">
              <Image
                src={PartnerLogo5}
                width={101}
                height={40}
                alt="hotel partner icon"
              />
            </div>
            <div className="hotel-partner-card">
              <Image
                src={PartnerLogo6}
                width={77}
                height={40}
                alt="hotel partner icon"
              />
            </div>
            <div className="hotel-partner-card">
              <Image
                src={PartnerLogo7}
                width={61}
                height={40}
                alt="hotel partner icon"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
