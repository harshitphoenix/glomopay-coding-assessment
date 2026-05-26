import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SavedToastProps = {
  visible: boolean;
};

export function SavedToast({ visible }: SavedToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-6 right-6 flex items-center gap-2 rounded-lg border bg-background px-4 py-3 shadow-lg",
        "transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      )}
    >
      <CheckCircle2 className="h-4 w-4 text-green-500" />
      <span className="text-sm font-medium">Saved</span>
    </div>
  );
}
