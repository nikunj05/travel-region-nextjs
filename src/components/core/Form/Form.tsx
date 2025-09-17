"use client";
import React, { forwardRef } from "react";
import {
  useForm,
  FormProvider,
  FieldValues,
  DefaultValues,
  ValidationMode,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AnyObjectSchema } from "yup";

interface FormProps<TFormValues extends FieldValues> {
  id?: string;
  defaultValues: DefaultValues<TFormValues>;
  children: React.ReactNode | ((methods: UseFormReturn<TFormValues>) => React.ReactNode);
  onSubmit: SubmitHandler<TFormValues>;
  schema: AnyObjectSchema;
  className?: string;
  mode?: keyof ValidationMode;
}

function FormComponent<TFormValues extends FieldValues = FieldValues>(
  { id, defaultValues, children, onSubmit, schema, className = "", mode = "onChange" }: FormProps<TFormValues>,
  ref: React.ForwardedRef<HTMLFormElement>
) {
  const methods = useForm<TFormValues>({
    defaultValues,
    resolver: yupResolver(schema),
    mode,
  });

  return (
    <FormProvider {...methods}>
      <form
        ref={ref}
        id={id}
        onSubmit={methods.handleSubmit(onSubmit)}
        className={className}
      >
        {typeof children === "function" ? children(methods) : children}
      </form>
    </FormProvider>
  );
}

FormComponent.displayName = "Form";

export const Form = forwardRef(FormComponent) as <TFormValues extends FieldValues = FieldValues>(
  props: FormProps<TFormValues> & { ref?: React.ForwardedRef<HTMLFormElement> }
) => React.JSX.Element;
