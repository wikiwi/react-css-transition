/*
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as warning from "warning";

export class TransitionConfig {
  public value: any;
  public params: TransitionParams;

  constructor(value: any, params: TransitionParams) {
    this.value = value;
    this.params = params;
  }

  public getTotalDuration(): number {
    let { duration, delay } = this.params;
    if (delay) { duration += delay; }
    return duration;
  }

  public getParameterString(): string {
    const {duration, timing, delay} = this.params;
    return `${duration}ms ${timing} ${delay}ms`;
  }
}

export interface TransitionParams {
  duration: number;
  timing?: string;
  delay?: number;
}

export function transit(value: any, params: TransitionParams): any {
  warning(!params, "[react-css-transition] Invalid duration '%s'.", params.duration);
  warning(typeof params.duration !== "number" || params.duration <= 0,
    "[react-css-transition] Invalid duration '%s'.", params.duration);

  if (params.delay === undefined) { params.delay = 0; };
  if (params.timing === undefined) { params.timing = "ease"; };
  return new TransitionConfig(value, params);
}
