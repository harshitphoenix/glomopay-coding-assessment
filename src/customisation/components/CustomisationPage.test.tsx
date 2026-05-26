import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CustomisationPage } from "./CustomisationPage";
import { useCustomisationStore } from "../store/useCustomisationStore";
import * as api from "../api/customisationApi";

const MOCK = {
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

async function renderAndLoad() {
  vi.spyOn(api, "getCustomisations").mockResolvedValue({ customisations: MOCK });
  render(<CustomisationPage />);
  await waitFor(() => screen.getByLabelText("Button text"));
}

describe("CustomisationPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    resetStore();
  });

  it("shows loading state on initial render", () => {
    vi.spyOn(api, "getCustomisations").mockResolvedValue({ customisations: MOCK });
    render(<CustomisationPage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("populates all form fields with API values after load", async () => {
    await renderAndLoad();
    expect(screen.getByLabelText("Button text")).toHaveValue(MOCK.buttonText);
    expect(screen.getByLabelText("Background colour")).toHaveValue(MOCK.backgroundColor);
    expect(screen.getByLabelText("Logo URL")).toHaveValue(MOCK.logoUrl);
  });

  describe("State 1 — default (clean)", () => {
    it("disables both Save and Reset when clean", async () => {
      await renderAndLoad();
      expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Reset" })).toBeDisabled();
    });
  });

  describe("State 2 — validation error", () => {
    it("enables Reset and keeps Save disabled on invalid edit", async () => {
      await renderAndLoad();
      userEvent.clear(screen.getByLabelText("Button text"));

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Reset" })).toBeEnabled();
        expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
      });
    });

    it("shows inline error under the invalid field", async () => {
      await renderAndLoad();
      userEvent.clear(screen.getByLabelText("Button text"));
      userEvent.type(screen.getByLabelText("Button text"), "ab");

      await waitFor(() =>
        expect(screen.getByText("At least 3 characters")).toBeInTheDocument()
      );
    });

    it("enables Save once the invalid field is corrected", async () => {
      await renderAndLoad();
      userEvent.clear(screen.getByLabelText("Button text"));
      userEvent.type(screen.getByLabelText("Button text"), "Buy now");

      await waitFor(() =>
        expect(screen.getByRole("button", { name: "Save" })).toBeEnabled()
      );
    });
  });

  describe("happy path — load → edit → save", () => {
    it("shows Saved toast after a successful save", async () => {
      vi.spyOn(api, "saveCustomisations").mockResolvedValue({
        customisations: { ...MOCK, buttonText: "Buy now" },
      });
      await renderAndLoad();

      userEvent.clear(screen.getByLabelText("Button text"));
      userEvent.type(screen.getByLabelText("Button text"), "Buy now");
      await waitFor(() =>
        expect(screen.getByRole("button", { name: "Save" })).toBeEnabled()
      );

      userEvent.click(screen.getByRole("button", { name: "Save" }));

      await waitFor(() => expect(screen.getByText("Saved")).toBeVisible());
    });

    it("disables both buttons after save completes", async () => {
      vi.spyOn(api, "saveCustomisations").mockResolvedValue({
        customisations: { ...MOCK, buttonText: "Buy now" },
      });
      await renderAndLoad();

      userEvent.clear(screen.getByLabelText("Button text"));
      userEvent.type(screen.getByLabelText("Button text"), "Buy now");
      await waitFor(() =>
        expect(screen.getByRole("button", { name: "Save" })).toBeEnabled()
      );

      userEvent.click(screen.getByRole("button", { name: "Save" }));

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Reset" })).toBeDisabled();
      });
    });

    it("resets form to saved values on Reset click", async () => {
      await renderAndLoad();

      userEvent.clear(screen.getByLabelText("Button text"));
      userEvent.type(screen.getByLabelText("Button text"), "Buy");
      await waitFor(() =>
        expect(screen.getByRole("button", { name: "Reset" })).toBeEnabled()
      );

      userEvent.click(screen.getByRole("button", { name: "Reset" }));

      await waitFor(() =>
        expect(screen.getByLabelText("Button text")).toHaveValue(MOCK.buttonText)
      );
    });
  });
});
