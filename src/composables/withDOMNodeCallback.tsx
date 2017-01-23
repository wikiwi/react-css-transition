/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { withHandlers } from "reassemble";

import { CSSTransitionInnerProps } from "../csstransition";

export type WithDOMNodeCallbackProps = {
  onDOMNodeRef: CSSTransitionInnerProps["onDOMNodeRef"],
  getDOMNode: () => Element,
};

export const withDOMNodeCallback =
  withHandlers<{}, WithDOMNodeCallbackProps>(() => {
    let ref: Element;
    return {
      onDOMNodeRef: () => (e: Element) => {
        ref = e;
      },
      getDOMNode: () => () => ref,
    };
  });
