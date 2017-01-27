import Prefixer from "inline-style-prefixer";
import mapKeys from "reassemble/cjs/utils/mapKeys";

const globalPrefixer = new Prefixer();

export const prefix = (obj: any) => globalPrefixer.prefix(obj);

export function createClassRules<T>(rules: T): {[P in keyof T]: string } {
  return mapKeys(rules, (key) => "." + key) as any;
};

export function multi(...val: any[]) {
  return val.join(", ");
}

export const fontFamily = {
  serif: "'Roboto Slab', 'Georgia', serif",
  sansSerif: "'Roboto', 'Helvetica','Arial',sans-serif",
  monospace: "'Roboto Mono', 'Lucida Console', 'Courier New', monospace",
};

export const whiteTextColor = "rgba(255, 255, 255, 1)";
export const blackTextColor = "rgba(0, 0, 0, 0.87)";

export const primaryColor = {
  lightest: "#4d8fa8",
  light: "#2e7995",
  default: "#136a8a",
  dark: "#0a526e",
  darkest: "#033f55",
};

export const accentColor = {
  lightest: "#ffba6f",
  light: "#ed9c43",
  default: "#dc7d16",
  dark: "#af5f08",
  darkest: "#884700",
};

export const buttonReset = {
  // reset button
  userSelect: "none",
  outline: "none",
  border: "none",
  touchAction: "manipulation",
  padding: 0,
  position: "relative",
  overflow: "hidden",
  background: "transparent",
  "&::-moz-focus-inner": {
    border: 0,
  },

  // Unify anchor and button.
  cursor: "pointer",
  display: "inline-block",
  boxSizing: "border-box",
  textAlign: "center",
  textDecoration: "none",
  alignItems: "flex-start",
  verticalAlign: "middle",
  WebkitTapHighlightColor: "rgba(0, 0, 0, 0) !important",
  whiteSpace: "nowrap",
};

export const timing = {
  easeInOut: "cubic-bezier(0.4, 0.0, 0.2, 1)",
  easeOut: "cubic-bezier(0.0, 0.0, 0.2, 1)",
  easeIn: "cubic-bezier(0.4, 0.0, 1, 1)",
  sharp: "cubic-bezier(0.4, 0.0, 0.6, 1)",
};

export const breakpoints = {
  xs: 360,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};
