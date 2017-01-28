import {
  createClassRules, primaryColor, breakpoints,
  blackTextColor, whiteTextColor, accentColor,
  fontFamily,
} from "./theme";

export default createClassRules({
  root: {
    fontFamily: fontFamily.sansSerif,
    color: blackTextColor,
    paddingBottom: "120px",
    [`@media (max-width: ${breakpoints.md}px)`]: {
      paddingBottom: "40px",
    },
  },
  hero: {
    height: "540px",
    background: primaryColor.dark,
    boxShadow: "inset -30px 0px 100px -60px rgba(0,0,0,0.5)",
    padding: "32px",
    [`@media (max-width: ${breakpoints.md}px)`]: {
      height: "480px",
    },
  },
  logoContainer: {
    paddingTop: "120px",
    textAlign: "center",

    [`@media (max-width: ${breakpoints.sm}px)`]: {
      paddingTop: "60px",
    },
  },

  logoContainerFlex: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    [`@media (max-width: ${breakpoints.sm}px)`]: {
      flexFlow: "column wrap",
    },
  },
  logo: {
    fill: "#fff",
    width: "100px",
    verticalAlign: "middle",

    [`@media (max-width: ${breakpoints.md}px)`]: {
      width: "90px",
    },

    [`@media (max-width: ${breakpoints.sm}px)`]: {
      marginBottom: "10px",
    },

    [`@media (min-width: ${breakpoints.sm}px)`]: {
      marginRight: "30px",
    },
  },

  logoText: {
    fontSize: "60px",
    lineHeight: "1.3",
    color: whiteTextColor,
    fontWeight: 400,
    letterSpacing: "-0.02em",

    [`@media (max-width: ${breakpoints.md}px)`]: {
      fontSize: "48px",
    },

    [`@media (max-width: ${breakpoints.sm}px)`]: {
      fontSize: "32px",
    },

    [`@media (mix-width: ${breakpoints.sm}px)`]: {
      width: "150px",
    },
  },

  logoSubtext: {
    fontSize: "20px",
    color: "rgba(255, 255, 255, 0.8)",
    marginLeft: "-69px",
    marginTop: "-20px",

    [`@media (max-width: ${breakpoints.md}px)`]: {
      fontSize: "16px",
      marginLeft: "-40px",
      marginTop: "-16px",
    },

    [`@media (max-width: ${breakpoints.sm}px)`]: {
      fontSize: "16px",
      margin: "0",
    },
  },
  githubButton: {
    marginTop: "48px",
  },
  main: {
    display: "block",
    margin: "0 auto",
    maxWidth: "1024px",
    textAlign: "left",
    padding: "32px",
    boxSizing: "border-box",
    lineHeight: "1.5",

  },

  mainSection: {
    margin: "48px 0",

    "& > h2 > a, & > h3 > a, & > h4 > a, & > p > a": {
      color: accentColor.default,
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
        color: accentColor.dark,
      },
    },

    "& > code, & > p > code": {
      display: "inline-block",
      fontFamily: fontFamily.monospace,
      fontSize: "14px",
      padding: "2px 6px",
      color: "rgba(0, 0, 0, 0.8)",
    },

    "&:first-child": {
      marginTop: "32px",
    },

    "& > h2 + .mainSection": {
      marginTop: "0",
    },

    "& > .mainSection + h2": {
      marginBottom: "0",
    },

    "& > p": {
      margin: "16px 0",
    },

    "& > h2": {
      marginBottom: "16px",
      color: primaryColor.default,
      fontSize: "32px",
    },

    "& > h3": {
      marginBottom: "16px",
      fontSize: "24px",
      color: blackTextColor,
    },

    "& > h4": {
      marginBottom: "16px",
      fontSize: "18px",
      color: blackTextColor,
    },
  },

  block: {
    margin: "32px 0",
  },
});
