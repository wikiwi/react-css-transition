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
    totalDuration: number,
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
          const [first, last] = parsed;
          return {
            transitionInfo: {
              firstPropertyDelay: first.delay,
              firstProperty: first.property,
              lastProperty: last.property,
              totalDuration: last.duration + last.delay,
            },
          };
        }
        return { transitionInfo: {} };
      }),
    integrate<keyof WithTransitionInfoProps>(
      "transitionInfo",
    ),
  );
