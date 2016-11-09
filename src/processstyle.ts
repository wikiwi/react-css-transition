/**
 * @license
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as objectAssign from "object-assign";

import { CSSProperties } from "react";

import { TransitionConfig } from "./transit";
import { convertToCSSPrefix } from "./utils";

export interface ProcessResult {
  style: CSSProperties;
  lastProperty?: string;
  firstProperty?: string;
  firstPropertyDelay?: number;
}

export function processStyle(style: CSSProperties): ProcessResult {
  let transition = "";
  let processedStyle = objectAssign({}, style);
  let lastProperty: string;
  let lastPropertyDuration = -1;
  let firstPropertyDelay = 9999999999;
  let firstProperty: string;

  for (const property in style) {
    const value = style[property];
    if (typeof value === "object") {
      const cssProperty = convertToCSSPrefix(property);
      const config = value as TransitionConfig;
      if (transition !== "") {
        transition += ", ";
      }
      transition += `${cssProperty} ${config.getParameterString()}`;
      processedStyle[property] = config.value;
      const duration = config.getTotalDuration();
      const delay = config.params.delay ? config.params.delay : 0;
      if (delay < firstPropertyDelay) {
        firstPropertyDelay = delay;
        firstProperty = cssProperty;
      }
      if (duration > lastPropertyDuration) {
        lastPropertyDuration = duration;
        lastProperty = cssProperty;
      }
    }
  }
  if (transition) {
    processedStyle.transition = transition;
  }
  return {
    style: processedStyle,
    lastProperty,
    firstProperty,
    firstPropertyDelay: firstProperty ? firstPropertyDelay : undefined,
  };
}
