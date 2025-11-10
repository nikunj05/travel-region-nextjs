"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18/navigation";
import { useTransition } from "react";
import hamburgerMenuIcon from "@/assets/images/hamburger-menu-icon.svg";
import travelRegionsLogo from "@/assets/images/travel-regions-logo.svg";
import UserImage from "@/assets/images/user-image.png";
import closeBtnIcon from "@/assets/images/close-btn-icon.svg";
// import englishFlagIcon from "@/assets/images/english-flag-icon.svg";
// import arabicFlagIcon from "@/assets/images/united-arab-emirates-svgrepo-com.svg";
import Link from "next/link";
import { useSettingsStore } from "@/store/settingsStore";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const t = useTranslations("Header");
  const [isSticky, setIsSticky] = useState(true);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  // Language switching logic
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
    setIsLanguageMenuOpen(false);
  };

  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleSignupClick = () => {
    router.push("/register");
  };

  useEffect(() => {
    setIsSticky(true);
    // const checkHeaderSticky = () => {
    //   // On search-result path: always sticky
    //   if (
    //     pathname.startsWith("/search-result") ||
    //     pathname.startsWith("/hotel-details") ||
    //     // pathname === "/blogs" ||
    //     pathname.startsWith("/booking-review")||
    //     pathname.startsWith("/checkout") ||
    //     pathname.startsWith("/booking-confirmation") ||
    //     pathname.startsWith("/blogs/") ||
    //     // pathname.startsWith("/privacy-policy") ||
    //     // pathname.startsWith("/terms-conditions") ||
    //     // private routes are below
    //     pathname.startsWith("/profile") ||
    //     pathname.startsWith("/bookings") ||
    //     pathname.startsWith("/favorites") ||
    //     pathname.startsWith("/payment-methods") ||
    //     pathname.startsWith("/notification") ||
    //     pathname.startsWith("/settings") ||
    //     pathname.startsWith("/support")
    //   ) {
    //     setIsSticky(true);
    //   }
    //   // On other paths: sticky only on scroll
    //   else if (typeof window !== "undefined" && window.scrollY > 5) {
    //     setIsSticky(true);
    //   } else {
    //     setIsSticky(false);
    //   }
    // };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".header-language-dropdown")) {
        setIsLanguageMenuOpen(false);
      }
      if (!target.closest(".profile-dropdown")) {
        setIsProfileMenuOpen(false);
      }
    };

    // Check on mount
    // checkHeaderSticky();

    // Add event listeners only on client side
    // if (typeof window !== "undefined") {
    //   window.addEventListener("scroll", checkHeaderSticky);
    //   document.addEventListener("click", handleClickOutside);

    //   // Cleanup event listeners on unmount
    //   return () => {
    //     window.removeEventListener("scroll", checkHeaderSticky);
    //     document.removeEventListener("click", handleClickOutside);
    //   };
    // }
  }, [pathname]);

  // Handle mobile menu body class toggle
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isMobileMenuOpen) {
        document.body.classList.add("mobile_menu_open");
      } else {
        document.body.classList.remove("mobile_menu_open");
      }

      // Cleanup on unmount
      return () => {
        document.body.classList.remove("mobile_menu_open");
      };
    }
  }, [isMobileMenuOpen]);

  const dynamicLogo = useSettingsStore((s) => s.setting?.logo);
  // console.log("==> dynamicLogo", useSettingsStore((s) => s.setting))
  const { isAuthenticated, logout, user } = useAuth();

  // Use dynamic profile image or fallback to static image
  const profileImage = user?.profile_image_url || UserImage;

  return (
    <header
      id="siteHeader"
      className={`header header_sticky ${isSticky ? "header_sticky" : ""}`}
    >
      <div className="container">
        <nav className="navbar navbar-expand-lg justify-content-between align-items-center py-0">
          <button
            className="navbar-toggler d-lg-none p-0 border-0 collapsed"
            type="button"
            onClick={toggleMobileMenu}
            aria-controls="navbarSupportedContent"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation"
          >
            <Image
              src={hamburgerMenuIcon}
              width="24"
              height="24"
              alt="hamburger icon"
              className="hamburger-icon"
            />
          </button>
          <Link className="navbar-brand p-0 m-0" href="/">
            {dynamicLogo ? (
              <>
                <Image src={dynamicLogo} alt="logo" width={205} height={35} />
              </>
            ) : (
              <Image
                src={travelRegionsLogo}
                alt="logo"
                width={205}
                height={35}
              />
            )}
          </Link>
          <div
            className="navbar-collapse mobile_side_menu navigation-barmenu justify-content-center"
            id="navbarSupportedContent"
          >
            <button
              className="navbar-toggler mobile-menu-close-button d-lg-none p-0 border-0"
              type="button"
              onClick={closeMobileMenu}
              aria-controls="navbarSupportedContent"
              aria-expanded="true"
              aria-label="Close menu"
            >
              <Image
                src={closeBtnIcon}
                width="24"
                height="24"
                alt="close icon"
                className="hamburger-icon"
              />
            </button>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" href="/" onClick={closeMobileMenu}>
                  {t("home")}
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link
                  className="nav-link"
                  href="/deals&offers"
                  onClick={closeMobileMenu}
                >
                  {" "}
                  {t("dealsAndOffers")}
                </Link>
              </li> */}
              {isAuthenticated && (
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    href="/bookings"
                    onClick={closeMobileMenu}
                  >
                    My Bookings
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href="/blogs"
                  onClick={closeMobileMenu}
                >
                  {t("blog")}
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link"
                  href="/faqs"
                  onClick={closeMobileMenu}
                >
                  {t("faqs")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href="/about-us"
                  onClick={closeMobileMenu}
                >
                  {t("aboutUs")}
                </Link>
              </li>
            </ul>
            {!isAuthenticated && (
              <div className="header-button-box d-flex d-lg-none align-items-center ">
                <button
                  className="button login-btn sign-up-btn d-flex align-items-center"
                  onClick={() => {
                    handleSignupClick();
                    closeMobileMenu();
                  }}
                >
                  {t("signUp")}
                </button>
                <button
                  className="button login-btn d-flex align-items-center"
                  onClick={() => {
                    handleLoginClick();
                    closeMobileMenu();
                  }}
                >
                  {t("logIn")}
                </button>
              </div>
            )}
            {isAuthenticated && (
              <div className="header-button-box d-flex d-lg-none align-items-center ">
                <button
                  className="button login-btn d-flex align-items-center"
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                >
                  {t("logout")}
                </button>
              </div>
            )}
          </div>
          <div className="profile-language-box d-flex align-items-center">
            <div
              className={`header-language-dropdown ${
                isLanguageMenuOpen ? "open" : ""
              }`}
            >
              <button
                className="language-btn"
                onClick={toggleLanguageMenu}
                disabled={isPending}
              >
                {/* <Image
                  src={locale === "ar" ? arabicFlagIcon : englishFlagIcon}
                  width="36"
                  height="24"
                  alt={locale === "ar" ? "AR" : "EN"}
                  className="flag-icon"
                /> */}
                <span className="lang-text">
                  {locale === "ar" ? "AR" : "EN"}
                </span>
                <svg
                  className="language-arrow-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.66797 6.33352L8.00133 9.66683L11.3346 6.3335"
                    stroke="white"
                    strokeWidth="0.833333"
                    strokeMiterlimit="16"
                  />
                </svg>
              </button>

              <ul className="language-menu">
                <li
                  data-lang="en"
                  onClick={() => handleLanguageChange("en")}
                  style={{ cursor: "pointer" }}
                >
                  {/* <Image
                    src={englishFlagIcon}
                    width="36"
                    height="24"
                    alt="EN"
                    className="flag"
                  />{" "} */}
                  EN
                </li>
                <li
                  data-lang="ar"
                  onClick={() => handleLanguageChange("ar")}
                  style={{ cursor: "pointer" }}
                >
                  {/* <Image
                    src={arabicFlagIcon}
                    width="36"
                    height="24"
                    alt="AR"
                    className="flag"
                  />{" "} */}
                  AR
                </li>
              </ul>
            </div>

            {isAuthenticated && (
              <div className="user-login-box">
                <div
                  className={`profile-dropdown ${
                    isProfileMenuOpen ? "open" : ""
                  }`}
                >
                  <button
                    className="profile-button"
                    onClick={toggleProfileMenu}
                  >
                    <Image
                      src={profileImage}
                      width="42"
                      height="42"
                      alt="user image"
                      className="profile-avatar"
                    />
                    <span className="profile-arrow">
                      <svg
                        className="language-arrow-icon"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.66797 6.33352L8.00133 9.66683L11.3346 6.3335"
                          stroke="white"
                          strokeWidth="0.833333"
                          strokeMiterlimit="16"
                        />
                      </svg>
                    </span>
                  </button>

                  <div className="profile-menu">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      {t("myProfile")}
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      {t("settings")}
                    </Link>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      {t("logout")}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {!isAuthenticated && (
              <div className="header-button-box align-items-center d-none d-lg-flex">
                <button
                  className="button login-btn sign-up-btn d-flex align-items-center"
                  onClick={handleSignupClick}
                >
                  {t("signUp")}
                </button>
                <button
                  className="button login-btn d-flex align-items-center"
                  onClick={handleLoginClick}
                >
                  {t("logIn")}
                </button>
              </div>
            )}
          </div>
        </nav>
        <div className="mobile-overlay" onClick={closeMobileMenu}></div>
      </div>
    </header>
  );
};

export default Header;
