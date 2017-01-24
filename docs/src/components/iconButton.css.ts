/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

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
