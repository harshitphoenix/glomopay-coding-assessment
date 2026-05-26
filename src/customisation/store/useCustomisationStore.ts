import { create } from "zustand";
import { type Customisations, type SaveStatus } from "../types";
import { getCustomisations, saveCustomisations } from "../api/customisationApi";
import { validateForm } from "../utils/validation";
import { isDirty, isValid } from "../utils/formState";

const EMPTY_DRAFT: Customisations = {
  buttonText: "",
  backgroundColor: "",
  logoUrl: "",
};

interface CustomisationState {
  saved: Customisations | null;
  draft: Customisations;
  status: SaveStatus;
  toastVisible: boolean;

  load: () => Promise<void>;
  setField: <K extends keyof Customisations>(key: K, value: Customisations[K]) => void;
  reset: () => void;
  save: () => Promise<void>;
  dismissToast: () => void;
}

export const useCustomisationStore = create<CustomisationState>((set, get) => ({
  saved: null,
  draft: EMPTY_DRAFT,
  status: "loading",
  toastVisible: false,

  load: async () => {
    set({ status: "loading" });
    const { customisations } = await getCustomisations();
    set({ saved: customisations, draft: { ...customisations }, status: "idle" });
  },

  setField: (key, value) => {
    set((s) => ({ draft: { ...s.draft, [key]: value } }));
  },

  reset: () => {
    const { saved, status } = get();
    if (!saved || status === "saving") return;
    set({ draft: { ...saved } });
  },

  save: async () => {
    const { draft, saved, status } = get();
    if (status === "saving") return;
    if (!isDirty(saved, draft) || !isValid(validateForm(draft))) return;
    set({ status: "saving" });
    try {
      const { customisations } = await saveCustomisations(draft);
      set({ saved: customisations, draft: { ...customisations }, status: "idle", toastVisible: true });
      setTimeout(() => set({ toastVisible: false }), 2000);
    } catch {
      set({ status: "idle" });
    }
  },

  dismissToast: () => set({ toastVisible: false }),
}));
