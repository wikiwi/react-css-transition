/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";
import { Children, TransitionEventHandler, TransitionEvent } from "react";

import { matchTransitionProperty, parseTransition } from "./utils";

export interface TransitionObserverProps {
  style: React.CSSProperties;
  onTransitionBegin?: () => void;
  onTransitionComplete?: () => void;
  [index: string]: any;
}

const createTransitionEndHandler = (
  onTransitionComplete: () => void,
  lastProperty: string,
  onTransitionEnd?: TransitionEventHandler,
) => {
  return (e: TransitionEvent) => {
    if (onTransitionEnd) { onTransitionEnd(e); }
    if (e.target !== e.currentTarget ||
      !matchTransitionProperty(e.propertyName, lastProperty)) {
      return;
    }
    onTransitionComplete();
  };
};

export const TransitionObserver: React.StatelessComponent<TransitionObserverProps> =
  ({ style = {}, onTransitionComplete, onTransitionBegin, onTransitionEnd, children, ...rest }) => {
    const child = Children.only(children);
    const workaroundProps: React.HTMLProps<HTMLSpanElement> = {
      key: "workaround",
      style: { transform: "scale(0.99)" },
    };

    if (style.transition) {
      const [{delay: firstPropertyDelay}, {property: lastProperty}] = parseTransition(style.transition);
      if (onTransitionComplete) {
        onTransitionEnd = createTransitionEndHandler(onTransitionComplete, lastProperty, onTransitionEnd);
      }
      workaroundProps.onTransitionEnd = onTransitionBegin;
      workaroundProps.style = { transform: "scale(1.0)", transition: `transform 1ms linear ${firstPropertyDelay}ms` };
    }

    return React.cloneElement(
      child,
      {
        style,
        onTransitionEnd,
        ...rest,
      },
      <span {...workaroundProps } />,
      child.props.children,
    );
  };
TransitionObserver.displayName = "TransitionObserver";
