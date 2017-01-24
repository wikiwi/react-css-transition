/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { createClassRules, buttonReset, timing, multi, blackTextColor } from "../theme";

export default createClassRules({
  root: {
    ...buttonReset,
    backgroundColor: "white",
    color: blackTextColor,
    minWidth: "88px",
    height: "36px",
    fontSize: "14px",
    lineHeight: "36px",
    textTransform: "uppercase",
    letterSpacing: 0,
    transition: multi(
      `background 400ms ${timing.easeInOut}`,
      `box-shadow 400ms ${timing.easeInOut}`,
    ),
    boxShadow: multi(
      "0px 1px 5px 0px rgba(0, 0, 0, 0.2)",
      "0px 2px 2px 0px rgba(0, 0, 0, 0.14)",
      "0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
    ),
    "&:hover, &:focus": {
      backgroundColor: "#eee",
    },
    "&:active": {
      transition: "none",
      backgroundColor: "#ddd",
    },

    "& svg": {
      fill: "currentColor",
      width: "32px",
      height: "32px",
      verticalAlign: "middle",
    },
  },
});
