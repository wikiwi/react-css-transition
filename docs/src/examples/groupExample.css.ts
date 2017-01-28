import { createClassRules, accentColor, timing } from "../theme";

export default createClassRules({
  container: {
    width: "100%",
    maxWidth: "240px",
    marginBottom: "32px",
  },

  item: {
    padding: "8px 16px",
    borderBottom: 0,
    cursor: "pointer",
    boxShadow: "1px 1px 5px #ccc",
    borderLeft: `4px solid ${accentColor.default}`,
    background: "#fff",
    position: "relative",
    fontSize: "15px",
    lineHeight: "1.5",
    color: "#666",
    marginBottom: "16px",
    userSelect: "none",
    touchAction: "manipulation",
    WebkitTapHighlightColor: "rgba(0, 0, 0, 0) !important",
    transition: `background 400ms ${timing.easeInOut}`,

    "&:hover": {
      background: "#eee",
    },
    "&:active": {
      transition: 0,
      background: "#ddd",
    },
  },
});
