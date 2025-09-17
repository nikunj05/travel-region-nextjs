"use client";
import React from "react";
import { useFormContext, FieldError } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
}

export const Input = ({
  name,
  label,
  className = "",
  labelClassName = "",
  errorClassName = "",
  ...rest
}: InputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name] as FieldError | undefined;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className={`block text-sm font-medium text-gray-700 ${labelClassName}`}>
          {label}
        </label>
      )}
      <input
        id={name}
        {...register(name)}
        {...rest}
        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
      />
      {error && <p className={`mt-2 text-sm text-red-600 ${errorClassName}`}>{error.message}</p>}
    </div>
  );
};
