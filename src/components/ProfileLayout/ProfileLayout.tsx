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
            d="M13.3346 1.66797V5.0013M6.66797 1.66797V5.0013"
            stroke="#71717B"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.8333 3.33203H9.16667C6.02397 3.33203 4.45262 3.33203 3.47631 4.30834C2.5 5.28466 2.5 6.856 2.5 9.9987V11.6654C2.5 14.808 2.5 16.3794 3.47631 17.3557C4.45262 18.332 6.02397 18.332 9.16667 18.332H10.8333C13.976 18.332 15.5474 18.332 16.5237 17.3557C17.5 16.3794 17.5 14.808 17.5 11.6654V9.9987C17.5 6.856 17.5 5.28466 16.5237 4.30834C15.5474 3.33203 13.976 3.33203 10.8333 3.33203Z"
            stroke="#71717B"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2.5 8.33203H17.5"
            stroke="#71717B"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.5 13.75C7.5 13.75 8.75 14.1667 9.16667 15.4167C9.16667 15.4167 10.9804 12.0833 13.3333 11.25"
            stroke="#71717B"
            strokeWidth="1.25"
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
            d="M16.2182 3.32846C13.9834 1.95769 12.033 2.51009 10.8613 3.39001C10.3809 3.7508 10.1407 3.93119 9.99935 3.93119C9.85802 3.93119 9.61781 3.7508 9.13739 3.39001C7.9657 2.51009 6.01525 1.95769 3.78055 3.32846C0.847739 5.12745 0.184116 11.0624 6.94896 16.0695C8.23745 17.0232 8.88169 17.5 9.99935 17.5C11.117 17.5 11.7613 17.0232 13.0497 16.0695C19.8146 11.0624 19.151 5.12745 16.2182 3.32846Z"
            stroke="#71717B"
            strokeWidth="1.5"
            strokeLinecap="round"
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
            d="M5.48131 12.9026C4.30234 13.6046 1.21114 15.0381 3.09388 16.8318C4.01359 17.708 5.03791 18.3346 6.32572 18.3346H13.6743C14.9621 18.3346 15.9864 17.708 16.9061 16.8318C18.7889 15.0381 15.6977 13.6046 14.5187 12.9026C11.754 11.2564 8.24599 11.2564 5.48131 12.9026Z"
            stroke="#71717B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.75 5.41797C13.75 7.48904 12.0711 9.16797 10 9.16797C7.92893 9.16797 6.25 7.48904 6.25 5.41797C6.25 3.3469 7.92893 1.66797 10 1.66797C12.0711 1.66797 13.75 3.3469 13.75 5.41797Z"
            stroke="#71717B"
            strokeWidth="1.5"
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
            d="M1.66602 9.9987C1.66602 7.05079 1.66602 5.57684 2.54335 4.59278C2.68367 4.43539 2.83833 4.28983 3.00556 4.15776C4.05113 3.33203 5.6172 3.33203 8.74935 3.33203H11.2493C14.3815 3.33203 15.9476 3.33203 16.9931 4.15776C17.1604 4.28983 17.315 4.43539 17.4554 4.59278C18.3327 5.57684 18.3327 7.05079 18.3327 9.9987C18.3327 12.9466 18.3327 14.4206 17.4554 15.4046C17.315 15.562 17.1604 15.7076 16.9931 15.8396C15.9476 16.6654 14.3815 16.6654 11.2493 16.6654H8.74935C5.6172 16.6654 4.05113 16.6654 3.00556 15.8396C2.83833 15.7076 2.68367 15.562 2.54335 15.4046C1.66602 14.4206 1.66602 12.9466 1.66602 9.9987Z"
            stroke="#71717B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.33398 13.332H9.58398"
            stroke="#71717B"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.084 13.332L15.0007 13.332"
            stroke="#71717B"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1.66602 7.5H18.3327"
            stroke="#71717B"
            strokeWidth="1.5"
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
            d="M2.10892 12.3093C1.93171 13.471 2.72398 14.2773 3.69403 14.6792C7.41299 16.2198 12.5883 16.2198 16.3073 14.6792C17.2773 14.2773 18.0696 13.471 17.8924 12.3093C17.7835 11.5954 17.245 11.0009 16.846 10.4204C16.3234 9.65069 16.2715 8.81116 16.2714 7.91797C16.2714 4.46619 13.4639 1.66797 10.0007 1.66797C6.53742 1.66797 3.72992 4.46619 3.72992 7.91797C3.72985 8.81116 3.67792 9.65069 3.15532 10.4204C2.75635 11.0009 2.21783 11.5954 2.10892 12.3093Z"
            stroke="#71717B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.66602 15.832C7.04809 17.2697 8.39562 18.332 9.99935 18.332C11.6031 18.332 12.9506 17.2697 13.3327 15.832"
            stroke="#71717B"
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
            d="M17.7652 5.94986L17.3539 5.23603C17.0428 4.69617 16.8873 4.42624 16.6226 4.3186C16.358 4.21096 16.0587 4.2959 15.4601 4.46577L14.4432 4.75218C14.061 4.84031 13.6601 4.79032 13.3111 4.61103L13.0304 4.44905C12.7311 4.25739 12.501 3.97481 12.3736 3.64265L12.0953 2.8115C11.9123 2.26148 11.8208 1.98647 11.603 1.82917C11.3852 1.67188 11.0959 1.67188 10.5172 1.67188L9.58826 1.67188C9.00963 1.67188 8.72032 1.67188 8.5025 1.82917C8.28469 1.98647 8.1932 2.26148 8.01022 2.8115L7.73193 3.64265C7.60452 3.97481 7.37436 4.25739 7.07512 4.44905L6.79439 4.61103C6.44543 4.79032 6.04448 4.84031 5.6623 4.75218L4.64544 4.46577C4.04683 4.2959 3.74752 4.21096 3.48288 4.3186C3.21823 4.42624 3.06269 4.69617 2.75161 5.23603L2.34029 5.94986C2.0487 6.4559 1.9029 6.70892 1.9312 6.97827C1.9595 7.24762 2.15468 7.46468 2.54503 7.8988L3.40424 8.85938C3.61423 9.12524 3.76332 9.58854 3.76332 10.0051C3.76332 10.4219 3.61428 10.8851 3.40426 11.1509L2.54504 12.1115C2.15468 12.5457 1.9595 12.7627 1.9312 13.0321C1.9029 13.3014 2.0487 13.5545 2.34029 14.0605L2.7516 14.7743C3.06267 15.3141 3.21823 15.5841 3.48288 15.6917C3.74753 15.7994 4.04684 15.7144 4.64546 15.5445L5.66227 15.2581C6.04451 15.17 6.44554 15.22 6.79454 15.3994L7.07523 15.5614C7.37441 15.753 7.60452 16.0356 7.7319 16.3677L8.01022 17.1989C8.1932 17.7489 8.28469 18.0239 8.5025 18.1812C8.72032 18.3385 9.00963 18.3385 9.58826 18.3385H10.5172C11.0959 18.3385 11.3852 18.3385 11.603 18.1812C11.8208 18.0239 11.9123 17.7489 12.0953 17.1989L12.3736 16.3677C12.501 16.0356 12.7311 15.753 13.0303 15.5614L13.311 15.3994C13.66 15.22 14.061 15.17 14.4432 15.2581L15.4601 15.5445C16.0587 15.7144 16.358 15.7994 16.6226 15.6917C16.8873 15.5841 17.0428 15.3142 17.3539 14.7743L17.3539 14.7743L17.7652 14.0605C18.0568 13.5545 18.2026 13.3014 18.1743 13.0321C18.146 12.7627 17.9508 12.5457 17.5605 12.1115L16.7013 11.1509C16.4912 10.8851 16.3422 10.4219 16.3422 10.0051C16.3422 9.58854 16.4913 9.12524 16.7013 8.85938L17.5605 7.8988C17.9508 7.46468 18.146 7.24762 18.1743 6.97827C18.2026 6.70892 18.0568 6.4559 17.7652 5.94986Z"
            stroke="#71717B"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12.9329 9.9987C12.9329 11.6095 11.6271 12.9154 10.0163 12.9154C8.40545 12.9154 7.09961 11.6095 7.09961 9.9987C7.09961 8.38787 8.40545 7.08203 10.0163 7.08203C11.6271 7.08203 12.9329 8.38787 12.9329 9.9987Z"
            stroke="#71717B"
            strokeWidth="1.5"
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
          <g opacity="0.95">
            <path
              d="M14.168 9.00371C14.168 8.7157 14.168 8.57169 14.2113 8.44331C14.3373 8.07037 14.6695 7.92563 15.0022 7.77407C15.3763 7.60368 15.5633 7.51849 15.7487 7.5035C15.959 7.48649 16.1698 7.53181 16.3496 7.63274C16.588 7.76654 16.7543 8.02078 16.9245 8.22751C17.7107 9.18237 18.1038 9.6598 18.2476 10.1863C18.3637 10.6112 18.3637 11.0555 18.2476 11.4804C18.0378 12.2483 17.375 12.892 16.8845 13.4878C16.6335 13.7926 16.508 13.945 16.3496 14.0339C16.1698 14.1349 15.959 14.1802 15.7487 14.1632C15.5633 14.1482 15.3763 14.063 15.0022 13.8926C14.6695 13.741 14.3373 13.5963 14.2113 13.2234C14.168 13.095 14.168 12.951 14.168 12.663V9.00371Z"
              stroke="#71717B"
              strokeWidth="1.5"
            />
            <path
              d="M5.83398 9.00385C5.83398 8.64114 5.8238 8.31517 5.53058 8.06017C5.42392 7.96741 5.28253 7.90301 4.99974 7.77421C4.62566 7.60382 4.43862 7.51863 4.25329 7.50364C3.69725 7.45867 3.39808 7.83817 3.07742 8.22765C2.29128 9.18251 1.8982 9.65994 1.75437 10.1864C1.6383 10.6113 1.6383 11.0556 1.75437 11.4805C1.96415 12.2484 2.62692 12.8921 3.11749 13.488C3.42672 13.8636 3.72212 14.2063 4.25329 14.1633C4.43862 14.1483 4.62566 14.0631 4.99974 13.8927C5.28253 13.7639 5.42392 13.6995 5.53058 13.6068C5.8238 13.3518 5.83398 13.0258 5.83398 12.6631V9.00385Z"
              stroke="#71717B"
              strokeWidth="1.5"
            />
            <path
              d="M4.16797 7.5C4.16797 4.73858 6.77964 2.5 10.0013 2.5C13.223 2.5 15.8346 4.73858 15.8346 7.5"
              stroke="#71717B"
              strokeWidth="1.5"
              strokeLinecap="square"
              strokeLinejoin="round"
            />
            <path
              d="M15.834 14.168V14.8346C15.834 16.3074 14.3416 17.5013 12.5007 17.5013H10.834"
              stroke="#71717B"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
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
          <div className={styles.mobileMenuToggleContainer}>
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
          </div>
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
