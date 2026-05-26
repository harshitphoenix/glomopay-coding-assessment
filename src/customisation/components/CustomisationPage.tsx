import React, { useEffect } from "react";
import { useCustomisationStore } from "../store/useCustomisationStore";
import { validateForm } from "../utils/validation";
import { isDirty, isValid, canReset, canSave } from "../utils/formState";
import { type FieldErrors } from "../types";
import { Toolbar } from "./Toolbar";
import { CustomisationForm } from "./CustomisationForm";
import { CheckoutPreview } from "./CheckoutPreview";
import { SavedToast } from "./SavedToast";

export function CustomisationPage() {
  const saved = useCustomisationStore((s) => s.saved);
  const draft = useCustomisationStore((s) => s.draft);
  const status = useCustomisationStore((s) => s.status);
  const toastVisible = useCustomisationStore((s) => s.toastVisible);
  const load = useCustomisationStore((s) => s.load);
  const setField = useCustomisationStore((s) => s.setField);
  const reset = useCustomisationStore((s) => s.reset);
  const save = useCustomisationStore((s) => s.save);

  useEffect(() => {
    load();
  }, [load]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const dirty = isDirty(saved, draft);
  // Only surface validation errors once the form is dirty (no "touched" machinery needed)
  const errors: FieldErrors = dirty ? validateForm(draft) : {};
  const valid = isValid(errors);

  return (
    <div className="min-h-screen bg-background">
      <Toolbar
        canReset={canReset({ dirty, status })}
        canSave={canSave({ dirty, valid, status })}
        status={status}
        onReset={reset}
        onSave={save}
      />
      <main className="mx-auto max-w-5xl p-6">
        <div className="grid grid-cols-2 gap-10">
          <CustomisationForm draft={draft} errors={errors} onFieldChange={setField} />
          <CheckoutPreview draft={draft} />
        </div>
      </main>
      <SavedToast visible={toastVisible} />
    </div>
  );
}
