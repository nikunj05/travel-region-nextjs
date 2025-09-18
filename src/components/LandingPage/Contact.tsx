import React from 'react'

const Contact = () => {
  return (
    <section className="home-contact-section section-space-tb">
    <div className="container">
      <div className="contact-inner-section">
        <div className="contact-us-content">
          <div className="heading_section">
            <h1 className="section-title">Contact us for help <br/> or information</h1>
            <p className="section-description mx-width-790">"Have questions or need help? We’re just a message away."</p>
          </div>
          <button className="btn hotel-search-button d-flex align-items-center mx-auto">
            Search Hotel
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 17.5L22.5 22" stroke="white" strokeWidth="1.5" strokeLinecap="round"
                strokeLinejoin="round" />
              <path
                d="M20.5 11C20.5 6.02944 16.4706 2 11.5 2C6.52944 2 2.5 6.02944 2.5 11C2.5 15.9706 6.52944 20 11.5 20C16.4706 20 20.5 15.9706 20.5 11Z"
                stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
  )
}

export default Contact
