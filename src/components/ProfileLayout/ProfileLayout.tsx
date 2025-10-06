"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18/navigation";
import Image from "next/image";
import styles from "./ProfileLayout.module.scss";
import hamburgerMenuIcon from "@/assets/images/hamburger-menu-icon.svg";
import closeBtnIcon from "@/assets/images/close-btn-icon.svg";

interface ProfileLayoutProps {
  children: ReactNode;
}

const ProfileLayout = ({ children }: ProfileLayoutProps) => {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  // Handle mobile sidebar body class toggle
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isMobileSidebarOpen) {
        document.body.classList.add("profile_mobile_sidebar_open");
      } else {
        document.body.classList.remove("profile_mobile_sidebar_open");
      }

      // Cleanup on unmount
      return () => {
        document.body.classList.remove("profile_mobile_sidebar_open");
      };
    }
  }, [isMobileSidebarOpen]);

  const menuItems = [
    {
      id: "bookings",
      label: "Bookings",
      href: "/bookings",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.66667 1.66669V4.16669M13.3333 1.66669V4.16669M2.5 7.50002H17.5M4.16667 3.33335H15.8333C16.7538 3.33335 17.5 4.07955 17.5 5.00002V16.6667C17.5 17.5872 16.7538 18.3334 15.8333 18.3334H4.16667C3.24619 18.3334 2.5 17.5872 2.5 16.6667V5.00002C2.5 4.07955 3.24619 3.33335 4.16667 3.33335Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "favorites",
      label: "Favorites",
      href: "/favorites",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 17.5L3.33333 10.8333C1.66667 9.16667 1.66667 6.66667 3.33333 5C5 3.33333 7.5 3.33333 9.16667 5L10 5.83333L10.8333 5C12.5 3.33333 15 3.33333 16.6667 5C18.3333 6.66667 18.3333 9.16667 16.6667 10.8333L10 17.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      href: "/profile",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 10C12.0711 10 13.75 8.32107 13.75 6.25C13.75 4.17893 12.0711 2.5 10 2.5C7.92893 2.5 6.25 4.17893 6.25 6.25C6.25 8.32107 7.92893 10 10 10Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.75 17.5C3.75 14.0482 6.54822 11.25 10 11.25C13.4518 11.25 16.25 14.0482 16.25 17.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "payment-methods",
      label: "Payment Methods",
      href: "/payment-methods",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.5 7.5H17.5M4.16667 3.33331H15.8333C16.7538 3.33331 17.5 4.07951 17.5 4.99998V15C17.5 15.9205 16.7538 16.6666 15.8333 16.6666H4.16667C3.24619 16.6666 2.5 15.9205 2.5 15V4.99998C2.5 4.07951 3.24619 3.33331 4.16667 3.33331Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "notification",
      label: "Notification",
      href: "/notification",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 6.66669C15 5.34061 14.4732 4.06883 13.5355 3.13115C12.5979 2.19347 11.3261 1.66669 10 1.66669C8.67392 1.66669 7.40215 2.19347 6.46447 3.13115C5.52678 4.06883 5 5.34061 5 6.66669C5 12.5 2.5 14.1667 2.5 14.1667H17.5C17.5 14.1667 15 12.5 15 6.66669Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.4417 17.5C11.2952 17.7526 11.0849 17.9622 10.8319 18.1079C10.5789 18.2537 10.292 18.3304 10 18.3304C9.70802 18.3304 9.42113 18.2537 9.16814 18.1079C8.91515 17.9622 8.70484 17.7526 8.55835 17.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      href: "/settings",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.1667 12.5C16.0557 12.7513 16.0226 13.0301 16.0717 13.3006C16.1209 13.5711 16.2501 13.8205 16.4417 14.0167L16.4917 14.0667C16.6465 14.2212 16.7692 14.4052 16.8527 14.608C16.9362 14.8107 16.9788 15.028 16.9788 15.2475C16.9788 15.467 16.9362 15.6843 16.8527 15.887C16.7692 16.0898 16.6465 16.2738 16.4917 16.4283C16.3372 16.5831 16.1532 16.7058 15.9504 16.7893C15.7477 16.8728 15.5304 16.9154 15.3109 16.9154C15.0914 16.9154 14.8741 16.8728 14.6713 16.7893C14.4686 16.7058 14.2846 16.5831 14.1301 16.4283L14.0801 16.3783C13.8838 16.1867 13.6345 16.0575 13.364 16.0084C13.0935 15.9592 12.8147 15.9923 12.5634 16.1033C12.3165 16.2095 12.1065 16.3869 11.9602 16.6132C11.8139 16.8395 11.7375 17.1051 11.7401 17.3758V17.5C11.7401 17.9421 11.5644 18.3659 11.2518 18.6785C10.9392 18.9911 10.5154 19.1667 10.0734 19.1667C9.63135 19.1667 9.20755 18.9911 8.89498 18.6785C8.58242 18.3659 8.40677 17.9421 8.40677 17.5V17.425C8.39885 17.1464 8.31244 16.8751 8.15701 16.6433C8.00158 16.4114 7.78347 16.2284 7.52844 16.1158C7.27714 16.0048 6.99834 15.9717 6.72783 16.0208C6.45732 16.07 6.20803 16.1992 6.01177 16.3908L5.96177 16.4408C5.80726 16.5956 5.62325 16.7183 5.42051 16.8018C5.21777 16.8853 5.00046 16.9279 4.78094 16.9279C4.56141 16.9279 4.34411 16.8853 4.14137 16.8018C3.93862 16.7183 3.75461 16.5956 3.6001 16.4408C3.44535 16.2863 3.32261 16.1023 3.23914 15.8996C3.15566 15.6968 3.11304 15.4795 3.11304 15.26C3.11304 15.0405 3.15566 14.8232 3.23914 14.6204C3.32261 14.4177 3.44535 14.2337 3.6001 14.0792L3.6501 14.0292C3.84173 13.8329 3.97088 13.5836 4.02004 13.3131C4.06919 13.0426 4.03608 12.7638 3.9251 12.5125C3.81889 12.2656 3.6415 12.0556 3.41517 11.9093C3.18885 11.763 2.92329 11.6866 2.6526 11.6892H2.5001C2.05806 11.6892 1.63427 11.5135 1.3217 11.2009C1.00913 10.8884 0.833496 10.4646 0.833496 10.0225C0.833496 9.58045 1.00913 9.15666 1.3217 8.84409C1.63427 8.53152 2.05806 8.35588 2.5001 8.35588H2.5751C2.85367 8.34796 3.125 8.26155 3.35684 8.10612C3.58869 7.95069 3.77174 7.73258 3.88427 7.47755C3.99525 7.22625 4.02836 6.94745 3.9792 6.67694C3.93005 6.40643 3.8009 6.15714 3.60927 5.96088L3.55927 5.91088C3.40452 5.75637 3.28178 5.57236 3.1983 5.36962C3.11483 5.16687 3.07221 4.94957 3.07221 4.73005C3.07221 4.51052 3.11483 4.29322 3.1983 4.09048C3.28178 3.88773 3.40452 3.70372 3.55927 3.54921C3.71378 3.39447 3.89779 3.27173 4.10053 3.18825C4.30327 3.10478 4.52058 3.06216 4.7401 3.06216C4.95963 3.06216 5.17693 3.10478 5.37968 3.18825C5.58242 3.27173 5.76643 3.39447 5.92094 3.54921L5.97094 3.59921C6.1672 3.79084 6.41649 3.92 6.687 3.96915C6.95751 4.0183 7.2363 3.98519 7.4876 3.87421H7.5376C7.78455 3.768 7.99452 3.59062 8.14082 3.36429C8.28713 3.13797 8.36354 2.8724 8.36094 2.60171V2.44921C8.36094 2.00717 8.53657 1.58338 8.84914 1.27081C9.16171 0.958241 9.5855 0.782608 10.0276 0.782608C10.4696 0.782608 10.8934 0.958241 11.206 1.27081C11.5185 1.58338 11.6942 2.00717 11.6942 2.44921V2.52421C11.6916 2.7949 11.768 3.06047 11.9143 3.28679C12.0606 3.51312 12.2706 3.6905 12.5176 3.79671C12.7689 3.90769 13.0477 3.9408 13.3182 3.89165C13.5887 3.8425 13.838 3.71335 14.0342 3.52171L14.0842 3.47171C14.2388 3.31697 14.4228 3.19423 14.6255 3.11075C14.8283 3.02728 15.0456 2.98466 15.2651 2.98466C15.4846 2.98466 15.7019 3.02728 15.9047 3.11075C16.1074 3.19423 16.2914 3.31697 16.446 3.47171C16.6007 3.62623 16.7234 3.81024 16.8069 4.01298C16.8904 4.21572 16.933 4.43303 16.933 4.65255C16.933 4.87207 16.8904 5.08938 16.8069 5.29212C16.7234 5.49486 16.6007 5.67887 16.446 5.83338L16.396 5.88338C16.2043 6.07964 16.0752 6.32893 16.026 6.59944C15.9769 6.86995 16.01 7.14874 16.121 7.40005C16.2272 7.64699 16.4046 7.85697 16.6309 8.00327C16.8572 8.14957 17.1228 8.22599 17.3935 8.22338H17.546C17.988 8.22338 18.4118 8.39902 18.7244 8.71159C19.0369 9.02416 19.2126 9.44795 19.2126 9.88999C19.2126 10.332 19.0369 10.7558 18.7244 11.0684C18.4118 11.381 17.988 11.5566 17.546 11.5566H17.471C17.2003 11.5592 16.9347 11.6357 16.7084 11.782C16.4821 11.9283 16.3047 12.1383 16.1985 12.3852V12.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "support",
      label: "Support & Help Center",
      href: "/support",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 18.3334C14.6024 18.3334 18.3333 14.6024 18.3333 10C18.3333 5.39765 14.6024 1.66669 10 1.66669C5.39763 1.66669 1.66667 5.39765 1.66667 10C1.66667 14.6024 5.39763 18.3334 10 18.3334Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 13.3334V10M10 6.66669H10.0083"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className={`${styles.profileLayout} padding-top-100 section-space-b`}>
      <div className="container">
        <div className={styles.layoutWrapper}>
          {/* Mobile Hamburger Button */}
          <button
            className={styles.mobileMenuToggle}
            type="button"
            onClick={toggleMobileSidebar}
            aria-label="Toggle sidebar menu"
          >
            <Image
              src={hamburgerMenuIcon}
              width="24"
              height="24"
              alt="hamburger icon"
              className={styles.hamburgerIcon}
            />
          </button>

          {/* Sidebar */}
          <aside
            className={`${styles.sidebar} ${
              isMobileSidebarOpen ? styles.sidebarOpen : ""
            }`}
          >
            {/* Mobile Close Button */}
            <button
              className={styles.mobileCloseButton}
              type="button"
              onClick={closeMobileSidebar}
              aria-label="Close sidebar menu"
            >
              <Image
                src={closeBtnIcon}
                width="24"
                height="24"
                alt="close icon"
                className={styles.closeIcon}
              />
            </button>

            <div className={styles.sidebarHeader}>
              <h2>Menu Items</h2>
            </div>
            <nav className={styles.sidebarNav}>
              <ul>
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`${styles.navLink} ${
                        isActive(item.href) ? styles.active : ""
                      }`}
                      onClick={closeMobileSidebar}
                    >
                      <span className={styles.icon}>{item.icon}</span>
                      <span className={styles.label}>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Mobile Overlay */}
          <div
            className={`${styles.mobileOverlay} ${
              isMobileSidebarOpen ? styles.overlayOpen : ""
            }`}
            onClick={closeMobileSidebar}
          ></div>

          {/* Main Content */}
          <main className={styles.mainContent}>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
