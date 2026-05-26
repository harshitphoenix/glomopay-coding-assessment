import { type Customisations, type FieldErrors } from "../types";

export function validateButtonText(value: string): string | undefined {
  if (!value.trim()) return "Button text is required";
  if (value.trim().length < 3) return "At least 3 characters";
  return undefined;
}

export function validateBackgroundColor(value: string): string | undefined {
  if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value))
    return "Enter a valid hex colour (e.g. #ffffff)";
  return undefined;
}

export function validateLogoUrl(value: string): string | undefined {
  try {
    const { protocol } = new URL(value);
    if (protocol !== "http:" && protocol !== "https:") return "Enter a valid URL";
    return undefined;
  } catch {
    return "Enter a valid URL";
  }
}

export function validateForm(draft: Customisations): FieldErrors {
  const errors: FieldErrors = {};
  const bt = validateButtonText(draft.buttonText);
  if (bt) errors.buttonText = bt;
  const bg = validateBackgroundColor(draft.backgroundColor);
  if (bg) errors.backgroundColor = bg;
  const logo = validateLogoUrl(draft.logoUrl);
  if (logo) errors.logoUrl = logo;
  return errors;
}
