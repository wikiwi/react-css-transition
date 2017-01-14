/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { combine, withProps } from "react-assemble";

const mergeClasses = (...classes: string[]) => classes.filter((s) => s).join(" ");

export const mergeWithBaseStyle = combine(
  withProps<any, any>(({ transitionState, style, className }: any) => ({
    style: { ...style, ...transitionState.style },
    className: mergeClasses(className, transitionState.className),
  })),
);
