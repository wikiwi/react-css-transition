/*
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

export class TransitionConfig {
  public value: any;
  public duration: number;
  public params: TransitionParams;

  constructor(value: any, duration: number, params = {} as TransitionParams) {
    this.value = value;
    this.duration = duration;
    this.params = params;
  }

  public getTotalDuration(): number {
    let duration = this.duration;
    let { delay } = this.params;
    if (delay) {
      duration += delay;
    }
    return duration;
  }

  public getParameterString(additionalDelay?: number): string {
    let result = "";
    let duration = this.duration;
    let {timing, delay} = this.params;
    result += duration + "ms";
    if (timing) {
      result += " " + timing;
    } else {
      result += " ease";
    }
    if (!delay) {
      delay = 0;
    }
    if (additionalDelay) {
      delay += additionalDelay;
    }
    result += " " + delay + "ms";
    return result;
  }

  public isEqualTo(other: TransitionConfig): boolean {
    if (this.value !== other.value ||
      this.duration !== other.duration ||
      this.params.delay !== other.params.delay ||
      this.params.timing !== other.params.timing
    ) {
      return false;
    }
    return true;
  }
}

export interface TransitionParams {
  timing?: string;
  delay?: number;
}

export function transit(value: any, duration: number, params?: TransitionParams): any {
  return new TransitionConfig(value, duration, params);
}
