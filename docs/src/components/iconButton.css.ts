import { createClassRules, buttonReset, timing } from "../theme";

export default createClassRules({
  root: {
    ...buttonReset,
    color: "inherit",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    transition: `background 300ms ${timing.easeInOut}`,

    "&:hover, &:focus": {
      background: "rgba(0, 0, 0, 0.2)",
    },

    "&:active": {
      transition: "none",
      background: "rgba(0, 0, 0, 0.3)",
    },

    "& svg": {
      fill: "currentColor",
      width: "32px",
      height: "32px",
      verticalAlign: "middle",
    },
  },
});
