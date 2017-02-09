import parseDuration from "./parseDuration";

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
  transition.split(/\s*,\s*(?![^\(]*\))/g).forEach(
    (entry) => {
      const parts = entry.split(/\s+(?![^\(]*\))/g);
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

export default parseTransition;
