"use client";
import React from "react";
import { useFormContext, FieldError } from "react-hook-form";
import { CustomSelect, CustomSelectOption } from "./CustomSelect";
import styles from "./FormSelect.module.scss";

interface FormSelectProps {
  name: string;
  label?: string;
  options: CustomSelectOption[];
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const FormSelect = ({
  name,
  label,
  options,
  className = "",
  labelClassName = "",
  errorClassName = "",
  placeholder = "Select an option",
  disabled = false,
}: FormSelectProps) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const error = errors[name] as FieldError | undefined;
  const currentValue = watch(name);

  const handleChange = (value: string) => {
    setValue(name, value, { shouldValidate: true });
  };

  return (
    <div className={`${styles.formSelectContainer} form-group`}>
      {label && (
        <label 
          htmlFor={name} 
          className={`${styles.formSelectLabel} form-label ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <div className={styles.formSelectWrapper}>
        <CustomSelect
          options={options}
          value={currentValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={`${styles.formSelect} ${className}`}
          disabled={disabled}
        />
        <input
          type="hidden"
          {...register(name)}
        />
      </div>
      {error && (
        <p className={`${styles.errorMessage} ${errorClassName}`}>
          {error.message}
        </p>
      )}
    </div>
  );
};
