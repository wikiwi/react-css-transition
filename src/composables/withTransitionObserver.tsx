/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { TransitionEvent } from "react";
import { withHandlers } from "react-assemble";

import matchTransitionProperty from "../utils/matchTransitionProperty";

export const withTransitionObserver =
  withHandlers<any, any>({
    onTransitionStart: (
      {
        transitionInfo: { firstProperty },
        transitionState: { inTransition },
        onTransitionStart,
        onTransitionBegin,
      }: any,
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
      }: any,
    ) => (e: TransitionEvent) => {
      if (onTransitionEnd) { onTransitionEnd(e); }
      if (!inTransition || e.target !== e.currentTarget ||
        !matchTransitionProperty(e.propertyName, lastProperty)) {
        return;
      }
      onTransitionComplete();
    },
  });
