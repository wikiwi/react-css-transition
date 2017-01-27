import { createClassRules, multi, primaryColor, whiteTextColor, blackTextColor, breakpoints } from "../theme";

export default createClassRules({
  root: {
    boxShadow: multi(
      "0px 1px 5px 0px rgba(0, 0, 0, 0.2)",
      "0px 2px 2px 0px rgba(0, 0, 0, 0.14)",
      "0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
    ),
    borderRadius: "2px",
    backgroundColor: "white",
    color: blackTextColor,
    position: "relative",

  },

  source: {
    overflow: "scroll",
    "& pre": {
      margin: 0,
    },
  },

  bar: {
    display: "flex",
    boxSizing: "border-box",
    backgroundColor: primaryColor.default,
    color: whiteTextColor,
    height: "64px",
    padding: "0 16px",
    lineHeight: "64x",
    alignItems: "center",
    [`@media (max-width: ${breakpoints.sm}px)`]: {
      height: "58px",
    },
    "& h3": {
      margin: 0,
      fontSize: "20px",
      letterSpacing: ".005em",
      [`@media (max-width: ${breakpoints.sm}px)`]: {
        fontSize: "16px",
      },
      [`@media (max-width: ${breakpoints.xs}px)`]: {
        fontSize: "14px",
      },
    },
  },

  flex: {
    flex: 1,
  },

  main: {
    padding: "32px",
  },
});
