/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";
import { Children } from "react";
import { combine, withProps, withHandlers, omitProps } from "react-assemble";

export const withWorkaround = combine(
  withHandlers<any, any>({
    workaroundHandler: ({
      transitionInfo: {firstProperty},
      onTransitionStart,
    }: any) => () => {
      onTransitionStart({ propertyName: firstProperty });
    },
  }),
  withProps<any, any>((
    {
      transitionInfo: {firstPropertyDelay},
      transitionState: {inTransition},
      workaroundHandler,
      children,
    }: any,
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
  omitProps<any>("workaroundHandler", "onTransitionStart"),
);
