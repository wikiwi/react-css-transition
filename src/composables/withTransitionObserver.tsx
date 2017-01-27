import { EventHandler, TransitionEvent } from "react";
import { withHandlers } from "reassemble";

import { CSSTransitionInnerProps } from "../csstransition";
import { WithTransitionStateProps } from "./withTransitionState";
import { WithTransitionInfoProps } from "./withTransitionInfo";
import matchTransitionProperty from "../utils/matchTransitionProperty";

export type WithTransitionObserverProps = {
  onTransitionStart: EventHandler<TransitionEvent>,
};

type PropsOut = WithTransitionObserverProps & {
  onTransitionEnd: EventHandler<TransitionEvent>,
};

type PropsUnion = CSSTransitionInnerProps
  & WithTransitionStateProps
  & WithTransitionInfoProps
  & PropsOut;

export const withTransitionObserver =
  withHandlers<PropsUnion, PropsOut>({
    onTransitionStart: (
      {
        transitionInfo: { firstProperty },
        transitionState: { inTransition },
        onTransitionStart,
        onTransitionBegin,
      },
    ) => (e: TransitionEvent) => {
      if (onTransitionStart) { onTransitionStart(e); }
      if (!inTransition || e.target !== e.currentTarget ||
        !matchTransitionProperty(e.propertyName, firstProperty)) {
        return;
      }
      onTransitionBegin();
    },
    onTransitionEnd: (
      {
        transitionInfo: { lastProperty },
        transitionState: { inTransition },
        onTransitionEnd,
        onTransitionComplete,
      },
    ) => (e: TransitionEvent) => {
      if (onTransitionEnd) { onTransitionEnd(e); }
      if (!inTransition || e.target !== e.currentTarget ||
        !matchTransitionProperty(e.propertyName, lastProperty)) {
        return;
      }
      onTransitionComplete();
    },
  });
