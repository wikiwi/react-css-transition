/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

export function memoize<T>(cb: T, hasher: (...args: any[]) => string): T {
  const cache: any = {};
  const ret: any = (...args: any[]) => {
    const hash = hasher(...args);
    if (hash in cache) {
      return cache[hash];
    }
    const result = (cb as any)(...args);
    cache[hash] = result;
    return result;
  };
  return ret;
}

export default memoize;
