"use client";
import React from "react";
import { useFormContext, FieldError, FieldErrors } from "react-hook-form";
import styles from "./Textarea.module.scss";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
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

export const Textarea = ({
  name,
  label,
  className = "",
  labelClassName = "",
  errorClassName = "",
  ...rest
}: TextareaProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = name.includes('.') ? getNestedError(errors, name) : (errors[name] as FieldError | undefined);

  return (
    <div className={`${styles.textareaContainer} form-group`}>
      {label && (
        <label 
          htmlFor={name} 
          className={`${styles.textareaLabel} form-label ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <textarea
        id={name}
        {...register(name)}
        {...rest}
        className={`${styles.textareaField} form-input form-control ${className}`}
      />
      {error && (
        <p className={`${styles.errorMessage} ${errorClassName}`}>
          {error.message}
        </p>
      )}
    </div>
  );
};
