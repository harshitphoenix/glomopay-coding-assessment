import React from "react";
import { type SaveStatus } from "../types";

type ToolbarProps = {
  canReset: boolean;
  canSave: boolean;
  status: SaveStatus;
  onReset: () => void;
  onSave: () => void;
};

export function Toolbar({ canReset, canSave, status, onReset, onSave }: ToolbarProps) {
  return <div>Toolbar</div>;
}
