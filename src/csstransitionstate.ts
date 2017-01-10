/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

/* tslint:disable: variable-name no-switch-case-fall-through */

import { CSSProperties } from "react";

import { CSSTransitionProps, CSSTransitionDelay } from "./csstransition";
import { resolveTransit } from "./transit";

export interface CSSTransitionState {
  id?: StateID;
  style?: CSSProperties;
}

export enum StateID {
  DefaultInit,
  ActiveInit,
  AppearInit,
  Default,
  Active,
  AppearPending,
  AppearTriggered,
  AppearStarted,
  EnterPending,
  EnterTriggered,
  EnterStarted,
  LeavePending,
  LeaveTriggered,
  LeaveStarted,
}

export const StateIDList = [
  StateID.ActiveInit, StateID.DefaultInit, StateID.AppearInit,
  StateID.Active, StateID.Default,
  StateID.AppearPending, StateID.AppearTriggered, StateID.AppearStarted,
  StateID.EnterPending, StateID.EnterTriggered, StateID.EnterStarted,
  StateID.LeavePending, StateID.LeaveTriggered, StateID.LeaveStarted,
];

export enum ActionID {
  Init,
  Mount,
  TransitionInit,
  TransitionTrigger,
  TransitionStart,
  TransitionComplete,
}

export const transitionNames = ["enter", "leave", "appear"];

export function hasTransition(name: string, props: any): boolean {
  const result = props[name + "Style"] !== undefined;
  return !result && name === "appear"
    ? hasTransition("enter", props)
    : result;
}

export function getDelay(name: string, delay: CSSTransitionDelay): number {
  if (!delay) { return 0; }
  if (typeof delay === "number") {
    return delay as number;
  }
  return (delay as any)[name] ? (delay as any)[name] : 0;
}

export function getState(id: StateID, name: string, props: any, params: { init?: boolean } = {}): CSSTransitionState {
  if (name === "appear" && !props.appearStyle) {
    return getState(id, "enter", props, params);
  }
  let style: any;
  if (params.init) {
    style = props[name + "InitStyle"];
    if (style === undefined) {
      if (name === "enter" || name === "appear") {
        style = props.defaultStyle;
      } else if (name === "leave") {
        style = props.activeStyle;
      }
    }
  } else {
    style = props[name + "Style"];
    if (["enter", "appear", "leave"].indexOf(name) >= 0) {
      style = resolveTransit(style, getDelay(name, props.transitionDelay));
    }
  }
  return {
    id,
    style: { ...props.style, ...style },
  };
}

export function stateFunc(id: StateID, name: string, params: { init?: boolean } = {}) {
  return (props: CSSTransitionProps) => getState(id, name, props, params);
}

export const activeInitState = stateFunc(StateID.ActiveInit, "active");
export const defaultInitState = stateFunc(StateID.DefaultInit, "default");
export const appearInitState = stateFunc(StateID.AppearInit, "appear", { init: true });
export const activeState = stateFunc(StateID.Active, "active");
export const defaultState = stateFunc(StateID.Default, "default");
export const appearPendingState = stateFunc(StateID.AppearPending, "appear", { init: true });
export const enterPendingState = stateFunc(StateID.EnterPending, "enter", { init: true });
export const leavePendingState = stateFunc(StateID.LeavePending, "leave", { init: true });
export const appearTriggeredState = stateFunc(StateID.AppearTriggered, "appear");
export const enterTriggeredState = stateFunc(StateID.EnterTriggered, "enter");
export const leaveTriggeredState = stateFunc(StateID.LeaveTriggered, "leave");
export const appearStartedState = stateFunc(StateID.AppearStarted, "appear");
export const enterStartedState = stateFunc(StateID.EnterStarted, "enter");
export const leaveStartedState = stateFunc(StateID.LeaveStarted, "leave");

