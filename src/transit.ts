import { CSSProperties } from "react";

import convertToCSSPrefix from "./utils/convertToCSSPrefix";

interface TransitionParams {
  duration: number;
  timing?: string;
  delay?: number;
}

interface AugmentedArray extends Array<any> {
  transitParams: TransitionParams;
};

export function transit(value: any, duration: number, timing?: string, delay?: number): any {
  const ret = [value];
  (ret as AugmentedArray).transitParams = {
    duration,
    timing: timing || "ease",
    delay: delay !== undefined ? delay : 0,
  };
  return ret;
}

export function resolveTransit(style: CSSProperties, extraDelay = 0): CSSProperties {
  let transition = "";
  let processedStyle = { ...style };
  for (const property in style) {
    const val = style[property];
    if (Array.isArray(val) && (val as AugmentedArray).transitParams) {
      const {duration, timing, delay} = (val as AugmentedArray).transitParams;
      if (transition !== "") { transition += ", "; }
      transition += `${convertToCSSPrefix(property)} ${duration}ms ${timing} ${delay + extraDelay}ms`;
      processedStyle[property] = val[0];
    }
  }
  if (transition) {
    processedStyle.transition = transition;
  }
  return processedStyle;
}
