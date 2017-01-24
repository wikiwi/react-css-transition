/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { HTMLAttributes } from "react";
import { withHandlers } from "reassemble";

export const preventMouseFocus =
  withHandlers<HTMLAttributes<any>, HTMLAttributes<any>>({
    onMouseDown: ({onMouseDown}) => (event: React.MouseEvent<any>) => {
      if (onMouseDown) { onMouseDown(event); }
      event.preventDefault();
    },
  });