export function reduce(
  state: CSSTransitionState,
  action: ActionID,
  props: CSSTransitionProps,
): { state: CSSTransitionState, pending?: ActionID } {
  switch (action) {
    case ActionID.Init:
      if (state !== undefined) { throw new Error("invalid state transition"); }
      if (props.active) {
        if (props.transitionAppear) { return { state: appearInitState(props) }; }
        return { state: activeInitState(props) };
      }
      if (!props.transitionAppear && props.active) { return { state: activeInitState(props) }; }
      return { state: defaultInitState(props) };
    case ActionID.Mount:
      switch (state.id) {
        case StateID.AppearInit:
          return reduce(state, ActionID.TransitionTrigger, props);
        default:
          return null;
      }
    case ActionID.TransitionInit:
      let nextState: CSSTransitionState;
      switch (state.id) {
        case StateID.DefaultInit:
        case StateID.Default:
          if (!hasTransition("enter", props)) {
            if (props.onTransitionComplete) { props.onTransitionComplete(); }
            return { state: activeState(props) };
          }
          nextState = enterPendingState(props);
          break;
        case StateID.ActiveInit:
        case StateID.Active:
          if (!hasTransition("leave", props)) {
            if (props.onTransitionComplete) { props.onTransitionComplete(); }
            return { state: defaultState(props) };
          }
          nextState = leavePendingState(props);
          break;
        case StateID.AppearInit:
          if (!hasTransition("appear", props)) {
            if (props.onTransitionComplete) { props.onTransitionComplete(); }
            return { state: activeState(props) };
          }
          nextState = appearPendingState(props);
          break;
        default:
          throw new Error(`invalid state transition from ${StateID[state.id]}`);
      };
      return { state: nextState, pending: ActionID.TransitionTrigger };
    case ActionID.TransitionStart:
      switch (state.id) {
        case StateID.EnterTriggered:
          return { state: enterStartedState(props) };
        case StateID.LeaveTriggered:
          return { state: leaveStartedState(props) };
        case StateID.AppearTriggered:
          return { state: appearStartedState(props) };
        default:
          // We don't error out, because the workaround for transitionstart
          // could happen after transitionend.
          return null;
      }
    case ActionID.TransitionComplete:
      switch (state.id) {
        case StateID.AppearStarted:
        case StateID.AppearTriggered:
        case StateID.EnterTriggered:
        case StateID.EnterStarted:
          if (props.onTransitionComplete) { props.onTransitionComplete(); }
          return { state: activeState(props) };
        case StateID.LeaveTriggered:
        case StateID.LeaveStarted:
          if (props.onTransitionComplete) { props.onTransitionComplete(); }
          return { state: defaultState(props) };
        default:
          throw new Error(`invalid state transition from ${StateID[state.id]}`);
      }
    case ActionID.TransitionTrigger:
      switch (state.id) {
        case StateID.ActiveInit:
        case StateID.Active:
        case StateID.DefaultInit:
        case StateID.Default:
        case StateID.AppearInit:
          return reduce(state, ActionID.TransitionInit, props);
        case StateID.EnterPending:
          if (props.active) { return { state: enterTriggeredState(props) }; }
          if (props.onTransitionComplete) { props.onTransitionComplete(); }
          return { state: defaultState(props) };
        case StateID.LeavePending:
          if (!props.active) { return { state: leaveTriggeredState(props) }; }
          if (props.onTransitionComplete) { props.onTransitionComplete(); }
          return { state: activeState(props) };
        case StateID.AppearPending:
          if (props.active) { return { state: appearTriggeredState(props) }; }
          if (props.onTransitionComplete) { props.onTransitionComplete(); }
          return { state: defaultState(props) };
        case StateID.EnterTriggered:
          if (props.onTransitionComplete) { props.onTransitionComplete(); }
          return { state: defaultState(props) };
        case StateID.LeaveTriggered:
          if (props.onTransitionComplete) { props.onTransitionComplete(); }
          return { state: activeState(props) };
        case StateID.AppearTriggered:
          if (props.onTransitionComplete) { props.onTransitionComplete(); }
          return { state: defaultState(props) };
        case StateID.AppearStarted:
        case StateID.EnterStarted:
          return { state: leaveStartedState(props) };
        case StateID.LeaveStarted:
          return { state: enterStartedState(props) };
        default:
          throw new Error(`invalid state transition from ${StateID[state.id as any]}`);
      }
    default:
  }
  throw new Error("unexpected error");
}
