import { createClassRules } from "../theme";

export default createClassRules({
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
