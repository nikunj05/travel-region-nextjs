'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18/navigation'
import { useTransition } from 'react'
import hamburgerMenuIcon from '@/assets/images/hamburger-menu-icon.svg'
import travelRegionsLogo from '@/assets/images/travel-regions-logo.svg'
import closeBtnIcon from '@/assets/images/close-btn-icon.svg'
import englishFlagIcon from '@/assets/images/english-flag-icon.svg'
import arabicFlagIcon from '@/assets/images/arabic-flag-icon.svg'
import Link from 'next/link'

const Header = () => {
  const [isSticky, setIsSticky] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  
  // Language switching logic
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale })
    })
    setIsLanguageMenuOpen(false)
  }

  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen)
  }

  const handleLoginClick = () => {
    router.push('/login')
  }

  const handleSignupClick = () => {
    router.push('/register')
  }

  useEffect(() => {
    const checkHeaderSticky = () => {
      if (window.scrollY > 5) {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.header-language-dropdown')) {
        setIsLanguageMenuOpen(false)
      }
    }

    // Check on mount
    checkHeaderSticky()

    // Add event listeners
    window.addEventListener('scroll', checkHeaderSticky)
    document.addEventListener('click', handleClickOutside)

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('scroll', checkHeaderSticky)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <header id="siteHeader" className={`header ${isSticky ? 'header_sticky' : ''}`}>
    <div className="container">
      <nav className="navbar navbar-expand-lg justify-content-between align-items-center py-0">
        <button className="navbar-toggler d-lg-none p-0 border-0 collapsed" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
          aria-label="Toggle navigation">
          <Image src={hamburgerMenuIcon} width="24" height="24" alt="hamburger icon"
            className="hamburger-icon" />
        </button>
        <a className="navbar-brand p-0 m-0" href="/">
          <Image src={travelRegionsLogo} alt="logo" width="205" height="35" />
        </a>
        <div className="collapse navbar-collapse mobile_side_menu navigation-barmenu justify-content-center"
          id="navbarSupportedContent">
          <button className="navbar-toggler mobile-menu-close-button d-lg-none p-0 border-0" type="button"
            data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
            aria-expanded="true" aria-label="Close menu">
            <Image src={closeBtnIcon} width="24" height="24" alt="hamburger icon"
              className="hamburger-icon" />
          </button>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" href="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/deals&offers"> Deals & Offers</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/blogs">Blog</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/faqs">FAQs</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/about-us">About Us</Link>
            </li>
          </ul>
          <div className="header-button-box d-flex d-lg-none align-items-center ">
            <button className="button login-btn sign-up-btn d-flex align-items-center" onClick={handleSignupClick}>
              Sign up
            </button>
            <button className="button login-btn d-flex align-items-center" onClick={handleLoginClick}>
              Log In
            </button>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <div className={`header-language-dropdown ${isLanguageMenuOpen ? 'open' : ''}`}>
            <button 
              className="language-btn" 
              onClick={toggleLanguageMenu}
              disabled={isPending}
            >
              <Image 
                src={locale === 'ar' ? arabicFlagIcon : englishFlagIcon} 
                width="36" 
                height="24" 
                alt={locale === 'ar' ? 'AR' : 'EN'} 
                className="flag-icon" 
              />
              <span className="lang-text">{locale === 'ar' ? 'AR' : 'EN'}</span>
              <svg className="language-arrow-icon" width="16" height="16" viewBox="0 0 16 16" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M4.66797 6.33352L8.00133 9.66683L11.3346 6.3335" stroke="white" strokeWidth="0.833333"
                  strokeMiterlimit="16" />
              </svg>
            </button>

            <ul className="language-menu">
              <li 
                data-lang="en" 
                onClick={() => handleLanguageChange('en')}
                style={{ cursor: 'pointer' }}
              >
                <Image src={englishFlagIcon} width="36" height="24" alt="EN" className="flag"/> EN
              </li>
              <li 
                data-lang="ar" 
                onClick={() => handleLanguageChange('ar')}
                style={{ cursor: 'pointer' }}
              >
                <Image src={arabicFlagIcon} width="36" height="24" alt="AR" className="flag" /> AR
              </li>
            </ul>
          </div>

          <div className="header-button-box align-items-center d-none d-lg-flex">
            <button className="button login-btn sign-up-btn d-flex align-items-center" onClick={handleSignupClick}>
              Sign up
            </button>
            <button className="button login-btn d-flex align-items-center" onClick={handleLoginClick}>
              Log In
            </button>
          </div>
        </div>
      </nav>
      <div className="mobile-overlay"></div>
    </div>
  </header>
  )
}

export default Header
