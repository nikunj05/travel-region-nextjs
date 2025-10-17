"use client";
import React from "react";
import Image from "next/image";
import minusRoundIcon from "@/assets/images/minus-round-icon.svg";
import plusRoundIcon from "@/assets/images/plus-round-icon.svg";
import "./GuestsPicker.scss";

interface GuestCounts {
  adults: number;
  children: number;
  pets: number;
}

interface GuestsPickerProps {
  isOpen: boolean;
  onGuestCountChange: (counts: GuestCounts) => void;
  guestCounts: GuestCounts;
}

const GuestsPicker: React.FC<GuestsPickerProps> = ({
  isOpen,
  onGuestCountChange,
  guestCounts,
}) => {
  const updateGuestCount = (type: keyof GuestCounts, increment: boolean) => {
    const newCounts = { ...guestCounts };
    const currentCount = newCounts[type];

    if (increment) {
      newCounts[type] = currentCount + 1;
    } else {
      if (type === "adults") {
        newCounts[type] = Math.max(1, currentCount - 1);
      } else {
        newCounts[type] = Math.max(0, currentCount - 1);
      }
    }

    onGuestCountChange(newCounts);
  };

  const renderGuestIcon = (type: "adults" | "children" | "pets") => {
    switch (type) {
      case "adults":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.20664 6.51758C6.65165 6.51758 7.08666 6.38562 7.45667 6.13839C7.82668 5.89115 8.11507 5.53975 8.28537 5.12862C8.45567 4.71748 8.50022 4.26508 8.41341 3.82863C8.32659 3.39217 8.1123 2.99126 7.79763 2.67659C7.48296 2.36192 7.08205 2.14763 6.64559 2.06081C6.20914 1.974 5.75674 2.01855 5.3456 2.18885C4.93447 2.35915 4.58307 2.64754 4.33583 3.01755C4.0886 3.38756 3.95664 3.82257 3.95664 4.26758C3.95664 4.86432 4.19369 5.43661 4.61565 5.85857C5.03761 6.28053 5.6099 6.51758 6.20664 6.51758ZM7.61664 7.38008H4.79664C4.07092 7.34748 3.36187 7.60388 2.82485 8.0931C2.28783 8.58232 1.96664 9.26447 1.93164 9.99008V13.7401C1.94341 14.1593 2.08553 14.5644 2.33823 14.8991C2.59094 15.2338 2.94167 15.4815 3.34164 15.6076V20.3776C3.33054 20.5777 3.35964 20.7779 3.42722 20.9666C3.4948 21.1552 3.5995 21.3284 3.73513 21.4759C3.87076 21.6234 4.03456 21.7423 4.21688 21.8254C4.3992 21.9086 4.59633 21.9544 4.79664 21.9601H7.61664C7.8163 21.9534 8.01262 21.9069 8.19407 21.8233C8.37552 21.7397 8.53844 21.6207 8.67328 21.4733C8.80811 21.3259 8.91214 21.153 8.97926 20.9649C9.04638 20.7767 9.07524 20.577 9.06414 20.3776V15.5776C9.47029 15.4577 9.8282 15.2126 10.0868 14.8772C10.3454 14.5418 10.4914 14.1334 10.5041 13.7101V9.96008C10.4616 9.23571 10.1339 8.55766 9.59282 8.07419C9.05173 7.59072 8.34122 7.34116 7.61664 7.38008Z"
              fill="black"
            />
            <path
              d="M16.7073 6.65248C17.9458 6.65248 18.9498 5.64848 18.9498 4.40998C18.9498 3.17148 17.9458 2.16748 16.7073 2.16748C15.4688 2.16748 14.4648 3.17148 14.4648 4.40998C14.4648 5.64848 15.4688 6.65248 16.7073 6.65248Z"
              fill="black"
            />
            <path
              d="M21.9201 15.1874L20.1801 12.3224V9.84736C20.2003 9.19464 19.9618 8.56034 19.5165 8.0827C19.0712 7.60506 18.4551 7.32277 17.8026 7.29736H15.6051C14.9525 7.32277 14.3365 7.60506 13.8911 8.0827C13.4458 8.56034 13.2073 9.19464 13.2276 9.84736V12.3224L11.5476 15.0674L11.4951 15.1874C11.3563 15.5317 11.3049 15.9051 11.3455 16.2741C11.3861 16.6431 11.5173 16.9964 11.7276 17.3024C11.9098 17.5776 12.1571 17.8036 12.4475 17.9606C12.7379 18.1176 13.0625 18.2006 13.3926 18.2024H15.2526V20.1374C15.1814 20.3553 15.158 20.5859 15.1838 20.8137C15.2097 21.0415 15.2843 21.261 15.4026 21.4574C15.4808 21.573 15.5856 21.6681 15.7084 21.7347C15.8311 21.8013 15.968 21.8373 16.1076 21.8399H17.3001C17.4396 21.8373 17.5766 21.8013 17.6993 21.7347C17.822 21.6681 17.9269 21.573 18.0051 21.4574C18.125 21.2617 18.2012 21.0425 18.2284 20.8146C18.2556 20.5868 18.2331 20.3557 18.1626 20.1374V18.2024H20.0151C20.3453 18.2013 20.6701 18.1185 20.9606 17.9615C21.2511 17.8045 21.4983 17.578 21.6801 17.3024C21.8915 16.997 22.0241 16.6441 22.066 16.275C22.1079 15.906 22.0577 15.5323 21.9201 15.1874Z"
              fill="black"
            />
          </svg>
        );
      case "children":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 11.5C4.5 11.5 2.5 9.5 2.5 7C2.5 4.5 4.5 2.5 7 2.5C9.5 2.5 11.5 4.5 11.5 7C11.5 9.5 9.5 11.5 7 11.5ZM17.5 15.5C15.3 15.5 13.5 13.7 13.5 11.5C13.5 9.3 15.3 7.5 17.5 7.5C19.7 7.5 21.5 9.3 21.5 11.5C21.5 13.7 19.7 15.5 17.5 15.5ZM17.5 16.5C20 16.5 22 18.5 22 21V21.5H13V21C13 18.5 15 16.5 17.5 16.5ZM7 12.5C9.8 12.5 12 14.7 12 17.5V21.5H2V17.5C2 14.7 4.2 12.5 7 12.5Z"
              fill="black"
            />
          </svg>
        );
      case "pets":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23.14 12.3535C22.9154 13.1463 22.4663 13.8334 21.8763 14.2876C21.4052 14.6508 20.8702 14.8408 20.344 14.8408C20.1459 14.8408 19.9522 14.8143 19.7606 14.7602C19.065 14.5612 18.5013 14.0086 18.2152 13.2437C17.9532 12.5465 17.9356 11.7262 18.1601 10.9332C18.3869 10.1404 18.836 9.4533 19.4238 8.99913C20.0711 8.50028 20.8416 8.32787 21.5395 8.52648C22.2352 8.72552 22.801 9.27808 23.0872 10.0429C23.347 10.7402 23.3667 11.5605 23.14 12.3535ZM8.42036 10.3496C9.24817 10.3496 10.0385 9.88886 10.5889 9.08486C11.0886 8.35591 11.3638 7.40111 11.3638 6.39587C11.3638 5.38975 11.0886 4.43495 10.5889 3.706C10.0385 2.90223 9.24812 2.44141 8.42036 2.44141C7.59034 2.44141 6.80003 2.90219 6.24962 3.706C5.75209 4.43495 5.47689 5.38975 5.47689 6.39587C5.47689 7.40111 5.75209 8.35591 6.24962 9.08486C6.80003 9.88886 7.59039 10.3496 8.42036 10.3496ZM15.5799 10.3496C16.4099 10.3496 17.2002 9.88886 17.7506 9.08486C18.2481 8.35591 18.5233 7.40111 18.5233 6.39587C18.5233 5.38975 18.2481 4.43495 17.7506 3.706C17.2002 2.90223 16.4098 2.44141 15.5799 2.44141C14.752 2.44141 13.9617 2.90219 13.4113 3.706C12.9116 4.43495 12.6364 5.38975 12.6364 6.39587C12.6364 7.40111 12.9116 8.35591 13.4113 9.08486C13.9617 9.88886 14.752 10.3496 15.5799 10.3496ZM5.84012 10.9337C5.61339 10.1405 5.16428 9.45339 4.57642 8.99917C3.92917 8.50033 3.15864 8.32792 2.46072 8.52653C1.76284 8.72556 1.19922 9.27812 0.912998 10.043C0.653217 10.7402 0.633435 11.5605 0.86017 12.3535C1.08475 13.1463 1.53386 13.8334 2.12383 14.2876C2.59497 14.6508 3.12995 14.8408 3.65612 14.8408C3.85206 14.8408 4.048 14.8144 4.23733 14.7602C4.9352 14.5612 5.49883 14.0087 5.785 13.2438C6.04708 12.5466 6.0647 11.7263 5.84012 10.9337ZM16.3195 12.8669C15.1131 11.5988 13.5808 10.9009 12.0001 10.9009C10.4194 10.9009 8.88489 11.5988 7.68283 12.8669C6.53359 14.0762 5.73226 15.7543 5.42401 17.5928C5.22808 18.7655 5.5847 19.8943 6.4059 20.6893C7.26011 21.5166 8.3763 21.7678 9.4683 21.3795C10.2763 21.091 11.1283 20.9449 12.0001 20.9449C12.8719 20.9449 13.7239 21.0911 14.5319 21.3795C14.8688 21.4992 15.2078 21.5584 15.5402 21.5584C16.2865 21.5584 17.0021 21.2617 17.5921 20.6893C18.4155 19.8943 18.7721 18.7656 18.5762 17.5928C18.268 15.7542 17.4666 14.0762 16.3195 12.8669Z"
              fill="black"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="guestspicker-dropdown">
      <div className="guestspicker-content">
        <div className="guestspicker-section">
          <div className="guestspicker-room-title">Room 1</div>

          <div className="guestspicker-item">
            <div className="guestspicker-icon-with-text">
              {renderGuestIcon("adults")}
              <span className="guestspicker-label">Adults</span>
            </div>
            <div className="guestspicker-counter">
              <button
                className="guestspicker-btn"
                onClick={() => updateGuestCount("adults", false)}
              >
                <Image
                  src={minusRoundIcon}
                  width="20"
                  height="20"
                  alt="minus icon"
                />
              </button>
              <span className="guestspicker-count">{guestCounts.adults}</span>
              <button
                className="guestspicker-btn"
                onClick={() => updateGuestCount("adults", true)}
              >
                <Image
                  src={plusRoundIcon}
                  width="20"
                  height="20"
                  alt="plus icon"
                />
              </button>
            </div>
          </div>

          <div className="guestspicker-item">
            <div className="guestspicker-icon-with-text">
              {renderGuestIcon("children")}
              <span className="guestspicker-label">Children</span>
            </div>
            <div className="guestspicker-counter">
              <button
                className="guestspicker-btn"
                onClick={() => updateGuestCount("children", false)}
              >
                <Image
                  src={minusRoundIcon}
                  width="20"
                  height="20"
                  alt="minus icon"
                />
              </button>
              <span className="guestspicker-count">{guestCounts.children}</span>
              <button
                className="guestspicker-btn"
                onClick={() => updateGuestCount("children", true)}
              >
                <Image
                  src={plusRoundIcon}
                  width="20"
                  height="20"
                  alt="plus icon"
                />
              </button>
            </div>
          </div>

          {/* <div className="guestspicker-item">
            <div className="guestspicker-icon-with-text">
              {renderGuestIcon('pets')}
              <span className="guestspicker-label">Pets</span>
            </div>
            <div className="guestspicker-counter">
              <button 
                className="guestspicker-btn"
                onClick={() => updateGuestCount('pets', false)}
              >
                <Image src={minusRoundIcon} width="20" height="20" alt="minus icon" />
              </button>
              <span className="guestspicker-count">{guestCounts.pets}</span>
              <button 
                className="guestspicker-btn"
                onClick={() => updateGuestCount('pets', true)}
              >
                <Image src={plusRoundIcon} width="20" height="20" alt="plus icon" />
              </button>
            </div>
          </div> */}

          <button className="guestspicker-add-room">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.0007 5.3335V18.6668M18.6673 12.0002H5.33398"
                stroke="#3E5B96"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Add another Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestsPicker;
