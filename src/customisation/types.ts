export type Customisations = {
  buttonText: string;
  backgroundColor: string;
  logoUrl: string;
};

export type CustomisationResponse = {
  customisations: Customisations;
};

export type FieldErrors = Partial<Record<keyof Customisations, string>>;

export type SaveStatus = "idle" | "loading" | "saving";
