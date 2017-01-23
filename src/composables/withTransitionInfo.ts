/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { withProps, withHandlers, isolate, integrate } from "reassemble";

import { CSSTransitionProps } from "../csstransition";
import { WithDOMNodeCallbackProps } from "./withDOMNodeCallback";
import { WithTransitionStateProps } from "./withTransitionState";
import { parseTransition, TransitionEntry } from "../utils/parseTransition";
import { parseComputedTransition } from "../utils/parseComputedTransition";
import { memoize } from "../utils/memoize";

export type WithTransitionInfoProps = {
  transitionInfo?: {
    firstPropertyDelay: number,
    firstProperty: string,
    lastProperty: string,
  },
};

type PropsOut = WithTransitionInfoProps & {
  parseComputedTransitionMemoized?: typeof parseComputedTransition,
};

type PropsUnion = CSSTransitionProps
  & WithDOMNodeCallbackProps
  & WithTransitionStateProps
  & PropsOut;

export const withTransitionInfo =
  isolate(
    withHandlers<PropsUnion, PropsOut>(
      () => {
        const memoized = memoize(
          (node: Element) => parseComputedTransition(getComputedStyle(node)),
          (node: Element) => node.className,
        );
        return {
          parseComputedTransitionMemoized: () => memoized,
        };
      }),
    withProps<PropsUnion, PropsOut>(
      ({style, className, transitionState, getDOMNode, parseComputedTransitionMemoized}) => {
        if (transitionState.inTransition) {
          let parsed: [TransitionEntry, TransitionEntry];
          if (style && style.transition) {
            parsed = parseTransition(style.transition);
          } else {
            const node = getDOMNode();
            node.className = className;
            parsed = parseComputedTransitionMemoized(node);
          }
          const [{delay: firstPropertyDelay, property: firstProperty}, {property: lastProperty}] = parsed;
          return {
            transitionInfo: {
              firstPropertyDelay,
              firstProperty,
              lastProperty,
            },
          };
        }
        return { transitionInfo: {} };
      }),
    integrate<keyof WithTransitionInfoProps>(
      "transitionInfo",
    ),
  );
