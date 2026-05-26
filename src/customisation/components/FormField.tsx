import React from "react";

type FormFieldProps = {
  id: string;
  label: string;
  value: string;
  error?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  onChange: (value: string) => void;
};

export function FormField({ id, label, value, error, type, placeholder, onChange }: FormFieldProps) {
  return <div>FormField</div>;
}
