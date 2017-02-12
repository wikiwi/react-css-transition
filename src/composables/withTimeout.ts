import { withHandlers, isolate, onWillReceiveProps, debug } from "reassemble";

import { CSSTransitionProps } from "../csstransition";
import { WithTransitionStateProps } from "./withTransitionState";
import { WithTransitionInfoProps } from "./withTransitionInfo";

export const timeoutMultiplier = 3;

type PropsOut = {
  cancel: () => void,
  timeoutIn: (ms: number) => void,
};

type PropsUnion =
  CSSTransitionProps
  & WithTransitionStateProps
  & WithTransitionInfoProps
  & PropsOut;

export const withTimeout =
  isolate(
    withHandlers<PropsUnion, PropsOut>(
      () => {
        let timeoutID: any;
        return {
          timeoutIn: ({timeout}) => (ms: number) => timeoutID = setTimeout(timeout, ms),
          cancel: () => () => clearTimeout(timeoutID),
        };
      }),
    onWillReceiveProps<PropsUnion>(
      (
        {transitionState: {inTransition}, active},
        {
          transitionState: {inTransition: nextInTransition},
          transitionInfo: {totalDuration},
          cancel, timeoutIn, active: nextActive,
        },
      ) => {
        const newTransition = inTransition !== nextInTransition;
        const interrupted = nextInTransition && active !== nextActive;
        if (newTransition || interrupted) {
          cancel();
          if (nextInTransition) {
            timeoutIn(totalDuration * timeoutMultiplier);
          }
        }
      }),
  );
