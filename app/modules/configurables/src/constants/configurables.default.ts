/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  primary: string;
  secondary: string;
  accent: string;
};

export type TScoreLabels = {
  high: string;
  medium: string;
  low: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  tagline?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  ctaLabel?: string;
  brandColor: TBrandColor;
  scoreLabels?: TScoreLabels;
  maxSessionsPerPage?: number;
  enablePublicSignup?: boolean;
  footerText?: string;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "InterviewIQ",
  logoUrl: "FILL_LOGO_URL_HERE",
  tagline: "AI-Powered Interview Performance Review",
  heroTitle: "Know Exactly How You Performed",
  heroSubtitle:
    "Upload your interview recording. Get objective, structured feedback on answer quality, clarity, confidence, and delivery — in minutes.",
  ctaLabel: "Analyze My Interview",
  brandColor: {
    primary: "#1E3A5F",
    secondary: "#0F2440",
    accent: "#00BCD4",
  },
  scoreLabels: {
    high: "Strong",
    medium: "Needs Work",
    low: "Critical",
  },
  maxSessionsPerPage: 10,
  enablePublicSignup: true,
  footerText: "© 2026 InterviewIQ. All rights reserved.",
};
