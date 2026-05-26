import React from "react";
import { type Customisations, type FieldErrors } from "../types";
import { FormField } from "./FormField";

type CustomisationFormProps = {
  draft: Customisations;
  errors: FieldErrors;
  onFieldChange: <K extends keyof Customisations>(key: K, value: Customisations[K]) => void;
};

export function CustomisationForm({ draft, errors, onFieldChange }: CustomisationFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold">Customise Checkout</h2>
      <FormField
        id="buttonText"
        label="Button text"
        value={draft.buttonText}
        error={errors.buttonText}
        placeholder="Pay now"
        onChange={(v) => onFieldChange("buttonText", v)}
      />
      <FormField
        id="backgroundColor"
        label="Background colour"
        value={draft.backgroundColor}
        error={errors.backgroundColor}
        placeholder="#0F172A"
        onChange={(v) => onFieldChange("backgroundColor", v)}
      />
      <FormField
        id="logoUrl"
        label="Logo URL"
        value={draft.logoUrl}
        error={errors.logoUrl}
        placeholder="https://example.com/logo.png"
        type="url"
        onChange={(v) => onFieldChange("logoUrl", v)}
      />
    </div>
  );
}
