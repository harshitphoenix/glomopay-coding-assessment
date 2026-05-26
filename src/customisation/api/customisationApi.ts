import { type Customisations, type CustomisationResponse } from "../types";

const DEFAULT: Customisations = {
  buttonText: "Pay now",
  backgroundColor: "#0F172A",
  logoUrl: "https://example.com/logo.png",
};

let stored: Customisations = { ...DEFAULT };

function delay(min: number, max: number): Promise<void> {
  return new Promise((r) => setTimeout(r, min + Math.random() * (max - min)));
}

export async function getCustomisations(): Promise<CustomisationResponse> {
  await delay(300, 500);
  return { customisations: { ...stored } };
}

export async function saveCustomisations(
  payload: Customisations
): Promise<CustomisationResponse> {
  await delay(400, 600);
  stored = { ...payload };
  return { customisations: { ...stored } };
}
