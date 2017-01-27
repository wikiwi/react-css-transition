import { createClassRules, accentColor } from "../theme";

export default createClassRules({
  className: {
    boxShadow: "1px 1px 5px 0px rgba(0,0,0,0.25)",
    borderRadius: "50%",
    marginBottom: "32px",
    background: accentColor.default,
    height: "20px",
    width: "20px",
  },
  defaultClassName: {
    transform: "translate(0, 0)",
  },
  enterClassName: {
    transform: "translate(175px, 0)",
    transition: "transform 500ms ease-in-out",
  },
  leaveClassName: {
    transform: "translate(0, 0)",
    transition: "transform 500ms ease-in-out",
  },
  activeClassName: {
    transform: "translate(175px, 0)",
  },
});
