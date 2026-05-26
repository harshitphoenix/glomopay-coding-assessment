import { describe, it, expect } from "vitest";
import {
  validateButtonText,
  validateBackgroundColor,
  validateLogoUrl,
  validateForm,
} from "./validation";
import { type Customisations } from "../types";

const VALID: Customisations = {
  buttonText: "Pay now",
  backgroundColor: "#0F172A",
  logoUrl: "https://example.com/logo.png",
};

describe("validateButtonText", () => {
  it("errors on empty string", () => {
    expect(validateButtonText("")).toBeDefined();
  });
  it("errors on whitespace only", () => {
    expect(validateButtonText("   ")).toBeDefined();
  });
  it("errors on 2 characters", () => {
    expect(validateButtonText("ab")).toBeDefined();
  });
  it("passes on exactly 3 characters", () => {
    expect(validateButtonText("Buy")).toBeUndefined();
  });
  it("passes on valid text", () => {
    expect(validateButtonText("Pay now")).toBeUndefined();
  });
});

describe("validateBackgroundColor", () => {
  it("passes 6-digit hex", () => {
    expect(validateBackgroundColor("#0F172A")).toBeUndefined();
  });
  it("passes 3-digit hex", () => {
    expect(validateBackgroundColor("#FFF")).toBeUndefined();
  });
  it("is case-insensitive", () => {
    expect(validateBackgroundColor("#ffffff")).toBeUndefined();
    expect(validateBackgroundColor("#FFFFFF")).toBeUndefined();
  });
  it("errors without leading #", () => {
    expect(validateBackgroundColor("0F172A")).toBeDefined();
  });
  it("errors on invalid characters", () => {
    expect(validateBackgroundColor("#GGGGGG")).toBeDefined();
  });
  it("errors on 4-digit hex", () => {
    expect(validateBackgroundColor("#1234")).toBeDefined();
  });
  it("errors on empty string", () => {
    expect(validateBackgroundColor("")).toBeDefined();
  });
});

describe("validateLogoUrl", () => {
  it("passes https URL", () => {
    expect(validateLogoUrl("https://example.com/logo.png")).toBeUndefined();
  });
  it("passes http URL", () => {
    expect(validateLogoUrl("http://example.com/logo.png")).toBeUndefined();
  });
  it("errors on plain string", () => {
    expect(validateLogoUrl("not-a-url")).toBeDefined();
  });
  it("errors on ftp scheme", () => {
    expect(validateLogoUrl("ftp://example.com/logo.png")).toBeDefined();
  });
  it("errors on empty string", () => {
    expect(validateLogoUrl("")).toBeDefined();
  });
});

describe("validateForm", () => {
  it("returns empty errors for a fully valid draft", () => {
    expect(validateForm(VALID)).toEqual({});
  });
  it("returns errors for all three invalid fields", () => {
    const errors = validateForm({ buttonText: "", backgroundColor: "bad", logoUrl: "bad" });
    expect(errors.buttonText).toBeDefined();
    expect(errors.backgroundColor).toBeDefined();
    expect(errors.logoUrl).toBeDefined();
  });
  it("returns only the failing field when one field is invalid", () => {
    const errors = validateForm({ ...VALID, buttonText: "" });
    expect(errors.buttonText).toBeDefined();
    expect(errors.backgroundColor).toBeUndefined();
    expect(errors.logoUrl).toBeUndefined();
  });
});
