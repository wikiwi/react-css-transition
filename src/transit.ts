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

const nonWebkitPrefixRegexp = /^-(moz|ms|o)-/;

export function resolveTransit(style: CSSProperties, extraDelay = 0): CSSProperties {
  let transitionList: string[] = [];
  let propertyList: string[] = [];
  let processedStyle = { ...style };
  for (const property in style) {
    const val = style[property];
    if (Array.isArray(val) && (val as AugmentedArray).transitParams) {
      const {duration, timing, delay} = (val as AugmentedArray).transitParams;
      const name = convertToCSSPrefix(property);
      const transition = `${name} ${duration}ms ${timing} ${delay + extraDelay}ms`;
      transitionList.push(transition);
      propertyList.push(name);
      processedStyle[property] = val[0];
    }
  }
  if (transitionList.length > 0) {
    processedStyle.transition = transitionList.join(", ");
    (processedStyle as any).WebkitTransition = transitionList.
      filter((item, i) =>
        !propertyList[i].match(nonWebkitPrefixRegexp) &&
        propertyList.indexOf("-webkit-" + propertyList[i]) < 0).
      join(", ");
  }
  return processedStyle;
}
