import { describe, it, expect } from "vitest";
import { isDirty, isValid, canReset, canSave } from "./formState";
import { type Customisations, type FieldErrors } from "../types";

const base: Customisations = {
  buttonText: "Pay now",
  backgroundColor: "#0F172A",
  logoUrl: "https://example.com/logo.png",
};

describe("isDirty", () => {
  it("returns false when draft matches saved", () => {
    expect(isDirty(base, { ...base })).toBe(false);
  });
  it("returns true when buttonText differs", () => {
    expect(isDirty(base, { ...base, buttonText: "Buy" })).toBe(true);
  });
  it("returns true when backgroundColor differs", () => {
    expect(isDirty(base, { ...base, backgroundColor: "#fff" })).toBe(true);
  });
  it("returns true when logoUrl differs", () => {
    expect(isDirty(base, { ...base, logoUrl: "https://other.com/img.png" })).toBe(true);
  });
  it("returns false when saved is null", () => {
    expect(isDirty(null, base)).toBe(false);
  });
});

describe("isValid", () => {
  it("returns true for empty errors object", () => {
    expect(isValid({})).toBe(true);
  });
  it("returns false when errors has entries", () => {
    const errors: FieldErrors = { buttonText: "Required" };
    expect(isValid(errors)).toBe(false);
  });
});

describe("canReset", () => {
  it("true when dirty and idle", () => {
    expect(canReset({ dirty: true, status: "idle" })).toBe(true);
  });
  it("false when not dirty", () => {
    expect(canReset({ dirty: false, status: "idle" })).toBe(false);
  });
  it("false while saving", () => {
    expect(canReset({ dirty: true, status: "saving" })).toBe(false);
  });
});

describe("canSave", () => {
  it("true when dirty, valid, and idle", () => {
    expect(canSave({ dirty: true, valid: true, status: "idle" })).toBe(true);
  });
  it("false when not dirty", () => {
    expect(canSave({ dirty: false, valid: true, status: "idle" })).toBe(false);
  });
  it("false when invalid", () => {
    expect(canSave({ dirty: true, valid: false, status: "idle" })).toBe(false);
  });
  it("false while saving", () => {
    expect(canSave({ dirty: true, valid: true, status: "saving" })).toBe(false);
  });
});
