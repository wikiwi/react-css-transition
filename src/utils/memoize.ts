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
