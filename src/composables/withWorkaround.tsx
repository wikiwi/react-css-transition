/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";
import { ReactNode, EventHandler, TransitionEvent, Children } from "react";
import { combine, withProps, withHandlers, omitProps } from "reassemble";

import { WithTransitionStateProps } from "./withTransitionState";
import { WithTransitionInfoProps } from "./withTransitionInfo";
import { WithTransitionObserverProps } from "./withTransitionObserver";

type PropsOut = {
  workaroundHandler?: EventHandler<TransitionEvent>,
  children?: ReactNode;
};

type PropsUnion = WithTransitionObserverProps
  & WithTransitionStateProps
  & WithTransitionInfoProps
  & PropsOut;

export const withWorkaround = combine(
  withHandlers<PropsUnion, PropsOut>({
    workaroundHandler: ({
      transitionInfo: {firstProperty},
      onTransitionStart,
    }) => () => {
      onTransitionStart({ propertyName: firstProperty } as any);
    },
  }),
  withProps((
    {
      transitionInfo: {firstPropertyDelay},
      transitionState: {inTransition},
      workaroundHandler,
      children,
    },
  ) => {
    const workaroundProps: React.HTMLProps<HTMLSpanElement> = {
      key: "workaround",
      style: { transform: "scale(0.99)" },
    };
    if (inTransition) {
      workaroundProps.onTransitionEnd = workaroundHandler;
      workaroundProps.style = { transform: "scale(1.0)", transition: `transform 1ms linear ${firstPropertyDelay}ms` };
    }
    return {
      children: [<span {...workaroundProps } />, ...Children.toArray(children)],
    };
  }),
  omitProps<keyof PropsUnion>(
    "workaroundHandler",
    "onTransitionStart",
  ),
);
