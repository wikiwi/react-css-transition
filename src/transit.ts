/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { CSSProperties } from "react";

import { convertToCSSPrefix } from "./utils";

interface TransitionParams {
  duration: number;
  timing?: string;
  delay?: number;
}

class TransitionConfig {
  public value: any;
  public params: TransitionParams;

  constructor(value: any, params: TransitionParams) {
    this.value = value;
    this.params = params;
  }
}

export function transit(value: any, duration: number, timing?: string, delay?: number): any {
  return new TransitionConfig(value, {
    duration,
    timing: timing || "ease",
    delay: delay !== undefined ? delay : 0,
  });
}

export function resolveTransit(style: CSSProperties, extraDelay = 0): CSSProperties {
  let transition = "";
  let processedStyle = { ...style };
  for (const property in style) {
    const val = style[property];
    if (typeof val === "object") {
      const {value, params: {duration, timing, delay}} = val as TransitionConfig;
      if (transition !== "") { transition += ", "; }
      transition += `${convertToCSSPrefix(property)} ${duration}ms ${timing} ${delay + extraDelay}ms`;
      processedStyle[property] = value;
    }
  }
  if (transition) {
    processedStyle.transition = transition;
  }
  return processedStyle;
}
