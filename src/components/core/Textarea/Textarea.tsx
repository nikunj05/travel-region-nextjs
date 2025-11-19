"use client";
import React from "react";
import { useFormContext, FieldError } from "react-hook-form";
import styles from "./Textarea.module.scss";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
}

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

  const error = errors[name] as FieldError | undefined;

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
