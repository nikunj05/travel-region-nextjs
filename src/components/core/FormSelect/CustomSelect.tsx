"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import DropdownArror from "@/assets/images/down-black-arrow-icon.svg";
import styles from "./CustomSelect.module.scss";

export interface CustomSelectOption {
  value: string;
  label: string;
}

export interface CustomSelectProps {
  options: CustomSelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  labelClassName?: string;
}

export const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  disabled = false,
  label,
  labelClassName = "",
}: CustomSelectProps) => {
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

  return (
    <div className={`${styles.customSelectContainer} ${className}`}>
      <div
        ref={selectRef}
        className={`${styles.customSelectWrapper} ${isOpen ? styles.open : ""} ${
          disabled ? styles.disabled : ""
        }`}
      >
        {label && (
          <label className={`${styles.customSelectLabel} ${labelClassName}`}>
            {label}
          </label>
        )}
        <button
          type="button"
          className={styles.customSelectButton}
          onClick={handleToggle}
          disabled={disabled}
        >
          <span className={styles.customSelectText}>{displayText}</span>
          <Image
            src={DropdownArror}
            alt="Dropdown arrow"
            width={20}
            height={20}
            className={`${styles.customSelectArrow} ${
              isOpen ? styles.arrowOpen : ""
            }`}
          />
        </button>

        {isOpen && (
          <ul className={styles.customSelectDropdown}>
            {options.map((option) => (
              <li
                key={option.value}
                className={`${styles.customSelectOption} ${
                  selectedValue === option.value ? styles.selected : ""
                }`}
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
