/**
 * @license
 * Copyright (C) 2016 Chi Vinh Le and contributors.
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

  public getParameterString(extraDelay: number): string {
    const {duration, timing, delay} = this.params;
    return `${duration}ms ${timing} ${delay + extraDelay}ms`;
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
    const value = style[property];
    if (typeof value === "object") {
      const config = value as TransitionConfig;
      if (transition !== "") { transition += ", "; }
      transition += `${convertToCSSPrefix(property)} ${config.getParameterString(extraDelay)}`;
      processedStyle[property] = config.value;
    }
  }
  if (transition) {
    processedStyle.transition = transition;
  }
  return processedStyle;
}
