import { EventHandler, TransitionEvent } from "react";
import { withHandlers, onWillReceiveProps, onDidUpdate, isolate, integrate } from "reassemble";

import { CSSTransitionProps } from "../csstransition";

type PropsOut = {
  requestTimeUpdate?: () => void;
  handleTimeUpdateRequest?: () => void;
  onTransitionEnd?: EventHandler<TransitionEvent<any>>;
};

type PropsUnion = CSSTransitionProps & PropsOut;

export const preventPhantomEvents = isolate(
  withHandlers<PropsUnion, PropsOut>(
    () => {
      let lastTriggerTime: any;
      let lastTriggerTimePerformance: any;
      let timeUpdateRequested = false;
      return {
        requestTimeUpdate: () => () => {
          timeUpdateRequested = true;
        },
        handleTimeUpdateRequest: () => () => {
          if (timeUpdateRequested) {
            lastTriggerTime = Date.now();
            if (typeof performance !== "undefined" &&
              typeof performance.now !== "undefined") {
              lastTriggerTimePerformance = performance.now();
            }
            timeUpdateRequested = false;
          }
        },
        onTransitionEnd: ({onTransitionEnd}) => (e: TransitionEvent<any>) => {
          if (!onTransitionEnd) { return; }

          if (e.target !== e.currentTarget) {
            onTransitionEnd(e);
            return;
          }

          // Skip transitionEnd that comes <= 10ms after (reversing) a transition.
          // In most cases this came from the previous transition.
          let compareWith = lastTriggerTime;
          if ((e.timeStamp as any) < 1000000000000 && lastTriggerTimePerformance) {
            compareWith = lastTriggerTimePerformance;
          }
          if ((e.timeStamp as any) - compareWith <= 10) {
            return;
          }

          onTransitionEnd(e);
        },
      };
    }),
  onWillReceiveProps<PropsUnion>(
    ({active}, {active: nextActive, requestTimeUpdate}) => {
      if (active !== nextActive) {
        requestTimeUpdate();
      }
    }),
  onDidUpdate<PropsUnion>(
    ({handleTimeUpdateRequest}) => handleTimeUpdateRequest(),
  ),
  integrate<keyof PropsUnion>(
    "onTransitionEnd",
  ),
);
