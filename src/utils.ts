/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

export function removeVendorPrefix(val: string): string {
  return val.replace(/^-(webkit|moz|ms|o)-/, "");
}

export function convertToCSSPrefix(property: string): string {
  return property
    .replace(/^Moz/, "-moz-")
    .replace(/^ms/, "-ms-")
    .replace(/^O/, "-o-")
    .replace(/^Webkit/, "-webkit-")
    .toLowerCase();
}

export function matchTransitionProperty(subject: string, property: string): boolean {
  const sub = removeVendorPrefix(subject);
  const prop = removeVendorPrefix(property);
  if (sub.length < prop.length) {
    return false;
  } else if (sub.length === prop.length) {
    return sub === prop;
  }
  return sub.substr(0, prop.length) === prop;
}

export function parseDuration(duration: string): number {
  const parsed = parseFloat(duration);
  if (duration.match(/ms$/)) {
    return parsed;
  }
  return parsed * 1000;
}

export type TransitionEntry = {
  property: string;
  duration: number;
  delay: number;
};

export function parseTransition(transition: string): [TransitionEntry, TransitionEntry] {
  let lastProperty: TransitionEntry = null;
  let firstProperty: TransitionEntry = null;
  let lastPropertyTotalDuration = -1;
  let firstPropertyDelay = 99999999;
  transition.split(/\s*,\s*/).forEach(
    (entry) => {
      const parts = entry.split(/\s+/);
      const property = parts.filter((p) => p.match(/^[a-z\-A-Z]+$/))[0];
      const [duration = 0, delay = 0] = parts.filter((p) => p.match(/^[0-9]+m?s$/)).map((p) => parseDuration(p));
      const totalDuration = duration + delay;
      if (totalDuration > lastPropertyTotalDuration) {
        lastPropertyTotalDuration = totalDuration;
        lastProperty = { property, duration, delay };
      }
      if (delay < firstPropertyDelay) {
        firstPropertyDelay = delay;
        firstProperty = { property, duration, delay };
      }
    },
  );
  return [firstProperty, lastProperty];
}

export type TransitionDelay = number | { enter?: number; leave?: number };

export function getEnterDelay(delay: TransitionDelay): number {
  if (!delay) { return 0; }
  if (typeof delay === "number") {
    return delay as number;
  }
  return delay.enter;
}

export function getLeaveDelay(delay: TransitionDelay): number {
  if (!delay) { return 0; }
  if (typeof delay === "number") {
    return delay as number;
  }
  return delay.leave;
}

export const runInFrame = (no: number, callback: Function) => {
  let cur = 0;
  let canceled = false;
  const loop = () => {
    if (canceled) {
      return;
    }
    if (cur <= no) {
      cur++;
      requestAnimationFrame(loop);
      return;
    }
    callback();
  };
  loop();
  return () => { canceled = true; };
};
