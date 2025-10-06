"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import DropdownArror from "@/assets/images/down-black-arrow-icon.svg";
import styles from "./SelectWithFlag.module.scss";

export interface SelectWithFlagOption {
  value: string;
  label: string;
  flag: string; // Image source path
}

export interface SelectWithFlagProps {
  options: SelectWithFlagOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  labelClassName?: string;
}

export const SelectWithFlag = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  disabled = false,
  label,
  labelClassName = "",
}: SelectWithFlagProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || "");
  const selectRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update selected value when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleOptionClick = (optionValue: string) => {
    setSelectedValue(optionValue);
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );
  const displayText = selectedOption ? selectedOption.label : placeholder;
  const displayFlag = selectedOption ? selectedOption.flag : options[0]?.flag;

  return (
    <div className={`${styles.selectContainer} ${className}`}>
      <div
        ref={selectRef}
        className={`${styles.selectWrapper} ${isOpen ? styles.open : ""} ${
          disabled ? styles.disabled : ""
        }`}
      >
        {label && (
          <label className={`${styles.selectLabel} ${labelClassName}`}>
            {label}
          </label>
        )}
        <button
          type="button"
          className={styles.selectButton}
          onClick={handleToggle}
          disabled={disabled}
        >
          <div className={styles.selectContent}>
            <Image
              src={displayFlag}
              alt="Flag"
              width={20}
              height={15}
              className={styles.flagIcon}
            />
            <span className={styles.selectText}>{displayText}</span>
          </div>
          <Image
            src={DropdownArror}
            alt="Dropdown arrow"
            width={20}
            height={20}
            className={`${styles.selectArrow} ${
              isOpen ? styles.arrowOpen : ""
            }`}
          />
        </button>

        {isOpen && (
          <ul className={styles.selectDropdown}>
            {options.map((option) => (
              <li
                key={option.value}
                className={`${styles.selectOption} ${
                  selectedValue === option.value ? styles.selected : ""
                }`}
                onClick={() => handleOptionClick(option.value)}
              >
                <div className={styles.optionContent}>
                  <Image
                    src={option.flag}
                    alt="Flag"
                    width={20}
                    height={15}
                    className={styles.optionFlag}
                  />
                  <span className={styles.optionText}>{option.label}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
