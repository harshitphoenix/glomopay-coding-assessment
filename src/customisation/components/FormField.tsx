import React from "react";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  id: string;
  label: string;
  value: string;
  error?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  onChange: (value: string) => void;
};

export function FormField({
  id,
  label,
  value,
  error,
  type = "text",
  placeholder,
  onChange,
}: FormFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full rounded-md border bg-background px-3 py-2 text-sm",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          error ? "border-destructive" : "border-input"
        )}
      />
      {error && (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
