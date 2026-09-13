export type RomStatus = "stock" | "active" | "stale" | "discontinued";

export type RomGroup =
  | "baseline"
  | "privacy"
  | "clean"
  | "degoogle"
  | "feature";

export type GoogleStack =
  | "stock"
  | "sandboxed-play"
  | "microg"
  | "gapps"
  | "optional-gapps"
  | "none";

export type Bootlock = "stock-locked" | "can-relock" | "unlocked-only";

export type Cadence =
  | "same-week"
  | "weekly"
  | "monthly"
  | "irregular"
  | "stopped";

export type Integrity = "stock" | "limited" | "weak" | "unknown";

export type CameraSupport = "stock-pixel" | "pixel-hal" | "gcam" | "aosp";

export type InstallEase = "stock" | "web-flasher" | "recovery";

export type EsimSupport = "yes" | "partial" | "unknown";

export type Customization = "none" | "low" | "medium" | "high";

export type RomLink = {
  label: string;
  href: string;
};

export type Rom = {
  slug: string;
  name: string;
  shortName: string;
  isStock: boolean;
  status: RomStatus;
  group: RomGroup;
  androidVersion: number;
  versionLabel: string;
  buildLabel: string;
  lastVerified: string;
  cadence: Cadence;
  ota: boolean;
  bootlock: Bootlock;
  google: GoogleStack;
  integrity: Integrity;
  integrityNote: string;
  camera: CameraSupport;
  cameraNote: string;
  esim: EsimSupport;
  customization: Customization;
  install: InstallEase;
  tagline: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  bestFor: string[];
  notFor: string[];
  notes: string[];
  links: RomLink[];
};

export type NeedId =
  | "security"
  | "banking"
  | "camera"
  | "degoogle"
  | "customize";
