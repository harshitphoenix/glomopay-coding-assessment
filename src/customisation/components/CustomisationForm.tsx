import React from "react";
import { type Customisations, type FieldErrors } from "../types";

type CustomisationFormProps = {
  draft: Customisations;
  errors: FieldErrors;
  onFieldChange: <K extends keyof Customisations>(key: K, value: Customisations[K]) => void;
};

export function CustomisationForm({ draft, errors, onFieldChange }: CustomisationFormProps) {
  return <div>CustomisationForm</div>;
}
