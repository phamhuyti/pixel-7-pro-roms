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

export type CameraSupport =
  | "stock-pixel"
  | "pixel-hal"
  | "gcam"
  | "aosp"
  | "vendor";

export type InstallEase = "stock" | "web-flasher" | "recovery" | "desktop";

export type EsimSupport = "yes" | "partial" | "unknown" | "no";

export type DeviceId = "pixel-7-pro" | "lg-v50" | "vivo-v40-lite";

export type Customization = "none" | "low" | "medium" | "high";

export type RomLink = {
  label: string;
  href: string;
};

export type FlashMethod =
  | "stock-web"
  | "web-installer"
  | "device-flasher"
  | "recovery-sideload"
  | "desktop-installer";

export type RelockAdvice = "required" | "recommended" | "forbidden" | "n/a";

export type FlashStep = {
  title: string;
  body: string;
  commands?: string[];
  note?: string;
};

export type FlashDownload = {
  label: string;
  href: string;
  detail?: string;
};

export type FlashGuide = {
  method: FlashMethod;
  officialHref: string;
  officialLabel: string;
  extraLinks?: RomLink[];
  summary: string;
  relock: RelockAdvice;
  firmwareNote?: string;
  requirements: string[];
  warnings: string[];
  downloads: FlashDownload[];
  steps: FlashStep[];
  afterInstall: string[];
};

export type RootSupport = "official-optional" | "unofficial" | "unsupported";

export type RootMethodGuide = {
  support: RootSupport;
  summary: string;
  warnings: string[];
  steps: FlashStep[];
  after?: string[];
};

export type RootGuide = {
  magisk: RootMethodGuide;
  kernelsu: RootMethodGuide;
  integrityNote: string;
};

export type SwitchGuide = {
  summary: string;
  stockFirst: boolean;
  dirtyAllowed: boolean;
  cleanRequired: boolean;
  steps: FlashStep[];
  notes: string[];
};

export type UnlockGuide = {
  title: string;
  summary: string;
  officialHref: string;
  officialLabel: string;
  extraLinks?: RomLink[];
  warnings: string[];
  requirements: string[];
  steps: FlashStep[];
  afterUnlock: string[];
  cannotUnlock: string[];
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

export type DeviceFaq = {
  q: string;
  a: string;
};

export type DeviceCatalog = {
  id: DeviceId;
  name: string;
  shortName: string;
  codename: string;
  manufacturer: string;
  chipset: string;
  released: string;
  stockSupportEnd: string;
  pickerSummary: string;
  pickerWarning?: string;
  heroTitle: string;
  heroLede: string;
  wizardLede: string;
  installHubLede: string;
  unlockBlurb: string;
  sourcesNote: string;
  stockRestoreHref: string;
  stockRestoreLabel: string;
  faq: DeviceFaq[];
  androidFilters: { value: string; label: string }[];
  androidOlderBelow: number;
  defaultCompareSlugs: string[];
  roms: Rom[];
  unlockGuide: UnlockGuide;
  flashGuides: Record<string, FlashGuide>;
  switchGuides: Record<string, SwitchGuide>;
  switchOverview: { summary: string; rules: string[] };
  rootGuides: Record<string, RootGuide>;
  magiskDocLinks: { label: string; href: string }[];
};
