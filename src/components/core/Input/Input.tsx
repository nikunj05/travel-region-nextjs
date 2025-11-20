"use client";
import React, { useState } from "react";
import { useFormContext, FieldError, FieldErrors } from "react-hook-form";
import Image from "next/image";
import EyeIconHide from "@/assets/images/eye-hide-icon.svg";
import EyeIconShow from "@/assets/images/eye-show-icon.svg";
import styles from "./Input.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  showPasswordToggle?: boolean;
  labelWithContent?: React.ReactNode;
}

// Type for nested field errors that can contain FieldError or nested objects
type NestedFieldErrors = FieldErrors<Record<string, unknown>>;

// Helper function to get nested error from errors object
const getNestedError = (errors: NestedFieldErrors, path: string): FieldError | undefined => {
  const keys = path.split('.');
  let current: unknown = errors;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  
  // Type guard to check if current is a FieldError
  if (current && typeof current === 'object' && 'message' in current) {
    return current as FieldError;
  }
  
  return undefined;
};

export const Input = ({
  name,
  label,
  className = "",
  labelClassName = "",
  errorClassName = "",
  showPasswordToggle = false,
  labelWithContent,
  type,
  ...rest
}: InputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const error = name.includes('.') ? getNestedError(errors, name) : (errors[name] as FieldError | undefined);

  const inputType = showPasswordToggle && type === "password" 
    ? (isPasswordVisible ? "text" : "password") 
    : type;

  return (
    <div className={`${styles.inputContainer} form-group`}>
      {label && (
        <label 
          htmlFor={name} 
          className={`${styles.inputLabel} form-label ${labelWithContent ? styles.labelWithContent : ""} ${labelClassName}`}
        >
          {label}
          {labelWithContent}
        </label>
      )}
      <div className={`${styles.inputWrapper} ${showPasswordToggle && type === "password" ? "passwordwithicon" : ""}`}>
        <input
          id={name}
          {...register(name)}
          type={inputType}
          {...rest}
          className={`${styles.inputField} form-input form-control ${
            showPasswordToggle && type === "password" ? styles.passwordField : ""
          } ${className}`}
        />
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            className={`${styles.passwordToggle} passwordeyeicon`}
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Image
              src={isPasswordVisible ? EyeIconHide : EyeIconShow}
              alt={isPasswordVisible ? "Hide password" : "Show password"}
              width="24"
              height="24"
              className="passeyeicon"
            />
          </button>
        )}
      </div>
      {error && (
        <p className={`${styles.errorMessage} ${errorClassName}`}>
          {error.message}
        </p>
      )}
    </div>
  );
};