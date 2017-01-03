/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

/* tslint:disable: variable-name no-switch-case-fall-through */

import { CSSProperties } from "react";

import { CSSTransitionProps } from "./csstransition";
import { resolveTransit } from "./transit";
import { getEnterDelay, getLeaveDelay } from "./utils";

export interface CSSTransitionState {
  id?: StateID;
  style?: CSSProperties;
}

export enum StateID {
  DefaultInit,
  ActiveInit,
  Default,
  Active,
  EnterPending,
  EnterTriggered,
  EnterStarted,
  LeavePending,
  LeaveTriggered,
  LeaveStarted,
}

export const StateIDList = [
  StateID.ActiveInit, StateID.DefaultInit,
  StateID.Active, StateID.Default,
  StateID.EnterPending, StateID.EnterTriggered, StateID.EnterStarted,
  StateID.LeavePending, StateID.LeaveTriggered, StateID.LeaveStarted,
];

export enum ActionID {
  Init,
  TransitionInit,
  TransitionSkip,
  TransitionTrigger,
  TransitionStart,
  TransitionComplete,
}

export const initActiveState = (props: CSSTransitionProps) => ({
  id: StateID.ActiveInit,
  style: { ...props.style, ...props.activeStyle },
});

export const initDefaultState = (props: CSSTransitionProps) => ({
  id: StateID.DefaultInit,
  style: { ...props.style, ...props.defaultStyle },
});

export const activeState = (props: CSSTransitionProps) => ({
  id: StateID.Active,
  style: { ...props.style, ...props.activeStyle },
});

export const defaultState = (props: CSSTransitionProps) => ({
  id: StateID.Default,
  style: { ...props.style, ...props.defaultStyle },
});

export const enterPendingState = (props: CSSTransitionProps) => ({
  id: StateID.EnterPending,
  style: { ...props.style, ...props.defaultStyle },
});

export const leavePendingState = (props: CSSTransitionProps) => ({
  id: StateID.LeavePending,
  style: { ...props.style, ...props.activeStyle },
});

export const enterTriggeredState = (props: CSSTransitionProps) => ({
  id: StateID.EnterTriggered,
  style: { ...props.style, ...resolveTransit(props.enterStyle, getEnterDelay(props.transitionDelay)) },
});

export const leaveTriggeredState = (props: CSSTransitionProps) => ({
  id: StateID.LeaveTriggered,
  style: { ...props.style, ...resolveTransit(props.leaveStyle, getLeaveDelay(props.transitionDelay)) },
});

export const enterStartedState = (props: CSSTransitionProps) => ({
  id: StateID.EnterStarted,
  style: { ...props.style, ...resolveTransit(props.enterStyle, getEnterDelay(props.transitionDelay)) },
});

export const leaveStartedState = (props: CSSTransitionProps) => ({
  id: StateID.LeaveStarted,
  style: { ...props.style, ...resolveTransit(props.leaveStyle, getLeaveDelay(props.transitionDelay)) },
});

export function reduce(
  state: CSSTransitionState,
  action: ActionID,
  props: CSSTransitionProps,
): { state: CSSTransitionState, pending?: ActionID } {
  switch (action) {
    case ActionID.Init:
      if (state !== undefined) { throw new Error("invalid state transition"); }
      if (!props.transitionAppear && props.active) { return { state: initActiveState(props) }; }
      return { state: initDefaultState(props) };
    case ActionID.TransitionInit:
      let nextState: CSSTransitionState;
      switch (state.id) {
        case StateID.DefaultInit:
        case StateID.Default:
          nextState = enterPendingState(props);
          break;
        case StateID.ActiveInit:
        case StateID.Active:
          nextState = leavePendingState(props);
          break;
        default:
          throw new Error("invalid state transition");
      };
      return { state: nextState, pending: ActionID.TransitionTrigger };
    case ActionID.TransitionStart:
      switch (state.id) {
        case StateID.EnterTriggered:
          return { state: enterStartedState(props) };
        case StateID.LeaveTriggered:
          return { state: leaveStartedState(props) };
        default:
          // We don't error out, because the workaround for transitionstart
          // could happen after transitionend.
          return null;
      }
    case ActionID.TransitionComplete:
      switch (state.id) {
        case StateID.EnterTriggered:
        case StateID.EnterStarted:
          if (props.onTransitionComplete) { props.onTransitionComplete(); }
          return { state: activeState(props) };
        case StateID.LeaveTriggered:
        case StateID.LeaveStarted:
          if (props.onTransitionComplete) { props.onTransitionComplete(); }
          return { state: defaultState(props) };
        default:
          throw new Error("invalid state transition");
      }
    case ActionID.TransitionTrigger:
      switch (state.id) {
        case StateID.ActiveInit:
        case StateID.Active:
        case StateID.DefaultInit:
        case StateID.Default:
          return reduce(state, ActionID.TransitionInit, props);
        case StateID.EnterPending:
          if (props.active) { return { state: enterTriggeredState(props) }; }
          if (props.onTransitionComplete) { props.onTransitionComplete(); }
          return { state: defaultState(props) };
        case StateID.LeavePending:
          if (!props.active) { return { state: leaveTriggeredState(props) }; }
          if (props.onTransitionComplete) { props.onTransitionComplete(); }
          return { state: activeState(props) };
        case StateID.EnterTriggered:
          if (props.onTransitionComplete) { props.onTransitionComplete(); }
          return { state: defaultState(props) };
        case StateID.LeaveTriggered:
          if (props.onTransitionComplete) { props.onTransitionComplete(); }
          return { state: activeState(props) };
        case StateID.EnterStarted:
          return { state: leaveTriggeredState(props) };
        case StateID.LeaveStarted:
          return { state: enterTriggeredState(props) };
        default:
          throw new Error("invalid state transition");
      }
    default:
  }
  throw new Error("unexpected error");
}
