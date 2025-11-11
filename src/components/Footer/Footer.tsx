'use client'
import React from 'react'
import Image from 'next/image'
import footerLogoWhite from '@/assets/images/footer-logo-white.png'
import facebookLogo from '@/assets/images/facebook-logo.svg'
import instagramLogo from '@/assets/images/instagram-logo.svg'
import tiktokLogo from '@/assets/images/tiktok-logo.svg'
import xLogo from '@/assets/images/x-logo.svg'
import youtubeLogo from '@/assets/images/youtube-logo.svg'
import masterCard from '@/assets/images/master-card.svg'
import visaCard from '@/assets/images/visa-card.svg'
import americanExpress from '@/assets/images/american-express.svg'
import payPal from '@/assets/images/pay-pal.svg'
import stripe from '@/assets/images/stripe.svg'
import unionPay from '@/assets/images/union-pay.svg'
import { useEffect } from 'react'
import Link from 'next/link'
import { useCmsStore } from '@/store/cmsStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useTranslations } from 'next-intl'

const Footer = () => {
  const t = useTranslations("Footer")
  const dynamicFooterLogo = useSettingsStore((s) => s.setting?.footer_logo)
  // const socialMediaLinks = useSettingsStore((s) => s.setting?.social_media_links) || []
  const { pages, fetchPages } = useCmsStore()
  useEffect(() => {
    fetchPages()
  }, [fetchPages])
  return (
        <footer className="page-footer section-space-tb">
    <div className="container">
      <div className="row">
        <div className="col-lg-6">
          <div className="footer-logo-content">
            <Image src={dynamicFooterLogo || footerLogoWhite} width={240} height={44} alt="logo" className="footer-logo" />
            <p className="footer-caption">{t("caption")}</p>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="usefull-link d-grid">
            <div className="quick-link">
              <h4 className="usefull-link-heading">{t("explore")}</h4>
              <ul className="footer-link">
                <li><a href="#">{t("destination")}</a></li>
                <li><a href="#">{t("deals")}</a></li>
                {/* <li><Link href="/blogs">{t("blog")}</Link></li> */}
                <li><a href="#">{t("limitedOffers")}</a></li>
              </ul>
            </div>
            <div className="quick-link">
              <h4 className="usefull-link-heading">{t("about")}</h4>
              <ul className="footer-link">
                {pages
                  .filter(p => ['about-us','privacy-policy','terms-conditions'].includes(p.slug))
                  .map(p => (
                    <li key={p.id}>
                      <Link href={`/${p.slug}`}>{p.title}</Link>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="quick-link">
              <h4 className="usefull-link-heading">{t("support")}</h4>
              <ul className="footer-link">
                <li><a href="#">{t("helpCenter")}</a></li>
                <li><Link href="/faqs">{t("faqs")}</Link></li>
                <li><a href="#">{t("contactUs")}</a></li>
                <li><a href="#">{t("bookingPolicy")}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="social-media-payment d-flex">
        <div className="social-media-items">
          <h4 className="social-media-payment-title">{t("connectWithUs")}</h4>
          <ul className="footer-social-media">
            <li>
              <a href="#">
                <Image src={facebookLogo} width={40} height={40} alt="facebook"
                  className="footer-social-media-logo" />
              </a>
            </li>
            <li>
              <a href="#">
                <Image src={instagramLogo} width={40} height={40} alt="instagram"
                  className="footer-social-media-logo" />
              </a>
            </li>
            <li>
              <a href="#">
                <Image src={tiktokLogo} width={40} height={40} alt="tiktok"
                  className="footer-social-media-logo" />
              </a>
            </li>
            <li>
              <a href="#">
                <Image src={xLogo} width={40} height={40} alt="x" className="footer-social-media-logo" />
              </a>
            </li>
            <li>                  
              <a href="#">
                <Image src={youtubeLogo} width={40} height={40} alt="youtube"
                  className="footer-social-media-logo" />
              </a>
            </li>
          </ul>

          {/* {socialMediaLinks.map((socialLink, index) => (
              <li key={index}>
                <a href={socialLink.link} target="_blank" rel="noopener noreferrer">
                  {socialLink.icon ? (
                    <Image 
                      src={socialLink.icon} 
                      width={40} 
                      height={40} 
                      alt={socialLink.title}
                      className="footer-social-media-logo" 
                    />
                  ) : (
                    <span className="footer-social-media-text">{socialLink.title}</span>
                  )}
                </a>
              </li>
            ))} */}
        </div>
        <div className="social-media-items payment-security">
          <h4 className="social-media-payment-title">{t("paymentSecurity")}</h4>
          <ul className="footer-social-media">
            <li>
              <Image src={masterCard} width={40} height={40} alt="master card"
                className="footer-payment-logo" />
            </li>
            <li>
              <Image src={visaCard} width={40} height={40} alt="visa card"
                className="footer-payment-logo" />
            </li>
            <li>
              <Image src={americanExpress} width={40} height={40} alt="american express"
                className="footer-payment-logo" />
            </li>
            <li>
              <Image src={payPal} width={40} height={40} alt="pay pal" className="footer-payment-logo" />
            </li>
            <li>
              <Image src={stripe} width={40} height={40} alt="stripe" className="footer-payment-logo" />
            </li>
            <li>
              <Image src={unionPay} width={40} height={40} alt="union pay"
                className="footer-payment-logo" />
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-copy-right">
        <div className="row">
          <div className="col-md-6 text-start d-flex align-items-center">
            <p className="copy-right-text">{t("copyRight")}</p>
          </div>
          <div className="col-md-6 text-end">
            <div className="copy-right-links">
              <Link href="/privacy-policy">{t("privacyPolicy")}</Link>
              <span className="separator"></span>
              <Link href="/terms-conditions">{t("termsConditions")}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
  )
}

export default Footer
