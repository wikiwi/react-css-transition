import { CSSProperties } from "react";
import {
  combine, withState, withHandlers, withProps,
  onDidMount, onWillUnmount, onWillReceiveProps,
  isolate, integrate, StateUpdater, onDidUpdate,
} from "reassemble";

import { CSSTransitionProps, CSSTransitionInnerProps } from "../csstransition";
import runInFrame from "../utils/runInFrame";
import pick from "../utils/pick";
import { ActionID, StateID, Reducer, actionPropKeys, ActionPropKeys } from "../reducer";

export type TransitionState = {
  style?: CSSProperties,
  className?: string,
  inTransition?: boolean,
};

export type WithTransitionStateProps = {
  transitionState?: TransitionState,
  timeout?: () => void,
};

type PropsOut =
  WithTransitionStateProps & {
    actionProps?: {[P in ActionPropKeys]?: CSSTransitionProps[P]},
    cancelPendingIfExistent?: () => void,
    dispatch?: (actionID: ActionID) => void,
    runPending?: () => void,
    setTransitionState?: StateUpdater<TransitionState>,
    onTransitionBegin?: CSSTransitionInnerProps["onTransitionBegin"],
    onTransitionComplete?: CSSTransitionInnerProps["onTransitionComplete"],
  };

type PropsUnion = CSSTransitionProps & PropsOut;

export const withTransitionState = (reduce: Reducer) => combine(
  isolate(
    withProps<PropsUnion, PropsOut>(
      (props) => ({ actionProps: pick(props, ...actionPropKeys) }),
    ),
    withState<PropsUnion, keyof PropsOut, TransitionState>(
      "transitionState", "setTransitionState",
      ({actionProps}) =>
        pick(
          reduce(StateID.EntryPoint, { kind: ActionID.New, props: actionProps }).state,
          "style", "className", "inTransition",
        ),
    ),
    withHandlers<PropsUnion, PropsOut>(
      (initialProps) => {
        let stateID = reduce(StateID.EntryPoint, { kind: ActionID.New, props: initialProps }).state.id;
        let cancelPending: () => void = null;
        let pendingCallback: () => void;
        const cancelPendingIfExistent = () => {
          if (cancelPending) {
            cancelPending();
            cancelPending = null;
          }
        };
        return {
          cancelPendingIfExistent: () => cancelPendingIfExistent,
          runPending: () => () => {
            const callback = pendingCallback;
            pendingCallback = null;
            if (callback) {
              callback();
            }
          },
          dispatch: ({actionProps, onTransitionComplete, setTransitionState}) => {
            const run = (actionID: ActionID) => {
              const result = reduce(stateID, { kind: actionID, props: actionProps });
              if (!result) { return; }
              if (result.completed && onTransitionComplete) {
                onTransitionComplete();
              }
              const {state, pending} = result;
              stateID = state.id;
              cancelPendingIfExistent();
              if (pending) {
                pendingCallback = () => {
                  cancelPending = runInFrame(1, () => run(pending));
                };
              }
              setTransitionState(pick(state, "style", "className", "inTransition"), null);
            };
            return run;
          },
        };
      }),
    withHandlers<PropsUnion, PropsOut>({
      onTransitionBegin: ({dispatch}) => () => dispatch(ActionID.TransitionStart),
      onTransitionComplete: ({dispatch}) => () => dispatch(ActionID.TransitionComplete),
      timeout: ({dispatch}) => () => dispatch(ActionID.Timeout),
    }),
    onDidMount<PropsUnion>(
      ({dispatch}) => {
        dispatch(ActionID.Mount);
      }),
    onWillReceiveProps<PropsUnion>(
      ({active: prevActive}, {active: nextActive, dispatch}) => {
        if (prevActive === nextActive) { return; }
        dispatch(ActionID.TransitionTrigger);
      }),
    onDidUpdate<PropsUnion>(
      ({runPending}) => {
        runPending();
      }),
    onWillUnmount<PropsUnion>(
      ({cancelPendingIfExistent}) => {
        cancelPendingIfExistent();
      }),
    integrate<keyof PropsUnion>(
      "timeout", "transitionState", "onTransitionBegin", "onTransitionComplete",
    ),
  ),
);
