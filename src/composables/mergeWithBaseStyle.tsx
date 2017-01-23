/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { combine, withProps } from "reassemble";
import { HTMLAttributes } from "react";

import { WithTransitionStateProps } from "./withTransitionState";

const mergeClasses = (...classes: string[]) => classes.filter((s) => s).join(" ");

type StyleProps = Pick<HTMLAttributes<any>, "style" | "className">;

export const mergeWithBaseStyle = combine(
  withProps<StyleProps & WithTransitionStateProps, StyleProps>(
    ({ transitionState, style, className }) => ({
      style: { ...style, ...transitionState.style },
      className: mergeClasses(className, transitionState.className),
    })),
);
