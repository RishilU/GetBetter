// Colors are CSS custom properties (defined for both themes in index.css),
// not literal hex — that's what lets the dark-mode toggle repaint everything
// without every component needing to know which theme is active.
export const COLORS = {
  bg: "var(--bg)",
  bgElevated: "var(--bg-elevated)",
  bgElevatedHover: "var(--bg-elevated-hover)",
  bgSidebar: "var(--bg-sidebar)",
  border: "var(--border)",
  borderSoft: "var(--border-soft)",
  textPrimary: "var(--text-primary)",
  textSecondary: "var(--text-secondary)",
  textMuted: "var(--text-muted)",
  accent: "var(--accent)",
  danger: "var(--danger)",
  // Pre-mixed instead of `danger + "88"` — you can't append an alpha suffix
  // to a var() reference and get valid CSS out of it.
  dangerMuted: "var(--danger-muted)",
  ink: "var(--ink)",
  onAccent: "var(--on-accent)",
  // Diverging pair for the mood chart: warm/cool-reading poles + neutral gray midpoint.
  moodUp: "var(--mood-up)",
  moodDown: "var(--mood-down)",
  moodFlat: "var(--mood-flat)",
};

export const FONT_DISPLAY = "'Fraunces', Georgia, 'Times New Roman', serif";
export const FONT_BODY = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
