export function parseDuration(duration: string): number {
  const parsed = parseFloat(duration);
  if (duration.match(/ms$/)) {
    return parsed;
  }
  return parsed * 1000;
}

export default parseDuration;
