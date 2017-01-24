/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { createClassRules, accentColor, fontFamily } from "../theme";

export default createClassRules({
  root: {
    display: "block",
    background: "#fff",
    padding: "15px 50px 15px 55px",
    margin: "20px 0",
    position: "relative",

    fontFamily: fontFamily.serif,
    fontSize: "15px",
    lineHeight: "1.5",
    color: "#666",

    borderLeft: `15px solid ${accentColor.default}`,
    borderRight: `2px solid ${accentColor.default}`,

    boxShadow: "1px 1px 15px #ddd",

    "&::before": {
      content: "'\\201C'",

      fontFamily: "Georgia, serif",
      fontSize: "55px",
      fontWeight: "bold",
      color: "#999",

      position: "absolute",
      left: "10px",
      top: "-10px",
    },

    "& footer": {
      marginTop: "4px",
      fontFamily: fontFamily.sansSerif,
      "& a": {
        cursor: "pointer",
        color: "#999",
        textDecoration: "none",
        fontSize: "12px",
        "&:hover": {
          color: "#888",
          textDecoration: "underline",
        },
      },
    },
  },
});
