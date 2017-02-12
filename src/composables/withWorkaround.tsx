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
      style: { opacity: 0.9 },
    };
    const transition = `opacity 1ms linear ${firstPropertyDelay}ms`;
    if (inTransition) {
      workaroundProps.onTransitionEnd = workaroundHandler;
      workaroundProps.style = { opacity: 1.0, transition, WebkitTransition: transition };
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
