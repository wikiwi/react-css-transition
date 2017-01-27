import parseDuration from "./parseDuration";
import { TransitionEntry } from "./parseTransition";

export function parseComputedTransition(computed: any): [TransitionEntry, TransitionEntry] {
  let lastProperty: TransitionEntry = null;
  let firstProperty: TransitionEntry = null;
  let lastPropertyTotalDuration = -1;
  let firstPropertyDelay = 99999999;
  const properties = computed.transitionProperty.split(/\s*,\s*/);
  const delays = computed.transitionDelay.split(/\s*,\s*/);
  const durations = computed.transitionDuration.split(/\s*,\s*/);
  properties.forEach(
    (property: string, i: number) => {
      const duration = parseDuration(durations[i]);
      const delay = parseDuration(delays[i]);
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

export default parseComputedTransition;
