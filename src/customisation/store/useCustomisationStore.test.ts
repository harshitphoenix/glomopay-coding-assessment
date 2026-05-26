import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCustomisationStore } from "./useCustomisationStore";
import * as api from "../api/customisationApi";
import { type Customisations } from "../types";

const MOCK: Customisations = {
  buttonText: "Pay now",
  backgroundColor: "#0F172A",
  logoUrl: "https://example.com/logo.png",
};

function resetStore() {
  useCustomisationStore.setState({
    saved: null,
    draft: { buttonText: "", backgroundColor: "", logoUrl: "" },
    status: "loading",
    toastVisible: false,
  });
}

describe("useCustomisationStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.restoreAllMocks();
    resetStore();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("load", () => {
    it("populates saved and draft from API and sets status to idle", async () => {
      vi.spyOn(api, "getCustomisations").mockResolvedValue({ customisations: MOCK });

      await useCustomisationStore.getState().load();

      const { saved, draft, status } = useCustomisationStore.getState();
      expect(saved).toEqual(MOCK);
      expect(draft).toEqual(MOCK);
      expect(status).toBe("idle");
    });
  });

  describe("setField", () => {
    it("updates only the targeted draft field", () => {
      useCustomisationStore.setState({ saved: MOCK, draft: { ...MOCK }, status: "idle" });

      useCustomisationStore.getState().setField("buttonText", "Buy");

      const { draft, saved } = useCustomisationStore.getState();
      expect(draft.buttonText).toBe("Buy");
      expect(draft.backgroundColor).toBe(MOCK.backgroundColor);
      expect(saved?.buttonText).toBe(MOCK.buttonText);
    });
  });

  describe("reset", () => {
    it("restores draft to saved values", () => {
      useCustomisationStore.setState({
        saved: MOCK,
        draft: { ...MOCK, buttonText: "Buy" },
        status: "idle",
      });

      useCustomisationStore.getState().reset();

      expect(useCustomisationStore.getState().draft).toEqual(MOCK);
    });

    it("is a no-op while saving", () => {
      const modified = { ...MOCK, buttonText: "Buy" };
      useCustomisationStore.setState({ saved: MOCK, draft: modified, status: "saving" });

      useCustomisationStore.getState().reset();

      expect(useCustomisationStore.getState().draft.buttonText).toBe("Buy");
    });
  });

  describe("save", () => {
    it("calls API with draft, updates saved, and shows toast", async () => {
      const updated = { ...MOCK, buttonText: "Checkout" };
      useCustomisationStore.setState({ saved: MOCK, draft: updated, status: "idle" });
      vi.spyOn(api, "saveCustomisations").mockResolvedValue({ customisations: updated });

      await useCustomisationStore.getState().save();

      const { saved, toastVisible, status } = useCustomisationStore.getState();
      expect(saved).toEqual(updated);
      expect(toastVisible).toBe(true);
      expect(status).toBe("idle");
    });

    it("auto-dismisses toast after 2 s", async () => {
      const updated = { ...MOCK, buttonText: "Checkout" };
      useCustomisationStore.setState({ saved: MOCK, draft: updated, status: "idle" });
      vi.spyOn(api, "saveCustomisations").mockResolvedValue({ customisations: updated });

      await useCustomisationStore.getState().save();
      expect(useCustomisationStore.getState().toastVisible).toBe(true);

      vi.advanceTimersByTime(2001);
      expect(useCustomisationStore.getState().toastVisible).toBe(false);
    });

    it("guards against double-save while already saving", async () => {
      useCustomisationStore.setState({
        saved: MOCK,
        draft: { ...MOCK, buttonText: "Checkout" },
        status: "saving",
      });
      const spy = vi.spyOn(api, "saveCustomisations");

      await useCustomisationStore.getState().save();

      expect(spy).not.toHaveBeenCalled();
    });

    it("is a no-op when the draft is invalid", async () => {
      useCustomisationStore.setState({
        saved: MOCK,
        draft: { ...MOCK, buttonText: "" },
        status: "idle",
      });
      const spy = vi.spyOn(api, "saveCustomisations");

      await useCustomisationStore.getState().save();

      expect(spy).not.toHaveBeenCalled();
    });

    it("is a no-op when the form is not dirty", async () => {
      useCustomisationStore.setState({ saved: MOCK, draft: { ...MOCK }, status: "idle" });
      const spy = vi.spyOn(api, "saveCustomisations");

      await useCustomisationStore.getState().save();

      expect(spy).not.toHaveBeenCalled();
    });

    it("resets status to idle on API error", async () => {
      useCustomisationStore.setState({
        saved: MOCK,
        draft: { ...MOCK, buttonText: "Checkout" },
        status: "idle",
      });
      vi.spyOn(api, "saveCustomisations").mockRejectedValue(new Error("Network error"));

      await useCustomisationStore.getState().save();

      expect(useCustomisationStore.getState().status).toBe("idle");
    });
  });

  describe("dismissToast", () => {
    it("sets toastVisible to false", () => {
      useCustomisationStore.setState({ toastVisible: true });

      useCustomisationStore.getState().dismissToast();

      expect(useCustomisationStore.getState().toastVisible).toBe(false);
    });
  });
});
