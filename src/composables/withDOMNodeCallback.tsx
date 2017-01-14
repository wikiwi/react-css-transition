/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { withHandlers } from "react-assemble";

export const withDOMNodeCallback =
  withHandlers<any, any>(() => {
    let ref: Element;
    return {
      onDOMNodeRef: () => (e: Element) => {
        ref = e;
      },
      getDOMNode: () => () => ref,
    };
  });
