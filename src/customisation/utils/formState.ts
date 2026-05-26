import { type Customisations, type FieldErrors, type SaveStatus } from "../types";

export function isDirty(saved: Customisations | null, draft: Customisations): boolean {
  if (!saved) return false;
  return (
    saved.buttonText !== draft.buttonText ||
    saved.backgroundColor !== draft.backgroundColor ||
    saved.logoUrl !== draft.logoUrl
  );
}

export function isValid(errors: FieldErrors): boolean {
  return Object.keys(errors).length === 0;
}

export function canReset(opts: { dirty: boolean; status: SaveStatus }): boolean {
  return opts.dirty && opts.status !== "saving";
}

export function canSave(opts: {
  dirty: boolean;
  valid: boolean;
  status: SaveStatus;
}): boolean {
  return opts.dirty && opts.valid && opts.status !== "saving";
}
