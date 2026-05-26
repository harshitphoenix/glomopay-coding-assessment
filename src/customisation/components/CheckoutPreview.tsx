import React, { useEffect, useState } from "react";
import { type Customisations } from "../types";
import { Button } from "@/components/ui/button";

type CheckoutPreviewProps = {
  draft: Customisations;
};

export function CheckoutPreview({ draft }: CheckoutPreviewProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [draft.logoUrl]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Preview</h2>
      <div
        className="flex min-h-48 flex-col gap-6 rounded-xl border p-6 shadow-sm"
        style={{ backgroundColor: draft.backgroundColor || undefined }}
      >
        <div className="flex h-10 items-center">
          {draft.logoUrl && !imgError ? (
            <img
              src={draft.logoUrl}
              alt="Merchant logo"
              className="h-full w-auto object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="h-8 w-24 rounded bg-white/20" aria-hidden />
          )}
        </div>
        <Button
          className="w-full"
          style={{ pointerEvents: "none" }}
          tabIndex={-1}
          aria-hidden
        >
          {draft.buttonText || "Pay now"}
        </Button>
      </div>
    </div>
  );
}
