/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import {
  combine, withState, withHandlers, withProps,
  onDidMount, onWillUnmount, onWillReceiveProps,
  isolate, integrate,
} from "react-assemble";
import * as shallowEqual from "fbjs/lib/shallowEqual";

import runInFrame from "../utils/runInFrame";
import { pick } from "../utils/pick";
import { ActionID, StateID, Reducer, actionPropKeys } from "../reducer";

export const withTransitionState = (reduce: Reducer) => combine(
  isolate(
    withProps<any, any>((props: any) => ({ actionProps: pick(props, ...actionPropKeys) })),
    withState<any, any>(
      "transitionStyle", "setTransitionStyle",
      ({actionProps}: any) => reduce(StateID.EntryPoint, { kind: ActionID.Init, props: actionProps }).state.style,
    ),
    withHandlers<any, any>((initialProps: any) => {
      let stateID = reduce(StateID.EntryPoint, { kind: ActionID.Init, props: initialProps }).state.id;
      let cancelPending: () => void = null;
      const cancelPendingIfExistent = () => {
        if (cancelPending) {
          cancelPending();
          cancelPending = null;
        }
      };
      return {
        cancelPendingIfExistent: () => cancelPendingIfExistent,
        dispatch: ({actionProps, onTransitionComplete, setTransitionStyle, transitionStyle}: any) => {
          const run = (actionID: ActionID) => {
            const result = reduce(stateID, { kind: actionID, props: actionProps });
            if (!result) { return; }
            if (result.completed && onTransitionComplete) {
              onTransitionComplete();
            }
            const {state, pending} = result;
            stateID = state.id;
            cancelPendingIfExistent();
            let callback: any;
            if (pending) {
              callback = () => {
                cancelPending = runInFrame(1, () => run(pending));
              };
            }
            if (!shallowEqual(transitionStyle, result.state.style)) {
              setTransitionStyle(state.style, callback);
            } else if (callback) {
              callback();
            }
          };
          return run;
        },
      };
    }),
    withHandlers<any, any>({
      onTransitionBegin: ({dispatch}: any) => () => dispatch(ActionID.TransitionStart),
      onTransitionComplete: ({dispatch}: any) => () => dispatch(ActionID.TransitionComplete),
    }),
    onDidMount(({dispatch}) => {
      dispatch(ActionID.Mount);
    }),
    onWillUnmount(({cancelPendingIfExistent}) => {
      cancelPendingIfExistent();
    }),
    onWillReceiveProps(({active: prevActive}, {active: nextActive, dispatch}) => {
      if (prevActive === nextActive) { return; }
      dispatch(ActionID.TransitionTrigger);
    }),
    integrate<any>("transitionStyle", "onTransitionBegin", "onTransitionComplete"),
  ),
);
