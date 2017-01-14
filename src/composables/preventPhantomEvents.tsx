/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { TransitionEvent } from "react";
import { combine, withHandlers, onWillReceiveProps, onDidUpdate, isolate, integrate } from "react-assemble";

export const preventPhantomEvents = combine(
  isolate(
    withHandlers<any, any>(() => {
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
            if (typeof performance !== "undefined") {
              lastTriggerTimePerformance = performance.now();
            }
            timeUpdateRequested = false;
          }
        },
        onTransitionEnd: ({onTransitionEnd}: any) => (e: TransitionEvent) => {
          if (!onTransitionEnd) { return; }

          // Skip transitionEnd that comes <= 15ms after (reversing) a transition.
          // In most cases this came from the previous transition.
          let compareWith = lastTriggerTime;
          if ((e.timeStamp as any) < 1000000000000 && lastTriggerTimePerformance) {
            compareWith = lastTriggerTimePerformance;
          }
          if ((e.timeStamp as any) - compareWith <= 15) {
            return;
          }

          onTransitionEnd(e);
        },
      };
    }),
    onWillReceiveProps<any>(({active}, {active: nextActive, requestTimeUpdate}) => {
      if (active !== nextActive) {
        requestTimeUpdate();
      }
    }),
    onDidUpdate<any>(({handleTimeUpdateRequest}) => handleTimeUpdateRequest()),
    integrate<any>("onTransitionEnd"),
  ),
);
