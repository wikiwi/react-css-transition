/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

export function parseDuration(duration: string): number {
  const parsed = parseFloat(duration);
  if (duration.match(/ms$/)) {
    return parsed;
  }
  return parsed * 1000;
}

export default parseDuration;
