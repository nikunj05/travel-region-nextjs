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
import HighlightsIcon1 from "@/assets/images/bookings-completed-icon.svg";
import HighlightsIcon2 from "@/assets/images/customer-satisfaction-icon.svg";
import HighlightsIcon3 from "@/assets/images/verified-hotels-icon.svg";
import HighlightsIcon4 from "@/assets/images/supports-icon.svg";
import Travelers from "../LandingPage/Travelers";

interface AboutUsProps {
  page: CmsPageItem;
}

export default function AboutUs({ page }: AboutUsProps) {

  console.log(page)

  // Parse the dynamic content from page.content
  const parseContent = (content: string) => {
    // Extract title (first h2)
    const titleMatch = content.match(/<h2>(.*?)<\/h2>/);
    const title = titleMatch ? titleMatch[1] : "Our Story – How It All Started";

    // Extract description (first p tag content before <br><br><strong>)
    const descriptionMatch = content.match(/<p>([\s\S]*?)<br><br><strong>/);
    const description = descriptionMatch 
      ? descriptionMatch[1].replace(/<br>/g, '').trim()
      : "Founded in 2015, our journey began with a simple yet powerful vision — to make hotel discovery and booking effortless, transparent, and enjoyable for travelers everywhere. What started as a small idea born from personal travel frustrations quickly grew into a platform trusted by thousands of users every month. Over the years, we've partnered with top hotels, refined our technology, and built a passionate team dedicated to delivering seamless travel experiences. Every booking we facilitate is a step towards our mission.";

    // Extract founder name and title
    const founderMatch = content.match(/<strong>(.*?)<\/strong><br>([\s\S]*?)<\/p>/);
    const founderName = founderMatch ? founderMatch[1] : "Imran Ahmed";
    const founderTitle = founderMatch ? founderMatch[2] : "Founder of Travel Region";

    return { title, description, founderName, founderTitle };
  };

  const dynamicContent = page.content ? parseContent(page.content) : {
    title: "Our Story – How It All Started",
    description: "Founded in 2015, our journey began with a simple yet powerful vision — to make hotel discovery and booking effortless, transparent, and enjoyable for travelers everywhere. What started as a small idea born from personal travel frustrations quickly grew into a platform trusted by thousands of users every month. Over the years, we've partnered with top hotels, refined our technology, and built a passionate team dedicated to delivering seamless travel experiences. Every booking we facilitate is a step towards our mission.",
    founderName: "Imran Ahmed",
    founderTitle: "Founder of Travel Region"
  };
  return (
    
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
                  src={page.founder_image_url ||   OurStoryimage}
                  width={387}
                  height={463}
                  alt="about image"
                />
              </div>
            </div>
            <div className="col-md-7">
              <div className="about-our-story-content">
                <h2 className="about-us-section-title">
                  {dynamicContent.title}
                </h2>
                <p className="about-our-story-description">
                  {dynamicContent.description}
                </p>
                <div className="about-self-info">
                  <h4 className="about-self-name">{dynamicContent.founderName}</h4>
                  <p className="about-self-title">{dynamicContent.founderTitle}</p>
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
            {page.why_we_exist && page.why_we_exist.length > 0 ? (
              page.why_we_exist.map((item, idx) => {
                // Default icons array for fallback
                const defaultIcons = [WatchIcon, VisionIcon, MissionIcon];
                const defaultAltTexts = ["watch icon", "vision icon", "mission icon"];
                const defaultCardClasses = ["", "vision-card", "mission-card"];
                
                return (
                  <div key={idx} className={`why-exist-card ${defaultCardClasses[idx] || ""}`}>
                    <div className="why-exist-icon">
                      <Image
                        src={item.icon_url || defaultIcons[idx] || WatchIcon}
                        width={32}
                        height={32}
                        alt={item.title?.toLowerCase() + " icon" || defaultAltTexts[idx] || "icon"}
                      />
                    </div>
                    <h3 className="why-exist-title">{item.title || "Title"}</h3>
                    <p className="why-exist-description">
                      {item.description || "Description"}
                    </p>
                  </div>
                );
              })
            ) : (
              // Fallback static content
              <>
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
              </>
            )}
          </div>
        </div>
      </section>
      <section className="hotel-partner-section section-space-tb">
        <div className="container">
          <h2 className="about-us-section-title">Our Hotel Partners</h2>
          <div className="hotel-partner-cards">
            {page.our_partners && page.our_partners.length > 0 ? (
              page.our_partners.map((partnerUrl, idx) => {
                // Default partner logos array for fallback
                const defaultPartners = [PartnerLogo1, PartnerLogo2, PartnerLogo3, PartnerLogo4, PartnerLogo5, PartnerLogo6, PartnerLogo7];
                const defaultWidths = [104, 120, 114, 119, 101, 77, 61];
                
                return (
                  <div key={idx} className="hotel-partner-card">
                    <Image
                      src={partnerUrl || defaultPartners[idx] || PartnerLogo1}
                      width={defaultWidths[idx] || 104}
                      height={40}
                      alt={`hotel partner ${idx + 1} icon`}
                    />
                  </div>
                );
              })
            ) : (
              // Fallback static content
              <>
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
              </>
            )}
          </div>
        </div>
      </section>
      <section className="few-highlights-section section-space-tb">
        <div className="container">
          <h2 className="about-us-section-title">A Few Highlights</h2>
          <div className="few-highlights-cards">
            {page.few_highlights && page.few_highlights.length > 0 ? (
              page.few_highlights.map((item, idx) => {
                // Default icons array for fallback
                const defaultIcons = [HighlightsIcon1, HighlightsIcon2, HighlightsIcon3, HighlightsIcon4];
                const defaultAltTexts = ["Bookings Completed Icon", "Customer Satisfaction Icon", "Verified Hotels Icon", "Support Icon"];
                const defaultCardClasses = ["red-highlight-card", "blue-highlight-card", "yellow-highlight-card", "violet-highlight-card"];
                
                return (
                  <div key={idx} className={`few-highlights-card ${defaultCardClasses[idx] || "red-highlight-card"}`}>
                    <div className="few-highlights-icon">
                      <Image
                        src={item.icon_url || defaultIcons[idx] || HighlightsIcon1}
                        width={64}
                        height={64}
                        alt={item.title?.toLowerCase() + " icon" || defaultAltTexts[idx] || "highlight icon"}
                      />
                    </div>
                    <h3 className="few-highlights-title">{item.title || "Title"}</h3>
                    <p className="few-highlights-description">
                      {item.description || "Description"}
                    </p>
                  </div>
                );
              })
            ) : (
              // Fallback static content
              <>
                <div className="few-highlights-card red-highlight-card">
                  <div className="few-highlights-icon">
                    <Image
                      src={HighlightsIcon1}
                      width={64}
                      height={64}
                      alt="Bookings Completed Icon"
                    />
                  </div>
                  <h3 className="few-highlights-title">200k+</h3>
                  <p className="few-highlights-description">Bookings Completed</p>
                </div>
                <div className="few-highlights-card blue-highlight-card">
                  <div className="few-highlights-icon">
                    <Image
                      src={HighlightsIcon2}
                      width={64}
                      height={64}
                      alt="Customer Satisfaction Icon"
                    />
                  </div>
                  <h3 className="few-highlights-title">98%</h3>
                  <p className="few-highlights-description">
                    Customer Satisfaction
                  </p>
                </div>
                <div className="few-highlights-card yellow-highlight-card">
                  <div className="few-highlights-icon">
                    <Image
                      src={HighlightsIcon3}
                      width={64}
                      height={64}
                      alt="hotels Icon"
                    />
                  </div>
                  <h3 className="few-highlights-title">5k+</h3>
                  <p className="few-highlights-description">Verified Hotels</p>
                </div>
                <div className="few-highlights-card violet-highlight-card">
                  <div className="few-highlights-icon">
                    <Image
                      src={HighlightsIcon4}
                      width={64}
                      height={64}
                      alt="support Icon"
                    />
                  </div>
                  <h3 className="few-highlights-title">24/7 Support</h3>
                  <p className="few-highlights-description">Across 3 Continents</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      <section className="about-testimonails-section">
        <div className="testimonials-container">
          <Travelers />
        </div>
      </section>
      <section className="home-contact-section about-ready-to-explore-section section-space-t">
        <div className="container">
          <div className="contact-inner-section">
            <div className="contact-us-content">
              <div className="heading_section">
                <h2 className="section-title"> {page.ready_to_explore_title || "Ready to Explore"}</h2>
                <p className="section-description mx-width-790">
                  {page.ready_to_explore_sub_title || "Have questions or need help? We’re just a message away."}
                </p>
              </div>
              <button className="btn hotel-search-button d-flex align-items-center mx-auto">
                Search Hotel
                <svg
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 17.5L22.5 22"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20.5 11C20.5 6.02944 16.4706 2 11.5 2C6.52944 2 2.5 6.02944 2.5 11C2.5 15.9706 6.52944 20 11.5 20C16.4706 20 20.5 15.9706 20.5 11Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
