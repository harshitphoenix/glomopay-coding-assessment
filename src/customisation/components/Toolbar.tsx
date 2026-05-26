import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type SaveStatus } from "../types";

type ToolbarProps = {
  canReset: boolean;
  canSave: boolean;
  status: SaveStatus;
  onReset: () => void;
  onSave: () => void;
};

export function Toolbar({ canReset, canSave, status, onReset, onSave }: ToolbarProps) {
  const isSaving = status === "saving";

  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 border-b bg-background px-6 py-3">
      <Button variant="outline" size="sm" disabled={!canReset} onClick={onReset}>
        Reset
      </Button>
      <Button size="sm" disabled={!canSave} onClick={onSave}>
        {isSaving && <Loader2 className="h-3 w-3 animate-spin" />}
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
